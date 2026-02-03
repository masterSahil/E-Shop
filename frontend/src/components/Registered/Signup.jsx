import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import image from '../../assets/login/image.png';
import axios from "axios";
import { motion } from "framer-motion";
import { FaUser, FaEnvelope, FaLock, FaLeaf } from "react-icons/fa";

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
    <div className="min-h-screen bg-[#f7fee7] flex items-center justify-center px-4 py-10 relative overflow-hidden">
      {/* Decorative background blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-lime-200/40 blur-[120px] rounded-full" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-emerald-200/30 blur-[120px] rounded-full" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 bg-white shadow-[0_30px_100px_rgba(6,78,59,0.1)] rounded-[3rem] overflow-hidden relative z-10 border border-lime-100"
      >
        {/* Left Section - The Branding side */}
        <div className="bg-emerald-950 p-10 md:p-14 text-white flex flex-col justify-center relative overflow-hidden">
          {/* Subtle pattern overlay */}
          <div className="absolute inset-0 opacity-10 pointer-events-none">
             <div className="absolute top-10 left-10 text-9xl rotate-12"><FaLeaf /></div>
          </div>

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="relative z-10"
          >
            <div className="inline-flex items-center gap-2 bg-lime-400/10 px-4 py-1.5 rounded-full border border-lime-400/20 mb-8">
              <FaLeaf className="text-lime-400 text-xs" />
              <span className="text-lime-400 font-black tracking-widest uppercase text-[10px]">Join the Collective</span>
            </div>

            <img
              src={image}
              alt="signup"
              className="w-28 h-28 bg-white/5 rounded-[2.5rem] border border-white/10 shadow-2xl p-4 mb-8 backdrop-blur-sm"
            />
            
            <h2 className="text-5xl font-black mb-4 tracking-tighter">Start your <br/> <span className="text-lime-400">Journey.</span></h2>
            <p className="text-emerald-100/60 font-bold mb-10 leading-relaxed">
              Unlock the full experience and access our curated premium collection.
            </p>

            <ul className="space-y-5">
              {[
                { icon: <FaUser />, text: "Personalized curated feed" },
                { icon: <FaEnvelope />, text: "Early access to new drops" },
                { icon: <FaLock />, text: "Secure encrypted platform" }
              ].map((item, index) => (
                <li key={index} className="flex items-center gap-3 text-sm font-bold text-emerald-100/80">
                  <span className="w-8 h-8 rounded-xl bg-lime-400/20 flex items-center justify-center text-lime-400 border border-lime-400/20">
                    {item.icon}
                  </span>
                  {item.text}
                </li>
              ))}
            </ul>
          </motion.div>
        </div>

        {/* Right Form Section */}
        <div className="p-10 md:p-16 flex flex-col justify-center">
          <div className="mb-10">
            <h2 className="text-4xl font-black text-emerald-950 tracking-tighter mb-2">Create Account</h2>
            <div className="h-1.5 w-12 bg-lime-400 rounded-full"></div>
          </div>

          <div className="space-y-6">
            {/* Fullname */}
            <div className="group">
              <label className="text-[11px] font-black text-emerald-900/40 uppercase tracking-widest ml-1 mb-2 block">Full Name</label>
              <div className="relative">
                <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-900/20 group-focus-within:text-lime-500 transition-colors" />
                <input
                  type="text"
                  name="fullname"
                  value={data.fullname}
                  onChange={handleChange}
                  placeholder="Enter your name"
                  className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-gray-200 rounded-2xl focus:bg-white focus:border-lime-400 focus:shadow-[0_0_20px_rgba(163,230,53,0.15)] outline-none transition-all duration-300 font-bold text-emerald-950 placeholder:text-emerald-900/20"
                />
              </div>
              {errors.fullname && <p className="text-[10px] font-black text-red-500 mt-2 uppercase tracking-tighter ml-1">{errors.fullname}</p>}
            </div>

            {/* Email */}
            <div className="group">
              <label className="text-[11px] font-black text-emerald-900/40 uppercase tracking-widest ml-1 mb-2 block">Email Address</label>
              <div className="relative">
                <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-900/20 group-focus-within:text-lime-500 transition-colors" />
                <input
                  type="email"
                  name="email"
                  value={data.email}
                  onChange={handleChange}
                  placeholder="hello@company.com"
                  className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-gray-200 rounded-2xl focus:bg-white focus:border-lime-400 focus:shadow-[0_0_20px_rgba(163,230,53,0.15)] outline-none transition-all duration-300 font-bold text-emerald-950 placeholder:text-emerald-900/20"
                />
              </div>
              {errors.email && <p className="text-[10px] font-black text-red-500 mt-2 uppercase tracking-tighter ml-1">{errors.email}</p>}
            </div>

            {/* Password */}
            <div className="group">
              <label className="text-[11px] font-black text-emerald-900/40 uppercase tracking-widest ml-1 mb-2 block">Security Password</label>
              <div className="relative">
                <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-900/20 group-focus-within:text-lime-500 transition-colors" />
                <input
                  type="password"
                  name="password"
                  value={data.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-gray-200 rounded-2xl focus:bg-white focus:border-lime-400 focus:shadow-[0_0_20px_rgba(163,230,53,0.15)] outline-none transition-all duration-300 font-bold text-emerald-950 placeholder:text-emerald-900/20"
                />
              </div>
              {errors.password && <p className="text-[10px] font-black text-red-500 mt-2 uppercase tracking-tighter ml-1">{errors.password}</p>}
            </div>

            <motion.button
              whileHover={{ scale: 1.02, backgroundColor: '#84cc16' }}
              whileTap={{ scale: 0.98 }}
              onClick={submit}
              className="w-full py-5 bg-lime-400 text-emerald-950 font-black rounded-2xl shadow-xl shadow-lime-500/20 transition-all duration-300 uppercase tracking-widest text-xs mt-4"
            >
              Initialize Account
            </motion.button>

            <p className="text-center text-xs font-bold text-emerald-800/40">
              Already a member?{" "}
              <button
                onClick={() => navigate("/login")}
                className="text-emerald-950 hover:text-lime-600 underline font-black transition-colors"
              >
                Sign In Instead
              </button>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default SignUpForm;