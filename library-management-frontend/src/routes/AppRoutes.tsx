import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from '../components/layout/MainLayout';
import ProtectedRoute from '../components/guards/ProtectedRoute';
import RoleGuard from '../components/guards/RoleGuard';

// Auth Pages
import LoginPage from '../pages/auth/LoginPage';
import RegisterPage from '../pages/auth/RegisterPage';

// Public Pages
import HomePage from '../pages/home/HomePage';
import BooksPage from '../pages/books/BooksPage';
import BookDetailPage from '../pages/books/BookDetailPage';

// User Pages (Protected)
import ProfilePage from '../pages/profile/ProfilePage';
import RentalOrdersPage from '../pages/rental/RentalOrdersPage';
import WalletPage from '../pages/wallet/WalletPage';

// Admin Pages (Protected + Role Guard)
import AdminDashboardPage from '../pages/admin/AdminDashboardPage';
import AdminBooksPage from '../pages/admin/books/AdminBooksPage';
import AdminBookFormPage from '../pages/admin/books/AdminBookFormPage';
import AdminOrdersPage from '../pages/admin/orders/AdminOrdersPage';
import AdminUsersPage from '../pages/admin/users/AdminUsersPage';

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Auth pages — no layout wrapper */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Main layout */}
      <Route element={<MainLayout />}>
        {/* Public */}
        <Route path="/" element={<HomePage />} />
        <Route path="/books" element={<BooksPage />} />
        <Route path="/books/:id" element={<BookDetailPage />} />

        {/* Protected — User */}
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/rental/orders"
          element={
            <ProtectedRoute>
              <RentalOrdersPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/wallet"
          element={
            <ProtectedRoute>
              <WalletPage />
            </ProtectedRoute>
          }
        />

        {/* Admin / Librarian */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <RoleGuard roles={['ADMIN', 'LIBRARIAN']}>
                <AdminDashboardPage />
              </RoleGuard>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/books"
          element={
            <ProtectedRoute>
              <RoleGuard roles={['ADMIN', 'LIBRARIAN']}>
                <AdminBooksPage />
              </RoleGuard>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/books/new"
          element={
            <ProtectedRoute>
              <RoleGuard roles={['ADMIN', 'LIBRARIAN']}>
                <AdminBookFormPage />
              </RoleGuard>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/books/:id/edit"
          element={
            <ProtectedRoute>
              <RoleGuard roles={['ADMIN', 'LIBRARIAN']}>
                <AdminBookFormPage />
              </RoleGuard>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/orders"
          element={
            <ProtectedRoute>
              <RoleGuard roles={['ADMIN', 'LIBRARIAN']}>
                <AdminOrdersPage />
              </RoleGuard>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/users"
          element={
            <ProtectedRoute>
              <RoleGuard roles={['ADMIN']}>
                <AdminUsersPage />
              </RoleGuard>
            </ProtectedRoute>
          }
        />
      </Route>

      {/* Catch all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;
