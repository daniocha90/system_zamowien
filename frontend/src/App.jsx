import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { I18nextProvider } from 'react-i18next';
import i18n from './i18n';
import { ThemeProvider } from './contexts/ThemeContext';
import { CartProvider } from './contexts/CartContext';
import Header from './components/Layout/Header';
import Footer from './components/Layout/Footer';
import Home from './pages/Home';
import OrderForm from './pages/OrderForm';
import AdminDashboard from './pages/admin/Dashboard';
import Login from './pages/admin/Login';
import ProtectedRoute from './components/Admin/ProtectedRoute';

function App() {
  return (
    <I18nextProvider i18n={i18n}>
      <ThemeProvider>
        <CartProvider>
          <Router basename="/zamowienia">
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
              <Header />
              <main className="container mx-auto px-4 py-8">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/order" element={<OrderForm />} />
                  <Route path="/admin/login" element={<Login />} />
                  <Route 
                    path="/admin/dashboard" 
                    element={
                      <ProtectedRoute>
                        <AdminDashboard />
                      </ProtectedRoute>
                    } 
                  />
                </Routes>
              </main>
              <Footer />
            </div>
          </Router>
        </CartProvider>
      </ThemeProvider>
    </I18nextProvider>
  );
}

export default App;