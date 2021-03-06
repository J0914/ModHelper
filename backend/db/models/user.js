'use strict';
const { Validator } = require('sequelize');
const bcrypt = require('bcryptjs');

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    modId: {
      type: DataTypes.INTEGER,
      allowNull:false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [6, 256]
      }
    },
    fname: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [2, 30]
      }
    },
    lname: {
      type: DataTypes.STRING(50),
      allowNull: false,
      validate: {
        len: [2, 50]
      }
    },
    photo: {
      type: DataTypes.TEXT,
      allowNull: true,
      validate: {isUrl: true}
    },
    hashedPassword: {
      type: DataTypes.STRING.BINARY,
      allowNull: false,
      validate: {
        len: [60, 60]
      }
    }
  },
  {
    defaultScope: {
      attributes: {
        exclude: ['hashedPassword', 'createdAt', 'updatedAt']
      }
    },
    scopes: {
      currentUser: {
        attributes: { exclude: ['hashedPassword'] }
      },
      loginUser: {
        attributes: {}
      }
    }
  });

  User.associate = function(models) {
    User.belongsTo(models.Mod, {foreignKey: 'modId'})
    User.hasMany(models.Meeting, {foreignKey: 'userId'})
    User.hasMany(models.ProjectWalkthru, {foreignKey: 'userId'})
  };

  User.prototype.toSafeObject = function() { // remember, this cannot be an arrow function
    const { id, email, fname, lname, photo, modId } = this; // context will be the User instance
    return { id, email, fname, lname, photo, modId };
  };

  User.prototype.validatePassword = function (password) {
    return bcrypt.compareSync(password, this.hashedPassword.toString());
   };

  User.getCurrentUserById = async function (id) {
    return await User.scope('currentUser').findByPk(id);
   };
  
   User.login = async function ({ credential, password }) {
    const { Op } = require('sequelize');
    const user = await User.scope('loginUser').findOne({
      where: {
        [Op.or]: {
          email: credential
        }
      }
    });
    if (user && user.validatePassword(password)) {
      return await User.scope('currentUser').findByPk(user.id);
    }
  };

  User.signup = async function (userObj) {
    const hashedPassword = bcrypt.hashSync(userObj.password);
    userObj.hashedPassword = hashedPassword
    const user = await User.create(userObj);
    return await User.scope('currentUser').findByPk(user.id);
  };

  return User;
};