import { createClient } from 'redis';
import dotenv from 'dotenv';

dotenv.config();

const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';
const client = createClient({ url: redisUrl });

client.on('error', (err) => console.error('Redis Client Error', err));
client.connect().then(() => {
    console.log('Connected to Redis');
}).catch((err) => {
    console.error('Failed to connect to Redis:', err);
});

export default client;