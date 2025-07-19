// src/Pages/ProfilePage.jsx
import React from 'react';
import {
    User2,
    Tags,
    UploadCloud,
    Pencil,
    LogOut,
    Trash2,
    Info,
} from 'lucide-react';

function ProfilePage({
    profileImage = 'https://via.placeholder.com/150',
    username = 'John Doe',
    email = 'john@example.com',
    bio = "I'm passionate about coding and solving real-world problems.",
    onEdit,
    onLogout,
    onDelete,
}) {
    return (
        <div className="max-w-5xl mx-auto px-6 py-10">
            {/* Profile Header */}
            <div className="flex flex-col sm:flex-row items-center sm:items-start space-x-0 sm:space-x-6 space-y-6 sm:space-y-0 bg-white rounded-lg shadow-md p-6">
                <img
                    src={profileImage}
                    alt="Profile"
                    className="w-32 h-32 rounded-full border-4 border-blue-600 shadow"
                />
                <div>
                    <h2 className="text-3xl font-bold text-gray-900">{username}</h2>
                    <p className="text-gray-600">{email}</p>
                    <p className="mt-2 text-gray-700 max-w-xl">{bio}</p>
                </div>
            </div>

            {/* Options */}
            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <ProfileOption icon={<User2 />} label="Overview" onClick={() => alert('Overview clicked')} />
                <ProfileOption icon={<Tags />} label="Tags" onClick={() => alert('Tags clicked')} />
                <ProfileOption icon={<UploadCloud />} label="Upload Profile Picture" onClick={() => alert('Upload clicked')} />
                <ProfileOption icon={<Pencil />} label="Edit Info" onClick={onEdit || (() => alert('Edit clicked'))} />
                <ProfileOption icon={<LogOut />} label="Logout" color="text-red-600" onClick={onLogout || (() => alert('Logged out'))} />
                <ProfileOption icon={<Trash2 />} label="Delete Profile" color="text-red-600" onClick={onDelete || (() => alert('Delete clicked'))} />
                <ProfileOption icon={<Info />} label="About" onClick={() => alert('This is a user profile page.')} />
            </div>
        </div>
    );
}

// Reusable option box
const ProfileOption = ({ icon, label, onClick, color = 'text-gray-700' }) => (
    <div
        onClick={onClick}
        className={`flex items-center space-x-4 p-4 rounded-lg bg-gray-50 hover:bg-blue-50 cursor-pointer shadow-sm transition`}
    >
        <div className={`p-2 rounded-full bg-blue-100 ${color}`}>
            {React.cloneElement(icon, { className: 'w-5 h-5' })}
        </div>
        <span className={`font-medium ${color}`}>{label}</span>
    </div>
);

export default ProfilePage;
