import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Mail, Lock, User, ArrowRight, CheckCircle } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../middleware/user.authstore";

const AuthModal = ({ isOpen, onClose }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const setUser = useAuthStore((state) => state.setUser);

  const handleSwitch = () => {
    setFormData({ name: "", email: "", password: "" });
    setIsLogin(!isLogin);
  };

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const validateFields = () => {
    const { name, email, password } = formData;
    if (!email || !password) {
      toast.error("Email and password are required");
      return false;
    }
    if (!isLogin && !name) {
      toast.error("Name is required for registration");
      return false;
    }
    return true;
  };

  const handleLogin = async () => {
    try {
      setLoading(true);
      const res = await axios.post("http://localhost:5001/api/login", {
        email: formData.email,
        password: formData.password,
      });

      if (res.status == 200) {
        toast.success("Login successful");

        setTimeout(() => {
          setUser(res.data.data);
          navigate("/dashboard");
        }, 3000);
      }
    } catch (error) {
      const message =
        error.response?.data?.message || "Login failed. Please try again.";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    try {
      setLoading(true);
      const res = await axios.post(
        "http://localhost:5001/api/register",
        formData
      );

      if (res.status == 201) {
        toast.success("Account created successfully");

        setTimeout(() => {
          setUser(res.data.data);
          navigate("/dashboard");
        }, 3000);
      }
    } catch (error) {
      const message =
        error.response?.data?.message ||
        "Registration failed. Please try again.";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateFields()) return;
    isLogin ? await handleLogin() : await handleRegister();
  };

  return (
    <>
      <Toaster position="top-right" />

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-md z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          >
            <motion.div
              className="bg-white w-full max-w-md rounded-2xl shadow-2xl relative overflow-hidden"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.3, type: "spring", stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="absolute top-0 right-0 w-40 h-40 bg-gray-100 rounded-full -translate-y-20 translate-x-20 opacity-50"></div>
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-gray-100 rounded-full translate-y-16 -translate-x-16 opacity-50"></div>

              <div className="relative z-10 p-8">
                <button
                  onClick={onClose}
                  className="absolute right-4 top-4 w-8 h-8 flex cursor-pointer items-center justify-center rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>

                <div className="text-center mb-8">
                  <motion.div
                    className="w-16 h-16 bg-gradient-to-br from-gray-700 to-black rounded-2xl flex items-center justify-center mx-auto mb-4"
                    initial={{ rotate: -180, scale: 0 }}
                    animate={{ rotate: 0, scale: 1 }}
                    transition={{ duration: 0.5, type: "spring" }}
                  >
                    <svg
                      className="w-8 h-8 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </motion.div>

                  <h2 className="text-2xl font-bold text-gray-900">
                    {isLogin ? "Welcome Back" : "Join Us Today"}
                  </h2>
                  <p className="text-sm text-gray-500 mt-1">
                    {isLogin
                      ? "Enter your credentials to continue"
                      : "Create your account in seconds"}
                  </p>
                </div>

                <form className="space-y-4" onSubmit={handleSubmit}>
                  <AnimatePresence mode="wait">
                    {!isLogin && (
                      <motion.div
                        key="register-name"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="relative"
                      >
                        <input
                          name="name"
                          type="text"
                          value={formData.name}
                          onChange={handleChange}
                          placeholder="Full Name"
                          className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent transition-all"
                        />
                        <User className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <motion.div className="relative" layout>
                    <input
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Email Address"
                      className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent transition-all"
                    />
                    <Mail className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
                  </motion.div>

                  <motion.div className="relative" layout>
                    <input
                      name="password"
                      type="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Password"
                      className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent transition-all"
                    />
                    <Lock className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
                  </motion.div>

                  <motion.button
                    type="submit"
                    className={`w-full ${
                      loading ? "bg-gray-600" : "bg-black"
                    } text-white py-3 rounded-xl font-medium cursor-pointer hover:bg-gray-800 transition-all flex items-center justify-center group`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    disabled={loading}
                  >
                    {loading
                      ? "Please wait..."
                      : isLogin
                      ? "Sign In"
                      : "Create Account"}
                    {!loading && (
                      <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    )}
                  </motion.button>
                </form>

                <div className="text-center text-sm text-gray-600 mt-6">
                  {isLogin
                    ? "Don't have an account?"
                    : "Already have an account?"}{" "}
                  <button
                    onClick={handleSwitch}
                    className="text-black font-semibold hover:underline focus:outline-none cursor-pointer"
                  >
                    {isLogin ? "Sign up" : "Sign in"}
                  </button>
                </div>

                {!isLogin && (
                  <div className="mt-4 flex items-start space-x-2">
                    <CheckCircle className="w-4 h-4 text-gray-400 mt-0.5" />
                    <p className="text-xs text-gray-500">
                      By signing up, you agree to our Terms of Service and
                      Privacy Policy
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default AuthModal;
