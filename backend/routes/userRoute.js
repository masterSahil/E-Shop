const express = require('express');
const router = express.Router();
const userController = require('../controller/userController');

router.get('/user', userController.getUser);
router.post('/user', userController.createUser);
router.put('/user/:id', userController.update);
router.delete('/user/:id', userController.deletedUser);

router.get('/remove-cookie', userController.removeCookie);
router.post('/compare', userController.compare);

// Token is URL encoded, express decodes automatically
router.get('/getuser/:token', userController.getCartUserName);
router.get('/user/:id', userController.getSingleUser); 

module.exports = router;