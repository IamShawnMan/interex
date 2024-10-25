const { DataTypes } = require("sequelize");
const sequelize = require("../../core/config/database/database");
const User = require("../user/User");

const Debt = sequelize.define(
  "debt",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    debt: {
      type: DataTypes.INTEGER,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  { underscored: true }
);

// Debt.belongsTo(User, { primaryKey: "userId", as: "user" });
module.exports = Debt;
