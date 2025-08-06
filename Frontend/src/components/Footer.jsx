import React from "react";
import { motion } from "framer-motion";

const links = [
  { href: "/help", label: "Help Center" },
  { href: "/privacy-policy", label: "Privacy Policy" },
  { href: "/terms", label: "Terms of Service" },
  { href: "/contact", label: "Contact Us" },
];

function Footer() {
  return (
    <motion.footer
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="bg-white border-t border-gray-300 text-gray-600 text-xs"
    >
      <div className="max-w-screen-xl mx-auto px-6 py-4 flex flex-col sm:flex-row justify-between items-center space-y-2 sm:space-y-0">
        {/* Links */}
        <div className="flex flex-wrap justify-center gap-6">
          {links.map(({ href, label }) => (
            <motion.a
              key={label}
              href={href}
              whileHover={{ scale: 1.1, color: "#2563eb" }} // blue-600
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="cursor-pointer transition-colors"
            >
              {label}
            </motion.a>
          ))}
        </div>

        {/* Copyright */}
        <div className="text-center sm:text-right text-[11px] select-none">
          &copy; {new Date().getFullYear()} SolveIt. All rights reserved.
        </div>
      </div>
    </motion.footer>
  );
}

export default Footer;