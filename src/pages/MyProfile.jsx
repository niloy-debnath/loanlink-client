import { useEffect, useState } from "react";
import axios from "../../axiosConfig";
import Swal from "sweetalert2";
import { TbEdit, TbLogout, TbUser } from "react-icons/tb";
import { signOut } from "firebase/auth";
import { auth } from "../firebase/firebase.config";
import useAuth from "../hooks/useAuth";
import PageTitle from "../components/PageTitle";

const MyProfile = () => {
  const { user, setUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  /* ================= FETCH PROFILE ================= */
  useEffect(() => {
    const fetchProfile = async () => {
      if (!user?.email) return;

      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/users/${user.email}`
        );
        setProfile(res.data);
      } catch (err) {
        Swal.fire("Error", "Failed to load profile", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user]);

  /* ================= UPDATE FIELD ================= */
  const handleEdit = async (field) => {
    const { value } = await Swal.fire({
      title: `Update ${field}`,
      input: "text",
      inputValue: profile[field] || "",
      showCancelButton: true,
    });

    if (!value) return;

    try {
      await axios.put(`${import.meta.env.VITE_API_URL}/users/${profile._id}`, {
        [field]: value,
      });

      setProfile((prev) => ({ ...prev, [field]: value }));
      Swal.fire("Updated", `${field} updated successfully`, "success");
    } catch {
      Swal.fire("Error", "Update failed", "error");
    }
  };

  /* ================= IMAGE UPLOAD ================= */
  const uploadToImgBB = async (file) => {
    const formData = new FormData();
    formData.append("image", file);

    const res = await axios.post(
      `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_IMGBB_KEY}`,
      formData
    );

    return res.data.data.url;
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const imageUrl = await uploadToImgBB(file);

      await axios.put(
        `${import.meta.env.VITE_API_URL}/users/${profile._id}/image`,
        { photoURL: imageUrl }
      );

      setProfile((prev) => ({ ...prev, photoURL: imageUrl }));

      Swal.fire("Success", "Profile photo updated", "success");
    } catch {
      Swal.fire("Error", "Image upload failed", "error");
    }
  };

  /* ================= LOGOUT ================= */
  const handleLogout = async () => {
    await signOut(auth);
    setUser(null);
  };

  if (loading || !profile) {
    return (
      <div className="flex justify-center items-center min-h-[70vh]">
        <span className="loading loading-spinner loading-lg text-[#162660]" />
      </div>
    );
  }

  return (
    <div className="min-h-[85vh] bg-gradient-to-br from-[#D0E6FD] to-[#F1E4D1] flex justify-center items-start p-6">
      <PageTitle title="Profile"></PageTitle>
      <div className="w-full max-w-4xl bg-white rounded-3xl shadow-xl overflow-hidden">
        {/* ================= HEADER ================= */}
        <div className="relative bg-gradient-to-r from-[#162660] to-[#243a8f] p-10 text-white">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="relative">
              <img
                src={profile?.photoURL || "/default-avatar.png"}
                alt="Profile"
                className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg"
              />
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="absolute inset-0 opacity-0 cursor-pointer"
                title="Change profile photo"
              />
            </div>

            <div>
              <h2 className="text-3xl font-bold">
                {profile.name || "Unnamed User"}
              </h2>
              <p className="opacity-90">{profile.email}</p>

              {profile.role && (
                <span className="inline-block mt-2 px-4 py-1 rounded-full text-xs font-semibold bg-white text-[#162660]">
                  {profile.role.toUpperCase()}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* ================= BODY ================= */}
        <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* INFO CARD */}
          <div className="bg-gray-50 rounded-2xl p-6 shadow-sm">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <TbUser /> Account Info
            </h3>

            <div className="space-y-4">
              <ProfileRow
                label="Name"
                value={profile.name}
                onEdit={() => handleEdit("name")}
              />

              <ProfileRow
                label="Email"
                value={profile.email}
                editable={false}
              />

              <ProfileRow
                label="Status"
                value={profile.status || "active"}
                editable={false}
              />

              <ProfileRow
                label="Joined"
                value={
                  profile.createdAt
                    ? new Date(profile.createdAt).toDateString()
                    : "N/A"
                }
                editable={false}
              />
            </div>
          </div>

          {/* ACTIONS */}
          <div className="bg-gray-50 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
            <div>
              <h3 className="text-lg font-bold mb-4">Account Actions</h3>

              <p className="text-sm text-gray-600">
                Manage your account information and security settings.
              </p>
            </div>

            <button
              onClick={handleLogout}
              className="mt-6 w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-red-600 text-white font-semibold hover:bg-red-700 transition"
            >
              <TbLogout /> Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ================= REUSABLE ROW ================= */
const ProfileRow = ({ label, value, onEdit, editable = true }) => (
  <div className="flex justify-between items-center border-b pb-2">
    <div>
      <p className="text-xs text-gray-500">{label}</p>
      <p className="font-semibold">{value || "N/A"}</p>
    </div>

    {editable && (
      <button onClick={onEdit} className="text-[#162660] hover:text-[#243a8f]">
        <TbEdit />
      </button>
    )}
  </div>
);

export default MyProfile;
