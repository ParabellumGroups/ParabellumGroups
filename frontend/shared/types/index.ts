// Types partagés entre frontend et backend
export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  serviceId?: number;
  isActive: boolean;
  lastLogin?: Date;
  avatarUrl?: string;
  service?: Service;
  permissions?: Permission[];
}

export interface Service {
  id: number;
  name: string;
  description?: string;
}

export interface Permission {
  id: number;
  name: string;
  resource: string;
  action: string;
  description?: string;
}

export interface AuthResponse {
  user: User;
  token: string;
  refreshToken: string;
  permissions: Permission[];
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: string[];
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export enum UserRole {
  ADMIN = 'ADMIN',
  GENERAL_DIRECTOR = 'GENERAL_DIRECTOR',
  SERVICE_MANAGER = 'SERVICE_MANAGER',
  EMPLOYEE = 'EMPLOYEE',
  ACCOUNTANT = 'ACCOUNTANT'
}

export enum CustomerType {
  INDIVIDUAL = 'INDIVIDUAL',
  COMPANY = 'COMPANY'
}

export enum QuoteStatus {
  DRAFT = 'DRAFT',
  SUBMITTED_FOR_SERVICE_APPROVAL = 'SUBMITTED_FOR_SERVICE_APPROVAL',
  APPROVED_BY_SERVICE_MANAGER = 'APPROVED_BY_SERVICE_MANAGER',
  REJECTED_BY_SERVICE_MANAGER = 'REJECTED_BY_SERVICE_MANAGER',
  SUBMITTED_FOR_DG_APPROVAL = 'SUBMITTED_FOR_DG_APPROVAL',
  APPROVED_BY_DG = 'APPROVED_BY_DG',
  REJECTED_BY_DG = 'REJECTED_BY_DG',
  ACCEPTED_BY_CLIENT = 'ACCEPTED_BY_CLIENT',
  REJECTED_BY_CLIENT = 'REJECTED_BY_CLIENT',
  EXPIRED = 'EXPIRED'
}

export enum InvoiceStatus {
  DRAFT = 'DRAFT',
  SENT = 'SENT',
  PAID = 'PAID',
  PARTIAL = 'PARTIAL',
  OVERDUE = 'OVERDUE',
  CANCELLED = 'CANCELLED'
}