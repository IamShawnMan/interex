const { DataTypes } = require("sequelize");
const sequelize = require("../../core/config/database/database");
const UserModel = require("../user/User");
const Package = sequelize.define(
  "package",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    packageTotalPrice: DataTypes.INTEGER,
  },
  { underscored: true }
);

UserModel.hasOne(Package, { as: "package", foreignKey: "storeOwnerId" });
Package.belongsTo(UserModel, { as: "storeOwner" });

module.exports = Package;
