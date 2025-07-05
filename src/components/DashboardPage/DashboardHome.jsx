import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { AlertTriangle, CheckCircle, Bell, Plus } from "lucide-react";
import axios from "axios";
import { useAuthStore } from "../../middleware/user.authstore";

axios.defaults.withCredentials = true;

const DashboardHome = () => {
  const [userName, setUserName] = useState("John");
  const [budgetAlerts, setBudgetAlerts] = useState([]);
  const [stats, setStats] = useState({
    totalBalance: 4250,
    monthlyIncome: 6500,
    monthlyExpense: 0,
    savingsRate: 28.3,
  });
  const [reportData, setReportData] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [monthlyLimit, setMonthlyLimit] = useState(15000);
  const user = useAuthStore((state) => state.user);

  const categories = [
    "Food",
    "Rent",
    "Shopping",
    "Transport",
    "Utilities",
    "Entertainment",
    "Health",
    "Education",
    "Travel",
    "Miscellaneous",
  ];

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  const getAlertColor = (status) => {
    switch (status) {
      case "exceeded":
        return "text-red-600 bg-red-100";
      case "reached":
        return "text-orange-600 bg-orange-100";
      case "warning":
        return "text-yellow-600 bg-yellow-100";
      default:
        return "text-green-600 bg-green-100";
    }
  };

  const getAlertIcon = (status) => {
    switch (status) {
      case "exceeded":
      case "reached":
      case "warning":
        return AlertTriangle;
      default:
        return CheckCircle;
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const reportResponse = await axios.get(
          "https://spendtrack-backend-node.onrender.com/report/generate",
          { params: { months: 1 } }
        );
        setReportData(reportResponse.data.data);
      } catch (error) {
        console.error("Error fetching report data:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchBudgetAlerts = async () => {
      if (!reportData || reportData.length === 0) return;

      const currentMonth = new Date().toISOString().slice(0, 7);
      const token = localStorage.getItem("token");

      const alerts = await Promise.all(
        categories.map(async (category) => {
          try {
            const response = await axios.get(
              `https://spendtrack-backend-node.onrender.com/budget/check-alert?category=${category}&month=${currentMonth}`,
              { headers: { Authorization: `Bearer ${token}` } }
            );

            return {
              category,
              amount: response.data.totalSpent,
              limit: response.data.monthlyLimit,
              percentage: parseFloat(response.data.percentageUsed).toFixed(0),
              status: response.data.alert
                ? "exceeded"
                : parseFloat(response.data.percentageUsed) >= 80
                ? "warning"
                : "safe",
            };
          } catch (error) {
            if (error.response?.status === 404) {
              return {
                category,
                amount: reportData[0]?.categoryBreakdown[category] || 0,
                limit: 15000,
                percentage: Math.round(
                  ((reportData[0]?.categoryBreakdown[category] || 0) / 15000) *
                    100
                ),
                status: "safe",
                isDefault: true,
              };
            }
            console.error(`Error fetching budget for ${category}:`, error);
            return null;
          }
        })
      );

      setBudgetAlerts(alerts.filter((alert) => alert !== null));
    };

    if (reportData) {
      fetchBudgetAlerts();
      setStats((prev) => ({
        ...prev,
        monthlyExpense: reportData[0]?.totalSpent || 0,
      }));
    }
  }, [reportData]);

  const handleSaveBudget = async () => {
    const token = localStorage.getItem("token");
    try {
      await axios.post("https://spendtrack-backend-node.onrender.com/budget/", {
        category: selectedCategory,
        monthlyLimit,
      });
      setIsModalOpen(false);
      const reportResponse = await axios.get(
        "https://spendtrack-backend-node.onrender.com/report/generate",
        { params: { months: 1 } }
      );
      setReportData(reportResponse.data.data);
    } catch (error) {
      console.error("Error saving budget:", error);
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto relative">
      <div className="absolute top-0 right-0 w-96 h-96 opacity-5">
        <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
          <path
            fill="#1F2937"
            d="M39.9,-65.7C54.3,-59.5,70.1,-52.7,77.3,-40.9C84.5,-29.1,83.1,-12.3,79.6,3.1C76.1,18.5,70.5,32.7,61.3,44.1C52.1,55.5,39.3,64.1,25.1,68.4C10.9,72.7,-4.7,72.7,-20.3,69.9C-35.9,67.1,-51.5,61.5,-62.9,51.1C-74.3,40.7,-81.5,25.5,-82.9,9.7C-84.3,-6.1,-79.9,-22.5,-71.3,-36.1C-62.7,-49.7,-49.9,-60.5,-35.8,-66.9C-21.7,-73.3,-6.3,-75.3,7.1,-72.9C20.5,-70.5,25.5,-71.9,39.9,-65.7Z"
            transform="translate(100 100)"
          />
        </svg>
      </div>

      <div className=" flex flex-col lg:flex-row items-center lg:justify-between justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {getGreeting()}, {user.name}! 👋
          </h1>
          <p className="text-gray-600">
            Here's your financial overview for{" "}
            {new Date().toLocaleDateString("default", {
              month: "long",
              year: "numeric",
            })}
          </p>
        </motion.div>

        <div className="flex gap-6 mb-8">
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-2xl cursor-pointer p-6 shadow-sm hover:shadow-lg transition-shadow relative overflow-hidden flex flex-col items-center justify-center border-2 border-dashed border-blue-300"
            onClick={() => setIsModalOpen(true)}
          >
            <div className="absolute top-0 right-0 w-24 h-24 transform translate-x-8 -translate-y-8">
              <div className="w-full h-full bg-blue-100 rounded-full opacity-50"></div>
            </div>
            <div className="relative z-10 flex flex-col items-center">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
                <Plus className="w-6 h-6 text-blue-700" />
              </div>
              <p className="text-lg font-bold text-gray-900">Set Budget</p>
              <p className="text-sm text-gray-500 mt-1 text-center">
                Configure spending limits for your categories
              </p>
            </div>
          </motion.button>
        </div>
      </div>

      <div className="w-full">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="w-full"
        >
          <div className="bg-white rounded-2xl p-6 shadow-sm w-full">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  Budget Alerts
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  Default category limit: ₹15,000. Update anytime
                </p>
              </div>
              <Bell className="w-5 h-5 text-gray-500" />
            </div>

            <div className="space-y-4">
              {budgetAlerts.map((alert, index) => {
                const Icon = getAlertIcon(alert.status);
                return (
                  <motion.div
                    key={alert.category}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 + index * 0.1 }}
                    className={`p-4 rounded-xl border ${
                      alert.status === "exceeded"
                        ? "border-red-200 bg-red-50"
                        : alert.status === "reached"
                        ? "border-orange-200 bg-orange-50"
                        : alert.status === "warning"
                        ? "border-yellow-200 bg-yellow-50"
                        : "border-green-200 bg-green-50"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div
                          className={`w-10 h-10 rounded-lg flex items-center justify-center ${getAlertColor(
                            alert.status
                          )}`}
                        >
                          <Icon className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">
                            {alert.category}
                            {alert.isDefault && (
                              <span className="text-xs text-gray-500 ml-2">
                                (default)
                              </span>
                            )}
                          </p>
                          <p className="text-sm text-gray-600">
                            ₹{alert.amount.toLocaleString()} of ₹
                            {alert.limit.toLocaleString()} budget used
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p
                          className={`text-2xl font-bold ${
                            alert.status === "exceeded"
                              ? "text-red-600"
                              : alert.status === "reached"
                              ? "text-orange-600"
                              : alert.status === "warning"
                              ? "text-yellow-600"
                              : "text-green-600"
                          }`}
                        >
                          {alert.percentage}%
                        </p>
                        <p className="text-xs text-gray-500 uppercase">
                          {alert.status}
                        </p>
                      </div>
                    </div>
                    <div className="mt-3 w-full bg-gray-200 rounded-full h-2">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{
                          width: `${Math.min(alert.percentage, 100)}%`,
                        }}
                        transition={{ duration: 0.5, delay: 0.7 + index * 0.1 }}
                        className={`h-2 rounded-full ${
                          alert.status === "exceeded"
                            ? "bg-red-500"
                            : alert.status === "reached"
                            ? "bg-orange-500"
                            : alert.status === "warning"
                            ? "bg-yellow-500"
                            : "bg-green-500"
                        }`}
                      />
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </motion.div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-md  flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-2xl w-96">
            <h3 className="text-xl font-bold mb-4">Set Budget Limit</h3>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Category
              </label>
              <select
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <option value="">Select a category</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Monthly Limit (₹)
              </label>
              <input
                type="number"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                value={monthlyLimit}
                onChange={(e) => setMonthlyLimit(Number(e.target.value))}
              />
            </div>
            <div className="flex justify-end space-x-3">
              <button
                className="flex-1 py-3 cursor-pointer border-2 border-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors"
                onClick={() => setIsModalOpen(false)}
              >
                Cancel
              </button>
              <button
                className="flex-1 py-3 cursor-pointer bg-black text-white rounded-xl font-medium hover:bg-gray-800 transition-colors"
                onClick={handleSaveBudget}
                disabled={!selectedCategory}
              >
                Save Budget
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardHome;
