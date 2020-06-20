"use strict";
module.exports = (sequelize, DataTypes) => {
  const employment = sequelize.define("employment", {
    paid: { type: DataTypes.BOOLEAN, defaultValue: false },
    active: { type: DataTypes.BOOLEAN, defaultValue: true },
  });

  return employment;
};
