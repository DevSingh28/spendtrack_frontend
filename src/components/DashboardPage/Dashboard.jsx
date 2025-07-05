import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu,
  X,
  LayoutDashboard,
  Wallet,
  TrendingUp,
  FileText,
  Settings,
  HelpCircle,
  LogOut,
  ChevronRight,
  DollarSign,
} from "lucide-react";
import { Outlet, useLocation, Link } from "react-router-dom";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { useAuthStore } from "../../middleware/user.authstore";

const SIDEBAR_WIDTH = 280;

const Dashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLargeScreen, setIsLargeScreen] = useState(window.innerWidth >= 1024);
  const location = useLocation();
  const { clearUser } = useAuthStore();

  useEffect(() => {
    const handleResize = () => {
      const isLarge = window.innerWidth >= 1024;
      setIsLargeScreen(isLarge);
      if (isLarge) setIsSidebarOpen(false);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handlelogoutclick = async () => {
    try {
      const res = await axios.post(
        "https://spendtrack-backend-node.onrender.com/api/logout",
        {
          withCredentials: true,
        }
      );
      clearUser();

      if (res.status == 200) {
        toast.success("Logout Success");
      }
    } catch (error) {}
  };

  const menuItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: LayoutDashboard,
      to: "/dashboard",
    },
    {
      id: "expenses",
      label: "Expenses",
      icon: Wallet,
      to: "/dashboard/expenses",
    },
    {
      id: "reports",
      label: "Reports",
      icon: FileText,
      to: "/dashboard/reports",
    },
    {
      id: "help",
      label: "Help Center",
      icon: HelpCircle,
      to: "/dashboard/help",
    },
  ];

  const bottomMenuItems = [{ id: "logout", label: "Logout", icon: LogOut }];

  const getActiveMenu = () => {
    const path = location.pathname.split("/")[2];
    return path || "dashboard";
  };

  const activeMenu = getActiveMenu();

  return (
    <div className="flex h-screen bg-gray-100">
      <AnimatePresence mode="wait">
        {!isLargeScreen && isSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <AnimatePresence>
        {(isLargeScreen || isSidebarOpen) && (
          <motion.aside
            initial={{ x: -SIDEBAR_WIDTH }}
            animate={{ x: 0 }}
            exit={{ x: -SIDEBAR_WIDTH }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="fixed top-0 left-0 h-full bg-white shadow-xl z-50 lg:static lg:shadow-lg"
            style={{ width: SIDEBAR_WIDTH }}
          >
            <div className="flex flex-col h-full">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-gray-700 to-black rounded-xl flex items-center justify-center">
                      <Wallet className="w-6 h-6 text-white" />
                    </div>
                    <h2 className="text-xl font-bold text-gray-900">
                      SpendTrack
                    </h2>
                  </div>
                  {!isLargeScreen && (
                    <button
                      onClick={() => setIsSidebarOpen(false)}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <X className="w-5 h-5 text-gray-600" />
                    </button>
                  )}
                </div>
              </div>

              <nav className="flex-1 p-4 space-y-1">
                {menuItems.map((item) => (
                  <Link
                    to={item.to}
                    key={item.id}
                    onClick={() => {
                      if (!isLargeScreen) setIsSidebarOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all ${
                      activeMenu === item.id
                        ? "bg-gray-900 text-white"
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <item.icon className="w-5 h-5" />
                      <span className="font-medium">{item.label}</span>
                    </div>
                    {activeMenu === item.id && (
                      <ChevronRight className="w-4 h-4" />
                    )}
                  </Link>
                ))}
              </nav>

              <div className="p-4 border-t border-gray-200 space-y-1">
                {bottomMenuItems.map((item) => (
                  <motion.button
                    key={item.id}
                    className="w-full flex items-center cursor-pointer space-x-3 px-4 py-3 rounded-xl text-gray-600 hover:bg-gray-100 transition-all"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handlelogoutclick}
                  >
                    <item.icon className="w-5 h-5" />
                    <span className="font-medium">{item.label}</span>
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile Header */}
        {!isLargeScreen && (
          <div className="sticky top-0 z-10 bg-white border-b p-4 lg:hidden">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Wallet className="text-black w-5 h-5" />
                <h1 className="text-lg md:text-xl font-bold text-black font-sans tracking-wide z-50">
                  SpendTrack
                </h1>
              </div>
              <button
                onClick={() => setIsSidebarOpen(true)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Menu className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </div>
        )}

        <main className="flex-1 p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
