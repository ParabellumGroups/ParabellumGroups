import { Response } from 'express';
import { AuthenticatedRequest } from '../types';
export declare const getTechniciens: (req: AuthenticatedRequest, res: Response) => Promise<void>;
export declare const getTechnicienById: (req: AuthenticatedRequest, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const createTechnicien: (req: AuthenticatedRequest, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const updateTechnicien: (req: AuthenticatedRequest, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const deleteTechnicien: (req: AuthenticatedRequest, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const validateTechnicien: import("express-validator").ValidationChain[];
//# sourceMappingURL=technicienController.d.ts.map