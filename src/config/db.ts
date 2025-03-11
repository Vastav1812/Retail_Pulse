import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

export const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: false // virtual postreSQL ke liye agar local pe chlana hai toh "True" pe change kardo.
});