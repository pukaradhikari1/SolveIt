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
  const [tags, setTags] = useState(editData?.tags || []);
  const [tagInput, setTagInput] = useState("");

  const [error, setError] = useState("");

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

  const handleSubmit = () => {
    if (!title.trim()) {
      setError("Please enter a question title.");
      return;
    }
    alert(
      `Question submitted:\nTitle: ${title}\nDetails: ${details}\nTags: ${tags.join(
        ", "
      )}\nFiles: ${files.map((f) => f.name).join(", ")}`
    );
    onClose();
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
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Tags</label>
          <div className="flex flex-wrap items-center gap-2 p-2 border rounded-lg bg-white dark:bg-gray-800 dark:border-gray-700">
            {tags.map((tag, idx) => (
              <span
                key={idx}
                className="bg-blue-100 dark:bg-blue-700 text-blue-800 dark:text-white text-xs font-semibold px-2 py-1 rounded-full flex items-center gap-1"
              >
                {tag}
                <button onClick={() => removeTag(tag)} className="text-xs ml-1">×</button>
              </span>
            ))}
            <input
              type="text"
              placeholder="Add tag"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleTagAdd}
              className="flex-1 text-sm bg-transparent text-gray-800 dark:text-white border-none outline-none"
            />
          </div>
        </div>

        {/* File Upload */}
        <label className="block mb-4">
          <span className="block text-sm font-medium mb-2">
            Attach Files (Max 4MB)
          </span>
          <input
            type="file"
            multiple
            onChange={handleFileChange}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0
              file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100
              dark:file:bg-gray-700 dark:file:text-white dark:hover:file:bg-gray-600"
          />
        </label>

        {files.length > 0 && (
          <ul className="mb-4 text-sm text-gray-800 dark:text-gray-300 list-disc pl-5">
            {files.map((file, index) => (
              <li key={index}>{file.name}</li>
            ))}
          </ul>
        )}

        <motion.button
          onClick={handleSubmit}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-2 rounded-full font-semibold shadow-md hover:shadow-lg transition"
        >
          {editData ? "Update Question" : "Submit Question"}
        </motion.button>
      </motion.div>
    </div>
  );
}

export default Modal;
