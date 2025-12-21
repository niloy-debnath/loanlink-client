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
    formState: { errors, isSubmitting },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        data.email,
        data.password
      );

      await updateProfile(userCredential.user, {
        displayName: data.name,
        photoURL: data.photoURL || null,
      });

      const userInfo = {
        name: data.name,
        email: data.email,
        photoURL: data.photoURL || null,
        role: data.role,
        status: "active",
        createdAt: new Date(),
      };

      await axios.post(`${import.meta.env.VITE_API_URL}/users`, userInfo);

      toast.success("Registration successful!");
      navigate("/login");
    } catch (error) {
      toast.error(error.message || "Registration failed!");
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center bg-gray-100 px-4">
      <div className="flex flex-col md:flex-row items-center bg-white rounded-lg shadow-lg overflow-hidden max-w-4xl w-full">
        {/* Image Section */}
        <div className="hidden md:block md:w-1/2">
          <img
            src={loginBg}
            alt="Register"
            className="h-full w-full object-cover"
          />
        </div>

        {/* Form Section */}
        <div className="w-full md:w-1/2 p-6 sm:p-8">
          <h2 className="text-2xl font-bold mb-6 text-center">Register</h2>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Name */}
            <div>
              <label className="block mb-1 font-medium">Name</label>
              <input
                type="text"
                {...formRegister("name", { required: "Name is required" })}
                className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-[#162660]"
              />
              {errors.name && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.name.message}
                </p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block mb-1 font-medium">Email</label>
              <input
                type="email"
                {...formRegister("email", { required: "Email is required" })}
                className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-[#162660]"
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Photo URL */}
            <div>
              <label className="block mb-1 font-medium">Photo URL</label>
              <input
                type="text"
                {...formRegister("photoURL")}
                className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-[#162660]"
              />
            </div>

            {/* Role */}
            <div>
              <label className="block mb-1 font-medium">Role</label>
              <select
                {...formRegister("role", { required: "Role is required" })}
                className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-[#162660]"
              >
                <option value="">Select Role</option>
                <option value="borrower">Borrower</option>
                <option value="manager">Manager</option>
              </select>
              {errors.role && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.role.message}
                </p>
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
                      "Password must contain uppercase and lowercase letters",
                  },
                })}
                className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-[#162660]"
              />
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[#162660] text-white py-2 rounded hover:opacity-90 transition"
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
    </div>
  );
};

export default Register;
