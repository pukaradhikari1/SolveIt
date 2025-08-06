import React, { useRef, useState } from "react";
import { motion } from "framer-motion";

export default function AnswerModal({ questionId, onClose }) {
    const modalRef = useRef(null);
    const [answer, setAnswer] = useState("");
    const [files, setFiles] = useState([]);
    const [error, setError] = useState("");
    const [submitting, setSubmitting] = useState(false);

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

    const handleSubmit = async () => {
        const user_id = localStorage.getItem("user_id");
        if (!user_id || !answer.trim()) {
            setError("You must be logged in and write something.");
            return;
        }
        setSubmitting(true);
        const formData = new FormData();
        formData.append("body", answer);
        formData.append("question_id", questionId);
        formData.append("user_id", user_id);
        if (files.length > 0) formData.append("file", files[0]);
        try {
            const res = await fetch(`http://localhost:5000/questions/${questionId}/answers`, {
                method: "POST",
                body: formData,
            });
            if (!res.ok) {
                const errData = await res.json();
                throw new Error(errData.error || "Failed to post answer.");
            }
            setAnswer("");
            setFiles([]);
            setError("");
            onClose(); // Close modal on success
        } catch (err) {
            setError(err.message);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex items-center justify-center">
            <motion.div
                initial={{ scale: 0.96, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-white rounded-xl shadow-2xl w-full max-w-lg p-8 relative"
                ref={modalRef}
                tabIndex={-1}
            >
                <button
                    aria-label="Close"
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-800 text-2xl"
                    onClick={onClose}
                >
                    &times;
                </button>

                <h2 className="text-xl font-bold mb-3 text-gray-800">Submit Your Answer</h2>
                {error && (
                    <div className="bg-red-100 text-red-700 px-4 py-2 rounded mb-4 text-sm">
                        {error}
                    </div>
                )}
                <textarea
                    className="w-full rounded border border-gray-300 focus:ring-2 focus:ring-blue-400 p-3 mb-3 resize-none min-h-[100px]"
                    placeholder="Type your answer here..."
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                    disabled={submitting}
                />

                <label className="block mb-2 text-gray-600 font-medium">
                    Attach file (optional):
                    <input
                        type="file"
                        className="block mt-1"
                        accept="*"
                        onChange={handleFileChange}
                        disabled={submitting}
                    />
                </label>
                {files.length > 0 && (
                    <div className="text-green-700 bg-green-50 px-3 py-1 rounded text-sm mb-2">
                        {files[0].name}
                    </div>
                )}

                <button
                    className="mt-4 w-full py-2 rounded bg-blue-600 hover:bg-blue-800 text-white font-semibold text-lg transition"
                    onClick={handleSubmit}
                    disabled={submitting}
                >
                    {submitting ? "Submitting..." : "Submit Answer"}
                </button>
            </motion.div>
        </div>
    );
}
