import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './hooks/useAuth';
import { NotificationProvider } from './contexts/NotificationContext';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import SuppliersPage from './pages/SuppliersPage';
import ExpensesPage from './pages/ExpensesPage';
import EmployeesPage from './pages/EmployeesPage';
import AccountingPage from './pages/AccountingPage';
import SettingsPage from './pages/SettingsPage';
import CustomersPage from './pages/CustomersPage';
import QuotesPage from './pages/QuotesPage';
import InvoicesPage from './pages/InvoicesPage';
import ProductsPage from './pages/ProductsPage';
import PaymentsPage from './pages/PaymentsPage';

function App() {
  return (
    <AuthProvider>
      <NotificationProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/" element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }>
              <Route index element={<Navigate to="/dashboard" replace />} />
              <Route path="dashboard" element={<DashboardPage />} />
              <Route 
                path="clients/*" 
                element={
                  <ProtectedRoute roles={['ADMIN', 'GENERAL_DIRECTOR', 'SERVICE_MANAGER', 'EMPLOYEE']}>
                    <CustomersPage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="produits/*" 
                element={
                  <ProtectedRoute roles={['ADMIN', 'GENERAL_DIRECTOR', 'SERVICE_MANAGER', 'EMPLOYEE']}>
                    <ProductsPage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="devis/*" 
                element={
                  <ProtectedRoute roles={['ADMIN', 'GENERAL_DIRECTOR', 'SERVICE_MANAGER', 'EMPLOYEE']}>
                    <QuotesPage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="factures/*" 
                element={
                  <ProtectedRoute roles={['ADMIN', 'GENERAL_DIRECTOR', 'SERVICE_MANAGER', 'EMPLOYEE', 'ACCOUNTANT']}>
                    <InvoicesPage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="paiements/*" 
                element={
                  <ProtectedRoute roles={['ADMIN', 'GENERAL_DIRECTOR', 'ACCOUNTANT']}>
                    <PaymentsPage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="fournisseurs" 
                element={
                  <ProtectedRoute roles={['ADMIN', 'GENERAL_DIRECTOR', 'ACCOUNTANT']}>
                    <SuppliersPage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="depenses/*" 
                element={
                  <ProtectedRoute roles={['ADMIN', 'GENERAL_DIRECTOR', 'ACCOUNTANT']}>
                    <ExpensesPage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="employes/*" 
                element={
                  <ProtectedRoute roles={['ADMIN', 'GENERAL_DIRECTOR']}>
                    <EmployeesPage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="comptabilite/*" 
                element={
                  <ProtectedRoute roles={['ADMIN', 'GENERAL_DIRECTOR', 'ACCOUNTANT']}>
                    <AccountingPage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="parametres/*" 
                element={
                  <ProtectedRoute roles={['ADMIN', 'GENERAL_DIRECTOR']}>
                    <SettingsPage />
                  </ProtectedRoute>
                } 
              />
            </Route>
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </Router>
      </NotificationProvider>
    </AuthProvider>
  );
}

export default App;