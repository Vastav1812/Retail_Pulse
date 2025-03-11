import { Request, Response, NextFunction, RequestHandler } from 'express';

/**
 * Wraps an async route handler to catch any errors and pass them to the next middleware.
 * @param fn Async function to wrap.
 * @returns A function that calls the async function and catches errors.
 */
export function wrapAsync(
    fn: (req: Request, res: Response, next: NextFunction) => Promise<any>
): RequestHandler {
    return (req, res, next) => {
        fn(req, res, next).catch(next);
    };
}
