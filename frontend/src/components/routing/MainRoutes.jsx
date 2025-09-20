import React, { useContext, useEffect, useState } from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import LoginForm from '../Registered/Login';
import Dashboard from '../Dashboard';
import SignUpForm from '../Registered/Signup';
import NotFound from '../main/NotFound';
import AdminDash from '../admin/AdminDash';
import EditProduct from '../main/EditProduct';
import CartPage from '../main/CartPage';
import { LoginContext } from '../context/Context';
import axios from 'axios';
import AdminCart from '../admin/AdminCart';
import SettingsPage from '../main/Settings';
import About from '../main/About';

const MainRoutes = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const { isLogin } = useContext(LoginContext);

  const USER_API = import.meta.env.VITE_API_URL;

  const getData = async () => {
    try {
      const res = await axios.get(USER_API);
      const userEmail = localStorage.getItem("email");
      const user = res.data.user;
      const filteredUser = user.find((u) => u.email === userEmail);
      if (filteredUser?.role === 'admin') {
        setIsAdmin(true);
        localStorage.setItem("role", "admin");
      } else {
        setIsAdmin(false);
        localStorage.setItem("role", "user");
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (localStorage.getItem("isLoggedIn")) {
      getData();
    }
  }, [isLogin]);

  const login = localStorage.getItem("isLoggedIn");

  return (
    <Routes>
      {/* Redirect home "/" based on admin or normal user */}
      <Route path="/"
        element={ login ? isAdmin ? <Navigate to="/admin" /> : <Dashboard /> : <SignUpForm /> } />

      {/* Only show /admin route if admin is true */}
      <Route path="/admin" element={isAdmin ? <AdminDash /> : <Navigate to="/" />} />

      {!login && <Route path="/login" element={<LoginForm />} />}

      <Route path="/edit-product/:id" element={<EditProduct />} />
      <Route path="/cart" element={!isAdmin? <CartPage />: <AdminCart />} />
      <Route path="/setting" element={<SettingsPage />} />
      <Route path="/about" element={<About />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default MainRoutes;