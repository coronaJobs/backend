"use strict";
module.exports = (sequelize, DataTypes) => {
  const post = sequelize.define("post", {
    name: DataTypes.STRING,
    description: DataTypes.STRING,
    applicantLimit: DataTypes.INTEGER,
    active: { type: DataTypes.BOOLEAN, defaultValue: true },
  });

  post.associate = (models) => {
    post.belongsTo(models.user, {
      foreignKey: "ownerId",
      as: "owner",
    });
    post.belongsTo(models.postState, {
      foreignKey: "stateId",
      as: "state",
    });
    post.belongsToMany(models.user, {
      through: "application",
      as: "applicants",
      foreignKey: "offerId",
    });
    post.belongsToMany(models.user, {
      through: "employment",
      as: "employees",
      foreignKey: "jobId",
    });
  };

  return post;
};
