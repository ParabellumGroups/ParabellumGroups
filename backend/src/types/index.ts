export * from '../../../shared/types';

// Types spécifiques au backend
export interface JWTPayload {
  userId: number;
  email: string;
  role: string;
  serviceId?: number;
  permissions: string[];
}

export interface AuthenticatedRequest extends Request {
  user?: JWTPayload;
}

export interface PermissionCheck {
  resource: string;
  action: string;
  serviceId?: number;
}

export interface AuditLogData {
  userId: number;
  action: string;
  resource: string;
  resourceId?: number;
  details?: any;
  ipAddress?: string;
  userAgent?: string;
}