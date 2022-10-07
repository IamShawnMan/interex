const { Op } = require("sequelize");
const User = require("../../modules/user/User");
const catchAsync = require("./catchAsync");


 module.exports =  catchAsync(async()=>{
    const superAdmin = await User.count({
        where:{userRole:{[Op.eq]:"SUPER_ADMIN"}}
    })
    if(superAdmin===0){
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
      console.log(createdUser);
    }
   


})