import { apiService } from './api';
import { ApiResponse, Employee, PaginatedResponse } from '../types/api';

export interface EmployeeFilters {
  page?: number;
  limit?: number;
  search?: string;
  department?: string;
  contractType?: string;
  active?: boolean;
}

export interface CreateEmployeeData {
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  addressLine1?: string;
  city?: string;
  postalCode?: string;
  country?: string;
  hireDate: string;
  jobTitle: string;
  department: string;
  salaryBase: number;
  contractType: 'CDI' | 'CDD' | 'STAGE' | 'FREELANCE';
  bankName?: string;
  bankIban?: string;
  bankBic?: string;
}

class EmployeeService {
  async getEmployees(filters: EmployeeFilters = {}): Promise<ApiResponse<PaginatedResponse<Employee>>> {
    return apiService.get<ApiResponse<PaginatedResponse<Employee>>>('/employees', filters);
  }

  async getEmployee(id: number): Promise<ApiResponse<{ employee: Employee }>> {
    return apiService.get<ApiResponse<{ employee: Employee }>>(`/employees/${id}`);
  }

  async createEmployee(data: CreateEmployeeData): Promise<ApiResponse<{ employee: Employee }>> {
    return apiService.post<ApiResponse<{ employee: Employee }>>('/employees', data);
  }

  async updateEmployee(id: number, data: Partial<CreateEmployeeData>): Promise<ApiResponse<{ employee: Employee }>> {
    return apiService.put<ApiResponse<{ employee: Employee }>>(`/employees/${id}`, data);
  }

  async deleteEmployee(id: number): Promise<ApiResponse<{ message: string }>> {
    return apiService.delete<ApiResponse<{ message: string }>>(`/employees/${id}`);
  }
}

export const employeeService = new EmployeeService();