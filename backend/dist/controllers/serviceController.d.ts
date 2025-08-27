import { Response } from 'express';
import { AuthenticatedRequest } from '../types';
export declare const getServices: (req: AuthenticatedRequest, res: Response) => Promise<void>;
export declare const getServiceById: (req: AuthenticatedRequest, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const createService: (req: AuthenticatedRequest, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const updateService: (req: AuthenticatedRequest, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const deleteService: (req: AuthenticatedRequest, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const validateService: import("express-validator").ValidationChain[];
//# sourceMappingURL=serviceController.d.ts.map