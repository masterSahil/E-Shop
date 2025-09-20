const CartSchema = require('../model/cart');
const jwt = require('jsonwebtoken');
const User = require('../model/user');

module.exports.getCart = async (req, res) => {
    try {
        const userCart = await CartSchema.find();

        res.status(200).json({
            success: true,
            cart: userCart,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

module.exports.createCart = async (req, res) => {
  try {
    const { image, name, desc, price, quantity, productId, inStock } = req.body;

    const token = req.cookies.authToken;
    if (!token) return res.status(401).json({ success: false, message: 'No token provided' });

    const decoded = jwt.verify(token, process.env.JWTSECRET);
    const user = await User.findById(decoded.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    const existingCart = await CartSchema.findOne({ productId, userId: user._id });
    if (existingCart) {
      return res.status(409).json({ success: false, message: "Product already in cart" });
    }

    const newCart = new CartSchema({
      image,
      name,
      desc,
      price,
      quantity,
      productId,
      inStock,
      userId: user._id
    });

    await newCart.save();

    res.status(200).json({
      success: true,
      cart: newCart,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports.updatedCart = async (req, res) => {
  try {
    const { id } = req.params;
    const { quantity, inStock } = req.body;

    const cartUpdate = await CartSchema.findByIdAndUpdate(id, { quantity, inStock }, { new: true });

    res.status(200).json({
      success: true,
      cart: cartUpdate,
    });
  } catch (error) {
    console.error("Cart Update Error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports.deleteCart = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await CartSchema.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      cart: deleted,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// NEW function to update all carts with given productId
module.exports.updateCartByProductId = async (req, res) => {
  try {
    const { productId } = req.params;
    const { inStock, quantity } = req.body;

    const result = await CartSchema.updateMany(
      { productId },
      { inStock, quantity }
    );

    res.status(200).json({
      success: true,
      modifiedCount: result.modifiedCount,
      message: `${result.modifiedCount} cart items updated`
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};