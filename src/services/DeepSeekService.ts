import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();
const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY || '';

export const generateJobSummary = async (jobDetails: any): Promise<string> => {
    try {
        const response = await axios.post(
            'https://api.deepseek.com/v1/chat/completions',
            {
                model: "deepseek-chat",
                messages: [{
                    role: "user",
                    content: `Summarize this image processing job in 2 sentences: ${JSON.stringify({
                        total_stores: jobDetails.visits.length,
                        total_images: jobDetails.visits.reduce((acc: number, v: any) => acc + v.image_url.length, 0),
                        error_count: jobDetails.errors.length
                    })}`
                }],
                temperature: 0.7
            },
            {
                headers: {
                    "Authorization": `Bearer ${DEEPSEEK_API_KEY}`,
                    "Content-Type": "application/json"
                }
            }
        );

        return response.data.choices[0].message.content.trim();
    } catch (error) {
        console.error('DeepSeek API Error:', error);
        return 'Summary unavailable (API limit reached)';
    }
};