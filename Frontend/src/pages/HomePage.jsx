import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ThumbsUp, ThumbsDown } from "lucide-react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import Modal from "../Components/Modal";
import Footer from "../Components/Footer";


const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
  hover: { scale: 1.03, boxShadow: "0 10px 20px rgba(59,130,246,0.3)" },
};

const POST_TITLES = [
  { icon: "💡", title: "Understanding Recursion in JavaScript" },
  { icon: "⚛️", title: "React Hooks: useEffect Demystified" },
  { icon: "🎨", title: "Mastering CSS Flexbox" },
  { icon: "🧠", title: "Structuring Clean HTML Forms" },
  { icon: "🐍", title: "Loops in Python: A Deep Dive" },
  { icon: "🔗", title: "Using Axios to Fetch APIs" },
  { icon: "📦", title: "State Management with Redux" },
  { icon: "🌐", title: "Node.js vs Express.js Explained" },
  { icon: "🗄️", title: "MongoDB Schema Design Intro" },
  { icon: "🧪", title: "Debugging and Testing with Jest" },
];

const TAGS = [
  ["JavaScript", "Recursion", "Functions"],
  ["React", "Hooks", "useEffect"],
  ["CSS", "Flexbox", "Design"],
  ["HTML", "Forms", "Validation"],
  ["Python", "Loops", "Basics"],
  ["Axios", "API", "Fetch"],
  ["Redux", "State", "Store"],
  ["Node.js", "Express", "Backend"],
  ["MongoDB", "Mongoose", "NoSQL"],
  ["Testing", "Jest", "Debugging"],
];

export default function HomePage() {
  const [showModal, setShowModal] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [votes, setVotes] = useState(Array(10).fill(0));
  const [sidebarWidth, setSidebarWidth] = useState(256);
  const [sidebarX, setSidebarX] = useState(0);

  useEffect(() => {
    const savedImage = localStorage.getItem("profileImage");
    if (savedImage) setProfileImage(savedImage);
  }, []);

  const handleProfileClick = () => {
    localStorage.setItem("profileImage", profileImage || "");
    window.open("/profile", "_blank", "width=600,height=600");
  };

  const handleVote = (index, type) => {
    setVotes((prevVotes) =>
      prevVotes.map((v, i) => (i === index ? (type === "up" ? v + 1 : v - 1) : v))
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 flex relative">
      <Sidebar setSidebarWidth={setSidebarWidth} setSidebarX={setSidebarX} />

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
        />

        {showModal && <Modal onClose={() => setShowModal(false)} />}

        <main className="flex-1 overflow-y-auto px-4 py-6">
          <div className="container mx-auto max-w-6xl space-y-6">
            {POST_TITLES.map((post, index) => (
              <motion.div
                key={index}
                className="bg-white p-6 rounded-2xl shadow cursor-pointer flex flex-col"
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                whileHover="hover"
                transition={{ duration: 0.3, ease: "easeInOut" }}
              >
                <div className="flex items-center mb-4">
                  <img
                    src={profileImage || "https://via.placeholder.com/40?text=User"}
                    alt="User"
                    className="w-10 h-10 rounded-full mr-3"
                  />
                  <div>
                    <p className="font-semibold text-gray-800">John Doe</p>
                    <p className="text-xs text-gray-500">Posted 2h ago</p>
                  </div>
                </div>

                <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                  <span>{post.icon}</span>
                  {post.title}
                </h2>

                <p className="text-gray-600 mt-2">
                  This post explains the concept with examples and best practices.
                </p>

                <div className="mt-3 flex flex-wrap gap-2">
                  {TAGS[index].map((tag, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-700"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>

                <div className="mt-4 flex items-center space-x-4">
                  <button
                    onClick={() => handleVote(index, "up")}
                    className="flex items-center space-x-1 text-green-600 hover:text-green-700 transition"
                  >
                    <ThumbsUp className="w-5 h-5" />
                    <span>Upvote</span>
                  </button>

                  <button
                    onClick={() => handleVote(index, "down")}
                    className="flex items-center space-x-1 text-red-600 hover:text-red-700 transition"
                  >
                    <ThumbsDown className="w-5 h-5" />
                    <span>Downvote</span>
                  </button>

                  <span className="ml-auto text-sm font-medium text-gray-700">
                    Votes: {votes[index]}
                  </span>
                </div>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="mt-4 text-sm text-blue-600 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-400 self-start"
                >
                  Read more
                </motion.button>

                <div className="mt-6 flex flex-col md:flex-row md:space-x-4">
                  <textarea
                    placeholder="Add your answer..."
                    className="flex-1 p-3 border rounded-md text-sm bg-white text-black focus:outline-none focus:ring-2 focus:ring-blue-300 resize-none mb-4 md:mb-0"
                    rows={4}
                  ></textarea>

                  <div className="flex flex-col space-y-2 w-full md:w-48">
                    <label
                      htmlFor={`file-upload-${index}`}
                      className="cursor-pointer p-2 text-center bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                    >
                      Upload File
                    </label>
                    <input
                      id={`file-upload-${index}`}
                      type="file"
                      className="hidden"
                    />
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="text-white bg-blue-500 py-2 rounded hover:bg-blue-600 transition"
                    >
                      Submit Answer
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </main>

        <Footer />
      </div>
    </div>
  );
}
