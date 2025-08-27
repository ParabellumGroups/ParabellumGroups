import { Response } from 'express';
import { AuthenticatedRequest } from '../types';
export declare const getPayments: (req: AuthenticatedRequest, res: Response) => Promise<void>;
export declare const getPaymentById: (req: AuthenticatedRequest, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const createPayment: (req: AuthenticatedRequest, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const getUnpaidInvoices: (req: AuthenticatedRequest, res: Response) => Promise<void>;
export declare const validatePayment: import("express-validator").ValidationChain[];
//# sourceMappingURL=paymentController.d.ts.map