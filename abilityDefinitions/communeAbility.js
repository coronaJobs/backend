const { db } = require("./../src/models");

const communeAbility = (ability, currentUser) => {
  if (currentUser) {
    ability.createAbility(db.commune, "read");
  }
};

module.exports = { communeAbility };
