import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Auth from './pages/Auth';
import Home from './pages/Home';
import PostDetails from './pages/PostDetails';
import Dashboard from './pages/Dashboard';
import API from './api/api';
import Loader from './components/Loader';
import Layout from './components/Layout';

export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // On app load, check if the user is authenticated via HttpOnly cookie
  useEffect(() => {
    API.get('/auth/me')
      .then((res) => {
        setUser(res.data.user);
      })
      .catch(() => {
        // No valid cookie, user is not logged in
        setUser(null);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const handleAuthSuccess = (user) => {
    setUser(user);
  };

  const handleLogout = async () => {
    try {
      await API.post('/auth/logout');
    } catch (err) {
      console.error('Logout failed', err);
    } finally {
      setUser(null);
    }
  };

  if (loading) {
    return <Loader fullScreen />;
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route 
          path="/" 
          element={
            <Layout user={user} onLogout={handleLogout}>
              <Home />
            </Layout>
          } 
        />
        <Route 
          path="/posts/:id" 
          element={
            <Layout user={user} onLogout={handleLogout}>
              <PostDetails user={user} />
            </Layout>
          } 
        />
        <Route 
          path="/dashboard" 
          element={
            user ? (
              <Layout user={user} onLogout={handleLogout}>
                <Dashboard user={user} />
              </Layout>
            ) : <Navigate to="/auth" replace />
          } 
        />

        <Route 
          path="/auth" 
          element={
            user ? <Navigate to="/" replace /> : <Auth onAuthSuccess={handleAuthSuccess} />
          } 
        />
        
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
