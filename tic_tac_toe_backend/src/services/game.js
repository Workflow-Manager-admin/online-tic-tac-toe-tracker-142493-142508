const { getCollection } = require('./db');
const { createNewGame, applyMove } = require('../models/game');
const { ObjectId } = require('mongodb');
const usersService = require('./user');

const GAMES_COLLECTION = 'games';

/**
 * PUBLIC_INTERFACE
 * Create a new Tic Tac Toe game.
 * mode: 'PVP' or 'PVC' (vs computer)
 * Returns created game doc.
 */
async function createGame({ playerX, playerO, mode }) {
  const games = await getCollection(GAMES_COLLECTION);
  const gameDoc = createNewGame({ playerX, playerO, mode });
  const { insertedId } = await games.insertOne(gameDoc);
  return { ...gameDoc, _id: insertedId };
}

/**
 * PUBLIC_INTERFACE
 * Get game data by ID, including moves.
 */
async function getGame(id) {
  const games = await getCollection(GAMES_COLLECTION);
  const game = await games.findOne({ _id: new ObjectId(id) });
  return game;
}

// Partial move validation done here
/**
 * PUBLIC_INTERFACE
 * Play a move (must be authorized user)
 * move: { gameId, x, y, by }
 * Returns game state after move
 */
async function playMove({ gameId, x, y, by }) {
  const games = await getCollection(GAMES_COLLECTION);
  const game = await getGame(gameId);
  if (!game) throw new Error('Game not found');
  if (game.status !== 'active') throw new Error('Game completed');
  if (game.board[x][y]) throw new Error('Cell occupied');
  if (
    (game.nextTurn === 'X' && by !== game.playerX) ||
    (game.nextTurn === 'O' && by !== game.playerO)
  ) throw new Error('Not this user\'s turn');
  applyMove(game, { x, y, by });
  await games.updateOne({ _id: new ObjectId(gameId) }, { $set: { board: game.board, moves: game.moves, nextTurn: game.nextTurn, winner: game.winner, status: game.status, updatedAt: new Date() } });
  // After game completed, update users
  if (game.status === 'completed') {
    await updatePlayerStats(game);
  }
  return game;
}

/**
 * Only called after game is completed.
 */
async function updatePlayerStats(game) {
  if (!game.playerX || !game.playerO) return;
  const users = await getCollection('users');
  await users.updateOne({ username: game.playerX }, { $inc: { gamesPlayed: 1, gamesWon: game.winner === 'X' ? 1 : 0, gamesLost: game.winner === 'O' ? 1 : 0, gamesDrawn: game.winner === 'Draw' ? 1 : 0 } });
  await users.updateOne({ username: game.playerO }, { $inc: { gamesPlayed: 1, gamesWon: game.winner === 'O' ? 1 : 0, gamesLost: game.winner === 'X' ? 1 : 0, gamesDrawn: game.winner === 'Draw' ? 1 : 0 } });
}

/**
 * PUBLIC_INTERFACE
 * List a user's games (by username).
 */
async function listUserGames(username) {
  const games = await getCollection(GAMES_COLLECTION);
  return await games.find({ $or: [{ playerX: username }, { playerO: username }] }).sort({ createdAt: -1 }).toArray();
}

/**
 * PUBLIC_INTERFACE
 * List leaderboard: top N users by games won.
 */
async function getLeaderboard(topN = 10) {
  const users = await getCollection('users');
  const cursor = users.find().sort({ gamesWon: -1, gamesPlayed: 1 }).limit(topN);
  const result = await cursor.toArray();
  return result.map(u => ({
    username: u.username,
    gamesPlayed: u.gamesPlayed,
    gamesWon: u.gamesWon,
    gamesLost: u.gamesLost,
    gamesDrawn: u.gamesDrawn,
  }));
}

module.exports = {
  createGame,
  getGame,
  playMove,
  listUserGames,
  getLeaderboard,
};
