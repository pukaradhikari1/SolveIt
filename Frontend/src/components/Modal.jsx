import React, { useRef, useState, useEffect } from 'react';

function Modal({ onClose }) {
  const modalRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  // Center the modal on mount
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
    window.addEventListener('resize', centerModal);
    return () => window.removeEventListener('resize', centerModal);
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

  return (
    <div
      className="fixed inset-0 z-50 bg-black/20"
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      <div
        ref={modalRef}
        onMouseDown={handleMouseDown}
        className="absolute bg-white/90 dark:bg-gray-800/90 text-gray-900 dark:text-white p-6 rounded-2xl shadow-xl w-full max-w-lg cursor-move"
        style={{
          top: `${position.y}px`,
          left: `${position.x}px`,
        }}
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-4 text-gray-500 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white"
        >
          ✕
        </button>
        <h2 className="text-xl font-bold mb-4 text-blue-600 dark:text-blue-400">
          Ask a Question
        </h2>
        <input
          type="text"
          placeholder="Enter your question title"
          className="w-full p-3 mb-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <textarea
          placeholder="Provide more details..."
          rows="5"
          className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
        ></textarea>
        <button className="mt-4 w-full bg-blue-600 text-white py-2 rounded-full font-semibold hover:bg-blue-700 transition">
          Submit Question
        </button>
      </div>
    </div>
  );
}

export default Modal;
