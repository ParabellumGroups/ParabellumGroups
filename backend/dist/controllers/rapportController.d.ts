import { Response } from 'express';
import { AuthenticatedRequest } from '../types';
export declare const getRapports: (req: AuthenticatedRequest, res: Response) => Promise<void>;
export declare const getRapportById: (req: AuthenticatedRequest, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const createRapport: (req: AuthenticatedRequest, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const updateRapport: (req: AuthenticatedRequest, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const deleteRapport: (req: AuthenticatedRequest, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const uploadRapportImages: (req: AuthenticatedRequest, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const validateRapport: import("express-validator").ValidationChain[];
//# sourceMappingURL=rapportController.d.ts.map