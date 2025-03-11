import axios from 'axios';

const BASE_URL = 'http://localhost:3000';
const TEST_STORE_ID = 'RP00001';

describe('Retail Pulse API Tests', () => {
    describe('POST /api/submit/', () => {
        it('should submit a job successfully', async () => {
            const payload = {
                count: 1,
                visits: [
                    {
                        store_id: TEST_STORE_ID,
                        image_url: ['https://picsum.photos/200/300'],
                        visit_time: new Date().toISOString()
                    }
                ]
            };
            const response = await axios.post(`${BASE_URL}/api/submit/`, payload);

            expect(response.status).toBe(201);
            expect(response.data).toHaveProperty('job_id');
            expect(typeof response.data.job_id).toBe('number');
        });

        it('should return 400 for invalid payload', async () => {
            const invalidPayload = {
                count: 2,
                visits: [
                    {
                        store_id: TEST_STORE_ID,
                        image_url: ['https://picsum.photos/200/300']
                    }
                ]
            };

            try {
                await axios.post(`${BASE_URL}/api/submit/`, invalidPayload);
                fail('Expected a 400 error, but request succeeded.');
            } catch (error) {
                if (axios.isAxiosError(error)) {
                    expect(error.response?.status).toBe(400);
                    expect(error.response?.data).toHaveProperty('error');
                } else {
                    throw error;
                }
            }
        });
    });

    describe('GET /api/status', () => {
        let jobId: number;
        beforeAll(async () => {
            const payload = {
                count: 1,
                visits: [
                    {
                        store_id: TEST_STORE_ID,
                        image_url: ['https://picsum.photos/200/300'],
                        visit_time: new Date().toISOString()
                    }
                ]
            };
            const response = await axios.post(`${BASE_URL}/api/submit/`, payload);
            jobId = response.data.job_id;
        });

        it('should retrieve job status successfully', async () => {
            await new Promise((resolve) => setTimeout(resolve, 1500));

            const response = await axios.get(`${BASE_URL}/api/status`, {
                params: { jobid: jobId }
            });

            expect(response.status).toBe(200);
            expect(response.data).toEqual({
                errors: expect.any(Array),
                status: expect.stringMatching(/completed|ongoing|failed/),
                summary: expect.any(String),
                visits: expect.any(Array)
            });
        });

        it('should return 500 for non-existent job', async () => {
            const invalidJobId = 9999;

            try {
                await axios.get(`${BASE_URL}/api/status`, {
                    params: { jobid: invalidJobId }
                });
                fail('Expected a 500 error, but request succeeded.');
            } catch (error) {
                if (axios.isAxiosError(error)) {
                    expect(error.response?.status).toBe(500);
                } else {
                    throw error;
                }
            }
        });
    });
});
