import React from "react";
import { useNavigate, Link, useLocation } from "react-router";
import { useForm } from "react-hook-form";
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../firebase/firebase.config";
import { toast } from "react-hot-toast";
import { FcGoogle } from "react-icons/fc";
import loginBg from "../assets/login-bg.png";
import PageTitle from "../components/PageTitle";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      await signInWithEmailAndPassword(auth, data.email, data.password);
      toast.success("Login successful!");
      navigate(from, { replace: true });
    } catch {
      toast.error("Invalid email or password!");
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      toast.success("Login successful!");
      navigate(from, { replace: true });
    } catch {
      toast.error("Google login failed!");
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center bg-gray-100 px-4">
      <PageTitle title="Login"></PageTitle>
      <div className="flex flex-col md:flex-row items-center bg-white rounded-lg shadow-lg overflow-hidden max-w-4xl w-full">
        {/* Image Section */}
        <div className="hidden md:block md:w-1/2">
          <img
            src={loginBg}
            alt="Login"
            className="h-full w-full object-cover"
          />
        </div>

        {/* Form Section */}
        <div className="w-full md:w-1/2 p-6 sm:p-8">
          <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Email */}
            <div>
              <label className="block mb-1 font-medium">Email</label>
              <input
                type="email"
                {...register("email", { required: "Email is required" })}
                className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-[#162660]"
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block mb-1 font-medium">Password</label>
              <input
                type="password"
                {...register("password", { required: "Password is required" })}
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
              {isSubmitting ? "Logging in..." : "Login"}
            </button>
          </form>

          <div className="my-4 text-center text-gray-500">or</div>

          <button
            onClick={handleGoogleLogin}
            className="w-full border py-2 rounded flex items-center justify-center gap-2 hover:bg-gray-100 transition"
          >
            <FcGoogle size={24} />
            Login with Google
          </button>

          <p className="mt-4 text-center text-gray-600">
            Don't have an account?{" "}
            <Link to="/register" className="text-blue-600 hover:underline">
              Register
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
