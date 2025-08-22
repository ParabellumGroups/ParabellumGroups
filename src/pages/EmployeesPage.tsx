import React from 'react';
import { Routes, Route } from 'react-router-dom';
import EmployeeList from '../components/employees/EmployeeList';
import EmployeeForm from '../components/employees/EmployeeForm';
import EmployeeDetail from '../components/employees/EmployeeDetail';
import SalaryList from '../components/employees/SalaryList';
import SalaryForm from '../components/employees/SalaryForm';
import LeaveList from '../components/employees/LeaveList';
import LeaveForm from '../components/employees/LeaveForm';

const EmployeesPage: React.FC = () => {
  return (
    <Routes>
      <Route index element={<EmployeeList />} />
      <Route path="nouveau" element={<EmployeeForm mode="create" />} />
      <Route path=":id" element={<EmployeeDetail />} />
      <Route path=":id/modifier" element={<EmployeeForm mode="edit" />} />
      <Route path=":id/salaires" element={<SalaryList />} />
      <Route path=":id/salaires/nouveau" element={<SalaryForm mode="create" />} />
      <Route path=":id/salaires/:salaryId" element={<SalaryForm mode="edit" />} />
      <Route path=":id/conges" element={<LeaveList />} />
      <Route path=":id/conges/nouveau" element={<LeaveForm mode="create" />} />
      <Route path=":id/conges/:leaveId" element={<LeaveForm mode="edit" />} />
    </Routes>
  );
};

export default EmployeesPage;