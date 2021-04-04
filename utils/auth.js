const { sign } = require('jsonwebtoken');
require('dotenv').config();

const revokeRefreshTokensForUser = async (user) => {
  user.tokenVersion++;
  await user.save({ fields: ['tokenVersion']});
};

const createRefreshToken = async (user) => {
  await revokeRefreshTokensForUser(user);
  return sign({ userId: user.id, tokenVersion: user.tokenVersion }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '7d' });
};

const sendRefreshToken = (res, token) => {
  res.cookie('jid', token, {
    httpOnly: true,
  });
};

module.exports = { createRefreshToken, sendRefreshToken, revokeRefreshTokensForUser };
