const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../model/user');

router.get('/loginVerify', async (req, res) => {
  try {
    const token = req.cookies.authToken;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Not logged in',
      });
    }

    const decoded = jwt.verify(token, process.env.JWTSECRET);
    const user = await User.findById(decoded.id).select('-password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid token',
      });
    }

    res.status(200).json({
      success: true,
      user, token,
    });

  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Session expired' + error.message,
    });
  }
});

module.exports = router;