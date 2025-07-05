import React, { useEffect, useState } from "react";
import Navbar from "../NavbarPage/Navbar";
import { motion } from "framer-motion";
import { TypeAnimation } from "react-type-animation";
import Footer from "../FooterPage/Footer";
import AuthModal from "../../AuthPage/AuthModal";
import toast, { Toaster } from "react-hot-toast";

const Home = ({ connecting }) => {
  const [openModal, setOpenModal] = useState(false);
  useEffect(() => {
    if (connecting) {
      toast.loading("Connecting to backend...", {
        id: "home-connection",
      });
    } else {
      toast.dismiss("home-connection");
    }
  }, [connecting]);

  return (
    <div className="relative min-h-screen bg-gray-100 text-black overflow-hidden">
      <Toaster position="top-right" />
      <div className="absolute -top-20 -left-32 w-[500px] h-[500px]  bg-gradient-to-br from-teal-50 to-teal-100 rounded-full opacity-40 animate-blob pointer-events-none hidden md:block"></div>
      <div className="absolute top-1/2 -right-40 w-[600px] h-[600px] bg-gradient-to-tr from-indigo-200 to-indigo-300 rounded-full opacity-30 animate-blob animation-delay-2000 pointer-events-none"></div>
      <div className="absolute bottom-0 left-1/3 w-[400px] h-[400px] bg-gradient-to-l from-pink-200 to-pink-300 rounded-full opacity-35 animate-blob animation-delay-4000 pointer-events-none"></div>
      <Navbar />
      <div className="relative w-[95%] mx-auto mt-4 rounded-3xl bg-white flex flex-col lg:flex-row items-center justify-between px-8 md:px-16 py-16 shadow-xl">
        <motion.div
          initial={{ x: -60, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="w-full lg:w-1/2 space-y-6 text-center lg:text-start"
        >
          <p className="text-sm font-medium text-gray-600 text-center lg:text-start">
            Save time and money.
            <br className="block lg:hidden" />
            <TypeAnimation
              sequence={[
                "Automated Expense Tracking",
                2000,
                "Smart Budget Alerts",
                2000,
                "Insightful Spending Reports",
                2000,
              ]}
              speed={50}
              repeat={Infinity}
              wrapper="span"
              className="text-black font-semibold ml-2"
            />
          </p>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
            <span className="relative">
              Optimize,
              <svg
                className="absolute -bottom-2 left-0 w-full"
                height="10"
                viewBox="0 0 200 10"
                preserveAspectRatio="none"
              >
                <path
                  d="M0,5 Q50,0 100,5 T200,5"
                  stroke="#9ca3af"
                  strokeWidth="2"
                  fill="none"
                />
              </svg>
            </span>
            <br className="block md:hidden lg:block" />
            <span className="bg-gradient-to-r from-gray-700 to-black bg-clip-text text-transparent">
              Outperform
            </span>
          </h1>
          <p className="text-gray-500 text-lg">
            Track your expenses, manage your budget, and get smart insights.
          </p>
          <div className="flex flex-col sm:flex-row lg:justify-start sm:space-x-4 items-center justify-center">
            <button
              onClick={() => setOpenModal(true)}
              className="px-6 py-3 bg-gradient-to-r from-gray-800 to-black text-white font-semibold rounded-lg md:min-w-md shadow-md cursor-pointer transition duration-300 transform hover:scale-105"
            >
              Try it For Free {`->`}
            </button>
          </div>
        </motion.div>

        <motion.div
          initial={{ x: 60, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="w-full lg:w-1/2 flex justify-center lg:justify-end mt-10 md:mt-14 lg:mt-0"
        >
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full filter blur-3xl opacity-30 transform scale-110"></div>
            <img
              src="./hero2.svg"
              alt="Hero"
              className="w-full max-w-[450px] h-auto relative z-10"
            />
            <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-white rounded-2xl shadow-lg flex items-center justify-center">
              <svg
                className="w-12 h-12 text-gray-700"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                />
              </svg>
            </div>
            <div className="absolute -top-6 -left-6 w-20 h-20 bg-gray-100 rounded-2xl shadow-lg flex items-center justify-center">
              <svg
                className="w-10 h-10 text-gray-700"
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
            </div>
          </div>
        </motion.div>
      </div>
      <Footer />
      <AuthModal isOpen={openModal} onClose={() => setOpenModal(false)} />
    </div>
  );
};

export default Home;
