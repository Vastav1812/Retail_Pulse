import { Request, Response, NextFunction } from 'express';
import { submitJob, getJobStatus } from '../services/jobProcessor';

export const submitJobHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { count, visits } = req.body;
    if (!count || !visits || count !== visits.length) {
        res.status(400).json({ error: "Invalid: count does not match number of visits." });
        return;
    }
    const jobId = await submitJob(visits);
    res.status(201).json({ job_id: jobId });
};
export const getJobStatusHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { jobid } = req.query;
    if (!jobid) {
        res.status(400).json({ error: "Job ID is required." });
        return;
    }
    const jobInfo = await getJobStatus(Number(jobid));
    res.status(200).json(jobInfo);
};
