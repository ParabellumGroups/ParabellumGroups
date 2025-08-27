import { Response } from 'express';
import { AuthenticatedRequest } from '../types';
export declare const getCustomers: (req: AuthenticatedRequest, res: Response) => Promise<void>;
export declare const getCustomerById: (req: AuthenticatedRequest, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const createCustomer: (req: AuthenticatedRequest, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const updateCustomer: (req: AuthenticatedRequest, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const deleteCustomer: (req: AuthenticatedRequest, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const validateCustomer: import("express-validator").ValidationChain[];
//# sourceMappingURL=customerController.d.ts.map