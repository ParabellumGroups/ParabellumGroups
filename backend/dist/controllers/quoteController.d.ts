import { Response } from 'express';
import { AuthenticatedRequest } from '../types';
export declare const getQuotes: (req: AuthenticatedRequest, res: Response) => Promise<void>;
export declare const getQuoteById: (req: AuthenticatedRequest, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const createQuote: (req: AuthenticatedRequest, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const submitForServiceApproval: (req: AuthenticatedRequest, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const approveByServiceManager: (req: AuthenticatedRequest, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const approveByDG: (req: AuthenticatedRequest, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const rejectQuote: (req: AuthenticatedRequest, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const validateQuote: import("express-validator").ValidationChain[];
//# sourceMappingURL=quoteController.d.ts.map