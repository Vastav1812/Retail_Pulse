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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getJobStatusHandler = exports.submitJobHandler = void 0;
const jobProcessor_1 = require("../services/jobProcessor");
const submitJobHandler = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { count, visits } = req.body;
    if (!count || !visits || count !== visits.length) {
        res.status(400).json({ error: "Invalid: count does not match number of visits." });
        return;
    }
    const jobId = yield (0, jobProcessor_1.submitJob)(visits);
    res.status(201).json({ job_id: jobId });
});
exports.submitJobHandler = submitJobHandler;
const getJobStatusHandler = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { jobid } = req.query;
    if (!jobid) {
        res.status(400).json({ error: "Job ID is required." });
        return;
    }
    const jobInfo = yield (0, jobProcessor_1.getJobStatus)(Number(jobid));
    res.status(200).json(jobInfo);
});
exports.getJobStatusHandler = getJobStatusHandler;
