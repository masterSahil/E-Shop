const express = require('express');
const router = express.Router();
const cartController = require('../controller/cartController');

router.get('/carts', cartController.getCart);
router.post('/carts', cartController.createCart);
router.put('/carts/:id', cartController.updatedCart);
router.delete('/carts/:id', cartController.deleteCart);

router.put('/carts/product/:productId', cartController.updateCartByProductId);

module.exports = router;