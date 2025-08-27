import { Response } from 'express';
import { AuthenticatedRequest } from '../types';
export declare const getInvoices: (req: AuthenticatedRequest, res: Response) => Promise<void>;
export declare const getInvoiceById: (req: AuthenticatedRequest, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const createInvoice: (req: AuthenticatedRequest, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const createInvoiceFromQuote: (req: AuthenticatedRequest, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const updateInvoiceStatus: (req: AuthenticatedRequest, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const validateInvoice: import("express-validator").ValidationChain[];
//# sourceMappingURL=invoiceController.d.ts.map