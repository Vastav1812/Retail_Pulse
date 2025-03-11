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
const axios_1 = __importDefault(require("axios"));
const BASE_URL = 'http://localhost:3000';
const TEST_STORE_ID = 'RP00001';
describe('Retail Pulse API Tests', () => {
    describe('POST /api/submit/', () => {
        it('should submit a job successfully', () => __awaiter(void 0, void 0, void 0, function* () {
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
            const response = yield axios_1.default.post(`${BASE_URL}/api/submit/`, payload);
            expect(response.status).toBe(201);
            expect(response.data).toHaveProperty('job_id');
            expect(typeof response.data.job_id).toBe('number');
        }));
        it('should return 400 for invalid payload', () => __awaiter(void 0, void 0, void 0, function* () {
            var _a, _b;
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
                yield axios_1.default.post(`${BASE_URL}/api/submit/`, invalidPayload);
                fail('Expected a 400 error, but request succeeded.');
            }
            catch (error) {
                if (axios_1.default.isAxiosError(error)) {
                    expect((_a = error.response) === null || _a === void 0 ? void 0 : _a.status).toBe(400);
                    expect((_b = error.response) === null || _b === void 0 ? void 0 : _b.data).toHaveProperty('error');
                }
                else {
                    throw error;
                }
            }
        }));
    });
    describe('GET /api/status', () => {
        let jobId;
        beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
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
            const response = yield axios_1.default.post(`${BASE_URL}/api/submit/`, payload);
            jobId = response.data.job_id;
        }));
        it('should retrieve job status successfully', () => __awaiter(void 0, void 0, void 0, function* () {
            yield new Promise((resolve) => setTimeout(resolve, 1500));
            const response = yield axios_1.default.get(`${BASE_URL}/api/status`, {
                params: { jobid: jobId }
            });
            expect(response.status).toBe(200);
            expect(response.data).toEqual({
                errors: expect.any(Array),
                status: expect.stringMatching(/completed|ongoing|failed/),
                summary: expect.any(String),
                visits: expect.any(Array)
            });
        }));
        it('should return 500 for non-existent job', () => __awaiter(void 0, void 0, void 0, function* () {
            var _a;
            const invalidJobId = 9999;
            try {
                yield axios_1.default.get(`${BASE_URL}/api/status`, {
                    params: { jobid: invalidJobId }
                });
                fail('Expected a 500 error, but request succeeded.');
            }
            catch (error) {
                if (axios_1.default.isAxiosError(error)) {
                    expect((_a = error.response) === null || _a === void 0 ? void 0 : _a.status).toBe(500);
                }
                else {
                    throw error;
                }
            }
        }));
    });
});
