const { DataTypes } = require("sequelize")
const sequelize = require("../../core/config/database/database")

const Store = sequelize.define("store", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    storeName: {
        type: DataTypes.STRING
    }
})