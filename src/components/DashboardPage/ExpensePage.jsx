import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Filter,
  Search,
  Calendar,
  IndianRupee,
  CreditCard,
  Trash2,
  Edit,
  X,
  ChevronDown,
  TrendingUp,
  Wallet,
  ShoppingCart,
  Home,
  Car,
  Heart,
  Briefcase,
  Coffee,
  Slash,
  Film,
  BookOpen,
  MapPin,
  MoreHorizontal,
} from "lucide-react";

import axios from "axios";

axios.defaults.withCredentials = true;

const ExpensePage = () => {
  const [expenses, setExpenses] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);
  const [selectedExpense, setSelectedExpense] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [dateRange, setDateRange] = useState({ from: "", to: "" });
  const [totalThisMonth, setTotalThisMonth] = useState(0);
  const [totalAllTime, setTotalAllTime] = useState(0);
  const [loading, setLoading] = useState(false);
  const [showDateFilter, setShowDateFilter] = useState(false);

  const categories = [
    {
      id: "Food",
      name: "Food & Dining",
      icon: Coffee,
      color: "bg-orange-100 text-orange-600",
    },
    {
      id: "Rent",
      name: "Rent",
      icon: Home,
      color: "bg-yellow-100 text-yellow-600",
    },
    {
      id: "Shopping",
      name: "Shopping",
      icon: ShoppingCart,
      color: "bg-purple-100 text-purple-600",
    },
    {
      id: "Transport",
      name: "Transport",
      icon: Car,
      color: "bg-blue-100 text-blue-600",
    },
    {
      id: "Utilities",
      name: "Utilities",
      icon: IndianRupee,
      color: "bg-indigo-100 text-indigo-600",
    },
    {
      id: "Entertainment",
      name: "Entertainment",
      icon: Film,
      color: "bg-pink-100 text-pink-600",
    },
    {
      id: "Health",
      name: "Health",
      icon: Heart,
      color: "bg-red-100 text-red-600",
    },
    {
      id: "Education",
      name: "Education",
      icon: BookOpen,
      color: "bg-green-100 text-green-600",
    },
    {
      id: "Travel",
      name: "Travel",
      icon: MapPin,
      color: "bg-teal-100 text-teal-600",
    },
    {
      id: "Miscellaneous",
      name: "Miscellaneous",
      icon: Slash,
      color: "bg-gray-100 text-gray-600",
    },
  ];

  const paymentMethods = [
    "Cash",
    "Credit Card",
    "Debit Card",
    "UPI",
    "Net Banking",
  ];

  useEffect(() => {
    fetchExpenses();
  }, [selectedCategory, dateRange, searchQuery]);

  const fetchExpenses = async () => {
    setLoading(true);
    try {
      const params = {
        ...(selectedCategory && { category: selectedCategory }),
        ...(dateRange.from && { from: dateRange.from }),
        ...(dateRange.to && { to: dateRange.to }),
        ...(searchQuery && { search: searchQuery }),
      };

      const response = await axios.get(
        "https://spendtrack-backend-node.onrender.com/exp",
        {
          params,
        }
      );
      setExpenses(response.data.data);
      calculateTotals(response.data.data);
      console.log(response);
    } catch (error) {
      console.error("Error fetching expenses:", error);
    } finally {
      setLoading(false);
    }
  };

  const calculateTotals = (expenseList) => {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();

    const monthTotal = expenseList
      .filter((expense) => {
        const expenseDate = new Date(expense.date);
        return (
          expenseDate.getMonth() === currentMonth &&
          expenseDate.getFullYear() === currentYear
        );
      })
      .reduce((sum, expense) => sum + expense.amount, 0);

    setTotalThisMonth(monthTotal);
    setTotalAllTime(
      expenseList.reduce((sum, expense) => sum + expense.amount, 0)
    );
  };

  const handleDelete = async () => {
    try {
      await axios.delete(
        `https://spendtrack-backend-node.onrender.com/exp/${selectedExpense._id}`
      );
      setShowDeleteModal(false);
      fetchExpenses();
    } catch (error) {
      console.error("Error deleting expense:", error);
    }
  };

  const ExpenseModal = ({ expense, onClose }) => {
    const [formData, setFormData] = useState({
      amount: expense?.amount || "",
      category: expense?.category || "",
      date:
        expense?.date?.split("T")[0] || new Date().toISOString().split("T")[0],
      paymentMethod: expense?.paymentMethod || "",
      notes: expense?.notes || "",
    });

    const handleSubmit = async (e) => {
      e.preventDefault();
      try {
        if (expense) {
          await axios.put(
            `https://spendtrack-backend-node.onrender.com/exp/${expense._id}`,
            formData
          );
        } else {
          await axios.post(
            "https://spendtrack-backend-node.onrender.com/exp",
            formData
          );
        }
        onClose();
        fetchExpenses();
      } catch (error) {
        console.error("Error saving expense:", error);
      }
    };

    return (
      <motion.div
        className="fixed inset-0 bg-black/50 backdrop-blur-md z-50 flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="bg-white w-full max-w-2xl rounded-lg shadow-2xl my-20 max-h-[90%] overflow-y-auto hide-scrollbar"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                {expense ? "Edit Expense" : "Add New Expense"}
              </h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Amount
                </label>
                <div className="relative">
                  <IndianRupee className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={formData.amount}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        amount: parseFloat(e.target.value),
                      })
                    }
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-400"
                    placeholder="0.00"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() =>
                        setFormData({ ...formData, category: cat.id })
                      }
                      className={`p-3 rounded-xl border-2 transition-all cursor-pointer ${
                        formData.category === cat.id
                          ? "border-gray-900 bg-gray-900 text-white"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <cat.icon className="w-5 h-5 mx-auto mb-1" />
                      <span className="text-xs">{cat.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date
                </label>
                <input
                  type="date"
                  required
                  max={new Date().toISOString().split("T")[0]}
                  value={formData.date}
                  onChange={(e) =>
                    setFormData({ ...formData, date: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-400"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Payment Method
                </label>
                <select
                  required
                  value={formData.paymentMethod}
                  onChange={(e) =>
                    setFormData({ ...formData, paymentMethod: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-400"
                >
                  <option value="">Select payment method</option>
                  {paymentMethods.map((method) => (
                    <option key={method} value={method}>
                      {method}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Notes (Optional)
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) =>
                    setFormData({ ...formData, notes: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-400"
                  rows="3"
                  placeholder="Add any additional notes..."
                />
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-3 cursor-pointer border-2 border-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 cursor-pointer bg-black text-white rounded-xl font-medium hover:bg-gray-800 transition-colors"
                >
                  {expense ? "Update" : "Add"} Expense
                </button>
              </div>
            </form>
          </div>
        </motion.div>
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto p-6">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Expenses</h1>
            <p className="text-gray-600 mt-1">Track and manage your spending</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowAddModal(true)}
            className="flex items-center space-x-2 px-6 py-3 cursor-pointer bg-black text-white rounded-xl font-medium hover:bg-gray-800 transition-colors"
          >
            <Plus className="w-5 h-5" />
            <span>Add Expense</span>
          </motion.button>
        </div>

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
              <span className="text-sm text-gray-500">All Time</span>
            </div>
            <p className="text-3xl font-bold text-gray-900">
              ₹{totalAllTime.toFixed(2)}
            </p>
            <p className="text-sm text-gray-500 mt-1">Total Expenses</p>
          </motion.div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl p-6 shadow-sm"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center">
                <Calendar className="w-6 h-6 text-gray-700" />
              </div>
              <span className="text-sm text-gray-500">This Month</span>
            </div>
            <p className="text-3xl font-bold text-gray-900">
              ₹{totalThisMonth.toFixed(2)}
            </p>
            <p className="text-sm text-gray-500 mt-1">Monthly Spending</p>
          </motion.div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl p-6 shadow-sm"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-gray-700" />
              </div>
              <span className="text-sm text-gray-500">Average</span>
            </div>
            <p className="text-3xl font-bold text-gray-900">
              ₹
              {expenses.length > 0
                ? (totalAllTime / expenses.length).toFixed(2)
                : "0.00"}
            </p>
            <p className="text-sm text-gray-500 mt-1">Per Transaction</p>
          </motion.div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm mb-6">
          <div className="flex flex-col space-y-4">
            <div className="relative flex-1 w-full lg:max-w-md mx-auto">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by notes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400"
              />
            </div>

            <div className="flex flex-col md:flex-row md:items-center md:space-x-3 space-y-3 md:space-y-0 w-full md:w-auto mx-auto">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full md:w-auto px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400"
              >
                <option value="">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>

              <button
                onClick={() => setShowDateFilter(!showDateFilter)}
                className="flex items-center px-4 py-2 bg-gray-100 border border-gray-200 rounded-lg md:hidden mt-1"
              >
                <Filter className="w-4 h-4 mr-1 text-gray-600" />
                <span className="text-sm text-gray-700">Date Filter</span>
              </button>

              <div className="hidden md:flex items-center space-x-3">
                <input
                  type="date"
                  value={dateRange.from}
                  onChange={(e) =>
                    setDateRange({ ...dateRange, from: e.target.value })
                  }
                  className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400"
                />

                <input
                  type="date"
                  value={dateRange.to}
                  onChange={(e) =>
                    setDateRange({ ...dateRange, to: e.target.value })
                  }
                  className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400"
                />
              </div>
            </div>
          </div>

          {showDateFilter && (
            <div className="mt-1 flex flex-col gap-y-2 md:hidden">
              <input
                type="date"
                value={dateRange.from}
                onChange={(e) =>
                  setDateRange({ ...dateRange, from: e.target.value })
                }
                className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400"
              />
              <input
                type="date"
                value={dateRange.to}
                onChange={(e) =>
                  setDateRange({ ...dateRange, to: e.target.value })
                }
                className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400"
              />
            </div>
          )}
        </div>

        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Description
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Payment Method
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                      </div>
                    </td>
                  </tr>
                ) : expenses.length === 0 ? (
                  <tr>
                    <td
                      colSpan="6"
                      className="px-6 py-4 text-center text-gray-500"
                    >
                      No expenses found. Add your first expense to get started.
                    </td>
                  </tr>
                ) : (
                  expenses.map((expense) => {
                    const category = categories.find(
                      (cat) => cat.id === expense.category
                    );
                    const Icon = category?.icon || MoreHorizontal;

                    return (
                      <motion.tr
                        key={expense._id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {new Date(expense.date).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center space-x-2">
                            <div
                              className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                                category?.color || "bg-gray-100"
                              }`}
                            >
                              <Icon className="w-4 h-4" />
                            </div>
                            <span className="text-sm font-medium text-gray-900">
                              {category?.name || "Other"}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                          {expense.notes || "-"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          <div className="flex items-center space-x-2">
                            <CreditCard className="w-4 h-4 text-gray-400" />
                            <span>{expense.paymentMethod}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                          ₹{expense.amount.toFixed(2)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => {
                                setEditingExpense(expense);
                                setShowAddModal(true);
                              }}
                              className="p-2 hover:bg-gray-100 rounded-lg cursor-pointer transition-colors"
                            >
                              <Edit className="w-4 h-4 text-gray-600" />
                            </button>
                            <button
                              onClick={() => {
                                setSelectedExpense(expense);
                                setShowDeleteModal(true);
                              }}
                              className="p-2 hover:bg-red-50 rounded-lg cursor-pointer transition-colors"
                            >
                              <Trash2 className="w-4 h-4 text-red-600" />
                            </button>
                          </div>
                        </td>
                      </motion.tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showAddModal && (
          <ExpenseModal
            expense={editingExpense}
            onClose={() => {
              setShowAddModal(false);
              setEditingExpense(null);
            }}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showDeleteModal && (
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-md z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowDeleteModal(false)}
          >
            <motion.div
              className="bg-white w-full max-w-md rounded-2xl shadow-2xl p-6"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mx-auto mb-4">
                <Trash2 className="w-8 h-8 text-red-600" />
              </div>

              <h3 className="text-xl font-bold text-gray-900 text-center mb-2">
                Delete Expense
              </h3>
              <p className="text-gray-500 text-center mb-6">
                Are you sure you want to delete this expense? This action cannot
                be undone.
              </p>

              {selectedExpense && (
                <div className="bg-gray-50 rounded-xl p-4 mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-500">Amount</span>
                    <span className="font-semibold">
                      ₹{selectedExpense.amount.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-500">Category</span>
                    <span className="font-medium">
                      {categories.find(
                        (cat) => cat.id === selectedExpense.category
                      )?.name || "Other"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">Date</span>
                    <span className="font-medium">
                      {new Date(selectedExpense.date).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              )}

              <div className="flex space-x-3">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="flex-1 py-3 border-2 border-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  className="flex-1 py-3 bg-red-600 text-white rounded-xl font-medium hover:bg-red-700 transition-colors"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ExpensePage;
