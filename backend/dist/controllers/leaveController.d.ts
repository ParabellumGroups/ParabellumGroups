import { Response } from 'express';
import { AuthenticatedRequest } from '../types';
export declare const getLeaveRequests: (req: AuthenticatedRequest, res: Response) => Promise<void>;
export declare const getLeaveRequestById: (req: AuthenticatedRequest, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const createLeaveRequest: (req: AuthenticatedRequest, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const updateLeaveRequest: (req: AuthenticatedRequest, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const approveLeaveRequest: (req: AuthenticatedRequest, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const rejectLeaveRequest: (req: AuthenticatedRequest, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const getLeaveBalance: (req: AuthenticatedRequest, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const validateLeaveRequest: import("express-validator").ValidationChain[];
//# sourceMappingURL=leaveController.d.ts.map