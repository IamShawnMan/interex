const { Op } = require("sequelize");
const User = require("../../modules/user/User");
const catchAsync = require("./catchAsync");
const userENUM = require("../utils/userENUM")

 module.exports =  catchAsync(async()=>{
    const superAdminCount = await User.count({
        where:{userRole:{[Op.eq]: userENUM.SUPER_ADMIN}}
    })
    if(superAdminCount===0){
        const superAdminInfo = {
            firstName: "Bekzod",
            lastName: "Ismatov",
            phoneNumber: "+998906479794",
            passportNumber: "AB4332323",
            username: "myusername",
            password: "19981998",
            userRole: "SUPER_ADMIN"
        }

      const createdUser = await  User.create(superAdminInfo)
    }
   


})