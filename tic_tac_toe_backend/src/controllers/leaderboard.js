const gameService = require('../services/game');

/**
 * Controller for leaderboard endpoint.
 */
class LeaderboardController {
  /**
   * PUBLIC_INTERFACE
   * GET /leaderboard
   */
  async leaderboard(req, res) {
    try {
      const topN = Number(req.query.top) || 10;
      const result = await gameService.getLeaderboard(topN);
      res.json(result);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }
}

module.exports = new LeaderboardController();
