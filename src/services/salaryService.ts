import { apiService } from './api';
import { ApiResponse, Salary, PaginatedResponse } from '../types/api';

export interface SalaryFilters {
  page?: number;
  limit?: number;
  employeeId?: number;
  status?: string;
  startDate?: string;
  endDate?: string;
}

export interface CreateSalaryData {
  employeeId: number;
  payDate: string;
  grossSalary: number;
  netSalary: number;
  socialContributions: number;
  taxDeductions: number;
  bonuses: number;
  deductions: number;
  status: 'DRAFT' | 'PAID' | 'CANCELLED';
  payrollPeriodStart?: string;
  payrollPeriodEnd?: string;
  notes?: string;
}

class SalaryService {
  async getSalaries(filters: SalaryFilters = {}): Promise<ApiResponse<PaginatedResponse<Salary>>> {
    return apiService.get<ApiResponse<PaginatedResponse<Salary>>>('/salaries', filters);
  }

  async getSalary(id: number): Promise<ApiResponse<{ salary: Salary }>> {
    return apiService.get<ApiResponse<{ salary: Salary }>>(`/salaries/${id}`);
  }

  async createSalary(data: CreateSalaryData): Promise<ApiResponse<{ salary: Salary }>> {
    return apiService.post<ApiResponse<{ salary: Salary }>>('/salaries', data);
  }

  async updateSalary(id: number, data: Partial<CreateSalaryData>): Promise<ApiResponse<{ salary: Salary }>> {
    return apiService.put<ApiResponse<{ salary: Salary }>>(`/salaries/${id}`, data);
  }

  async deleteSalary(id: number): Promise<ApiResponse<{ message: string }>> {
    return apiService.delete<ApiResponse<{ message: string }>>(`/salaries/${id}`);
  }

  async generatePayslip(id: number): Promise<ApiResponse<{ url: string }>> {
    return apiService.post<ApiResponse<{ url: string }>>(`/salaries/${id}/generate-payslip`);
  }
}

export const salaryService = new SalaryService();