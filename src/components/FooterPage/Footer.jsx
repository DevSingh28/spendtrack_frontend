import React from "react";
import { Instagram, Github, Linkedin } from "lucide-react";
import { motion } from "framer-motion";

const Footer = () => {
  return (
    <motion.div
      initial={{ y: 30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <footer className="w-[95%] rounded-2xl mx-auto px-4 py-4 bg-white backdrop-blur-md shadow-sm mb-4 mt-4">
        <div className=" text-gray-700 space-y-4 mx-auto flex flex-col items-center ">
          <p className="text-sm">Empowering smarter spending</p>
          <div className="flex space-x-6">
            <a
              href="https://www.instagram.com/dev.singh2002/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="hover:text-teal-500 cursor-pointer hover:scale-105"
            >
              <Instagram size={24} />
            </a>
            <a
              href="https://github.com/DevSingh28"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
              className="hover:text-teal-500 cursor-pointer hover:scale-105"
            >
              <Github size={24} />
            </a>
            <a
              href="https://www.linkedin.com/in/dev-singh-2b3541275/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className="hover:text-teal-500 cursor-pointer hover:scale-105"
            >
              <Linkedin size={24} />
            </a>
          </div>
          <p className="text-xs text-gray-500">
            © {new Date().getFullYear()} SpendTrack. Created by Dev Singh.
          </p>
        </div>
      </footer>
    </motion.div>
  );
};

export default Footer;
