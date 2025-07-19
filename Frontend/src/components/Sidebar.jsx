import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AiFillHome } from "react-icons/ai";
import { FaQuestionCircle } from "react-icons/fa";
import { IoMdInformationCircle } from "react-icons/io";
import { BsChatDotsFill } from "react-icons/bs";

function Sidebar({ setSidebarWidth, setSidebarX }) {
  const sidebarRef = useRef(null);
  const [width, setWidth] = useState(280);
  const [isResizing, setIsResizing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: 0 });
  const [collapsed, setCollapsed] = useState(false);
  const dragOffset = useRef(0);

  const [chatOpen, setChatOpen] = useState(false);


  const [messages, setMessages] = useState([
    { id: 1, text: "Welcome to the chat! Start your conversation here...", fromUser: false },
  ]);
  const [inputValue, setInputValue] = useState("");


  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (setSidebarWidth) setSidebarWidth(width);
  }, [width, setSidebarWidth]);

  useEffect(() => {
    if (setSidebarX) setSidebarX(position.x);
  }, [position.x, setSidebarX]);

  useEffect(() => {
    function handleMouseMove(e) {
      if (isResizing && !collapsed) {
        const newWidth = e.clientX - sidebarRef.current.getBoundingClientRect().left;
        if (newWidth > 180 && newWidth < 520) setWidth(newWidth);
      }
      if (isDragging) {
        let newX = e.clientX - dragOffset.current;
        if (newX < 0) newX = 0;
        if (newX > window.innerWidth - width) newX = window.innerWidth - width;
        setPosition({ x: newX });
      }
    }

    function handleMouseUp() {
      setIsResizing(false);
      setIsDragging(false);
    }

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isResizing, isDragging, width, collapsed]);

  // Scroll to bottom of chat on new message
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, chatOpen]);

  const onMouseDownResize = (e) => {
    if (!collapsed) {
      e.preventDefault();
      setIsResizing(true);
    }
  };

  const onMouseDownDrag = (e) => {
    e.preventDefault();
    setIsDragging(true);
    dragOffset.current = e.clientX - position.x;
  };

  const toggleCollapse = () => {
    if (collapsed) {
      setWidth(280);
      setCollapsed(false);
    } else {
      setCollapsed(true);
      setWidth(60);
      setChatOpen(false);
    }
  };

  const menuItems = [
    { label: "Home", icon: <AiFillHome size={22} /> },
    { label: "Questions", icon: <FaQuestionCircle size={22} /> },
    { label: "About Us", icon: <IoMdInformationCircle size={22} /> },
    {
      label: "Chat",
      icon: <BsChatDotsFill size={22} />,
      onClick: () => setChatOpen((prev) => !prev),
    },
  ];

  // Send message handler
  const handleSendMessage = () => {
    if (inputValue.trim() === "") return;
    setMessages((prev) => [
      ...prev,
      { id: Date.now(), text: inputValue.trim(), fromUser: true },
    ]);
    setInputValue("");

    // Simulate a bot reply for demo (optional)
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          text: "Thanks for your message! We'll get back to you shortly.",
          fromUser: false,
        },
      ]);
    }, 1000);
  };

  // Send message on Enter key
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <>
      <motion.aside
        ref={sidebarRef}
        className="fixed top-0 left-0 h-full shadow-xl rounded-r-xl select-none flex flex-col bg-gradient-to-b from-blue-50 to-blue-100 border-r border-blue-300"
        style={{ zIndex: 1000 }}
        animate={{
          width: width,
          x: position.x,
        }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        {/* Drag handle */}
        <div
          onMouseDown={onMouseDownDrag}
          className={`mb-6 cursor-move select-text px-4 py-5 font-extrabold text-2xl text-blue-700 flex items-center gap-2 ${collapsed ? "justify-center" : ""
            }`}
          style={{ userSelect: "text" }}
          title="Drag sidebar"
        >
          {!collapsed && (
            <>
              SolveIt
              {/* Hamburger icon */}
              <motion.div
                whileHover={{ rotate: 10, scale: 1.1 }}
                className="flex flex-col justify-between w-5 h-4"
              >
                <span className="h-0.5 bg-blue-400 rounded w-full" />
                <span className="h-0.5 bg-blue-400 rounded w-full" />
                <span className="h-0.5 bg-blue-400 rounded w-full" />
              </motion.div>
            </>
          )}
        </div>

        {/* Menu */}
        <nav className="flex-1 overflow-auto px-2">
          <ul className="space-y-5 font-semibold text-blue-700">
            {menuItems.map(({ label, icon, onClick }) => (
              <motion.li
                key={label}
                whileHover={{ scale: collapsed ? 1 : 1.05, color: "#1D4ED8" }}
                whileTap={{ scale: collapsed ? 1 : 0.95 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="flex items-center gap-3"
              >
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    if (onClick) onClick();
                  }}
                  className={`block px-4 py-3 rounded-lg text-blue-700 hover:text-blue-900 transition-colors duration-300 shadow-sm w-full ${collapsed ? "text-center px-0" : "flex items-center"
                    }`}
                  title={collapsed ? label : ""}
                >
                  <span className="flex justify-center w-6">{icon}</span>
                  {!collapsed && <span>{label}</span>}
                </a>
              </motion.li>
            ))}
          </ul>
        </nav>

        {/* Resize handle */}
        {!collapsed && (
          <div
            onMouseDown={onMouseDownResize}
            className="absolute top-0 right-0 h-full w-3 cursor-col-resize bg-transparent hover:bg-blue-400 rounded-l-lg flex items-center justify-center"
            style={{ userSelect: "none" }}
            title="Resize sidebar"
          >
            <div className="w-1.5 h-10 bg-blue-300 rounded mx-auto shadow-inner"></div>
          </div>
        )}

        {/* Toggle Collapse Button */}
        <button
          onClick={toggleCollapse}
          className="absolute bottom-4 right-[-15px] bg-blue-600 hover:bg-blue-700 text-white rounded-full w-8 h-8 flex items-center justify-center shadow-lg transition"
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          style={{ userSelect: "none" }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className={`h-5 w-5 transform transition-transform duration-300 ${collapsed ? "" : "rotate-180"
              }`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            {/* Arrow points left when expanded, right when collapsed */}
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
      </motion.aside>

      {/* Chat popup modal */}
      <AnimatePresence>
        {chatOpen && !collapsed && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, x: 50 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.8, x: 50 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="fixed bottom-20 left-[calc(280px+20px)] w-96 max-w-full bg-white shadow-lg rounded-xl p-4 z-50 flex flex-col"
          >
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-bold text-blue-700 text-lg">Chat</h3>
              <button
                onClick={() => setChatOpen(false)}
                className="text-gray-500 hover:text-gray-700 transition"
                aria-label="Close chat"
              >
                &times;
              </button>
            </div>
            <div
              className="flex-1 overflow-y-auto border border-blue-100 rounded p-2 text-sm text-gray-700 mb-3"
              style={{ maxHeight: "256px" }}
            >
              {messages.map(({ id, text, fromUser }) => (
                <div
                  key={id}
                  className={`my-1 px-3 py-2 rounded-lg max-w-[80%] ${fromUser
                    ? "bg-blue-600 text-white self-end"
                    : "bg-blue-100 text-blue-900 self-start"
                    }`}
                  style={{ alignSelf: fromUser ? "flex-end" : "flex-start" }}
                >
                  {text}
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
            <textarea
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type a message..."
              className="resize-none w-full border border-blue-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={2}
            />
            <button
              onClick={handleSendMessage}
              className="mt-2 bg-blue-600 hover:bg-blue-700 text-white rounded px-4 py-2 self-end shadow"
            >
              Send
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default Sidebar;