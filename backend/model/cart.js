const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const cartSchema = new Schema({
  image: String,
  name: String,
  desc: String,
  price: Number,
  quantity: Number,
  productId: { type: String, required: true },
  inStock: Boolean,
  userId: { type: Schema.Types.ObjectId, ref: 'UserModel', required: true },
});

cartSchema.index({ productId: 1, userId: 1 }, { unique: true });

module.exports = mongoose.model('CartModel', cartSchema);