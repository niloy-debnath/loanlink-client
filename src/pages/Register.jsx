import React from "react";
import { useNavigate, Link } from "react-router";
import { useForm } from "react-hook-form";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "../firebase/firebase.config";
import { toast } from "react-hot-toast";
import loginBg from "../assets/login-bg.png";
import axios from "axios";

const Register = () => {
  const navigate = useNavigate();

  const {
    register: formRegister,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      // 1️⃣ Create user in Firebase
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        data.email,
        data.password
      );

      // 2️⃣ Update Firebase profile
      await updateProfile(userCredential.user, {
        displayName: data.name,
        photoURL: data.photoURL || null,
      });

      // 3️⃣ SAVE USER TO BACKEND (MongoDB) ✅
      const userInfo = {
        name: data.name,
        email: data.email,
        photoURL: data.photoURL || null,
        role: data.role, // borrower | manager
        status: "active", // admin can suspend later
        createdAt: new Date(),
      };

      await axios.post(`${import.meta.env.VITE_API_URL}/users`, userInfo);

      toast.success("Registration successful!");
      navigate("/login");
    } catch (error) {
      console.error(error);
      toast.error(error.message || "Registration failed!");
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] flex justify-center items-center bg-gray-100 p-4">
      <div>
        <img src={loginBg} alt="Register Background" />
      </div>

      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Register</h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Name */}
          <div>
            <label className="block mb-1 font-medium">Name</label>
            <input
              type="text"
              {...formRegister("name", { required: "Name is required" })}
              className="w-full border p-2 rounded"
            />
            {errors.name && (
              <span className="text-red-500 text-sm">
                {errors.name.message}
              </span>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block mb-1 font-medium">Email</label>
            <input
              type="email"
              {...formRegister("email", { required: "Email is required" })}
              className="w-full border p-2 rounded"
            />
            {errors.email && (
              <span className="text-red-500 text-sm">
                {errors.email.message}
              </span>
            )}
          </div>

          {/* Photo URL */}
          <div>
            <label className="block mb-1 font-medium">Photo URL</label>
            <input
              type="text"
              {...formRegister("photoURL")}
              className="w-full border p-2 rounded"
            />
          </div>

          {/* Role */}
          <div>
            <label className="block mb-1 font-medium">Role</label>
            <select
              {...formRegister("role", { required: "Role is required" })}
              className="w-full border p-2 rounded"
            >
              <option value="">Select Role</option>
              <option value="borrower">Borrower</option>
              <option value="manager">Manager</option>
            </select>
            {errors.role && (
              <span className="text-red-500 text-sm">
                {errors.role.message}
              </span>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="block mb-1 font-medium">Password</label>
            <input
              type="password"
              {...formRegister("password", {
                required: "Password is required",
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters",
                },
                pattern: {
                  value: /^(?=.*[a-z])(?=.*[A-Z]).*$/,
                  message:
                    "Password must have at least one uppercase and one lowercase letter",
                },
              })}
              className="w-full border p-2 rounded"
            />
            {errors.password && (
              <span className="text-red-500 text-sm">
                {errors.password.message}
              </span>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-[#0B89A7] text-white py-2 rounded hover:bg-blue-700 transition"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Registering..." : "Register"}
          </button>
        </form>

        <p className="mt-4 text-center text-gray-600">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-600 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
