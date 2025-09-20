const {Schema, model} = require('mongoose');

const Product = new Schema({
    image: {type: String},
    name: {type: String},
    desc: {type: String},
    price: {type: String},
    token: {type: String},
    inStock: {type: Boolean, default: true},
    productId: {type: String, unique: true},
});

module.exports = model("ProductModel", Product);