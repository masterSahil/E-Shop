import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { LoginContext } from '../context/Context';
import { motion } from 'framer-motion';
import { RiUserFill, RiMailFill, RiLockFill, RiAdminFill, RiUserStarFill } from 'react-icons/ri'; // Importing icons
import { toast, Toaster } from 'react-hot-toast'; // For better notifications
import Navbar from './Navbar';

const SettingsPage = () => {
  const { isLogin } = useContext(LoginContext);
  const [userData, setUserData] = useState({ fullname: '', email: '', password: '' });
  const [allUsers, setAllUsers] = useState([]);
  const [role, setRole] = useState('user');
  const [loading, setLoading] = useState(true);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [adminActionLoading, setAdminActionLoading] = useState(null); // To track which user is being acted upon

  const API = import.meta.env.VITE_API_URL;
  const VERIFY = import.meta.env.VITE_CURRENT_USER_TOKEN_URL;

  // Fetch current user data on component mount
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(VERIFY, { withCredentials: true });
        setUserData({
          fullname: data.user.fullname,
          email: data.user.email,
          password: '', // Password should never be pre-filled
        });
        setRole(data.user.role);
      } catch (err) {
        toast.error('Failed to load user data.');
        console.error('Error fetching user data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
  }, []);

  // Fetch all users if the current user is an admin
  useEffect(() => {
    if (role === 'admin') {
      fetchAllUsers();
    }
  }, [role]);

  const handleChange = (e) => {
    setUserData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const updateProfile = async () => {
    setUpdateLoading(true);
    try {
      const res = await axios.get(VERIFY, { withCredentials: true });
      const id = res.data.user._id;
      await axios.put(`${API}/${id}`, userData);
      toast.success('Profile updated successfully!');
    } catch (err) {
      toast.error('Failed to update profile. Please try again.');
      console.error('Error updating profile:', err);
    } finally {
      setUpdateLoading(false);
    }
  };

  const fetchAllUsers = async () => {
    try {
      const res = await axios.get(API, { withCredentials: true }); // Ensure credentials are sent
      setAllUsers(res.data.user);
    } catch (err) {
      toast.error('Failed to fetch all users.');
      console.error('Error fetching all users:', err);
    }
  };

  const promoteToAdmin = async (id) => {
    setAdminActionLoading(id);
    try {
      await axios.put(`${API}/${id}`, { role: 'admin' }, { withCredentials: true });
      toast.success('User promoted to admin!');
      fetchAllUsers(); // Refresh the user list
    } catch (err) {
      toast.error('Failed to promote user.');
      console.error('Error promoting user:', err);
    } finally {
      setAdminActionLoading(null);
    }
  };

  const promoteToUser = async (id) => {
    setAdminActionLoading(id);
    try {
      await axios.put(`${API}/${id}`, { role: 'user' }, { withCredentials: true });
      toast.success('User demoted to user role!');
      fetchAllUsers(); // Refresh the user list
    } catch (err) {
      toast.error('Failed to demote user.');
      console.error('Error demoting user:', err);
    } finally {
      setAdminActionLoading(null);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-br from-indigo-50 to-purple-100">
        <div className="animate-spin rounded-full h-20 w-20 border-t-2 border-b-2 border-indigo-500"></div>
        <p className="ml-4 text-indigo-700 text-lg">Loading settings...</p>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100 p-4 sm:p-6 lg:p-8">
        <Toaster position="top-right" reverseOrder={false} />

        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-4xl font-extrabold text-center text-indigo-800 mb-8 drop-shadow-md"
        >
          Your Account Settings
        </motion.h2>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-white shadow-xl rounded-2xl p-6 sm:p-8 lg:p-10 max-w-2xl mx-auto border border-indigo-200"
        >
          <h3 className="text-2xl font-semibold text-indigo-700 mb-6 flex items-center">
            <RiUserStarFill className="mr-3 text-indigo-500" /> Personal Information
          </h3>
          <div className="space-y-5">
            <div className="relative">
              <input
                name="fullname"
                value={userData.fullname}
                onChange={handleChange}
                placeholder="Full Name"
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition duration-200"
              />
              <RiUserFill className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl" />
            </div>
            <div className="relative">
              <input
                name="email"
                value={userData.email}
                onChange={handleChange}
                placeholder="Email Address"
                type="email"
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition duration-200"
              />
              <RiMailFill className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl" />
            </div>
            <div className="relative">
              <input
                name="password"
                type="password"
                value={userData.password}
                onChange={handleChange}
                placeholder="New Password (leave blank to keep current)"
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition duration-200"
              />
              <RiLockFill className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl" />
            </div>
            <motion.button
              whileHover={{ scale: 1.01, boxShadow: "0 8px 20px rgba(99, 102, 241, 0.4)" }}
              whileTap={{ scale: 0.97 }}
              onClick={updateProfile}
              className="w-full bg-indigo-600 text-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:bg-indigo-700 transition duration-300 ease-in-out flex items-center justify-center"
              disabled={updateLoading}
            >
              {updateLoading ? (
                <svg className="animate-spin h-5 w-5 text-white mr-3" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                <RiUserStarFill className="mr-2" />
              )}
              {updateLoading ? 'Updating...' : 'Update Profile'}
            </motion.button>
          </div>
        </motion.div>

        {role === 'admin' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-12 bg-white shadow-xl rounded-2xl p-6 sm:p-8 lg:p-10 max-w-4xl mx-auto border border-purple-200"
          >
            <h3 className="text-3xl font-semibold text-purple-700 mb-6 flex items-center">
              <RiAdminFill className="mr-3 text-purple-500" /> Admin Dashboard
            </h3>
            <p className="text-gray-600 mb-6">Manage user roles and permissions across the platform.</p>
            <div className="overflow-x-auto rounded-lg shadow-inner">
              <table className="min-w-full bg-white border border-gray-200 rounded-lg">
                <thead className="bg-purple-50">
                  <tr>
                    <th className="px-4 py-3 border-b-2 border-purple-200 text-left text-sm font-semibold text-purple-700 uppercase tracking-wider rounded-tl-lg">Full Name</th>
                    <th className="px-4 py-3 border-b-2 border-purple-200 text-left text-sm font-semibold text-purple-700 uppercase tracking-wider">Email</th>
                    <th className="px-4 py-3 border-b-2 border-purple-200 text-left text-sm font-semibold text-purple-700 uppercase tracking-wider">Role</th>
                    <th className="px-4 py-3 border-b-2 border-purple-200 text-center text-sm font-semibold text-purple-700 uppercase tracking-wider rounded-tr-lg">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {allUsers.length > 0 ? (
                    allUsers.map(user => (
                      <motion.tr
                        key={user._id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: 0.1 * allUsers.indexOf(user) }}
                        className="border-b border-gray-100 hover:bg-gray-50"
                      >
                        <td className="px-4 py-3 text-gray-800 flex items-center">
                          <RiUserFill className="mr-2 text-gray-500" /> {user.fullname}
                        </td>
                        <td className="px-4 py-3 text-gray-600">{user.email}</td>
                        <td className="px-4 py-3">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${user.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'}`}>
                            {user.role}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-center">
                          {user.role !== 'admin' ? (
                            <motion.button
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => promoteToAdmin(user._id)}
                              className="text-sm bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-all duration-200 flex items-center justify-center mx-auto"
                              disabled={adminActionLoading === user._id}
                            >
                              {adminActionLoading === user._id ? (
                                <svg className="animate-spin h-4 w-4 text-white mr-2" viewBox="0 0 24 24">
                                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                              ) : (
                                'Promote to Admin'
                              )}
                            </motion.button>
                          ) : (
                            <motion.button
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => promoteToUser(user._id)}
                              className="text-sm bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-all duration-200 flex items-center justify-center mx-auto"
                              disabled={adminActionLoading === user._id}
                            >
                              {adminActionLoading === user._id ? (
                                <svg className="animate-spin h-4 w-4 text-white mr-2" viewBox="0 0 24 24">
                                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                              ) : (
                                'Demote to User'
                              )}
                            </motion.button>
                          )}
                        </td>
                      </motion.tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="px-4 py-6 text-center text-gray-500">No users found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}
      </div>
    </>
  );
};

export default SettingsPage;