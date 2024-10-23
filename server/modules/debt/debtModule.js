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
  },
  { underscored: true }
);

User.hasMany(CouriersDebt, { as: "debt" });
module.exports = Debt;
