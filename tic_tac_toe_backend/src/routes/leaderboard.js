const express = require('express');
const leaderboardController = require('../controllers/leaderboard');

const router = express.Router();

/**
 * @swagger
 * /leaderboard:
 *   get:
 *     summary: Get leaderboard
 *     tags:
 *       - Leaderboard
 */
router.get('/', leaderboardController.leaderboard);

module.exports = router;
