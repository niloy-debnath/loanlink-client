import { useEffect, useState } from "react";
import axios from "../../../../axiosConfig";
import Swal from "sweetalert2";
import useAuth from "../../../hooks/useAuth";
import { TbFidgetSpinner } from "react-icons/tb";
import { signOut } from "firebase/auth";
import { auth } from "../../../firebase/firebase.config";
import PageTitle from "../../../components/PageTitle";

const MyProfileManager = () => {
  const { user, setUser, logout } = useAuth();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState({});
  const [preview, setPreview] = useState("");

  /* ---------- FETCH PROFILE ---------- */
  const fetchProfile = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/users/${user.email}`
      );
      setProfile(res.data);
      setPreview(res.data.photoURL || "");
    } catch {
      Swal.fire("Error", "Failed to fetch profile", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  /* ---------- EDIT FIELD ---------- */
  const handleEdit = async (field) => {
    const { value } = await Swal.fire({
      title: `Edit ${field}`,
      input: "text",
      inputValue: profile[field] || "",
      showCancelButton: true,
    });

    if (value !== undefined) {
      try {
        const update = { [field]: value };
        await axios.put(
          `${import.meta.env.VITE_API_URL}/users/${profile._id}/role`,
          update
        );

        setProfile((prev) => ({ ...prev, ...update }));
        Swal.fire("Success", `${field} updated`, "success");
      } catch {
        Swal.fire("Error", `Failed to update ${field}`, "error");
      }
    }
  };

  /* ---------- UPLOAD PROFILE IMAGE ---------- */
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
      // 1️⃣ Upload to imgbb
      const imageUrl = await uploadToImgBB(file);

      // 2️⃣ Save URL to MongoDB
      const res = await axios.put(
        `${import.meta.env.VITE_API_URL}/users/${profile._id}/image`,
        { photoURL: imageUrl }
      );

      // 3️⃣ Live preview
      setPreview(imageUrl);

      Swal.fire("Success", "Profile image updated!", "success");
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Image upload failed", "error");
    }
  };

  /* ---------- CHANGE PASSWORD ---------- */
  const handleChangePassword = async () => {
    const { value: password } = await Swal.fire({
      title: "Change Password",
      input: "password",
      inputLabel: "New Password",
      inputPlaceholder: "Enter your new password",
      showCancelButton: true,
    });

    if (password) {
      try {
        await axios.put(
          `${import.meta.env.VITE_API_URL}/users/${profile._id}/role`,
          { password } // adjust endpoint if you have a proper password API
        );
        Swal.fire("Success", "Password updated", "success");
      } catch {
        Swal.fire("Error", "Failed to update password", "error");
      }
    }
  };

  /* ---------- LOGOUT ---------- */
  //   const handleLogout = () => {

  //     logout();
  //   };
  const handleLogout = async () => {
    await signOut(auth);

    setUser(null);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <PageTitle title="Manager Profile"></PageTitle>

        <TbFidgetSpinner className="animate-spin text-5xl text-[#162660]" />
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] p-6 bg-gradient-to-b from-[#D0E6FD] to-[#F1E4D1] flex justify-center items-start">
      <div className="bg-white shadow-2xl rounded-2xl p-8 max-w-xl w-full border-t-4 border-[#162660]">
        <h2 className="text-3xl font-bold mb-6 text-[#162660]">My Profile</h2>

        {/* PROFILE IMAGE */}
        <div className="flex justify-center mb-6">
          <div className="relative">
            <img
              src={preview || "/default-avatar.png"}
              alt="Profile"
              className="w-32 h-32 object-cover rounded-full border-4 border-gradient-to-r from-[#162660] to-[#D0E6FD] p-1"
            />
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="absolute inset-0 opacity-0 cursor-pointer rounded-full"
            />
          </div>
        </div>

        {/* PROFILE INFO */}
        <div className="flex flex-col gap-4">
          <div className="flex justify-between items-center border-b pb-2">
            <div>
              <p className="text-gray-500 text-sm">Name</p>
              <p className="text-lg font-semibold">{profile.name || "N/A"}</p>
            </div>
            <button
              onClick={() => handleEdit("name")}
              className="text-blue-600 font-semibold hover:underline"
            >
              Edit
            </button>
          </div>

          <div className="flex justify-between items-center border-b pb-2">
            <div>
              <p className="text-gray-500 text-sm">Email</p>
              <p className="text-lg font-semibold">{profile.email}</p>
            </div>
            <button
              onClick={() => handleEdit("email")}
              className="text-blue-600 font-semibold hover:underline"
            >
              Edit
            </button>
          </div>

          <div className="flex justify-between items-center border-b pb-2">
            <div>
              <p className="text-gray-500 text-sm">Role</p>
              <p className="text-lg font-semibold">{profile.role || "User"}</p>
            </div>
          </div>

          <div className="flex justify-between items-center">
            <div>
              <p className="text-gray-500 text-sm">Joined On</p>
              <p className="text-lg font-semibold">
                {profile.createdAt
                  ? new Date(profile.createdAt).toLocaleDateString()
                  : "N/A"}
              </p>
            </div>
          </div>
        </div>

        {/* ACTION BUTTONS */}
        <div className="mt-6 flex justify-between gap-4">
          <button
            onClick={handleChangePassword}
            className="flex-1 px-6 py-2 bg-gradient-to-r from-[#162660] to-[#D0E6FD] text-white rounded-full font-semibold hover:from-[#D0E6FD] hover:to-[#162660] transition"
          >
            Change Password
          </button>

          <button
            onClick={handleLogout}
            className="flex-1 px-6 py-2 bg-red-600 text-white rounded-full font-semibold hover:bg-red-700 transition"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default MyProfileManager;
