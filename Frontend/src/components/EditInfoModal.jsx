import React, { useState } from "react";

export default function EditInfoModal({ onClose, onSave, currentUsername, currentBio }) {
    const [username, setUsername] = useState(currentUsername || "");
    const [bio, setBio] = useState(currentBio || "");

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md animate-fadeIn">
                <h2 className="text-xl font-semibold mb-4 text-center">Edit Profile Info</h2>

                <div className="space-y-4">
                    <div>
                        <label className="block text-gray-700 mb-1">Username</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter new username"
                        />
                    </div>

                    <div>
                        <label className="block text-gray-700 mb-1">Bio</label>
                        <textarea
                            value={bio}
                            onChange={(e) => setBio(e.target.value)}
                            className="w-full px-4 py-2 border rounded-md resize-none h-24 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Write something about yourself"
                        ></textarea>
                    </div>
                </div>

                <div className="mt-6 flex justify-end space-x-3">
                    <button
                        className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
                        onClick={onClose}
                    >
                        Cancel
                    </button>
                    <button
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                        onClick={() => onSave(username, bio)}
                    >
                        Save
                    </button>
                </div>
            </div>
        </div>
    );
}
