import { Response } from 'express';
import { AuthenticatedRequest } from '../types';
export declare const getContracts: (req: AuthenticatedRequest, res: Response) => Promise<void>;
export declare const getContractById: (req: AuthenticatedRequest, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const createContract: (req: AuthenticatedRequest, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const updateContract: (req: AuthenticatedRequest, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const terminateContract: (req: AuthenticatedRequest, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const validateContract: import("express-validator").ValidationChain[];
//# sourceMappingURL=contractController.d.ts.map