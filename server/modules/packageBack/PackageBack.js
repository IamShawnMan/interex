const { DataTypes } = require("sequelize");
const sequelize = require("../../core/config/database/database");
const UserModel = require("../user/User");
const statusPackages = require("../../core/constants/packageStatus")
const OrderModel = require("../order/Order");
const Order = require("../order/Order");
const PackageBack = sequelize.define(
  "packageBack",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    packageTotalPrice: {
      type: DataTypes.INTEGER,
    },
    packageStatus: {
      type: DataTypes.ENUM([statusPackages.STATUS_REJ_NEW, statusPackages.STATUS_REJ_OLD]),
      defaultValue: statusPackages.STATUS_REJ_NEW
    }
  },
  { underscored: true }
);


UserModel.hasOne(PackageBack, { as: "packageBack", foreignKey: "storeOwnerId" });
PackageBack.belongsTo(UserModel, { as: "storeOwner" });

PackageBack.hasMany(OrderModel, {as: "rejOrders", foreignKey: "packageBackId"})
OrderModel.belongsTo(PackageBack, {as: "packageBack"})

module.exports = PackageBack;

