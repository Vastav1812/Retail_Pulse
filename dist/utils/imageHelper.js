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
exports.processImage = void 0;
const sharp_1 = __importDefault(require("sharp"));
const processImage = (url) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Fetch image buffer
        const response = yield fetch(url);
        const buffer = yield response.arrayBuffer();
        // Process with Sharp
        const metadata = yield (0, sharp_1.default)(Buffer.from(buffer)).metadata();
        if (!metadata.width || !metadata.height) {
            throw new Error('Invalid image dimensions');
        }
        return 2 * (metadata.width + metadata.height);
    }
    catch (error) {
        throw new Error(`Failed to process image from ${url}`);
    }
});
exports.processImage = processImage;
