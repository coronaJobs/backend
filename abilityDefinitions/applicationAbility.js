const { db } = require("./../src/models");

const applicationAbility = (ability, currentUser) => {
  if (currentUser) {
    ability.createAbility(db.application, "create", async (params) => {
      const role = await currentUser.getRole();
      return role.name == "employee";
    });

    ability.createAbility(db.application, "cancel", async (params) => {
      const role = await currentUser.getRole();
      return role.name == "employee";
    });
  }
};

module.exports = { applicationAbility };
