import React, { useState, useEffect } from "react";
import Sidebar from "../Components/Sidebar";
import Navbar from "../Components/Navbar";
import Modal from "../Components/Modal";
import Footer from "../Components/Footer";

export default function HomePage() {
  const [showModal, setShowModal] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [darkMode, setDarkMode] = useState(false);


  const [sidebarWidth, setSidebarWidth] = useState(256);
  const [sidebarX, setSidebarX] = useState(0);


  useEffect(() => {
    const savedImage = localStorage.getItem("profileImage");
    if (savedImage) setProfileImage(savedImage);

    const savedTheme = localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

    if (savedTheme === "dark" || (!savedTheme && prefersDark)) {
      setDarkMode(true);
      document.documentElement.classList.add("dark");
    } else {
      setDarkMode(false);
      document.documentElement.classList.remove("dark");
    }
  }, []);

  const handleToggleTheme = () => {
    setDarkMode((prev) => {
      const newTheme = !prev;
      if (newTheme) {
        document.documentElement.classList.add("dark");
        localStorage.setItem("theme", "dark");
      } else {
        document.documentElement.classList.remove("dark");
        localStorage.setItem("theme", "light");
      }
      return newTheme;
    });
  };

  const handleProfileClick = () => {
    localStorage.setItem("profileImage", profileImage || "");
    window.open("/profile", "_blank", "width=600,height=600");
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 flex relative">
      <Sidebar
        setSidebarWidth={setSidebarWidth}
        setSidebarX={setSidebarX}
      />

      <div
        className="flex-1 flex flex-col h-screen overflow-hidden"
        style={{
          marginLeft: sidebarX + sidebarWidth,
          transition: "margin-left 0.3s ease",
        }}
      >
        <Navbar
          profileImage={profileImage}
          onProfileClick={handleProfileClick}
          onAskClick={() => setShowModal(true)}
          onToggleTheme={handleToggleTheme}
          isDarkMode={darkMode}
        />

        {showModal && <Modal onClose={() => setShowModal(false)} />}

        <main className="flex-1 overflow-y-auto px-4 py-6">
          <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
            <section className="md:col-span-2 space-y-6">
              {[...Array(10)].map((_, index) => (
                <div
                  key={index}
                  className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow hover:shadow-lg transition"
                >
                  <h2 className="text-xl font-bold text-gray-800 dark:text-white">
                    Question #{index + 1} – How does recursion work in JavaScript?
                  </h2>
                  <p className="text-gray-600 dark:text-gray-300 mt-2">
                    Recursion is when a function calls itself to solve smaller
                    instances of a problem.
                  </p>
                  <button className="mt-4 text-sm text-blue-600 dark:text-blue-400 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-400">
                    Read more
                  </button>
                  <div className="mt-4">
                    <textarea
                      placeholder="Add a comment..."
                      className="w-full p-3 border rounded-md text-sm bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-300 resize-none"
                    ></textarea>
                    <button className="mt-2 text-sm text-white bg-blue-500 px-4 py-2 rounded hover:bg-blue-600 transition">
                      Comment
                    </button>
                  </div>
                </div>
              ))}
            </section>

            <aside className="space-y-6">
              <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow">
                <h3 className="text-lg font-bold mb-2">Top Topics</h3>
                <ul className="list-disc list-inside text-sm text-gray-700 dark:text-gray-300 space-y-1">
                  <li>JavaScript</li>
                  <li>Python</li>
                  <li>Data Structures</li>
                  <li>React.js</li>
                  <li>Machine Learning</li>
                </ul>
              </div>
              <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow">
                <h3 className="text-lg font-bold mb-2">Join the Community</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Ask questions, share knowledge, and grow together.
                </p>
                <button className="mt-3 w-full bg-blue-600 text-white py-2 rounded-full font-semibold hover:bg-blue-700 transition">
                  Sign Up
                </button>
              </div>
            </aside>
          </div>
        </main>

        <Footer />
      </div>
    </div>
  );
}
