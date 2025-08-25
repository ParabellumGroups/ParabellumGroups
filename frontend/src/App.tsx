import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './hooks/useAuth';
import { DarkModeProvider } from './hooks/useDarkMode';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Layout } from './components/Layout/Layout';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { CustomerList } from './pages/Customers/CustomerList';
import { QuoteList } from './pages/Quotes/QuoteList';
import { InvoiceList } from './pages/Invoices/InvoiceList';
import { PaymentList } from './pages/Payments/PaymentList';
import { ProductList } from './pages/Products/ProductList';
import { ExpenseList } from './pages/Expenses/ExpenseList';
import { ReportDashboard } from './pages/Reports/ReportDashboard';
import { UserManagement } from './pages/Admin/UserManagement';
import { ServiceManagement } from './pages/Admin/ServiceManagement';
import { PermissionManagement } from './pages/Admin/PermissionManagement';
import { EmployeeList } from './pages/HR/EmployeeList';
import { LeaveManagement } from './pages/HR/LeaveManagement';
import { SalaryManagement } from './pages/HR/SalaryManagement';
import { LoanManagement } from './pages/HR/LoanManagement';
import { ContractList } from './pages/HR/ContractList';
import { ProspectionWorkflow } from './pages/Commercial/ProspectionWorkflow';
import { SpecialiteList } from './pages/Services/SpecialiteList';
import { TechnicienList } from './pages/Services/TechnicienList';
import { MissionList } from './pages/Services/MissionList';
import { MaterielList } from './pages/Services/MaterielList';
import { InterventionList } from './pages/Services/InterventionList';
import { ReportList } from './pages/Reports/ReportList';
import { MessageList } from './pages/Messages/MessageList';

// Créer le client React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <DarkModeProvider>
        <AuthProvider>
          <Router>
            <Routes>
              {/* Route de connexion */}
              <Route path="/login" element={<Login />} />
              
              {/* Routes protégées */}
              <Route
                path="/*"
                element={
                  <ProtectedRoute>
                    <Layout />
                  </ProtectedRoute>
                }
              >
                <Route path="dashboard" element={<Dashboard />} />
                
                {/* Redirection par défaut vers le dashboard */}
                <Route path="" element={<Navigate to="/dashboard" replace />} />
                
                {/* Routes implémentées */}
                <Route 
                  path="customers" 
                  element={
                    <ProtectedRoute permission="customers.read">
                      <CustomerList />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="quotes" 
                  element={
                    <ProtectedRoute permission="quotes.read">
                      <QuoteList />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="invoices" 
                  element={
                    <ProtectedRoute permission="invoices.read">
                      <InvoiceList />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="payments" 
                  element={
                    <ProtectedRoute permission="payments.read">
                      <PaymentList />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="products" 
                  element={
                    <ProtectedRoute permission="products.read">
                      <ProductList />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="expenses" 
                  element={
                    <ProtectedRoute permission="expenses.read">
                      <ExpenseList />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="reports" 
                  element={
                    <ProtectedRoute permission="reports.financial">
                      <ReportList />
                    </ProtectedRoute>
                  } 
                />
                
                {/* Messages */}
                <Route
                  path="messages" 
                  element={
                    <ProtectedRoute permission="messages.read">
                      <MessageList />
                    </ProtectedRoute>
                  }
                />
                
                {/* Ressources Humaines */}
                <Route
                  path="hr/employees" 
                  element={
                    <ProtectedRoute permission="employees.read">
                      <EmployeeList />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="hr/salaries" 
                  element={
                    <ProtectedRoute permission="salaries.read">
                      <SalaryManagement />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="hr/contracts"
                  element={
                    <ProtectedRoute permission="contracts.read">
                      <ContractList />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="hr/leaves" 
                  element={
                    <ProtectedRoute permission="leaves.read">
                      <LeaveManagement />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="hr/loans" 
                  element={
                    <ProtectedRoute permission="loans.read">
                      <LoanManagement />
                    </ProtectedRoute>
                  }
                />
                
                {/* Commercial */}
                <Route
                  path="commercial/prospection" 
                  element={
                    <ProtectedRoute permission="prospects.read">
                      <ProspectionWorkflow />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="commercial/pipeline"
                  element={
                    <ProtectedRoute permission="quotes.read">
                      <div>Pipeline CRM (à implémenter)</div>
                    </ProtectedRoute>
                  }
                />
                
                {/* Services Techniques */}
                <Route
                  path="services/specialites" 
                  element={
                    <ProtectedRoute permission="specialites.read">
                      <SpecialiteList />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="services/techniciens" 
                  element={
                    <ProtectedRoute permission="techniciens.read">
                      <TechnicienList />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="services/missions" 
                  element={
                    <ProtectedRoute permission="missions.read">
                      <MissionList />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="services/interventions"
                  element={
                    <ProtectedRoute permission="interventions.read">
                      <InterventionList />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="services/materiel" 
                  element={
                    <ProtectedRoute permission="materiels.read">
                      <MaterielList />
                    </ProtectedRoute>
                  }
                />
                
                {/* Administration */}
                <Route
                  path="admin/users" 
                  element={
                    <ProtectedRoute permission="users.read">
                      <UserManagement />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="admin/services"
                  element={
                    <ProtectedRoute permission="admin.system_settings">
                      <ServiceManagement />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="admin/permissions"
                  element={
                    <ProtectedRoute permission="users.manage_permissions">
                      <PermissionManagement />
                    </ProtectedRoute>
                  }
                />
              </Route>
              
              {/* Route 404 */}
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </Router>
        </AuthProvider>
      </DarkModeProvider>
    </QueryClientProvider>
  );
}

export default App;