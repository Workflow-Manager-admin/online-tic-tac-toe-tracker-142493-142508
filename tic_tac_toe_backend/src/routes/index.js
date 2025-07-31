const express = require('express');
const healthController = require('../controllers/health');

const userRoutes = require('./user');
const gameRoutes = require('./game');
const leaderboardRoutes = require('./leaderboard');

const router = express.Router();

// Health endpoint
router.get('/', healthController.check.bind(healthController));

router.use('/users', userRoutes);
router.use('/games', gameRoutes);
router.use('/leaderboard', leaderboardRoutes);

module.exports = router;
