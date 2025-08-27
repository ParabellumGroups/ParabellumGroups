import { Response } from 'express';
import { AuthenticatedRequest } from '../types';
export declare const getMessages: (req: AuthenticatedRequest, res: Response) => Promise<void>;
export declare const getMessageById: (req: AuthenticatedRequest, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const createMessage: (req: AuthenticatedRequest, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const markAsRead: (req: AuthenticatedRequest, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const archiveMessage: (req: AuthenticatedRequest, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const replyToMessage: (req: AuthenticatedRequest, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const validateMessage: import("express-validator").ValidationChain[];
//# sourceMappingURL=messageController.d.ts.map