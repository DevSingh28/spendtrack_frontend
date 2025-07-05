import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Wallet } from "lucide-react";
import { motion } from "framer-motion";
import AuthModal from "../../AuthPage/AuthModal";

const Navbar = () => {
  const [openModal, setOpenModal] = useState(false);
  return (
    <motion.div
      initial={{ y: -30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="pt-4"
    >
      <div className="w-[95%] mx-auto  flex items-center justify-between rounded-2xl px-4 py-4 bg-white backdrop-blur-md shadow-sm">
        <div className="flex items-center gap-2">
          <Wallet className="text-black w-5 h-5" />
          <h1 className="text-lg md:text-xl font-bold text-black font-sans tracking-wide z-50">
            SpendTrack
          </h1>
        </div>
        <div>
          <button
            onClick={() => setOpenModal(true)}
            className="text-sm font-medium bg-gradient-to-r from-gray-800 to-black  duration-300 transform hover:scale-105 cursor-pointer text-white px-4 py-2 rounded-lg hover:bg-gray-900 transition"
          >
            Get Started
          </button>
        </div>
      </div>
      <AuthModal isOpen={openModal} onClose={() => setOpenModal(false)} />
    </motion.div>
  );
};

export default Navbar;
