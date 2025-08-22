import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './hooks/useAuth';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Layout } from './components/Layout/Layout';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { CustomerList } from './pages/Customers/CustomerList';
import { QuoteList } from './pages/Quotes/QuoteList';
import { UserManagement } from './pages/Admin/UserManagement';
import { EmployeeList } from './pages/HR/EmployeeList';
import { LeaveManagement } from './pages/HR/LeaveManagement';

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
              
              {/* Routes à implémenter */}
              <Route path="invoices" element={<div>Gestion des factures (à implémenter)</div>} />
              <Route path="payments" element={<div>Gestion des paiements (à implémenter)</div>} />
              <Route path="products" element={<div>Gestion des produits (à implémenter)</div>} />
              <Route path="expenses" element={<div>Gestion des dépenses (à implémenter)</div>} />
              <Route path="reports" element={<div>Rapports (à implémenter)</div>} />
              
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
                path="hr/contracts"
                element={
                  <ProtectedRoute permission="contracts.read">
                    <div>Gestion des contrats (à implémenter)</div>
                  </ProtectedRoute>
                }
              />
              <Route
                path="hr/salaries"
                element={
                  <ProtectedRoute permission="salaries.read">
                    <div>Gestion des salaires (à implémenter)</div>
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
                    <div>Gestion des services (à implémenter)</div>
                  </ProtectedRoute>
                }
              />
              <Route
                path="admin/permissions"
                element={
                  <ProtectedRoute permission="users.manage_permissions">
                    <div>Gestion des permissions (à implémenter)</div>
                  </ProtectedRoute>
                }
              />
            </Route>
            
            {/* Route 404 */}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;