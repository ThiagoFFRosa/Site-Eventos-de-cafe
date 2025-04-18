const express = require('express');
const router = express.Router();
const UserController = require('../controllers/UserController');

router.post('/login', UserController.login);
router.post('/logout', UserController.logout);
router.post('/register', UserController.register);


module.exports = router;
