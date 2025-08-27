import { Response } from 'express';
import { AuthenticatedRequest } from '../types';
export declare const getUsers: (req: AuthenticatedRequest, res: Response) => Promise<void>;
export declare const getUserById: (req: AuthenticatedRequest, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const createUser: (req: AuthenticatedRequest, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const updateUser: (req: AuthenticatedRequest, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const deleteUser: (req: AuthenticatedRequest, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const updatePassword: (req: AuthenticatedRequest, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const getRoles: (req: AuthenticatedRequest, res: Response) => Promise<void>;
export declare const getServices: (req: AuthenticatedRequest, res: Response) => Promise<void>;
export declare const getUserPermissions: (req: AuthenticatedRequest, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const updateUserPermissions: (req: AuthenticatedRequest, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const validateUser: import("express-validator").ValidationChain[];
export declare const validateUserCreation: import("express-validator").ValidationChain[];
export declare const validatePasswordUpdate: import("express-validator").ValidationChain[];
//# sourceMappingURL=userController.d.ts.map