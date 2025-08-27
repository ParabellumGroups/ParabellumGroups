import { Response } from 'express';
import { AuthenticatedRequest } from '../types';
export declare const getSalaries: (req: AuthenticatedRequest, res: Response) => Promise<void>;
export declare const getSalaryById: (req: AuthenticatedRequest, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const createSalary: (req: AuthenticatedRequest, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const updateSalary: (req: AuthenticatedRequest, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const deleteSalary: (req: AuthenticatedRequest, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const getSalaryReport: (req: AuthenticatedRequest, res: Response) => Promise<void>;
export declare const paySalary: (req: AuthenticatedRequest, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const validateSalary: import("express-validator").ValidationChain[];
//# sourceMappingURL=salaryController.d.ts.map