import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import BookList, { CartProvider } from './BookList';
import Cart from './Cart';

const App = () => {
  return (
    <Router>
      <CartProvider>
        <Routes>
          <Route path="/" element={<BookList />} />
          <Route path="/cart" element={<Cart />} />
        </Routes>
      </CartProvider>
    </Router>
  );
};

export default App;
