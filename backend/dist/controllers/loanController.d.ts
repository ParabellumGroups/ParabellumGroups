import { Response } from 'express';
import { AuthenticatedRequest } from '../types';
export declare const getLoans: (req: AuthenticatedRequest, res: Response) => Promise<void>;
export declare const getLoanById: (req: AuthenticatedRequest, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const createLoan: (req: AuthenticatedRequest, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const updateLoan: (req: AuthenticatedRequest, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const deleteLoan: (req: AuthenticatedRequest, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const getLoanPayments: (req: AuthenticatedRequest, res: Response) => Promise<void>;
export declare const createLoanPayment: (req: AuthenticatedRequest, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const validateLoan: import("express-validator").ValidationChain[];
//# sourceMappingURL=loanController.d.ts.map