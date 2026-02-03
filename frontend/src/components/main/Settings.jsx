import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { LoginContext } from '../context/Context';
import { motion } from 'framer-motion';
import { RiUserFill, RiMailFill, RiLockFill, RiSettings4Line, RiVerifiedBadgeFill, RiShieldCheckLine } from 'react-icons/ri';
import { toast, Toaster } from 'react-hot-toast';
import Navbar from './Navbar';
import { Loader2, Save } from 'lucide-react';

const SettingsPage = () => {
    const { isLogin } = useContext(LoginContext);
    const [userData, setUserData] = useState({ fullname: '', email: '', password: '' });
    const [loading, setLoading] = useState(true);
    const [updateLoading, setUpdateLoading] = useState(false);

    const API = import.meta.env.VITE_API_URL;
    const VERIFY = import.meta.env.VITE_CURRENT_USER_TOKEN_URL;

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                setLoading(true);
                const { data } = await axios.get(VERIFY, { withCredentials: true });
                setUserData({
                    fullname: data.user.fullname,
                    email: data.user.email,
                    password: '',
                });
            } catch (err) {
                toast.error('Sync failed.');
            } finally {
                setLoading(false);
            }
        };
        fetchUserData();
    }, []);

    const handleChange = (e) => {
        setUserData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const updateProfile = async () => {
        setUpdateLoading(true);
        try {
            const res = await axios.get(VERIFY, { withCredentials: true });
            const id = res.data.user._id;
            await axios.put(`${API}/${id}`, userData);
            toast.success('Profile updated!', {
                style: { borderRadius: '15px', background: '#065f46', color: '#fff' }
            });
        } catch (err) {
            toast.error('Update failed.');
        } finally {
            setUpdateLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col justify-center items-center h-screen bg-[#fcfdf2]">
                <Loader2 className="animate-spin text-emerald-600 w-12 h-12" />
                <p className="mt-4 text-emerald-900 font-black text-xs tracking-widest uppercase">Initializing Dashboard...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#fcfdf2] font-sans">
            {/* Fixed Navbar - Ensure your Navbar component uses 'fixed top-0 w-full z-50' */}
            <div className="fixed top-0 left-0 w-full z-50">
                <Navbar />
            </div>

            <Toaster position="top-right" />

            {/* Main Content with Padding-Top to account for Fixed Navbar */}
            <main className="pt-26 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    
                    {/* --- Entire Whole Square Layout --- */}
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ type: "spring", stiffness: 100 }}
                        className="bg-white rounded-[3rem] shadow-[0_40px_100px_-20px_rgba(6,78,59,0.08)] border border-emerald-50 overflow-hidden flex flex-col lg:flex-row min-h-[600px]"
                    >
                        
                        {/* --- Left Column: Identity Preview --- */}
                        <div className="lg:w-2/5 bg-emerald-600 p-10 lg:p-16 text-white flex flex-col justify-between relative">
                            {/* Abstract Decor */}
                            <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-400 rounded-full blur-[120px] opacity-20 -translate-y-1/2 translate-x-1/2"></div>
                            
                            <div className="relative z-10">
                                <div className="bg-yellow-400 w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg mb-8">
                                    <RiSettings4Line size={36} className="text-emerald-900 animate-spin-slow" />
                                </div>
                                <h2 className="text-5xl font-black tracking-tighter leading-none mb-6">
                                    Member <br /> <span className="text-yellow-400">Settings.</span>
                                </h2>
                                <p className="text-emerald-100/80 font-medium text-lg leading-relaxed">
                                    Keep your personal info up to date to ensure a smooth shopping experience.
                                </p>
                            </div>

                            <div className="relative z-10 mt-12 bg-emerald-700/50 backdrop-blur-md p-8 rounded-[2rem] border border-emerald-500/30">
                                <div className="flex items-center gap-5 mb-6">
                                    <div className="w-16 h-16 bg-yellow-400 rounded-2xl flex items-center justify-center text-emerald-900 text-2xl font-black shadow-inner">
                                        {userData.fullname.charAt(0).toUpperCase() || "?"}
                                    </div>
                                    <div>
                                        <p className="font-black text-2xl truncate max-w-[180px]">{userData.fullname || "New Member"}</p>
                                        <div className="flex items-center gap-1.5 text-yellow-400 text-[10px] font-black uppercase tracking-wider mt-1">
                                            <RiVerifiedBadgeFill /> Verified Account
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-3 pt-4 border-t border-emerald-500/20">
                                    <div className="flex justify-between text-xs">
                                        <span className="opacity-60">Status</span>
                                        <span className="font-bold text-yellow-400">Active</span>
                                    </div>
                                    <div className="flex justify-between text-xs">
                                        <span className="opacity-60">Security</span>
                                        <span className="font-bold">Encrypted</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* --- Right Column: Interactive Form --- */}
                        <div className="lg:w-3/5 p-10 lg:p-20 flex flex-col justify-center">
                            <div className="mb-12">
                                <div className="flex items-center gap-3 text-emerald-600 mb-2">
                                    <RiShieldCheckLine size={24} />
                                    <span className="font-black text-xs uppercase tracking-[0.2em]">Security Protocol</span>
                                </div>
                                <h3 className="text-4xl font-black text-emerald-950 tracking-tighter">Edit Your Profile</h3>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {/* Name */}
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-emerald-400/60 ml-1">Display Name</label>
                                    <div className="relative group">
                                        <RiUserFill className="absolute left-5 top-1/2 -translate-y-1/2 text-emerald-400 group-focus-within:text-emerald-600 transition-colors" />
                                        <input 
                                            name="fullname"
                                            value={userData.fullname}
                                            onChange={handleChange}
                                            className="w-full pl-14 pr-6 py-5 bg-emerald-50/30 border-2 border-gray-200 rounded-2xl focus:bg-white focus:border-yellow-400 outline-none transition-all duration-300 font-bold text-emerald-950"
                                            placeholder="John Doe"
                                        />
                                    </div>
                                </div>

                                {/* Email */}
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-emerald-400/60 ml-1">Email Endpoint</label>
                                    <div className="relative group">
                                        <RiMailFill className="absolute left-5 top-1/2 -translate-y-1/2 text-emerald-400 group-focus-within:text-emerald-600 transition-colors" />
                                        <input 
                                            name="email"
                                            value={userData.email}
                                            onChange={handleChange}
                                            className="w-full pl-14 pr-6 py-5 bg-emerald-50/30 border-2 border-gray-200 rounded-2xl focus:bg-white focus:border-yellow-400 outline-none transition-all duration-300 font-bold text-emerald-950"
                                            placeholder="john@example.com"
                                        />
                                    </div>
                                </div>

                                {/* Password */}
                                <div className="space-y-3 md:col-span-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-emerald-400/60 ml-1">Security Token (Password)</label>
                                    <div className="relative group">
                                        <RiLockFill className="absolute left-5 top-1/2 -translate-y-1/2 text-emerald-400 group-focus-within:text-emerald-600 transition-colors" />
                                        <input 
                                            name="password"
                                            type="password"
                                            value={userData.password}
                                            onChange={handleChange}
                                            className="w-full pl-14 pr-6 py-5 bg-emerald-50/30 border-2 border-gray-200 rounded-2xl focus:bg-white focus:border-yellow-400 outline-none transition-all duration-300 font-bold text-emerald-950"
                                            placeholder="Leave empty to keep current"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Save Button Container */}
                            <div className="mt-16 flex items-center justify-end">
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={updateProfile}
                                    disabled={updateLoading}
                                    className="bg-emerald-600 text-white px-12 py-5 rounded-[1.5rem] font-black text-sm uppercase tracking-[0.2em] shadow-2xl shadow-emerald-200 hover:bg-emerald-700 transition-all flex items-center gap-3 disabled:opacity-50"
                                >
                                    {updateLoading ? (
                                        <Loader2 className="animate-spin" />
                                    ) : (
                                        <>
                                            <Save size={20} /> Update Profile
                                        </>
                                    )}
                                </motion.button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </main>
        </div>
    );
};

export default SettingsPage;