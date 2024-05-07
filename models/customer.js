"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Customer extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Customer.belongsTo(models.User, { foreignKey: "userId" });
    }
  }
  Customer.init(
    {
      firstname: DataTypes.STRING,
      lastname: DataTypes.STRING,
      photo: {
        type: DataTypes.STRING,
        defaultValue: "eastendprep.org/wp-content/uploads/2016/06/noavatar.jpg",
      },
      phoneNumber: DataTypes.STRING,
      address: DataTypes.STRING,
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notNull: {
            msg: "UserId required",
          },
          notEmpty: {
            msg: "UserId required",
          },
        },
      },
    },
    {
      sequelize,
      modelName: "Customer",
    }
  );
  return Customer;
};
