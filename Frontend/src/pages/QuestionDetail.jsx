import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { MessageSquare, Tag, FileText, UserCircle2 } from "lucide-react";
import AnswerModal from "../components/AnswerModal";

export default function QuestionDetail() {
  const { id } = useParams();
  const [question, setQuestion] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    fetch(`http://localhost:5000/questions/${id}`)
      .then((res) => res.json())
      .then((data) => setQuestion(data));
    fetchAnswers();
  }, [id]);

  const fetchAnswers = () => {
    fetch(`http://localhost:5000/questions/${id}/answers`)
      .then((res) => res.json())
      .then((data) => setAnswers(data));
  };

  return (
    <main className="max-w-3xl mx-auto py-8 px-4">
      {question && (
        <motion.section
          className="bg-white rounded-xl shadow-lg p-6 mb-6 border border-gray-100"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <h1 className="text-3xl font-extrabold text-gray-800 flex items-center gap-2">
            <MessageSquare className="text-blue-500" size={28} />
            {question.title}
          </h1>
          <div className="text-gray-700 mt-3 leading-relaxed">{question.body}</div>
          <div className="mt-4 flex items-center gap-2">
            <Tag className="text-blue-600" size={18} />
            <span className="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
              {question.tag}
            </span>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            className="mt-6 bg-green-600 text-white font-semibold px-5 py-2 rounded-lg hover:bg-green-700 shadow transition"
            onClick={() => setModalOpen(true)}
          >
            ✍ Answer This Question
          </motion.button>
        </motion.section>
      )}

      <motion.h2
        className="text-2xl font-bold mb-4 text-gray-800"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        💬 Answers
      </motion.h2>

      {answers.length === 0 ? (
        <motion.div
          className="text-gray-500 italic"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          No answers yet. Be the first to answer!
        </motion.div>
      ) : (
        answers.map((ans, index) => (
          <motion.div
            key={ans.id}
            className="bg-gray-50 rounded-lg p-4 mb-4 shadow-sm border border-gray-200"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <div className="mb-3 flex items-start gap-2">
              <UserCircle2 className="text-gray-500" size={22} />
              <div>{ans.body}</div>
            </div>
            <div className="text-xs text-gray-500 flex items-center gap-2">
              <img
                src={ans.user_profile_url}
                alt={ans.username}
                className="w-6 h-6 rounded-full border border-gray-300"
              />
              — {ans.username || "Anonymous"}
            </div>
            {ans.file_url && (
              <a
                href={ans.file_url}
                className="text-blue-500 underline mt-2 flex items-center gap-1"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FileText size={16} /> View Attached File
              </a>
            )}
          </motion.div>
        ))
      )}

      {modalOpen && (
        <AnswerModal
          questionId={id}
          onClose={() => {
            setModalOpen(false);
            fetchAnswers(); // Refresh answers after submission
          }}
        />
      )}
    </main>
  );
}