import React, { useState, useRef, useEffect } from 'react';
import { Search, Moon, Sun } from 'lucide-react';

function Navbar({
  profileImage,
  username = "User", // add username prop with default
  onProfileClick,
  onAskClick,
  onToggleTheme,
  isDarkMode,
  onLogout, // callback for logout
}) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm sticky top-0 z-50 p-4 flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <h1 className="text-xl font-bold text-blue-600 dark:text-blue-400">SolveIt</h1>
        <div className="relative">
          <Search className="absolute left-3 top-2.5 text-gray-400 dark:text-gray-500 w-5 h-5" />
          <input
            type="text"
            placeholder="Search questions..."
            className="pl-10 pr-4 py-2 border dark:border-gray-600 bg-white dark:bg-gray-700 text-black dark:text-white rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="flex items-center space-x-4 relative" ref={dropdownRef}>
        <button
          onClick={onAskClick}
          className="bg-blue-600 text-white px-4 py-2 rounded-full font-semibold hover:bg-blue-700 transition"
        >
          Ask Question
        </button>

        <button
          onClick={onToggleTheme}
          className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition"
          title="Toggle Theme"
        >
          {isDarkMode ? (
            <Sun className="w-5 h-5 text-yellow-400" />
          ) : (
            <Moon className="w-5 h-5 text-gray-600" />
          )}
        </button>

        {/* Profile with username */}
        <button
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className="flex items-center space-x-2 focus:outline-none"
          title="Profile options"
          aria-haspopup="true"
          aria-expanded={dropdownOpen}
        >
          <img
            src={profileImage || "https://via.placeholder.com/32"}
            alt="Profile"
            className="w-8 h-8 rounded-full border-2 border-blue-500 cursor-pointer"
          />
          <span className="hidden sm:inline text-gray-700 dark:text-gray-300 font-semibold select-none">
            {username}
          </span>
        </button>

        {dropdownOpen && (
          <div
            className="absolute right-0 top-full mt-2 w-64 bg-white dark:bg-gray-800 text-black dark:text-white rounded-xl shadow-lg border dark:border-gray-700 z-50
            animate-fade-in slide-down"
            style={{ minWidth: "16rem" }}
          >
            <div className="p-4 border-b dark:border-gray-600 font-semibold text-blue-600 dark:text-blue-400 select-none">
              Profile Options
            </div>
            <ul className="divide-y divide-gray-200 dark:divide-gray-700 text-sm">
              <li
                className="p-3 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                onClick={() => {
                  setDropdownOpen(false);
                  alert("Overview clicked");
                }}
              >
                Overview
              </li>
              <li
                className="p-3 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                onClick={() => {
                  setDropdownOpen(false);
                  alert("Tags clicked");
                }}
              >
                Tags
              </li>
              <li
                className="p-3 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                onClick={() => {
                  setDropdownOpen(false);
                  alert("Upload clicked");
                }}
              >
                Upload Profile Picture
              </li>
              <li
                className="p-3 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                onClick={() => {
                  setDropdownOpen(false);
                  alert("Edit clicked");
                }}
              >
                Edit Info
              </li>
              <li
                className="p-3 text-red-600 hover:bg-red-50 dark:hover:bg-red-900 cursor-pointer font-semibold"
                onClick={() => {
                  setDropdownOpen(false);
                  if (onLogout) onLogout();
                  else alert("Logged out");
                }}
              >
                Logout
              </li>
              <li
                className="p-3 text-red-600 hover:bg-red-50 dark:hover:bg-red-900 cursor-pointer"
                onClick={() => {
                  setDropdownOpen(false);
                  alert("Delete clicked");
                }}
              >
                Delete Profile
              </li>
            </ul>
          </div>
        )}
      </div>

      {/* Add these animation styles to your global CSS or tailwind config */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        @keyframes slideDown {
          from {
            transform: translateY(-10px);
          }
          to {
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fadeIn 0.25s ease forwards;
        }
        .slide-down {
          animation: slideDown 0.25s ease forwards;
        }
      `}</style>
    </header>
  );
}

export default Navbar;
