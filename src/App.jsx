import React, { useEffect, useState } from "react";
import {
  Route,
  Routes,
  BrowserRouter,
  Navigate,
  useLocation,
} from "react-router-dom";
import axios from "axios";

import Home from "./components/HomePage/Home";
import Dashboard from "./components/DashboardPage/Dashboard";
import DashboardHome from "./components/DashboardPage/DashboardHome";
import ExpensesPage from "./components/DashboardPage/ExpensePage";
import ReportsPage from "./components/DashboardPage/ReportPage";
import HelpCenterPage from "./components/DashboardPage/HelpCenterPage";

import { useAuthStore } from "./middleware/user.authstore";

const ProtectedRoute = ({ element }) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return element;
};

const App = () => {
  const setUser = useAuthStore((state) => state.setUser);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const [connecting, setConnecting] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.post("http://localhost:5001/api/me", {
          withCredentials: true,
        });

        if (res.status === 200) {
          setUser(res.data);
        }
      } catch (error) {
        console.log("Not authenticated");
      } finally {
        setConnecting(false);
      }
    };

    fetchUser();
  }, [setUser]);

  return (
    <div className="min-h-screen">
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={
              isAuthenticated ? (
                <Navigate to="/dashboard" replace />
              ) : (
                <Home connecting={connecting} />
              )
            }
          />
          <Route
            path="/dashboard"
            element={<ProtectedRoute element={<Dashboard />} />}
          >
            <Route index element={<DashboardHome />} />
            <Route path="expenses" element={<ExpensesPage />} />
            <Route path="reports" element={<ReportsPage />} />
            <Route path="help" element={<HelpCenterPage />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;
