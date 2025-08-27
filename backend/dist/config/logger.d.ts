import winston from 'winston';
export declare const logger: winston.Logger;
export declare const auditLogger: winston.Logger;
export declare const performanceLogger: winston.Logger;
export declare const logError: (error: Error, context?: any) => void;
export declare const logAudit: (action: string, userId: number, details: any) => void;
export declare const logPerformance: (operation: string, duration: number, details?: any) => void;
export default logger;
//# sourceMappingURL=logger.d.ts.map