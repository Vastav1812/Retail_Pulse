"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getJobStatus = exports.submitJob = void 0;
const imageHelper_1 = require("../utils/imageHelper");
const randomDelay_1 = require("../utils/randomDelay");
const redisClient_1 = __importDefault(require("../config/redisClient"));
const DeepSeekService_1 = require("./DeepSeekService");
const StoreMaster_1 = require("../utils/StoreMaster");
const db_1 = require("../config/db");
const submitJob = (visits) => __awaiter(void 0, void 0, void 0, function* () {
    const client = yield db_1.pool.connect();
    try {
        yield client.query('BEGIN');
        // Create job record
        const jobRes = yield client.query('INSERT INTO jobs (status) VALUES ($1) RETURNING job_id', ['pending']);
        const jobId = jobRes.rows[0].job_id;
        //Redis
        const initialJobState = {
            status: 'processing',
            visits,
            errors: []
        };
        yield redisClient_1.default.set(`job:${jobId}`, JSON.stringify(initialJobState));
        const storeMaster = (0, StoreMaster_1.loadStoreMaster)();
        const errors = [];
        for (const visit of visits) {
            if (!storeMaster[visit.store_id]) {
                errors.push({
                    store_id: visit.store_id,
                    error: 'Store not found in Store Master'
                });
                continue;
            }
            for (const url of visit.image_url) {
                try {
                    const perimeter = yield (0, imageHelper_1.processImage)(url);
                    yield client.query(`INSERT INTO job_images 
                        (job_id, store_id, image_url, perimeter)
                        VALUES ($1, $2, $3, $4)`, [jobId, visit.store_id, url, perimeter]);
                    yield (0, randomDelay_1.randomDelay)();
                }
                catch (error) {
                    errors.push({
                        store_id: visit.store_id,
                        error: `Image processing failed: ${error.message}`
                    });
                }
            }
        }
        // Jobstatus
        const finalStatus = errors.length > 0 ? 'failed' : 'completed';
        let summary = '';
        if (finalStatus === 'completed') {
            try {
                summary = yield (0, DeepSeekService_1.generateJobSummary)(initialJobState);
            }
            catch (summaryError) {
                console.error('Summary generation failed:', summaryError);
                summary = 'Job summary unavailable';
            }
        }
        yield client.query('UPDATE jobs SET status = $1, summary = $2 WHERE job_id = $3', [finalStatus, summary, jobId]);
        //Redis_cache
        const finalJobState = {
            status: finalStatus,
            visits,
            errors,
            summary
        };
        yield redisClient_1.default.set(`job:${jobId}`, JSON.stringify(finalJobState));
        yield client.query('COMMIT');
        return jobId;
    }
    catch (error) {
        yield client.query('ROLLBACK');
        console.error('Transaction failed:', error);
        throw new Error('Job submission failed');
    }
    finally {
        client.release();
    }
});
exports.submitJob = submitJob;
const getJobStatus = (jobId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Try Redis cache first
        const cachedJob = yield redisClient_1.default.get(`job:${jobId}`);
        if (cachedJob)
            return JSON.parse(cachedJob);
        // PostgreSQL
        const jobRes = yield db_1.pool.query('SELECT status, summary FROM jobs WHERE job_id = $1', [jobId]);
        if (jobRes.rowCount === 0)
            throw new Error('Job not found');
        const imagesRes = yield db_1.pool.query('SELECT store_id, image_url, perimeter FROM job_images WHERE job_id = $1', [jobId]);
        const errorsRes = yield db_1.pool.query('SELECT store_id, error FROM job_errors WHERE job_id = $1', [jobId]);
        const jobData = {
            status: jobRes.rows[0].status,
            visits: imagesRes.rows,
            errors: errorsRes.rows,
            summary: jobRes.rows[0].summary
        };
        //Redis_cache
        yield redisClient_1.default.set(`job:${jobId}`, JSON.stringify(jobData));
        return jobData;
    }
    catch (error) {
        console.error('Error retrieving job status:', error);
        throw new Error('Failed to retrieve job status');
    }
});
exports.getJobStatus = getJobStatus;
