const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { getCollection } = require('./db');
const { createUserDoc, publicUserProfile } = require('../models/user');

const USERS_COLLECTION = 'users';

/**
 * PUBLIC_INTERFACE
 * Registers a user, returns JWT token.
 */
async function register(username, password) {
  const users = await getCollection(USERS_COLLECTION);
  const existing = await users.findOne({ username: { $regex: new RegExp(`^${username}$`, 'i') } });
  if (existing) throw new Error('Username already taken');
  const hash = await bcrypt.hash(password, 10);
  const userDoc = createUserDoc(username, hash);
  const { insertedId } = await users.insertOne(userDoc);
  const user = await users.findOne({ _id: insertedId });
  return { user: publicUserProfile(user), token: generateJWT(user) };
}

/**
 * PUBLIC_INTERFACE
 * Authenticates user credentials, returns JWT.
 */
async function login(username, password) {
  const users = await getCollection(USERS_COLLECTION);
  const user = await users.findOne({ username: { $regex: new RegExp(`^${username}$`, 'i') } });
  if (!user) throw new Error('Invalid username or password');
  const match = await bcrypt.compare(password, user.password);
  if (!match) throw new Error('Invalid username or password');
  return { user: publicUserProfile(user), token: generateJWT(user) };
}

/**
 * PUBLIC_INTERFACE
 * Retrieves public data for user by id or username.
 */
async function getUserById(id) {
  const users = await getCollection(USERS_COLLECTION);
  const user = await users.findOne({ _id: id });
  return publicUserProfile(user);
}

async function getUserByUsername(username) {
  const users = await getCollection(USERS_COLLECTION);
  const user = await users.findOne({ username: { $regex: new RegExp(`^${username}$`, 'i') } });
  return publicUserProfile(user);
}

/**
 * Generate JWT for user.
 */
function generateJWT(user) {
  const payload = { id: user._id, username: user.username };
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '12h' });
}

module.exports = {
  register,
  login,
  getUserById,
  getUserByUsername,
};
