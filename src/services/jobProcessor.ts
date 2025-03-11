import { processImage } from '../utils/imageHelper';
import { randomDelay } from '../utils/randomDelay';
import redisClient from '../config/redisClient';
import { generateJobSummary } from './DeepSeekService';
import { loadStoreMaster } from '../utils/StoreMaster';
import { pool } from '../config/db';

interface Job {
    status: 'pending' | 'processing' | 'completed' | 'failed';
    visits: Visit[];
    errors: JobError[];
    summary?: string;
}

interface Visit {
    store_id: string;
    image_url: string[];
    visit_time: string;
}

interface JobError {
    store_id: string;
    error: string;
}

export const submitJob = async (visits: Visit[]): Promise<number> => {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        // Create job record
        const jobRes = await client.query(
            'INSERT INTO jobs (status) VALUES ($1) RETURNING job_id',
            ['pending']
        );
        const jobId = jobRes.rows[0].job_id;
        //Redis
        const initialJobState: Job = {
            status: 'processing',
            visits,
            errors: []
        };
        await redisClient.set(`job:${jobId}`, JSON.stringify(initialJobState));
        const storeMaster = loadStoreMaster();
        const errors: JobError[] = [];

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
                    const perimeter = await processImage(url);
                    await client.query(
                        `INSERT INTO job_images 
                        (job_id, store_id, image_url, perimeter)
                        VALUES ($1, $2, $3, $4)`,
                        [jobId, visit.store_id, url, perimeter]
                    );
                    await randomDelay();
                } catch (error: any) {
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
                summary = await generateJobSummary(initialJobState);
            } catch (summaryError) {
                console.error('Summary generation failed:', summaryError);
                summary = 'Job summary unavailable';
            }
        }
        await client.query(
            'UPDATE jobs SET status = $1, summary = $2 WHERE job_id = $3',
            [finalStatus, summary, jobId]
        );
        //Redis_cache
        const finalJobState: Job = {
            status: finalStatus,
            visits,
            errors,
            summary
        };
        await redisClient.set(`job:${jobId}`, JSON.stringify(finalJobState));
        await client.query('COMMIT');
        return jobId;

    } catch (error) {
        await client.query('ROLLBACK');
        console.error('Transaction failed:', error);
        throw new Error('Job submission failed');
    } finally {
        client.release();
    }
};

export const getJobStatus = async (jobId: number): Promise<Job> => {
    try {
        const cachedJob = await redisClient.get(`job:${jobId}`);
        if (cachedJob) return JSON.parse(cachedJob);
        // PostgreSQL
        const jobRes = await pool.query(
            'SELECT status, summary FROM jobs WHERE job_id = $1',
            [jobId]
        );
        if (jobRes.rowCount === 0) throw new Error('Job not found');
        const imagesRes = await pool.query(
            'SELECT store_id, image_url, perimeter FROM job_images WHERE job_id = $1',
            [jobId]
        );
        const errorsRes = await pool.query(
            'SELECT store_id, error FROM job_errors WHERE job_id = $1',
            [jobId]
        );
        const jobData: Job = {
            status: jobRes.rows[0].status,
            visits: imagesRes.rows,
            errors: errorsRes.rows,
            summary: jobRes.rows[0].summary
        };

        await redisClient.set(`job:${jobId}`, JSON.stringify(jobData));

        return jobData;
    } catch (error) {
        console.error('Error retrieving job status:', error);
        throw new Error('Failed to retrieve job status');
    }
};