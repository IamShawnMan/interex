const { DataTypes } = require("sequelize");
const db = require("../../core/config/database/database");
const User = require("../user/User");

const Finance = db.define("finance", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  finance: {
    type: DataTypes.INTEGER,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: "id",
    },
  },
});

Finance.belongsTo(User, { foreignKey: "userId", as: "user" });
User.hasHooks(Finance, { foreignKey: "userId", as: "finances" });

module.exports = Finance;
