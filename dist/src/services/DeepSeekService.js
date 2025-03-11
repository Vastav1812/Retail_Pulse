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
exports.generateJobSummary = void 0;
const axios_1 = __importDefault(require("axios"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY || '';
const generateJobSummary = (jobDetails) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield axios_1.default.post('https://api.deepseek.com/v1/chat/completions', {
            model: "deepseek-chat",
            messages: [{
                    role: "user",
                    content: `Summarize this image processing job in 2 sentences: ${JSON.stringify({
                        total_stores: jobDetails.visits.length,
                        total_images: jobDetails.visits.reduce((acc, v) => acc + v.image_url.length, 0),
                        error_count: jobDetails.errors.length
                    })}`
                }],
            temperature: 0.7
        }, {
            headers: {
                "Authorization": `Bearer ${DEEPSEEK_API_KEY}`,
                "Content-Type": "application/json"
            }
        });
        return response.data.choices[0].message.content.trim();
    }
    catch (error) {
        console.error('DeepSeek API Error:', error);
        return 'Summary unavailable (API limit reached)';
    }
});
exports.generateJobSummary = generateJobSummary;
