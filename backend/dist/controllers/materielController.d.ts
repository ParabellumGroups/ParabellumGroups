import { Response } from 'express';
import { AuthenticatedRequest } from '../types';
export declare const getMateriels: (req: AuthenticatedRequest, res: Response) => Promise<void>;
export declare const getMaterielById: (req: AuthenticatedRequest, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const createMateriel: (req: AuthenticatedRequest, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const updateMateriel: (req: AuthenticatedRequest, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const deleteMateriel: (req: AuthenticatedRequest, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const createSortieMateriel: (req: AuthenticatedRequest, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const createEntreeMateriel: (req: AuthenticatedRequest, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const getStockAlerts: (req: AuthenticatedRequest, res: Response) => Promise<void>;
export declare const validateMateriel: import("express-validator").ValidationChain[];
export declare const validateSortieMateriel: import("express-validator").ValidationChain[];
export declare const validateEntreeMateriel: import("express-validator").ValidationChain[];
//# sourceMappingURL=materielController.d.ts.map