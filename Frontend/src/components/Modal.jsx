import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

function Modal({ onClose, editData }) {
  const modalRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  const [title, setTitle] = useState(editData?.title || "");
  const [details, setDetails] = useState(editData?.details || "");
  const [files, setFiles] = useState([]);
  const [tag, setTag] = useState("");
  const [availableTags, setAvailableTags] = useState([]);
  const [tagInput, setTagInput] = useState("");

  const [error, setError] = useState("");
  useEffect(() => {
    fetch("http://localhost:5000/tags")
      .then((res) => res.json())
      .then((data) => setAvailableTags(data))
      .catch((err) => console.error("Failed to load tags", err));
  }, []);
  useEffect(() => {
    const centerModal = () => {
      if (modalRef.current) {
        const rect = modalRef.current.getBoundingClientRect();
        const centerX = window.innerWidth / 2 - rect.width / 2;
        const centerY = window.innerHeight / 2 - rect.height / 2;
        setPosition({ x: centerX, y: centerY });
      }
    };

    centerModal();
    window.addEventListener("resize", centerModal);
    return () => window.removeEventListener("resize", centerModal);
  }, []);

  const handleMouseDown = (e) => {
    setIsDragging(true);
    const rect = modalRef.current.getBoundingClientRect();
    setOffset({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    setPosition({ x: e.clientX - offset.x, y: e.clientY - offset.y });
  };

  const handleMouseUp = () => setIsDragging(false);

  const handleFileChange = (e) => {
    setError("");
    const selectedFiles = Array.from(e.target.files);
    const invalidFile = selectedFiles.find((file) => file.size > 4 * 1024 * 1024);
    if (invalidFile) {
      setError(`File "${invalidFile.name}" exceeds 4MB size limit.`);
      return;
    }
    setFiles(selectedFiles);
  };

  const handleTagAdd = (e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      const newTag = tagInput.trim().replace(",", "");
      if (newTag && !tags.includes(newTag)) {
        setTags([...tags, newTag]);
      }
      setTagInput("");
    }
  };

  const removeTag = (tagToRemove) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const handleSubmit = async () => {
    if (!title.trim()) {
      setError("Please enter a question title.");
      return;
    }

    if (!tag) {
      setError("Please select a tag.");
      return;
    }

    const user_id = localStorage.getItem("user_id");
    if (!user_id) {
      setError("You must be logged in to submit a question.");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("tag", tag); // One tag only
    formData.append("body", details);
    formData.append("user_id", user_id);
    if (files.length > 0) {
      formData.append("file", files[0]); // Only first file
    }

    try {
      const response = await fetch("http://localhost:5000/questions", {
        method: "POST",
        body: formData
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to post question.");
      }

      onClose(); // Close modal after success
    } catch (error) {
      console.error(error);
      setError(error.message);
    }
  };


  return (
    <div
      className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      <motion.div
        ref={modalRef}
        onMouseDown={handleMouseDown}
        className="absolute p-6 rounded-2xl shadow-2xl w-full max-w-xl cursor-move bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg text-gray-900 dark:text-white"
        style={{ top: `${position.y}px`, left: `${position.x}px` }}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-4 text-gray-600 dark:text-gray-300 hover:text-red-500 text-xl font-bold"
        >
          ×
        </button>

        <h2 className="text-2xl font-bold mb-4 text-blue-600 dark:text-blue-400">
          {editData ? "Edit Your Question" : "Ask a Question"}
        </h2>

        {error && (
          <p className="mb-2 text-sm text-red-500 dark:text-red-400">{error}</p>
        )}

        <input
          type="text"
          placeholder="Enter your question title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-3 mb-4 border rounded-lg bg-white dark:bg-gray-800 dark:border-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <textarea
          placeholder="Provide more details..."
          rows="5"
          value={details}
          onChange={(e) => setDetails(e.target.value)}
          className="w-full p-3 mb-4 border rounded-lg bg-white dark:bg-gray-800 dark:border-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
        ></textarea>

        {/* Tags */}
        <select
          className="w-full p-3 border rounded"
          value={tag}
          onChange={(e) => setTag(e.target.value)}
          required
        >
          <option value="" disabled>Select a Tag</option>
          {availableTags.map((t, index) => (
            <option key={index} value={t}>{t}</option>
          ))}
        </select>


        {/* File Upload */}
        <label className="block mb-4">
          <span className="block text-sm font-medium mb-2">
            Attach Files (Max 4MB)
          </span>
          <input
            type="file"
            onChange={handleFileChange}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0
              file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100
              "
          />
        </label>

        {files.length > 0 && (
          <ul className="mb-4 text-sm text-gray-800 ">
            {files.map((file, index) => (
              <li key={index}>{file.name}</li>
            ))}
          </ul>
        )}
        <motion.button
          type="button"
          onClick={handleSubmit}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          className="mt-4 w-full bg-blue-600 text-white py-2 rounded-full font-semibold hover:bg-blue-700 transition"
        >
          {editData ? "Update Question" : "Submit Question"}
        </motion.button>
      </motion.div>
    </div>
  );
}

export default Modal;