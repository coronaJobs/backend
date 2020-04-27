'use strict'
module.exports = (sequelize, DataTypes) => {
    const user = sequelize.define('user', {
      rut: DataTypes.STRING,
      name: DataTypes.STRING,
      mail: DataTypes.STRING,
      phone: DataTypes.STRING,
      address: DataTypes.STRING,
      profilePicture: DataTypes.STRING,
      resumeUrl: DataTypes.STRING,
      active: {type: DataTypes.BOOLEAN, defaultValue: true},
    });

    user.associate = models => {
      user.hasMany(models.post, {as: 'posts'});
    };

    return user;
  };