const { db } = require("./../src/models");

const communeAbility = (ability, user) => {
  if (user) {
    ability.createAbility(db.commune, "read");
  }
};

module.exports = { communeAbility };
