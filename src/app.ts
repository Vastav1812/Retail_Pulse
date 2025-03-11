import express from 'express';
import dotenv from 'dotenv';
import { submitJobHandler, getJobStatusHandler } from './controllers/jobController';
import { wrapAsync } from './utils/wrapAsync';

dotenv.config();
const app = express();

app.use(express.json());
app.post('/api/submit/', wrapAsync(submitJobHandler));
app.get('/api/status', wrapAsync(getJobStatusHandler));

export default app;