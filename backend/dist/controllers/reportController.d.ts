import { Response } from 'express';
import { AuthenticatedRequest } from '../types';
export declare const getReports: (req: AuthenticatedRequest, res: Response) => Promise<void | Response<any, Record<string, any>>>;
export declare const getDashboardStatsInternal: (req: AuthenticatedRequest, res: Response) => Promise<void>;
export declare const getSalesReport: (req: AuthenticatedRequest, res: Response) => Promise<void>;
export declare const getFinancialReport: (req: AuthenticatedRequest, res: Response) => Promise<void>;
export declare const getCashFlowReport: (req: AuthenticatedRequest, res: Response) => Promise<void>;
//# sourceMappingURL=reportController.d.ts.map