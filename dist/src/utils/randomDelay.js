"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.randomDelay = void 0;
const randomDelay = () => {
    const delay = Math.random() * (400 - 100) + 100;
    return new Promise(resolve => setTimeout(resolve, delay));
};
exports.randomDelay = randomDelay;
