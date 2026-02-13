const User = require('../model/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const ms = require('ms');
require('dotenv').config();

module.exports.getUser = async (req, res) => {
    try {
        const fetched = await User.find();
        res.status(200).json({ success: true, user: fetched });
    } catch (error) {
        res.status(501).json({ success: false, message: error.message });
    }
}

module.exports.createUser = async (req, res) => {
    try {
        const { password, email, fullname } = req.body;
        if (!password || !email) {
            return res.status(400).json({ success: false, message: "Email and password are required" });
        }
        const hash = await bcrypt.hash(password, 10);

        const newUser = new User({ password: hash, email, fullname });
        await newUser.save();
        res.status(200).json({ success: true, user: newUser });
    } catch (error) {
        res.status(501).json({ success: false, message: error.message });
    }
}

module.exports.update = async (req, res) => {
    try {
        const { password, email, fullname, role } = req.body;
        const { id } = req.params;
        bcrypt.hash(password, 10, async (err, hash) => {
            const updatedUser = await User.findByIdAndUpdate(id, { password: hash, email, fullname, role }, { new: true });
            res.status(200).json({ success: true, user: updatedUser });
        });
    } catch (error) {
        res.status(501).json({ success: false, message: error.message });
    }
}

module.exports.deletedUser = async (req, res) => {
    try {
        const { id } = req.params;
        const removed = await User.findByIdAndDelete(id);
        res.status(200).json({ success: true, user: removed });
    } catch (error) {
        res.status(501).json({ success: false, message: error.message });
    }
}

module.exports.compare = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Email and password are required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const isMatched = await bcrypt.compare(password, user.password);

    if (isMatched) {
      const token = jwt.sign(
        { id: user._id, email: user.email, role: user.role },
        process.env.JWTSECRET,
        { expiresIn: "7d" }
      );

      res.cookie("authToken", token, {
        maxAge: ms("7d"),
        httpOnly: true,
        sameSite: "none",
        secure: true,
      });

      await User.findByIdAndUpdate(user._id, { token: token });
      return res.status(200).json({ success: true, message: "Password matched" });
    } else {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


module.exports.removeCookie = async (req, res) => {
    try {
        res.clearCookie("authToken", { httpOnly: true, sameSite: "none", secure: true });
        res.status(200).json({ success: true, message: "Logged out successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

module.exports.getCartUserName = async (req, res) => {
    try {
        // Express automatically decodes URL params, no manual decode needed
        const user = await User.findOne({ token: req.params.token });
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        res.json({ success: true, user });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
}

module.exports.getSingleUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    res.status(200).json({ success: true, user });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
