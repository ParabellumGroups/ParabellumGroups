import { apiService } from './api';
import { ApiResponse, Leave, PaginatedResponse } from '../types/api';

export interface LeaveFilters {
  page?: number;
  limit?: number;
  employeeId?: number;
  type?: string;
  status?: string;
  startDate?: string;
  endDate?: string;
}

export interface CreateLeaveData {
  employeeId: number;
  type: 'PAID' | 'UNPAID' | 'SICK' | 'TRAINING' | 'OTHER';
  startDate: string;
  endDate: string;
  duration: number;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'CANCELLED';
  reason?: string;
  comments?: string;
}

class LeaveService {
  async getLeaves(filters: LeaveFilters = {}): Promise<ApiResponse<PaginatedResponse<Leave>>> {
    return apiService.get<ApiResponse<PaginatedResponse<Leave>>>('/leaves', filters);
  }

  async getLeave(id: number): Promise<ApiResponse<{ leave: Leave }>> {
    return apiService.get<ApiResponse<{ leave: Leave }>>(`/leaves/${id}`);
  }

  async createLeave(data: CreateLeaveData): Promise<ApiResponse<{ leave: Leave }>> {
    return apiService.post<ApiResponse<{ leave: Leave }>>('/leaves', data);
  }

  async updateLeave(id: number, data: Partial<CreateLeaveData>): Promise<ApiResponse<{ leave: Leave }>> {
    return apiService.put<ApiResponse<{ leave: Leave }>>(`/leaves/${id}`, data);
  }

  async deleteLeave(id: number): Promise<ApiResponse<{ message: string }>> {
    return apiService.delete<ApiResponse<{ message: string }>>(`/leaves/${id}`);
  }

  async approveLeave(id: number): Promise<ApiResponse<{ leave: Leave }>> {
    return apiService.post<ApiResponse<{ leave: Leave }>>(`/leaves/${id}/approve`);
  }

  async rejectLeave(id: number, reason: string): Promise<ApiResponse<{ leave: Leave }>> {
    return apiService.post<ApiResponse<{ leave: Leave }>>(`/leaves/${id}/reject`, { reason });
  }
}

export const leaveService = new LeaveService();