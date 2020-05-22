const { db } = require("./../src/models");
const { UserInputError } = require("apollo-server");

const postAbility = (ability, user) => {
  if (user) {
    ability.createAbility(db.post, "create", async (params) => {
      const role = await user.getRole();
      return role.name == "employer";
    });

    ability.createAbility(db.post, "read", async (params) => {
      return true;
    });

    ability.createAbility(db.post, "update", async (params) => {
      return false;
    });

    ability.createAbility(db.post, "delete", async (params) => {
      const { post } = params;

      // validations
      if (!(post instanceof db.post))
        throw new UserInputError(
          "post: params must have a valid post instance"
        );

      const owner = await post.getOwner();
      return owner.id == user.id;
    });
  }
};

module.exports = { postAbility };
