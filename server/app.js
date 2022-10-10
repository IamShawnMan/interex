const express = require("express")
const errorController = require("./modules/error/errorController")
const AppError = require("./core/utils/appError")
const userRouter = require("./modules/user/userRouter")
const regionRouter = require("./modules/region/regionRouter")
const authRouter = require("./modules/auth/authRouter")
const cors = require("cors")
const authMiddleware = require("./core/middlewares/authMiddleware")
require("./modules/user/User")


const app = express()
app.use(express.json())
app.use(cors())

app.use("/api/v1/users", authMiddleware, userRouter)
app.use("/api/v1/auth", authRouter)
app.use("/api/v1/regions", regionRouter)

app.all("*", (req, res, next) => {
    return next(new AppError(`${req.path} yo'li mavjud emas`, 404))
})

app.use(errorController)

module.exports = app 