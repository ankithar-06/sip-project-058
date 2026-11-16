import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import DashboardLayout from './components/DashboardLayout';

// Public Pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ExplorePage from './pages/ExplorePage';
import OpportunitiesPage from './pages/OpportunitiesPage';
import PublicWebsitePage from './pages/PublicWebsitePage';

// Authenticated Dashboard Pages
import DashboardPage from './pages/DashboardPage';
import BusinessProfilePage from './pages/BusinessProfilePage';
import EditBusinessPage from './pages/EditBusinessPage';
import ProductsPage from './pages/ProductsPage';
import MarketingStudioPage from './pages/MarketingStudioPage';
import CollaborationHubPage from './pages/CollaborationHubPage';
import AnalyticsPage from './pages/AnalyticsPage';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/explore" element={<ExplorePage />} />
          <Route path="/opportunities" element={<OpportunitiesPage />} />
          <Route path="/biz/:id" element={<PublicWebsitePage />} />

          {/* Protected Dashboard Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<DashboardPage />} />
            <Route path="profile" element={<BusinessProfilePage />} />
            <Route path="profile/edit" element={<EditBusinessPage />} />
            <Route path="products" element={<ProductsPage />} />
            <Route path="marketing" element={<MarketingStudioPage />} />
            <Route path="collaborations" element={<CollaborationHubPage />} />
            <Route path="analytics" element={<AnalyticsPage />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
