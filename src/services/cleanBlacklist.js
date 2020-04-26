const db = require('./../models');
const jwt = require('jsonwebtoken');

async function cleanBlacklist() {
  const tokens = await db.blacklist.findAll();
  tokens.forEach(async token => {
    await jwt.verify(token.token, process.env.JWT_KEY, async (err, res) => {
      if (err) {
        await db.blacklist.destroy({ where: { token: token.token } });
      }
    });
  });
}

module.exports = { cleanBlacklist };