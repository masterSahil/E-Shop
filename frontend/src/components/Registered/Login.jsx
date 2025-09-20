import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import image from '../../assets/login/image.png';
import axios from "axios";
import { LoginContext } from "../context/Context";
import { motion } from "framer-motion";
import { FaEnvelope, FaLock } from "react-icons/fa";

const LoginForm = () => {
  const [data, setData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const loginContext = useContext(LoginContext);
  const URL = import.meta.env.VITE_COMPARE_URL;

  // Validation added, but login logic same
  const validate = () => {
    const errs = {};
    if (!data.email.trim()) {
      errs.email = "Email is required.";
    } else if (!/\S+@\S+\.\S+/.test(data.email)) {
      errs.email = "Invalid email format.";
    }
    if (!data.password) {
      errs.password = "Password is required.";
    } else if (data.password.length < 6) {
      errs.password = "Password must be at least 6 characters.";
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // Your original submit logic (no change)
  const submit = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      await axios.post(URL, data, { withCredentials: true });
      alert("Logged in Successfully");
      localStorage.setItem("isLoggedIn", true);
      localStorage.setItem("email", data.email);
      loginContext.setIsLogin(true);
      await checkUser();
    } catch (error) {
      alert("Something Went Wrong During Login");
    } finally {
      setLoading(false);
    }
  };

  // Your original checkUser logic (no change)
  const checkUser = async () => {
    try {
      const res = await axios.get(import.meta.env.VITE_API_URL);
      const Users = res.data.user;

      for (let currentUser of Users) {
        if (currentUser.email === data.email) {
          localStorage.setItem("role", currentUser.role);
          currentUser.role === "user" ? navigate("/") : navigate("/admin");
          return;
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleChange = (e) => {
    setData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4 py-10">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 bg-white shadow-2xl rounded-3xl overflow-hidden"
      >
        {/* Left Side - Welcome Panel */}
        <div className="bg-gradient-to-br from-indigo-700 to-purple-800 p-10 text-white flex flex-col justify-center space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-center"
          >
            <img
              src={image}
              alt="login"
              className="w-24 h-24 mx-auto bg-white rounded-full border-4 border-indigo-300 shadow-lg p-2 mb-4"
            />
            <h2 className="text-4xl font-extrabold mb-2">Welcome Back!</h2>
            <p className="text-indigo-200">Sign in to continue your journey</p>
          </motion.div>
          <ul className="space-y-4 text-sm text-indigo-200 pl-4">
            <li className="flex items-start gap-2">
              <FaEnvelope className="mt-1" /> Access your personalized dashboard.
            </li>
            <li className="flex items-start gap-2">
              <FaLock className="mt-1" /> Secure login with privacy protection.
            </li>
            <li className="flex items-start gap-2">
              <FaEnvelope className="mt-1" /> Stay updated with your notifications.
            </li>
          </ul>
        </div>

        {/* Right Side - Login Form */}
        <div className="p-10 md:p-12 space-y-6">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">Sign In</h2>

          <div className="space-y-5">
            {/* Email */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Email Address</label>
              <input
                type="email"
                name="email"
                value={data.email}
                onChange={handleChange}
                placeholder="you@example.com"
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 outline-none transition 
                  ${errors.email ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-indigo-500"}`}
              />
              {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
            </div>

            {/* Password */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Password</label>
              <input
                type="password"
                name="password"
                value={data.password}
                onChange={handleChange}
                placeholder="••••••••"
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 outline-none transition
                  ${errors.password ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-indigo-500"}`}
              />
              {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password}</p>}
            </div>

            {/* Submit Button */}
            <motion.button
              whileHover={loading ? {} : { scale: 1.02 }}
              whileTap={loading ? {} : { scale: 0.97 }}
              onClick={submit}
              disabled={loading}
              className={`w-full py-3 font-semibold rounded-lg shadow transition 
                ${loading ? "bg-indigo-300 cursor-not-allowed" : "bg-indigo-600 text-white hover:bg-indigo-700"}`}
            >
              {loading ? "Logging in..." : "Login"}
            </motion.button>

            {/* Switch to SignUp */}
            <p className="text-center text-sm text-gray-600">
              Don’t have an account?{" "}
              <button
                onClick={() => navigate("/")}
                className="text-indigo-600 hover:underline font-semibold"
              >
                Sign Up
              </button>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginForm;