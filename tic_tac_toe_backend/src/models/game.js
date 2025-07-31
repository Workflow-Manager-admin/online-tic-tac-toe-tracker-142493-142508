/**
 * Game model logic for Tic Tac Toe.
 */

function createNewGame({ playerX, playerO, mode = 'PVP' }) {
  return {
    playerX, // userId or 'computer'
    playerO,
    mode, // 'PVP' or 'PVC'
    moves: [], // array of { x, y, by, time }
    board: [
      ['', '', ''],
      ['', '', ''],
      ['', '', ''],
    ],
    nextTurn: 'X',
    winner: null,
    status: 'active', // active, completed
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}

function applyMove(game, move) {
  const { x, y, by } = move;
  if (game.board[x][y]) throw new Error('Cell already occupied');
  const piece = game.nextTurn;
  game.board[x][y] = piece;
  game.moves.push({ x, y, by, time: new Date() });
  game.nextTurn = (piece === 'X' ? 'O' : 'X');
  game.updatedAt = new Date();
  // Check for winner
  const result = checkForWinner(game.board);
  if (result) {
    game.winner = result;
    game.status = 'completed';
  } else if (isBoardFull(game.board)) {
    game.winner = 'Draw';
    game.status = 'completed';
  }
}

/**
 * Returns 'X', 'O', or null
 */
function checkForWinner(board) {
  const lines = [
    // rows
    [0, 0, 0, 1, 0, 2],
    [1, 0, 1, 1, 1, 2],
    [2, 0, 2, 1, 2, 2],
    // columns
    [0, 0, 1, 0, 2, 0],
    [0, 1, 1, 1, 2, 1],
    [0, 2, 1, 2, 2, 2],
    // diagonals
    [0, 0, 1, 1, 2, 2],
    [0, 2, 1, 1, 2, 0],
  ];
  for (const [x1, y1, x2, y2, x3, y3] of lines) {
    if (
      board[x1][y1] &&
      board[x1][y1] === board[x2][y2] &&
      board[x1][y1] === board[x3][y3]
    ) {
      return board[x1][y1];
    }
  }
  return null;
}

function isBoardFull(board) {
  return board.every(row => row.every(cell => cell));
}

module.exports = {
  createNewGame,
  applyMove,
  checkForWinner,
  isBoardFull,
};
