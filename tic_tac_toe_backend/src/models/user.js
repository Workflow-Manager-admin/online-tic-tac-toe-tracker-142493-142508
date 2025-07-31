/**
 * User Model Logic.
 * Handles user document construction and output hygiene.
 */

function publicUserProfile(user) {
  if (!user) return null;
  return {
    id: user._id,
    username: user.username,
    joined: user.createdAt,
    gamesPlayed: user.gamesPlayed || 0,
    gamesWon: user.gamesWon || 0,
    gamesLost: user.gamesLost || 0,
    gamesDrawn: user.gamesDrawn || 0,
  };
}

function createUserDoc(username, hashedPassword) {
  return {
    username,
    password: hashedPassword,
    createdAt: new Date(),
    gamesPlayed: 0,
    gamesWon: 0,
    gamesLost: 0,
    gamesDrawn: 0,
  };
}

module.exports = {
  publicUserProfile,
  createUserDoc,
};
