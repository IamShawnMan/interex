const {DataTypes} = require("sequelize");
const sequelize = require("../../core/config/database/database");

const Region = sequelize.define("region",{
    id:{
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey:true
    },
    name:{
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
    }
})

module.exports = Region;