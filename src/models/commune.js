"use strict";
module.exports = (sequelize, DataTypes) => {
  const commune = sequelize.define("commune", {
    name: DataTypes.STRING,
  });

  commune.associate = (models) => {
    commune.hasMany(models.post);
  };

  return commune;
};
