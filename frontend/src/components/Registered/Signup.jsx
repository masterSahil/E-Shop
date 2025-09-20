import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import image from '../../assets/login/image.png';
import axios from "axios";
import { motion } from "framer-motion";
import { FaUser, FaEnvelope, FaLock } from "react-icons/fa";

const SignUpForm = () => {
  const [data, setData] = useState({
    fullname: "",
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const URL = import.meta.env.VITE_API_URL;

  const handleChange = (e) => {
    setData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const validate = () => {
    const errs = {};
    if (!data.fullname.trim()) errs.fullname = "Full name is required.";
    if (!data.email.trim()) {
      errs.email = "Email is required.";
    } else if (!/\S+@\S+\.\S+/.test(data.email)) {
      errs.email = "Invalid email format.";
    }
    if (!data.password || data.password.length < 6) {
      errs.password = "Password must be at least 6 characters.";
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const submit = async () => {
    if (!validate()) return;
    try {
      await axios.post(URL, data, { withCredentials: true });
      alert("Account created!");
      setData({ fullname: "", email: "", password: "" });
      navigate("/login");
    } catch (err) {
      console.error(err);
      alert("Signup failed.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4 py-10">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 bg-white shadow-2xl rounded-3xl overflow-hidden"
      >
        {/* Left Section */}
        <div className="bg-gradient-to-br from-purple-700 to-indigo-800 p-10 text-white flex flex-col justify-center space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-center"
          >
            <img
              src={image}
              alt="signup"
              className="w-24 h-24 mx-auto bg-white rounded-full border-4 border-purple-300 shadow-lg p-2 mb-4"
            />
            <h2 className="text-4xl font-extrabold mb-2">Join Us Today!</h2>
            <p className="text-purple-200">Create your account to get started</p>
          </motion.div>

          <ul className="space-y-4 text-sm text-purple-200 pl-4">
            <li className="flex items-start gap-2">
              <FaUser className="mt-1" /> Access exclusive features.
            </li>
            <li className="flex items-start gap-2">
              <FaEnvelope className="mt-1" /> Stay updated with newsletters.
            </li>
            <li className="flex items-start gap-2">
              <FaLock className="mt-1" /> Secure and private platform.
            </li>
          </ul>
        </div>

        {/* Right Form Section */}
        <div className="p-10 md:p-12 space-y-6">
          <h2 className="text-3xl font-bold text-gray-800">Create Account</h2>

          <div className="space-y-5">
            {/* Fullname */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Full Name</label>
              <input
                type="text"
                name="fullname"
                value={data.fullname}
                onChange={handleChange}
                placeholder="John Doe"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
              />
              {errors.fullname && (
                <p className="text-xs text-red-500 mt-1">{errors.fullname}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Email Address</label>
              <input
                type="email"
                name="email"
                value={data.email}
                onChange={handleChange}
                placeholder="john@example.com"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
              />
              {errors.email && (
                <p className="text-xs text-red-500 mt-1">{errors.email}</p>
              )}
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
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
              />
              {errors.password && (
                <p className="text-xs text-red-500 mt-1">{errors.password}</p>
              )}
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              onClick={submit}
              className="w-full py-3 bg-purple-600 text-white font-semibold rounded-lg shadow hover:bg-purple-700 transition"
            >
              Sign Up
            </motion.button>

            <p className="text-center text-sm text-gray-600">
              Already have an account?{" "}
              <button
                onClick={() => navigate("/login")}
                className="text-indigo-600 hover:underline font-semibold"
              >
                Login
              </button>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default SignUpForm;