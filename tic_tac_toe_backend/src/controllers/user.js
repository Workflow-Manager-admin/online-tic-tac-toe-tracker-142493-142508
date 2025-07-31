const userService = require('../services/user');

/**
 * Controller for user registration, login, profile endpoints.
 */
class UserController {
  /**
   * PUBLIC_INTERFACE
   * Registers user with username and password.
   */
  async register(req, res) {
    try {
      const { username, password } = req.body;
      if (!username || !password) return res.status(400).json({ error: 'Username and password required' });
      const result = await userService.register(username, password);
      res.json(result);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }

  /**
   * PUBLIC_INTERFACE
   * Authenticates user (returns JWT & profile).
   */
  async login(req, res) {
    try {
      const { username, password } = req.body;
      if (!username || !password) return res.status(400).json({ error: 'Username and password required' });
      const result = await userService.login(username, password);
      res.json(result);
    } catch (err) {
      res.status(401).json({ error: err.message });
    }
  }

  /**
   * PUBLIC_INTERFACE
   * Gets user profile, authenticated.
   */
  async me(req, res) {
    try {
      const username = req.user.username;
      const result = await userService.getUserByUsername(username);
      res.json(result);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }
}

module.exports = new UserController();
