"use strict";
module.exports = (sequelize, DataTypes) => {
  const employment = sequelize.define("employment", {
    active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  });

  return employment;
};
