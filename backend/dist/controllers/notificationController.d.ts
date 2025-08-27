import { Response } from 'express';
import { AuthenticatedRequest } from '../types';
export declare const getNotifications: (req: AuthenticatedRequest, res: Response) => Promise<void>;
export declare const markAsRead: (req: AuthenticatedRequest, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const markAllAsRead: (req: AuthenticatedRequest, res: Response) => Promise<void>;
export declare const deleteNotification: (req: AuthenticatedRequest, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const createNotification: (req: AuthenticatedRequest, res: Response) => Promise<void>;
//# sourceMappingURL=notificationController.d.ts.map