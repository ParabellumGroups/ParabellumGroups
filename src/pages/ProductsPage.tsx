import React from 'react';
import { Routes, Route } from 'react-router-dom';
import ProductList from '../components/products/ProductList';

const ProductsPage: React.FC = () => {
  return (
    <Routes>
      <Route index element={<ProductList />} />
    </Routes>
  );
};

export default ProductsPage;