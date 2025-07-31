const express = require('express');
const userController = require('../controllers/user');
const auth = require('../middleware/auth');

const router = express.Router();

/**
 * @swagger
 * /users/register:
 *   post:
 *     summary: Register new user
 *     tags:
 *       - Users
 */
router.post('/register', userController.register);
/**
 * @swagger
 * /users/login:
 *   post:
 *     summary: Login user
 *     tags:
 *       - Users
 */
router.post('/login', userController.login);
/**
 * @swagger
 * /users/me:
 *   get:
 *     summary: Get own profile
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Users
 */
router.get('/me', auth, userController.me);

module.exports = router;
