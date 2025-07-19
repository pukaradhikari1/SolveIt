
import React from 'react';
import { motion } from 'framer-motion';

const notifications = [
    { id: 1, message: 'Your answer received an upvote.' },
    { id: 2, message: 'New comment on your question.' },
    { id: 3, message: 'Welcome to SolveIt!' },
];

function NotificationPopover({ isOpen }) {
    if (!isOpen) return null;

    return (
        <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute right-0 mt-2 w-72 bg-white dark:bg-gray-800 shadow-lg rounded-lg z-50 border dark:border-gray-700"
        >
            <div className="p-4">
                <h4 className="text-sm font-semibold text-gray-800 dark:text-white mb-2">
                    Notifications
                </h4>
                {notifications.length > 0 ? (
                    <ul className="space-y-2">
                        {notifications.map((n) => (
                            <li
                                key={n.id}
                                className="text-sm text-gray-700 dark:text-gray-300 border-b last:border-none dark:border-gray-600 pb-2"
                            >
                                {n.message}
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-sm text-gray-500 dark:text-gray-400">No new notifications</p>
                )}
            </div>
        </motion.div>
    );
}

export default NotificationPopover;