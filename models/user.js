"use strict";
const { hash } = require("../helpers/bcrypt");
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      User.hasMany(models.Product, { foreignKey: "userId" });
      User.hasMany(models.Customer, { foreignKey: "userId" });
    }
  }
  User.init(
    {
      username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: {
          msg: "Username already taken",
        },
        validate: {
          notNull: {
            msg: "Username required",
          },
          notEmpty: {
            msg: "Username required",
          },
        },
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: {
          msg: "Email already taken",
        },
        validate: {
          notNull: {
            msg: "Email or password is required",
          },
          notEmpty: {
            msg: "Email or password is required",
          },
          isEmail: {
            msg: "Email is invalid",
          },
        },
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: "Email or password is required",
          },
          notEmpty: {
            msg: "Email or password is required",
          },
          len: {
            args: 5,
            msg: "Password minimum 5 characters",
          },
        },
      },
      role: {
        type: DataTypes.STRING,
        defaultValue: "Customer",
      },
    },
    {
      sequelize,
      modelName: "User",
    }
  );

  User.beforeCreate((user) => {
    user.password = hash(user.password);
  });

  return User;
};
