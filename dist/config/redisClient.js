"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const redis_1 = require("redis");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';
const client = (0, redis_1.createClient)({ url: redisUrl });
client.on('error', (err) => console.error('Redis Client Error', err));
client.connect().then(() => {
    console.log('Connected to Redis');
}).catch((err) => {
    console.error('Failed to connect to Redis:', err);
});
exports.default = client;
