import { Response } from 'express';
import { AuthenticatedRequest } from '../types';
export declare const getProspects: (req: AuthenticatedRequest, res: Response) => Promise<void>;
export declare const getProspectById: (req: AuthenticatedRequest, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const createProspect: (req: AuthenticatedRequest, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const updateProspect: (req: AuthenticatedRequest, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const deleteProspect: (req: AuthenticatedRequest, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const moveProspectStage: (req: AuthenticatedRequest, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const getProspectionStats: (req: AuthenticatedRequest, res: Response) => Promise<void>;
export declare const validateProspect: import("express-validator").ValidationChain[];
//# sourceMappingURL=prospectController.d.ts.map