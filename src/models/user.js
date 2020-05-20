'use strict'

const bcrypt = require('bcryptjs');

async function buildPasswordHash(instance) {
  if (instance.changed('password')) {
    const salt = await bcrypt.genSalt(Number(process.env.PASSWORD_SALT));
    const hash = await bcrypt.hash(instance.password, salt);
    instance.set('password', hash);
  }
}

module.exports = (sequelize, DataTypes) => {
  const user = sequelize.define('user', {
    rut: DataTypes.STRING,
    name: DataTypes.STRING,
    mail: DataTypes.STRING,
    phone: DataTypes.STRING,
    password: DataTypes.STRING,
    address: DataTypes.STRING,
    profilePicture: DataTypes.STRING,
    resumeUrl: DataTypes.STRING,
    active: {type: DataTypes.BOOLEAN, defaultValue: true},
  });

  user.associate = (models) => {
    user.belongsTo(models.role);
    user.hasMany(models.post, {
      foreignKey: 'ownerId',
      as: 'posts'});
    user.belongsToMany(models.post, {
      through: 'application',
      as: 'offers',
      foreignKey: 'applicantId'
    });
  }
  user.beforeUpdate(buildPasswordHash);
  user.beforeCreate(buildPasswordHash);

  user.prototype.checkPassword = function checkPassword(password) {
    return bcrypt.compare(password, this.password);
  };

  return user;
};