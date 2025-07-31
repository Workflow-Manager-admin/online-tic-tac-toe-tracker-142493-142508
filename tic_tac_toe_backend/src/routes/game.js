const express = require('express');
const gameController = require('../controllers/game');
const auth = require('../middleware/auth');

const router = express.Router();

/**
 * @swagger
 * /games:
 *   post:
 *     summary: Start new game
 *     tags:
 *       - Games
 *     security:
 *       - bearerAuth: []
 */
router.post('/', auth, gameController.createGame);

/**
 * @swagger
 * /games/{id}:
 *   get:
 *     summary: Get game detail
 *     tags:
 *       - Games
 */
router.get('/:id', auth, gameController.getGame);

/**
 * @swagger
 * /games/{id}/move:
 *   post:
 *     summary: Play a move
 *     tags:
 *       - Games
 *     security:
 *       - bearerAuth: []
 */
router.post('/:id/move', auth, gameController.playMove);

/**
 * @swagger
 * /games/user/{username}:
 *   get:
 *     summary: Get all games for user
 *     tags:
 *       - Games
 */
router.get('/user/:username', auth, gameController.userGames);

module.exports = router;
