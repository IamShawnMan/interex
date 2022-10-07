const {DataTypes} = require("sequelize")
const sequelize = require("../../core/config/database/database")
const {hash} = require("bcrypt")
const userRole = require("../../core/utils/userENUM")

const User = sequelize.define("user", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    firstName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    lastName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    phoneNumber: {
        type: DataTypes.STRING,
        allowNull: false
    },
    passportNumber: {
        type: DataTypes.STRING,
        allowNull: false
    },
    username: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    userRole: {
        type: DataTypes.ENUM(Object.values(userRole)),
        allowNull: false
    },
    // chatId: {
    //     type: DataTypes.INTEGER
    // },
    // userStatus: {
    //     type: DataTypes.ENUM(Object.values(userStatus))
    // }
}, {
    underscored: true,
    hooks: {
        async beforeCreate(user) {
            user.password = await hash(user.password, 8)
        }
    }
})

module.exports = User