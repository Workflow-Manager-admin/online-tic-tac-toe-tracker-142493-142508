const gameService = require('../services/game');

class GameController {
  /**
   * PUBLIC_INTERFACE
   * POST /games - Create new game session
   */
  async createGame(req, res) {
    try {
      const { opponentType } = req.body; // 'human' or 'computer'
      const mode = opponentType === 'computer' ? 'PVC' : 'PVP';
      const playerX = req.user.username;
      let playerO = opponentType === 'human' ? req.body.opponent : 'computer';
      if (!playerO) playerO = 'computer';
      const result = await gameService.createGame({ playerX, playerO, mode });
      res.json(result);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }

  /**
   * PUBLIC_INTERFACE
   * GET /games/:id - fetch game by id
   */
  async getGame(req, res) {
    try {
      const game = await gameService.getGame(req.params.id);
      if (!game) return res.status(404).json({ error: 'Game not found' });
      res.json(game);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }

  /**
   * PUBLIC_INTERFACE
   * POST /games/:id/move - make a move
   */
  async playMove(req, res) {
    try {
      const { x, y } = req.body;
      const gameId = req.params.id;
      const username = req.user.username;
      const game = await gameService.playMove({ gameId, x, y, by: username });
      res.json(game);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }

  /**
   * PUBLIC_INTERFACE
   * GET /games/user/:username - user's games
   */
  async userGames(req, res) {
    try {
      const username = req.params.username;
      const result = await gameService.listUserGames(username);
      res.json(result);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }
}

module.exports = new GameController();
