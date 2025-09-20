const express = require('express');
const router = express.Router();
const productController = require('../controller/productController');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'),
    filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname)),
});

const upload = multer({storage: storage});

router.get('/product', productController.getProduct);
router.get('/single-product/:id', productController.getSingleProduct);
router.post('/product', upload.single('image'), productController.createProduct);
router.put('/product/:id', upload.single('image'), productController.update);
router.delete('/product/:id', productController.deleteProduct);

module.exports = router;