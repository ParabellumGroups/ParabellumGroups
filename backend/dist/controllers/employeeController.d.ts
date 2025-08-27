import { Response } from 'express';
import { AuthenticatedRequest } from '../types';
export declare const getEmployees: (req: AuthenticatedRequest, res: Response) => Promise<void>;
export declare const getEmployeeById: (req: AuthenticatedRequest, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const createEmployee: (req: AuthenticatedRequest, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const updateEmployee: (req: AuthenticatedRequest, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const deleteEmployee: (req: AuthenticatedRequest, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const validateEmployee: import("express-validator").ValidationChain[];
//# sourceMappingURL=employeeController.d.ts.map