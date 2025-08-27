import { Request, Response } from 'express';
export declare const generalLimiter: import("express-rate-limit").RateLimitRequestHandler;
export declare const authLimiter: import("express-rate-limit").RateLimitRequestHandler;
export declare const sensitiveOperationsLimiter: import("express-rate-limit").RateLimitRequestHandler;
export declare const reportsLimiter: import("express-rate-limit").RateLimitRequestHandler;
export declare const uploadLimiter: import("express-rate-limit").RateLimitRequestHandler;
export declare const exportLimiter: import("express-rate-limit").RateLimitRequestHandler;
export declare const emailLimiter: import("express-rate-limit").RateLimitRequestHandler;
export declare const conditionalRateLimit: (limiter: any) => (req: Request, res: Response, next: any) => any;
export declare const getRateLimitStats: (req: Request) => Promise<any>;
declare const _default: {
    generalLimiter: import("express-rate-limit").RateLimitRequestHandler;
    authLimiter: import("express-rate-limit").RateLimitRequestHandler;
    sensitiveOperationsLimiter: import("express-rate-limit").RateLimitRequestHandler;
    reportsLimiter: import("express-rate-limit").RateLimitRequestHandler;
    uploadLimiter: import("express-rate-limit").RateLimitRequestHandler;
    exportLimiter: import("express-rate-limit").RateLimitRequestHandler;
    emailLimiter: import("express-rate-limit").RateLimitRequestHandler;
    conditionalRateLimit: (limiter: any) => (req: Request, res: Response, next: any) => any;
};
export default _default;
//# sourceMappingURL=rateLimiter.d.ts.map