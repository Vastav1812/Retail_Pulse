"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.wrapAsync = wrapAsync;
/**
 * Wraps an async route handler to catch any errors and pass them to the next middleware.
 * @param fn Async function to wrap.
 * @returns A function that calls the async function and catches errors.
 */
function wrapAsync(fn) {
    return (req, res, next) => {
        fn(req, res, next).catch(next);
    };
}
