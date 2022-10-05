const AppError = require("../../core/utils/appError")

const sendErrorDev = (res, err) => {
    res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
        stack: err.stack,
        error: err
    })
}

const sendErrorProd = (res, err) => {
    res.status(err.statusCode).json({
        status: err.status,
        errors: err.errors,
        message: err.message
    })
}

const errorController = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500
    err.status = err.status || "error"

    if(process.env.NODE_ENV === "dev") {
        sendErrorDev(res, err)
    } else if(process.env.NODE_ENV === "prod") {
        if(err.isOperational) {
            res.status(statusCode).json({
                status: err.status,
                message: err.message
            })
        } else {
            let error = Object.create(err)
            if(error.name === "ValidationError") {
                error.errors = error.errors.map(e=>e.msg)
            }
            if(error.name === "SequelizeDatabaseError") {
                if(err.original.code === "22P02") {
                    error = new AppError("O'tkazish xatosi", 400)
                }
            }
            if(error.name === "SequelizeUniqueConstraintError") {
                if(err.original.code === "23505") {
                    error = new AppError("Ushbu qator allaqachon mavjud", 409)
                }
            }
            if(error.name === "TokenExpiredError") {
                error = new AppError("Tokeningizni muddati tugagan", 401)
            }
            sendErrorProd(error, res)
        }
    }
}

module.exports = errorController