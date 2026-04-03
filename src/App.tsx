import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./client/contexts/AuthContext";
import { Layout } from "./client/components/Layout";
import { Auth } from "./client/pages/Auth";
import { Home } from "./client/pages/Home";
import { TenantDashboard } from "./client/pages/TenantDashboard";
import { OwnerDashboard } from "./client/pages/OwnerDashboard";
import { AdminDashboard } from "./client/pages/AdminDashboard";

const ProtectedRoute: React.FC<{ children: React.ReactNode; role?: string }> = ({ children, role }) => {
  const { profile, loading } = useAuth();

  if (loading) return <div className="flex items-center justify-center h-screen">Loading...</div>;
  if (!profile) return <Navigate to="/login" />;
  if (role && profile.role !== role) return <Navigate to="/" />;

  return <>{children}</>;
};

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Layout>
          <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Auth />} />
              
              {/* Tenant Routes */}
              <Route path="/search" element={
                <ProtectedRoute role="TENANT">
                  <TenantDashboard />
                </ProtectedRoute>
              } />
              <Route path="/recommendations" element={
                <ProtectedRoute role="TENANT">
                  <TenantDashboard />
                </ProtectedRoute>
              } />

              {/* Owner Routes */}
              <Route path="/owner/listings" element={
                <ProtectedRoute role="OWNER">
                  <OwnerDashboard />
                </ProtectedRoute>
              } />
              <Route path="/owner/request" element={
                <ProtectedRoute role="OWNER">
                  <OwnerDashboard />
                </ProtectedRoute>
              } />

              {/* Admin Routes */}
              <Route path="/admin" element={
                <ProtectedRoute role="ADMIN">
                  <AdminDashboard />
                </ProtectedRoute>
              } />
            </Routes>
          </Layout>
        </Router>
      </AuthProvider>
  );
}
