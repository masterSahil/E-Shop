const Product = require('../model/products');
const path = require('path');
const fs = require('fs')

function generateUniqueProductId(length = 30) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let id = '';
    for (let i = 0; i < length; i++) {
        id += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return id;
}

module.exports.getProduct = async (req, res) => {
    try {
        const fetched = await Product.find();

        res.status(200).json({
            success: true,
            product: fetched,
        })
    } catch (error) {
        res.status(501).json({
            success: false,
            message: error.message,
        })
    }
}

module.exports.getSingleProduct = async (req, res) => {
    try {
        const {id} = req.params;
        const fetched = await Product.findById(id);

        res.status(200).json({
            success: true,
            product: fetched,
        })
    } catch (error) {
        res.status(501).json({
            success: false,
            message: error.message,
        })
    }
}

module.exports.createProduct = async (req, res) => {
    try {
        const { name, desc, price, inStock, } = req.body;
        const token = req.cookies.authToken;

        const newProduct = new Product({ image: req.file.filename, name, desc, price, inStock, token, productId: generateUniqueProductId() });

        await newProduct.save();
        console.log("Saved product:", newProduct);

        res.status(200).json({
            success: true,
            product: newProduct,
        });
    } catch (error) {
        res.status(501).json({
            success: false,
            message: error.message,
        });
    }
};

module.exports.update = async (req, res) => {
    try {
        const { name, desc, price, inStock } = req.body;
        const product = await Product.findById(req.params.id);

        if (!product) return res.status(404).json({ message: "Product not found" });

        // ✅ 1. Delete old image from server if a new one is uploaded
        if (req.file && product.image) {
            const oldImagePath = path.join(__dirname, '../uploads', product.image);
            if (fs.existsSync(oldImagePath)) {
                fs.unlinkSync(oldImagePath);
            }
        }

        // ✅ 2. Update product fields
        product.name = name;
        product.desc = desc;
        product.price = price;
        product.inStock = inStock === 'true' ? true : false;

        if (req.file) {
            product.image = req.file.filename; // Update with new filename
        }

        await product.save();
        res.json({ message: "Product updated successfully", product });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
}

module.exports.deleteProduct = async (req, res) => {
    try {
        const {id} = req.params;
        const removed = await Product.findByIdAndDelete(id);

        if (removed.image) {
            const file_path = path.join(__dirname, '../uploads/', removed.image);
            if (fs.existsSync(file_path)) {
                fs.unlinkSync(file_path);
            }
        }

        res.status(200).json({
            success: true,
            product: removed,
        })
    } catch (error) {
        res.status(501).json({
            success: false,
            message: error.message,
        })
    }
}
