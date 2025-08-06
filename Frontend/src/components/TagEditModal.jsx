import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

function TagFilterModal({ onClose, onApply, preselectedTags = [] }) {
    const [availableTags, setAvailableTags] = useState([]);
    const [selectedTags, setSelectedTags] = useState(preselectedTags);

    useEffect(() => {
        fetch("http://localhost:5000/tags")
            .then((res) => res.json())
            .then((data) => setAvailableTags(data))
            .catch((err) => console.error("Failed to fetch tags", err));
    }, []);

    const toggleTag = (tag) => {
        if (selectedTags.includes(tag)) {
            setSelectedTags(selectedTags.filter((t) => t !== tag));
        } else {
            setSelectedTags([...selectedTags, tag]);
        }
    };

    return (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center">
            <motion.div
                className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-xl max-w-md w-full"
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.25 }}
            >
                <h2 className="text-xl font-bold mb-4 text-blue-600 dark:text-blue-400">
                    Filter by Tags
                </h2>

                <div className="flex flex-wrap gap-2 mb-4">
                    {availableTags.map((tag, idx) => {
                        const isSelected = selectedTags.includes(tag);
                        return (
                            <button
                                key={idx}
                                onClick={() => toggleTag(tag)}
                                className={`px-3 py-1 rounded-full border transition ${isSelected
                                        ? "bg-blue-600 text-white border-blue-600"
                                        : "bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 border-gray-300"
                                    } hover:shadow`}
                            >
                                {tag}
                            </button>
                        );
                    })}
                </div>

                <div className="flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 rounded bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300"
                    >
                        Close
                    </button>
                    <button
                        onClick={() => onApply(selectedTags)}
                        className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
                    >
                        Apply
                    </button>
                </div>
            </motion.div>
        </div>
    );
}

export default TagFilterModal;