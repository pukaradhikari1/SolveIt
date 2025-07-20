
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ThumbsUp, ThumbsDown } from "lucide-react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import Footer from "../Components/Footer";
import Modal from "../components/Modal";


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



export default function HomePage() {
  const [showModal, setShowModal] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [votes, setVotes] = useState(Array(10).fill(0));
  const [sidebarWidth, setSidebarWidth] = useState(256);
  const [sidebarX, setSidebarX] = useState(0);
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    const savedImage = localStorage.getItem("profileImage");
    if (savedImage) setProfileImage(savedImage);
  }, []);
  useEffect(() => {
    fetch("http://localhost:5000/questions")
      .then((res) => res.json())
      .then((data) => setQuestions(data))
      .catch((err) => console.error("Error fetching questions:", err));
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
            {questions.map((post, index) => (
              <motion.div
                key={post.id}
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
                    <p className="font-semibold text-gray-800">
                      {post.username || "Anonymous"}
                    </p>
                    <p className="text-xs text-gray-500">
                      Posted {new Date(post.created_at).toLocaleString()}
                    </p>
                  </div>
                </div>

                <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                  <span>📌</span> {post.title}
                </h2>

                <p className="text-gray-600 mt-2">{post.body}</p>

                <div className="mt-3 flex flex-wrap gap-2">
                  <span className="px-3 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-700">
                    #{post.tag}
                  </span>
                </div>

                {post.file_url && (
                  <a
                    href={`http://localhost:5000${post.file_url}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 text-blue-500 text-sm underline"
                  >
                    View Attachment
                  </a>
                )}
              </motion.div>
            ))}
          </div>
        </main>

        <Footer />
      </div>
    </div>
  );
}
