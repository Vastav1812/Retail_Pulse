"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const jobController_1 = require("./controllers/jobController");
const wrapAsync_1 = require("./utils/wrapAsync");
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.post('/api/submit/', (0, wrapAsync_1.wrapAsync)(jobController_1.submitJobHandler));
app.get('/api/status', (0, wrapAsync_1.wrapAsync)(jobController_1.getJobStatusHandler));
exports.default = app;
