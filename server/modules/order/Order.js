const { DataTypes } = require("sequelize");
const sequelize = require("../../core/config/database/database");
const orderStatus = require("../../core/constants/orderStatus");
const RegiomModel = require("../region/Region");

const Order = sequelize.define(
  "order",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    recipient: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    note: DataTypes.TEXT,
    orderStatus: {
      type: DataTypes.ENUM(Object.values(orderStatus)),
      defaultValue: orderStatus.STATUS_NEW,
      allowNull: false,
    },
    deliveryPrice: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 45000,
    },
    totalPrice: DataTypes.INTEGER,
  },
  { underscored: true }
);

RegiomModel.hasMany(Order, { as: "order", foreignKey: "regionId" });
Order.belongsTo(RegiomModel, { as: "region" });

module.exports = Order;
