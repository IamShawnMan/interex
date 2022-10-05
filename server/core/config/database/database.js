const {Sequelize} = require("sequelize")
const vars = process.env

const databaseConfig = {
    host: vars.DB_HOST,
    port: vars.DB_PORT,
    database: vars.DB_NAME,
    username: vars.DB_USER,
    password: vars.DB_PASSWORD,
    dialect: vars.DB_DIALECT
}

const database = new Sequelize(databaseConfig)

module.exports = database