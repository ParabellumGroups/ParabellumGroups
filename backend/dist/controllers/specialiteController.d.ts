import { Response } from 'express';
import { AuthenticatedRequest } from '../types';
export declare const getSpecialites: (req: AuthenticatedRequest, res: Response) => Promise<void>;
export declare const getSpecialiteById: (req: AuthenticatedRequest, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const createSpecialite: (req: AuthenticatedRequest, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const updateSpecialite: (req: AuthenticatedRequest, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const deleteSpecialite: (req: AuthenticatedRequest, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const validateSpecialite: import("express-validator").ValidationChain[];
//# sourceMappingURL=specialiteController.d.ts.map