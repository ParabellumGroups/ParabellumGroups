import React from 'react';
import { Routes, Route } from 'react-router-dom';
import PaymentList from '../components/payments/PaymentList';

const PaymentsPage: React.FC = () => {
  return (
    <Routes>
      <Route index element={<PaymentList />} />
    </Routes>
  );
};

export default PaymentsPage;