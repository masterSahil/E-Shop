import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import image from '../../assets/login/image.png';
import axios from "axios";
import { LoginContext } from "../context/Context";
import { motion } from "framer-motion";
import { FaEnvelope, FaLock, FaLeaf, FaChevronRight } from "react-icons/fa";

const LoginForm = () => {
  const [data, setData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const loginContext = useContext(LoginContext);
  const URL = import.meta.env.VITE_COMPARE_URL;

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

  // Submit
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

  // checkUser
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
    <div className="min-h-screen bg-[#f7fee7] flex items-center justify-center px-4 py-10 relative overflow-hidden">
      {/* Aesthetic Background Accents */}
      <div className="absolute top-[-15%] right-[-10%] w-[50%] h-[50%] bg-lime-200/40 blur-[120px] rounded-full" />
      <div className="absolute bottom-[-15%] left-[-10%] w-[50%] h-[50%] bg-emerald-200/30 blur-[120px] rounded-full" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 bg-white shadow-[0_40px_100px_rgba(6,78,59,0.12)] rounded-[3rem] overflow-hidden relative z-10 border border-lime-100/50"
      >
        {/* Left Side - The Branding Panel */}
        <div className="bg-emerald-950 p-10 md:p-16 text-white flex flex-col justify-center relative overflow-hidden">
          {/* Decorative Leaf Icon */}
          <div className="absolute top-[-20px] right-[-20px] text-emerald-900/20 text-[15rem] rotate-12 pointer-events-none">
            <FaLeaf />
          </div>

          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="relative z-10"
          >
            <div className="inline-flex items-center gap-2 bg-lime-400/10 px-4 py-1.5 rounded-full border border-lime-400/20 mb-8">
              <FaLeaf className="text-lime-400 text-xs" />
              <span className="text-lime-400 font-black tracking-[0.2em] uppercase text-[10px]">Secure Access</span>
            </div>

            <img
              src={image}
              alt="login"
              className="w-32 h-32 bg-white/5 rounded-[2.8rem] border border-white/10 shadow-2xl p-5 mb-10 backdrop-blur-md object-contain"
            />
            
            <h2 className="text-6xl font-black mb-6 tracking-tighter leading-[0.9]">
              Welcome <br/> <span className="text-lime-400">Back.</span>
            </h2>
            
            <p className="text-emerald-100/50 font-bold mb-12 max-w-xs leading-relaxed">
              Continue your curated journey and manage your premium collection.
            </p>

            <ul className="space-y-6">
              {[
                "Access your personalized dashboard",
                "Secure encrypted login protection",
                "Real-time collection updates"
              ].map((text, i) => (
                <li key={i} className="flex items-center gap-4 text-xs font-black uppercase tracking-widest text-emerald-100/70">
                  <div className="w-6 h-6 rounded-lg bg-lime-400 flex items-center justify-center text-emerald-950 text-[10px]">
                    <FaChevronRight />
                  </div>
                  {text}
                </li>
              ))}
            </ul>
          </motion.div>
        </div>

        {/* Right Side - The Interaction Form */}
        <div className="p-10 md:p-20 flex flex-col justify-center bg-white">
          <div className="mb-12">
            <h2 className="text-4xl font-black text-emerald-950 tracking-tighter mb-3">Sign In</h2>
            <div className="h-1.5 w-16 bg-lime-400 rounded-full" />
          </div>

          <div className="space-y-7">
            {/* Email Field */}
            <div className="group">
              <label className="text-[11px] font-black text-emerald-900/40 uppercase tracking-[0.15em] ml-1 mb-2.5 block">
                Verification Email
              </label>
              <div className="relative">
                <FaEnvelope className="absolute left-5 top-1/2 -translate-y-1/2 text-emerald-900/20 group-focus-within:text-lime-500 transition-colors duration-300" />
                <input
                  type="email"
                  name="email"
                  value={data.email}
                  onChange={handleChange}
                  placeholder="name@provider.com"
                  className={`w-full pl-14 pr-6 bg-gray-50 border-2 rounded-2xl outline-none transition-all duration-300 font-bold text-emerald-950 placeholder:text-emerald-900/20 py-4
                    ${errors.email 
                      ? "border-red-500/50 bg-red-50/30" 
                      : "border-gray-200 focus:border-lime-400 focus:bg-white focus:shadow-[0_10px_30px_rgba(163,230,53,0.1)]"}`}
                />
              </div>
              {errors.email && (
                <p className="text-[10px] font-black text-red-500 mt-2 uppercase tracking-tight ml-1 animate-shake">
                  {errors.email}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div className="group">
              <label className="text-[11px] font-black text-emerald-900/40 uppercase tracking-[0.15em] ml-1 mb-2.5 block">
                Security Key
              </label>
              <div className="relative">
                <FaLock className="absolute left-5 top-1/2 -translate-y-1/2 text-emerald-900/20 group-focus-within:text-lime-500 transition-colors duration-300" />
                <input
                  type="password"
                  name="password"
                  value={data.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className={`w-full pl-14 pr-6 py-4.5 bg-gray-50 border-2 rounded-2xl outline-none transition-all duration-300 font-bold text-emerald-950 placeholder:text-emerald-900/20 py-4
                    ${errors.password 
                      ? "border-red-500/50 bg-red-50/30" 
                      : "border-gray-200 focus:border-lime-400 focus:bg-white focus:shadow-[0_10px_30px_rgba(163,230,53,0.1)]"}`}
                />
              </div>
              {errors.password && (
                <p className="text-[10px] font-black text-red-500 mt-2 uppercase tracking-tight ml-1 animate-shake">
                  {errors.password}
                </p>
              )}
            </div>

            {/* Action Button */}
            <div className="pt-4">
              <motion.button
                whileHover={loading ? {} : { scale: 1.02, backgroundColor: '#84cc16' }}
                whileTap={loading ? {} : { scale: 0.98 }}
                onClick={submit}
                disabled={loading}
                className={`w-full py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-xs transition-all duration-300 shadow-xl
                  ${loading 
                    ? "bg-emerald-100 text-emerald-300 cursor-not-allowed shadow-none" 
                    : "bg-lime-400 text-emerald-950 shadow-lime-500/20 hover:shadow-lime-500/40"}`}
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <motion.div 
                      animate={{ rotate: 360 }} 
                      transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                      className="w-4 h-4 border-2 border-emerald-950 border-t-transparent rounded-full"
                    />
                    Authorizing...
                  </span>
                ) : "Grant Access"}
              </motion.button>
            </div>

            {/* Footer Navigation */}
            <p className="text-center text-xs font-bold text-emerald-800/40 mt-8">
              New to the collective?{" "}
              <button
                onClick={() => navigate("/")}
                className="text-emerald-950 hover:text-lime-600 underline font-black transition-colors duration-300"
              >
                Create Account
              </button>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginForm;