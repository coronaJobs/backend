"use strict";
module.exports = (sequelize, DataTypes) => {
  const employment = sequelize.define("employment", {
    active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    employeeRating: DataTypes.INTEGER,
    employeeComment: DataTypes.STRING,
    employerRating: DataTypes.INTEGER,
    employerComment: DataTypes.STRING,
  });

  return employment;
};
