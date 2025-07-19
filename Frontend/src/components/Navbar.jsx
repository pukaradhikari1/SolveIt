import React, { useState, useEffect, useRef } from 'react';
import {
    Search,
    User,
    Home,
    PlusCircle,
    Bell,
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
    motion,
    AnimatePresence,
} from 'framer-motion';

function NotificationPopover({ isOpen }) {
    const notifications = [
        { id: 1, message: 'Your answer received an upvote.' },
        { id: 2, message: 'New comment on your question.' },
        { id: 3, message: 'Welcome to SolveIt!' },
    ];

    if (!isOpen) return null;

    return (
        <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 mt-2 w-72 bg-white shadow-xl rounded-xl z-50 border"
        >
            <div className="p-4">
                <h4 className="text-sm font-semibold text-gray-800 mb-2">
                    Notifications
                </h4>
                {notifications.length > 0 ? (
                    <ul className="space-y-2 max-h-60 overflow-y-auto">
                        {notifications.map((n) => (
                            <motion.li
                                key={n.id}
                                whileHover={{ x: 5 }}
                                transition={{ type: 'spring', stiffness: 300 }}
                                className="text-sm text-gray-700 border-b last:border-none pb-2 cursor-pointer"
                            >
                                {n.message}
                            </motion.li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-sm text-gray-500">
                        No new notifications
                    </p>
                )}
            </div>
        </motion.div>
    );
}

function Navbar({
    profileImage,
    username = 'User',
    onAskClick,
}) {
    const navigate = useNavigate();
    const location = useLocation();
    const popoverRef = useRef();

    const [searchQuery, setSearchQuery] = useState('');
    const [hasUnreadNotifications, setHasUnreadNotifications] = useState(true);
    const [showNotifications, setShowNotifications] = useState(false);

    const handleSearch = (e) => {
        if (e.key === 'Enter' && searchQuery.trim()) {
            navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
        }
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                popoverRef.current &&
                !popoverRef.current.contains(event.target)
            ) {
                setShowNotifications(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const containerVariants = {
        hidden: {},
        visible: {
            transition: {
                staggerChildren: 0.1,
            },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: -10 },
        visible: { opacity: 1, y: 0 },
    };

    return (
        <motion.header
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 70 }}
            className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50 p-4 flex items-center justify-between"
        >
            {/* Logo and Search */}
            <div className="flex items-center space-x-4">
                <motion.h1
                    onClick={() => navigate('/')}
                    whileHover={{ scale: 1.05 }}
                    className="text-xl font-bold text-blue-600 cursor-pointer flex items-center gap-2"
                >
                    <Home className="w-5 h-5 text-blue-500" />
                    SolveIt
                </motion.h1>

                <motion.div
                    variants={itemVariants}
                    initial="hidden"
                    animate="visible"
                    className="relative"
                >
                    <Search
                        className="absolute left-3 top-2.5 text-gray-400"
                        aria-hidden="true"
                    />
                    <input
                        type="text"
                        aria-label="Search questions"
                        placeholder="Search questions..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyDown={handleSearch}
                        className="pl-10 pr-4 py-2 border bg-white text-black rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </motion.div>
            </div>

            {/* Action Buttons */}
            <motion.div
                className="flex items-center space-x-4"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                {/* Ask Question */}
                <motion.button
                    variants={itemVariants}
                    onClick={onAskClick}
                    whileHover={{ scale: 1.07 }}
                    whileTap={{ scale: 0.95 }}
                    aria-label="Ask a question"
                    className="bg-blue-600 text-white px-4 py-2 rounded-full font-semibold hover:bg-blue-700 transition flex items-center gap-1 shadow-md"
                >
                    <PlusCircle className="w-4 h-4" />
                    Ask Question
                </motion.button>

                {/* Notifications */}
                <motion.div className="relative" ref={popoverRef} variants={itemVariants}>
                    <motion.button
                        onClick={() => {
                            setShowNotifications((prev) => !prev);
                            setHasUnreadNotifications(false);
                        }}
                        whileHover={{ rotate: [0, -10, 10, -10, 0] }}
                        transition={{ duration: 0.5 }}
                        aria-label="View notifications"
                        className="relative p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition shadow"
                    >
                        <Bell className="w-5 h-5 text-blue-600" />
                        {hasUnreadNotifications && (
                            <>
                                <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full animate-ping" />
                                <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full" />
                            </>
                        )}
                    </motion.button>

                    <AnimatePresence>
                        <NotificationPopover isOpen={showNotifications} />
                    </AnimatePresence>
                </motion.div>

                {/* Profile Button */}
                <motion.button
                    variants={itemVariants}
                    onClick={() => navigate('/profile')}
                    whileTap={{ scale: 0.95 }}
                    whileHover={{ scale: 1.1 }}
                    aria-label="Go to Profile"
                    className={`focus:outline-none p-1 rounded-full ${location.pathname === '/profile' ? 'ring-2 ring-blue-400' : ''
                        }`}
                >
                    {profileImage ? (
                        <img
                            src={profileImage}
                            alt={`${username}'s profile`}
                            className="w-8 h-8 rounded-full border-2 border-blue-500 cursor-pointer"
                        />
                    ) : (
                        <User className="w-8 h-8 text-blue-600 cursor-pointer" />
                    )}
                </motion.button>
            </motion.div>
        </motion.header>
    );
}

export default Navbar;
