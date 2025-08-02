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
import TagFilterModal from "../components/TagEditModal"; // Ensure this file exists

const ProfileOption = ({ icon, label, onClick, color = "text-gray-700" }) => (
  <div
    onClick={onClick}
    className="flex items-center space-x-4 p-4 rounded-lg bg-gray-50 hover:bg-blue-50 cursor-pointer shadow-sm transition"
  >
    <div className={`p-2 rounded-full bg-blue-100 ${color}`}>
      {React.cloneElement(icon, { className: "w-5 h-5" })}
    </div>
    <span className={`font-medium ${color}`}>{label}</span>
  </div>
);

function ProfilePage() {
  const userId = localStorage.getItem("user_id");

  const [profile, setProfile] = useState(null);
  const [tags, setTags] = useState([]);
  const [userTags, setUserTags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showTagModal, setShowTagModal] = useState(false);

  // Fetch user profile
  useEffect(() => {
    fetch(`http://localhost:5000/profile/${userId}`)
      .then((res) => res.json())
      .then((data) => {
        setProfile(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [userId]);

  // Fetch all tags
  useEffect(() => {
    fetch("http://localhost:5000/tags_list")
      .then((res) => res.json())
      .then((data) => setTags(data))
      .catch((err) => console.error("Error fetching tags:", err));
  }, []);

  // Fetch user's tags
  useEffect(() => {
    fetch(`http://localhost:5000/profile/${userId}/tags`)
      .then((res) => res.json())
      .then((data) => setUserTags(data.tags || []))
      .catch((err) => console.error("Failed to fetch user tags:", err));
  }, [userId]);

  const updateUserTags = (newTags) => {
    setUserTags(newTags);

    // Optional: send to backend
    fetch(`http://localhost:5000/profile/${userId}/tags`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tags: newTags }),
    })
      .then((res) => res.json())
      .then(() => console.log("Tags updated"));
  };

  if (loading) return <div className="p-6">Loading profile...</div>;
  if (!profile) return <div className="p-6">Profile not found or deleted.</div>;

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      {/* Profile Header */}
      <div className="flex flex-col sm:flex-row items-center sm:items-start space-x-0 sm:space-x-6 space-y-6 sm:space-y-0 bg-white rounded-lg shadow-md p-6">
        <img
          src={profile.profileImage || "https://via.placeholder.com/150"}
          alt="Profile"
          className="w-32 h-32 rounded-full border-4 border-blue-600 shadow"
        />
        <div>
          <h2 className="text-3xl font-bold text-gray-900">{profile.username}</h2>
          <p className="text-gray-600">{profile.email}</p>
          <p className="mt-2 text-gray-700 max-w-xl">{profile.bio || ""}</p>
        </div>
      </div>

      {/* User Tags */}
      <div className="mt-6">
        <h3 className="text-xl font-semibold mb-2 flex items-center space-x-2">
          <Tags className="w-6 h-6 text-blue-600" />
          <span>Your Tags</span>
        </h3>
        <div className="flex flex-wrap gap-2">
          {userTags.length === 0 && (
            <p className="text-gray-500">You haven't selected any tags yet.</p>
          )}
          {userTags.map((tag) => (
            <span
              key={tag}
              className="px-3 py-1 bg-blue-200 text-blue-800 rounded-full text-sm"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Profile Options */}
      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <ProfileOption
          icon={<User2 />}
          label="Overview"
          onClick={() => alert("Overview clicked")}
        />
        <ProfileOption
          icon={<Tags />}
          label="Tags"
          onClick={() => setShowTagModal(true)}
        />
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
          onClick={() => {
            const username = prompt("New username:", profile.username);
            const bio = prompt("New bio:", profile.bio);
            fetch(`http://localhost:5000/profile/${userId}/edit`, {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ username, bio }),
            })
              .then((res) => res.json())
              .then(() => {
                setProfile((prev) => ({
                  ...prev,
                  username,
                  bio,
                }));
              });
          }}
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
            fetch(`http://localhost:5000/about-us`,{
              method: "GET",
            })
              .then((res) => res.json())
              .then((data) => {
                alert(`About Us: ${data.description}`);
              })
              .catch((err) => {
                console.error("Error fetching about us:", err);
                alert("Failed to fetch about us information.");
            })
          }
        />
      </div>

      {/* Tag Selection Modal */}
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
    </div>
  );
}

export default ProfilePage;
