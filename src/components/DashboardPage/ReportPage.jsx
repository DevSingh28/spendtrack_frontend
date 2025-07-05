import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  TrendingUp,
  PieChart,
  BarChart3,
  Filter,
  Download,
  CreditCard,
  IndianRupee,
  ChevronDown,
  Coffee,
  Car,
  ShoppingCart,
  Home,
  Heart,
  Film,
  BookOpen,
  MapPin,
  Slash,
  MoreHorizontal,
} from "lucide-react";

import axios from "axios";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Line, Pie, Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const ReportPage = () => {
  axios.defaults.withCredentials = true;

  const now = new Date();
  const currentMonth = `${now.getFullYear()}-${String(
    now.getMonth() + 1
  ).padStart(2, "0")}`;

  const [reportData, setReportData] = useState([]);
  const [categoryTotals, setCategoryTotals] = useState({});
  const [selectedMonths, setSelectedMonths] = useState([currentMonth]);
  const [chartType, setChartType] = useState("line");
  const [loading, setLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(true);

  const categories = [
    {
      id: "Food",
      name: "Food & Dining",
      icon: Coffee,
      color: "#f97316",
    },
    {
      id: "Rent",
      name: "Rent",
      icon: Home,
      color: "#facc15",
    },
    {
      id: "Shopping",
      name: "Shopping",
      icon: ShoppingCart,
      color: "#a855f7",
    },
    {
      id: "Transport",
      name: "Transport",
      icon: Car,
      color: "#3b82f6",
    },
    {
      id: "Utilities",
      name: "Utilities",
      icon: IndianRupee,
      color: "#6366f1",
    },
    {
      id: "Entertainment",
      name: "Entertainment",
      icon: Film,
      color: "#ec4899",
    },
    {
      id: "Health",
      name: "Health",
      icon: Heart,
      color: "#ef4444",
    },
    {
      id: "Education",
      name: "Education",
      icon: BookOpen,
      color: "#10b981",
    },
    {
      id: "Travel",
      name: "Travel",
      icon: MapPin,
      color: "#14b8a6",
    },
    {
      id: "Miscellaneous",
      name: "Miscellaneous",
      icon: Slash,
      color: "#6b7280",
    },
  ];

  const chartOptions = [
    { type: "line", icon: TrendingUp, label: "Line Chart" },
    { type: "bar", icon: BarChart3, label: "Bar Chart" },
    { type: "pie", icon: PieChart, label: "Pie Chart" },
  ];

  useEffect(() => {
    fetchReports([currentMonth]);
    fetchCategoryTotals();
  }, []);

  const fetchReports = async (months) => {
    setLoading(true);
    try {
      const response = await axios.get(
        "https://spendtrack-backend-node.onrender.com/report/generate",
        {
          params: { months },
        }
      );
      setReportData(response.data.data);
      console.log("monthly budget report data: ", response.data.data);
    } catch (error) {
      console.error("Error fetching reports:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategoryTotals = async () => {
    try {
      const response = await axios.get(
        "https://spendtrack-backend-node.onrender.com/report/total"
      );
      setCategoryTotals(response.data.data);
      console.log("Total cat. data: ", response.data.data);
    } catch (error) {
      console.error("Error fetching category totals:", error);
    }
  };

  const handleMonthChange = (month) => {
    const newMonths = selectedMonths.includes(month)
      ? selectedMonths.filter((m) => m !== month)
      : [...selectedMonths, month];

    setSelectedMonths(newMonths);
    if (newMonths.length > 0) {
      fetchReports(newMonths);
    }
  };

  const getChartData = () => {
    if (chartType === "pie") {
      const labels = Object.keys(categoryTotals);
      const data = Object.values(categoryTotals);
      const colors = labels.map((label) => {
        const cat = categories.find((c) => c.id === label);
        return cat?.color || "#9ca3af";
      });

      return {
        labels: labels.map((label) => {
          const cat = categories.find((c) => c.id === label);
          return cat?.name || label;
        }),
        datasets: [
          {
            data,
            backgroundColor: colors,
            borderWidth: 0,
          },
        ],
      };
    } else {
      const sortedData = [...reportData].sort((a, b) =>
        a.month.localeCompare(b.month)
      );
      const labels = sortedData.map((data) => {
        const date = new Date(data.month + "-01");
        return date.toLocaleDateString("default", {
          month: "short",
          year: "numeric",
        });
      });

      if (chartType === "line") {
        const categoryDatasets = categories.map((cat) => {
          const data = sortedData.map(
            (report) => report.categoryBreakdown[cat.id] || 0
          );
          return {
            label: cat.name,
            data,
            borderColor: cat.color,
            backgroundColor: cat.color + "20",
            tension: 0.4,
            fill: true,
          };
        });

        return { labels, datasets: categoryDatasets };
      } else {
        return {
          labels,
          datasets: [
            {
              label: "Total Spent",
              data: sortedData.map((data) => data.totalSpent),
              backgroundColor: "#1f2937",
              borderRadius: 8,
            },
          ],
        };
      }
    }
  };

  const chartConfig = {
    line: {
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: "bottom" },
          title: { display: true, text: "Monthly Expense Trends" },
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              callback: (value) => "₹" + value.toLocaleString(),
            },
          },
        },
      },
    },
    bar: {
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          title: { display: true, text: "Monthly Total Expenses" },
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              callback: (value) => "₹" + value.toLocaleString(),
            },
          },
        },
      },
    },
    pie: {
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: "right" },
          title: { display: true, text: "Expenses by Category" },
        },
      },
    },
  };

  const generateMonthOptions = () => {
    const months = [];
    const currentDate = new Date();
    for (let i = 11; i >= 0; i--) {
      const date = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() - i,
        1
      );
      months.push(date.toISOString().slice(0, 7));
    }
    return months;
  };

  const downloadCSV = () => {
    if (!reportData.length) return;

    const keys = Object.keys(reportData[0]);

    const header = keys.join(",") + "\r\n";

    const rows = reportData
      .map((row) =>
        keys
          .map((key) => {
            let val = row[key];

            if (typeof val === "object") {
              val = JSON.stringify(val);
            }

            if (typeof val === "string" && /[,"\r\n]/.test(val)) {
              val = `"${val.replace(/"/g, '""')}"`;
            }

            return val;
          })
          .join(",")
      )
      .join("\r\n");

    const csvContent = header + rows;
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `report_${selectedMonths.join("_")}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto p-6">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Financial Reports
            </h1>
            <p className="text-gray-600 mt-1">
              Analyze your spending patterns and trends
            </p>
          </div>
          <motion.button
            onClick={downloadCSV}
            disabled={!reportData.length}
            whileHover={{ scale: !reportData.length ? 1 : 1.05 }}
            whileTap={{ scale: !reportData.length ? 1 : 0.95 }}
            className={`flex items-center cursor-pointer space-x-2 px-6 py-3 rounded-xl font-medium transition-colors ${
              !reportData.length
                ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                : "bg-black text-white hover:bg-gray-800"
            }`}
          >
            <Download className="w-5 h-5" />
            <span>{reportData.length ? "Export as CSV" : "No Data"}</span>
          </motion.button>
        </div>

        {reportData.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="bg-white rounded-2xl p-6 shadow-sm"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center">
                  <IndianRupee className="w-6 h-6 text-gray-700" />
                </div>
              </div>
              <p className="text-3xl font-bold text-gray-900">
                ₹
                {reportData
                  .reduce((sum, r) => sum + r.totalSpent, 0)
                  .toFixed(2)}
              </p>
              <p className="text-sm text-gray-500 mt-1">Total Spent</p>
            </motion.div>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-2xl p-6 shadow-sm"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-gray-700" />
                </div>
              </div>
              <p className="text-xl font-bold text-gray-900">
                {reportData[0]?.topCategory || "N/A"}
              </p>
              <p className="text-sm text-gray-500 mt-1">Top Category</p>
            </motion.div>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-2xl p-6 shadow-sm"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center">
                  <CreditCard className="w-6 h-6 text-gray-700" />
                </div>
              </div>
              <p className="text-xl font-bold text-gray-900">
                {reportData[0]?.topPaymentMethods[0]?.method || "N/A"}
              </p>
              <p className="text-sm text-gray-500 mt-1">Top Payment Method</p>
            </motion.div>
          </div>
        )}

        <div className="bg-white rounded-2xl p-6 shadow-sm mb-6">
          <div className="flex flex-col lg:flex-row items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">
              Expense Analysis
            </h2>
            <div className="flex flex-col lg:flex-row items-center space-x-4">
              <div className="flex bg-gray-100 rounded-lg p-1 my-3 lg:my-0">
                {chartOptions.map((option) => (
                  <button
                    key={option.type}
                    onClick={() => setChartType(option.type)}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${
                      chartType === option.type
                        ? "bg-white shadow-sm text-gray-900"
                        : "text-gray-600 hover:text-gray-900"
                    }`}
                  >
                    <option.icon className="w-4 h-4" />
                    <span className="text-sm font-medium">{option.label}</span>
                  </button>
                ))}
              </div>

              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center space-x-2 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Filter className="w-4 h-4" />

                <span className="text-sm font-medium">
                  {selectedMonths.length === 1
                    ? new Date(selectedMonths[0] + "-01").toLocaleDateString(
                        "default",
                        {
                          month: "short",
                          year: "2-digit",
                        }
                      )
                    : "Filters"}
                </span>
                <ChevronDown
                  className={`w-4 h-4 transition-transform ${
                    showFilters ? "rotate-180" : ""
                  }`}
                />
              </button>
            </div>
          </div>

          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="mb-6 overflow-hidden"
              >
                <div className="border-t border-gray-200 pt-4">
                  <p className="text-sm font-medium text-gray-700 mb-3">
                    Select Months:
                  </p>
                  <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
                    {generateMonthOptions().map((month) => (
                      <button
                        key={month}
                        onClick={() => handleMonthChange(month)}
                        className={`px-3 py-2 text-sm rounded-lg transition-all ${
                          selectedMonths.includes(month)
                            ? "bg-gray-900 text-white"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                      >
                        {new Date(month + "-01").toLocaleDateString("default", {
                          month: "short",
                          year: "2-digit",
                        })}
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="h-96">
            {loading ? (
              <div className="flex items-center justify-center h-full">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
              </div>
            ) : reportData.length > 0 ? (
              chartType === "line" ? (
                <Line
                  data={getChartData()}
                  options={chartConfig.line.options}
                />
              ) : chartType === "bar" ? (
                <Bar data={getChartData()} options={chartConfig.bar.options} />
              ) : (
                <Pie data={getChartData()} options={chartConfig.pie.options} />
              )
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500">
                Select months to generate report
              </div>
            )}
          </div>
        </div>

        {reportData.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="bg-white rounded-2xl p-6 shadow-sm"
            >
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                Category Breakdown
              </h3>
              <div className="space-y-3">
                {Object.entries(categoryTotals).map(([catId, total]) => {
                  const category = categories.find((c) => c.id === catId);
                  const Icon = category?.icon || MoreHorizontal;
                  const percentage = (
                    (total /
                      Object.values(categoryTotals).reduce(
                        (a, b) => a + b,
                        0
                      )) *
                    100
                  ).toFixed(1);

                  return (
                    <div
                      key={catId}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center space-x-3">
                        <div
                          className={`w-10 h-10 rounded-lg flex items-center justify-center`}
                          style={{
                            backgroundColor: category?.color + "20",
                            color: category?.color,
                          }}
                        >
                          <Icon className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">
                            {category?.name || catId}
                          </p>
                          <p className="text-sm text-gray-500">
                            {percentage}% of total
                          </p>
                        </div>
                      </div>
                      <p className="font-semibold text-gray-900">
                        ₹{total.toFixed(2)}
                      </p>
                    </div>
                  );
                })}
              </div>
            </motion.div>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="bg-white rounded-2xl p-6 shadow-sm"
            >
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                Payment Methods
              </h3>
              <div className="space-y-4">
                {reportData.length > 0 &&
                  reportData[0].topPaymentMethods.map((method, index) => {
                    const total = reportData.reduce((sum, report) => {
                      const methodData = report.topPaymentMethods.find(
                        (m) => m.method === method.method
                      );
                      return sum + (methodData?.total || 0);
                    }, 0);

                    const maxTotal = Math.max(
                      ...reportData[0].topPaymentMethods.map((m) => m.total)
                    );
                    const percentage = (method.total / maxTotal) * 100;

                    return (
                      <div key={method.method}>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-gray-700">
                            {method.method}
                          </span>
                          <span className="text-sm font-semibold text-gray-900">
                            ₹{total.toFixed(2)}
                          </span>
                        </div>
                        <div className="w-full bg-gray-100 rounded-full h-2">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${percentage}%` }}
                            transition={{ duration: 0.5, delay: 0.1 * index }}
                            className="bg-gray-900 h-2 rounded-full"
                          />
                        </div>
                      </div>
                    );
                  })}
              </div>
            </motion.div>
          </div>
        )}

        {reportData.length > 0 && (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="bg-white rounded-2xl p-6 shadow-sm mt-6"
          >
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              Monthly Summary
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b border-gray-200">
                  <tr>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">
                      Month
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">
                      Total Spent
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">
                      Top Category
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">
                      Transactions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {reportData.map((report) => (
                    <tr key={report.month} className="hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <span className="font-medium text-gray-900">
                          {new Date(report.month + "-01").toLocaleDateString(
                            "default",
                            {
                              month: "long",
                              year: "numeric",
                            }
                          )}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-semibold text-gray-900">
                        ₹{report.totalSpent.toFixed(2)}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-2">
                          {(() => {
                            const category = categories.find(
                              (c) => c.id === report.topCategory
                            );
                            const Icon = category?.icon || MoreHorizontal;
                            return (
                              <>
                                <div
                                  className={`w-6 h-6 rounded flex items-center justify-center`}
                                  style={{
                                    backgroundColor: category?.color + "20",
                                    color: category?.color,
                                  }}
                                >
                                  <Icon className="w-4 h-4" />
                                </div>
                                <span className="text-sm text-gray-700">
                                  {category?.name || report.topCategory}
                                </span>
                              </>
                            );
                          })()}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-600">
                        {Object.values(report.categoryBreakdown).reduce(
                          (sum, amount) => sum + (amount > 0 ? 1 : 0),
                          0
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default ReportPage;
