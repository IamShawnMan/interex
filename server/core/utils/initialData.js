const { Op } = require("sequelize");
const User = require("../../modules/user/User");
const catchAsync = require("./catchAsync");
const userRole = require("../constants/userRole");
const Region = require("../../modules/region/Region");
const regionJson = require("../../modules/region/regions.json");

 module.exports = catchAsync(async()=>{
    const haveRegion = await Region.count()
    if(haveRegion===0){
        const createdRegion = await Region.bulkCreate(regionJson);
        console.log(createdRegion);
    }
    
    const superAdminCount = await User.count({
        where:{userRole:{[Op.eq]: userRole.SUPER_ADMIN}}
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
      const createdUser = await User.create(superAdminInfo)
    }
})

