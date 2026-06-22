import { useState, useEffect } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import API from "./api/api";

import Home from "./pages/Home";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import PostDetails from "./pages/PostDetails";
import UserProfile from "./pages/UserProfile";

import Layout from "./components/common/Layout";
import Loader from "./components/common/Loader";

import ProtectedRoute from "./routes/ProtectedRoute";
import GuestRoute from "./routes/GuestRoute";

export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const { data } = await API.get("/auth/me");
        setUser(data.user);
      } catch (error) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  const handleAuthSuccess = (userData) => {
    setUser(userData);
  };

  const handleLogout = async () => {
    try {
      await API.post("/auth/logout");
    } catch (error) {
      console.error("Logout failed:", error);
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
        {/* Routes with Layout */}
        <Route
          element={
            <Layout
              user={user}
              onLogout={handleLogout}
            />
          }
        >
          <Route
            index
            element={<Home user={user} />}
          />

          <Route
            path="posts/:id"
            element={
              <PostDetails user={user} />
            }
          />

          <Route
            path="dashboard"
            element={
              <ProtectedRoute user={user}>
                <Dashboard user={user} />
              </ProtectedRoute>
            }
          />

          <Route
            path="profile/:username"
            element={
              <UserProfile user={user} />
            }
          />
        </Route>

        {/* Auth Route */}
        <Route
          path="/auth"
          element={
            <GuestRoute user={user}>
              <Auth
                onAuthSuccess={
                  handleAuthSuccess
                }
              />
            </GuestRoute>
          }
        />

        {/* 404 Redirect */}
        <Route
          path="*"
          element={
            <Navigate
              to="/"
              replace
            />
          }
        />
      </Routes>
    </BrowserRouter>
  );
}