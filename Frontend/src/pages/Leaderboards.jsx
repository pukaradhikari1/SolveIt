import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';


const dummyData = [
  { name: 'Alice', upvotes: 200, downvotes: 50 },
  { name: 'Bob', upvotes: 150, downvotes: 10 },
  { name: 'Charlie', upvotes: 170, downvotes: 60 },
  { name: 'Dana', upvotes: 130, downvotes: 15 },
  { name: 'Eve', upvotes: 125, downvotes: 5 },
];

const rowVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: (index) => ({
    opacity: 1,
    y: 0,
    transition: { delay: index * 0.1, type: 'spring', stiffness: 100 },
  }),
  hover: { scale: 1.03, backgroundColor: 'rgba(59, 130, 246, 0.1)' }, // light blue bg on hover
};

const Leaderboard = () => {
  // Sort by (upvotes - downvotes) descending
  const sortedUsers = [...dummyData].sort(
    (a, b) => (b.upvotes - b.downvotes) - (a.upvotes - a.downvotes)
  );

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold text-blue-700 mb-6">Leaderboard</h2>
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
        <table className="min-w-full text-sm text-left text-gray-800 dark:text-gray-200">
          <thead className="bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300">
            <tr>
              <th className="px-4 py-3">Rank</th>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Upvotes</th>
              <th className="px-4 py-3">Downvotes</th>
              <th className="px-4 py-3">Score</th>
            </tr>
          </thead>
          <tbody>
            <AnimatePresence>
              {sortedUsers.map(({ name, upvotes, downvotes }, index) => (
                <motion.tr
                  key={name}
                  custom={index}
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                  variants={rowVariants}
                  whileHover="hover"
                  className="border-t border-gray-200 dark:border-gray-700 cursor-pointer"
                  style={{ originX: 0 }}
                >
                  <td className="px-4 py-2 font-semibold">{index + 1}</td>
                  <td className="px-4 py-2">{name}</td>
                  <td className="px-4 py-2">{upvotes}</td>
                  <td className="px-4 py-2">{downvotes}</td>
                  <td className="px-4 py-2 font-bold">{upvotes - downvotes}</td>
                </motion.tr>
              ))}
            </AnimatePresence>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Leaderboard;