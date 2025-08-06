import React, { useEffect, useState } from "react";
import {
    User2,
    Tags,
    UploadCloud,
    Pencil,
    LogOut,
    Trash2,
    Info,
} from "lucide-react";
import TagFilterModal from "../components/TagEditModal";
import EditInfoModal from "../components/EditInfoModal";


const ProfileOption = ({ icon, label, onClick, color = "text-gray-700" }) => (
    <div
        onClick={onClick}
        className="flex items-center space-x-4 p-4 rounded-xl bg-white hover:bg-blue-50 cursor-pointer shadow-md transition-all border border-gray-200"
    >
        <div className={`p-2 rounded-full bg-blue-100 ${color}`}>
            {React.cloneElement(icon, { className: "w-5 h-5" })}
        </div>
        <span className={`font-medium text-base ${color}`}>{label}</span>
    </div>
);

function ProfilePage() {
    const userId = localStorage.getItem("user_id");

    const [profile, setProfile] = useState(null);
    const [tags, setTags] = useState([]);
    const [userTags, setUserTags] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showTagModal, setShowTagModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);

    useEffect(() => {
        fetch(`http://localhost:5000/profile/${userId}`)
            .then((res) => res.json())
            .then((data) => {
                setProfile(data);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, [userId]);

    useEffect(() => {
        fetch("http://localhost:5000/tags_list")
            .then((res) => res.json())
            .then((data) => setTags(data))
            .catch((err) => console.error("Error fetching tags:", err));
    }, []);

    useEffect(() => {
        fetch(`http://localhost:5000/profile/${userId}/tags`)
            .then((res) => res.json())
            .then((data) => setUserTags(data.tags || []))
            .catch((err) => console.error("Failed to fetch user tags:", err));
    }, [userId]);

    const updateUserTags = (newTags) => {
        setUserTags(newTags);
        fetch(`http://localhost:5000/profile/${userId}/tags`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ tags: newTags }),
        })
            .then((res) => res.json())
            .then(() => console.log("Tags updated"));
    };

    if (loading) return <div className="p-10 text-center text-lg">Loading profile...</div>;
    if (!profile) return <div className="p-10 text-center text-red-500">Profile not found or deleted.</div>;

    return (
        <div className="max-w-6xl mx-auto px-4 py-10">
            {/* Profile Header */}
            <div className="flex flex-col sm:flex-row items-center bg-white shadow-lg rounded-xl p-8 border border-gray-200">
                <img
                    src={profile.profileImage || "https://placehold.co/150x150?text=User"}
                    alt="Profile"
                    className="w-36 h-36 rounded-full border-4 border-blue-600 shadow-md transition-transform hover:scale-105"
                />
                <div className="sm:ml-6 mt-6 sm:mt-0 text-center sm:text-left">
                    <h2 className="text-3xl font-bold text-gray-800">{profile.username}</h2>
                    <p className="text-gray-500">{profile.email}</p>
                    {profile.bio && <p className="mt-2 text-gray-600 max-w-xl">{profile.bio}</p>}
                </div>
            </div>

            {/* Tags Section */}
            <div className="mt-10">
                <div className="flex items-center justify-between">
                    <h3 className="text-xl font-semibold text-gray-800 flex items-center space-x-2">
                        <Tags className="w-5 h-5 text-blue-600" />
                        <span>Your Tags</span>
                    </h3>
                    <button
                        onClick={() => setShowTagModal(true)}
                        className="text-blue-600 text-sm hover:underline"
                    >
                        Edit Tags
                    </button>
                </div>
                <div className="mt-4 flex flex-wrap gap-3">
                    {userTags.length === 0 ? (
                        <p className="text-gray-500">No tags selected yet.</p>
                    ) : (
                        userTags.map((tag) => (
                            <span
                                key={tag}
                                className="px-4 py-1.5 bg-blue-100 text-blue-800 rounded-full text-sm shadow-sm"
                            >
                                {tag}
                            </span>
                        ))
                    )}
                </div>
            </div>

            {/* Options */}
            <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                <ProfileOption icon={<User2 />} label="Overview" onClick={() => alert("Overview clicked")} />
                <ProfileOption icon={<Tags />} label="Tags" onClick={() => setShowTagModal(true)} />
                <ProfileOption
                    icon={<UploadCloud />}
                    label="Upload Profile Picture"
                    onClick={() => {
                        const input = document.createElement("input");
                        input.type = "file";
                        input.accept = "image/*";
                        input.onchange = (e) => {
                            const file = e.target.files[0];
                            if (!file) return;
                            const formData = new FormData();
                            formData.append("file", file);
                            fetch(`http://localhost:5000/profile/${userId}/image`, {
                                method: "POST",
                                body: formData,
                            })
                                .then((res) => res.json())
                                .then((data) => {
                                    setProfile((prev) => ({
                                        ...prev,
                                        profileImage: data.profileImage,
                                    }));
                                });
                        };
                        input.click();
                    }}
                />
                <ProfileOption
                    icon={<Pencil />}
                    label="Edit Info"
                    onClick={() => setShowEditModal(true)}
                />
                <ProfileOption
                    icon={<LogOut />}
                    label="Logout"
                    color="text-red-600"
                    onClick={() => {
                        if (window.confirm("Are you sure you want to logout?")) {
                            localStorage.clear();
                            window.location.href = "/login";
                            alert("You have been logged out successfully.");
                        }
                    }}
                />
                <ProfileOption
                    icon={<Trash2 />}
                    label="Delete Profile"
                    color="text-red-600"
                    onClick={() => {
                        if (window.confirm("Are you sure you want to delete your profile?")) {
                            fetch(`http://localhost:5000/profile/${userId}`, {
                                method: "DELETE",
                            })
                                .then((res) => res.json())
                                .then(() => setProfile(null));
                        }
                    }}
                />
                <ProfileOption
                    icon={<Info />}
                    label="About"
                    onClick={() =>
                        fetch(`http://localhost:5000/about-us`)
                            .then((res) => res.json())
                            .then((data) => alert(`About Us: ${data.description}`))
                            .catch(() => alert("Failed to fetch about us info."))
                    }
                />
            </div>

            {/* Modal */}
            {showTagModal && (
                <TagFilterModal
                    onClose={() => setShowTagModal(false)}
                    onApply={(tags) => {
                        updateUserTags(tags);
                        setShowTagModal(false);
                    }}
                    preselectedTags={userTags}
                />
            )}
            {showEditModal && (
                <EditInfoModal
                    currentUsername={profile.username}
                    currentBio={profile.bio}
                    onClose={() => setShowEditModal(false)}
                    onSave={(username, bio) => {
                        fetch(`http://localhost:5000/profile/${userId}/edit`, {
                            method: "PUT",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ username, bio }),
                        })
                            .then((res) => res.json())
                            .then(() => {
                                setProfile((prev) => ({ ...prev, username, bio }));
                                setShowEditModal(false);
                            });
                    }}
                />
            )}

        </div>
    );
}

export default ProfilePage;
