import { Response } from 'express';
import { AuthenticatedRequest } from '../types';
export declare const getMissions: (req: AuthenticatedRequest, res: Response) => Promise<void>;
export declare const getMissionById: (req: AuthenticatedRequest, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const createMission: (req: AuthenticatedRequest, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const updateMission: (req: AuthenticatedRequest, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const deleteMission: (req: AuthenticatedRequest, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const validateMission: import("express-validator").ValidationChain[];
//# sourceMappingURL=missionController.d.ts.map