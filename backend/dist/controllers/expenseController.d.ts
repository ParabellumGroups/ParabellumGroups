import { Response } from 'express';
import { AuthenticatedRequest } from '../types';
export declare const getExpenses: (req: AuthenticatedRequest, res: Response) => Promise<void>;
export declare const getExpenseById: (req: AuthenticatedRequest, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const createExpense: (req: AuthenticatedRequest, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const updateExpense: (req: AuthenticatedRequest, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const deleteExpense: (req: AuthenticatedRequest, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const getExpenseCategories: (req: AuthenticatedRequest, res: Response) => Promise<void>;
export declare const validateExpense: import("express-validator").ValidationChain[];
//# sourceMappingURL=expenseController.d.ts.map