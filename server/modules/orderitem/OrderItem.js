const { DataTypes } = require("sequelize");
const sequelize = require("../../core/config/database/database");
const Order = require("../order/Order");

const OrderItem = sequelize.define(
  "orderItem",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    productName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    quantity: {
      type: DataTypes.INTEGER,
      defaultValue: 1,
      allowNull: false,
    },
    price: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    orderItemTotalPrice: DataTypes.INTEGER,
  },
  { underscored: true }
);

Order.hasMany(OrderItem, { as: "items", foreignKey: "orderId" });
OrderItem.belongsTo(Order, { as: "order" });

module.exports = OrderItem;
