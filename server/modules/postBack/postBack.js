const { DataTypes } = require("sequelize");
const sequelize = require("../../core/config/database/database");
const Region = require("../region/Region");
const Order = require("../order/Order");
const postStatus = require("../../core/constants/postStatus");

const PostBack = sequelize.define("postBack", {
	id: {
		type: DataTypes.INTEGER,
		autoIncrement: true,
		primaryKey: true,
	},
	note: {
		type: DataTypes.TEXT,
	},
	postTotalPrice: {
		type: DataTypes.INTEGER,
	},
	regionId: {
		type: DataTypes.INTEGER,
	},
	postStatus: {
		type: DataTypes.ENUM(Object.values(postStatus)),
		defaultValue: postStatus.POST_REJECTED_NEW,
	},
});

Region.hasMany(PostBack, { as: "postbacks" });
PostBack.belongsTo(Region);

PostBack.hasMany(Order, { as: "orders" });
Order.belongsTo(PostBack);

module.exports = PostBack;
