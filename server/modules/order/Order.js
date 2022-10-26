const { DataTypes } = require("sequelize");
const sequelize = require("../../core/config/database/database");
const orderStatus = require("../../core/constants/orderStatus");
const RegiomModel = require("../region/Region");
const PackageModel = require("../package/Package");
const DistrictModel = require("../district/District");
const UserModel = require("../user/User")

const Order = sequelize.define(
	"order",
	{
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true,
		},
		recipient: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		note: DataTypes.TEXT,
		recipientPhoneNumber: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		orderStatus: {
			type: DataTypes.ENUM(Object.values(orderStatus)),
			defaultValue: orderStatus.STATUS_NEW,
			allowNull: false,
		},
		deliveryPrice: DataTypes.INTEGER,
		totalPrice: DataTypes.INTEGER,
	},
	{ underscored: true }
);

RegiomModel.hasMany(Order, { as: "orders", foreignKey: "regionId" });
Order.belongsTo(RegiomModel, { as: "region" });

DistrictModel.hasMany(Order, {as: "orders", foreignKey: "districtId"})
Order.belongsTo(DistrictModel, {as: "district"})

PackageModel.hasMany(Order, { as: "orders", foreignKey: "packageId" });
Order.belongsTo(PackageModel, { as: "package" });

UserModel.hasMany(Order, {as: "order", foreignKey: "storeOwnerId"})
Order.belongsTo(UserModel, {as: "storeOwner"})




module.exports = Order;
