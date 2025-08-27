import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../types';
export declare const auditLog: (action: string, resource: string) => (req: AuthenticatedRequest, res: Response, next: NextFunction) => Promise<void>;
//# sourceMappingURL=audit.d.ts.map