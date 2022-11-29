const excelJS = require("exceljs");
const catchAsync = require("../../core/utils/catchAsync");
const QueryBuilder = require("../../core/utils/QueryBuilder")
const regionsJSON = require("../region/regions.json");
const districtsJSON = require("../district/districts.json");
const User = require("../user/User");
const Order = require("../order/Order");
const userRoles = require("../../core/constants/userRole")
const {Op} = require("sequelize")
const orderStatuses = require("../../core/constants/orderStatus")
const Region = require("../region/Region")
const userStatuses = require("../../core/constants/userStatus")

exports.exportOrders = catchAsync(async (req, res, next) => {
    const {regionId, userRole, id} = req.user
	const workbook = new excelJS.Workbook();
	const worksheet = workbook.addWorksheet("orders");
	worksheet.columns = [
		{ header: "No", key: "s_no", width: 20 },
		{ header: "Id", key: "id", width: 20 },
		{ header: "Viloyati", key: "regionId", width: 30 },
		{ header: "Tumani", key: "districtId", width: 30 },
		{ header: "Firma", key: "storeOwnerId", width: 30 },
		{ header: "Telefon raqami", key: "recipientPhoneNumber", width: 20 },
		{ header: "Holati", key: "orderStatusUz", width: 30 },
		{ header: "Tovar summasi", key: "totalPrice", width: 20 },
		{ header: "Yetkazish narxi", key: "deliveryPrice", width: 20 },
        { header: "Xizmat narxi", key: "recipient", width: 20 },
		{ header: "Firma puli", width: 20 },
		{ header: "Daromad", width: 20 },
		{ header: "Yaratilgan sana", key: "createdAt", width: 20 },
		{ header: "Izoh", key: "note", width: 120 },
	];
	const queryBuilder = new QueryBuilder(req.query);
	queryBuilder.filter();
	let downloadOrders = await Order.findAndCountAll(
		queryBuilder.queryOptions
	);
	let regionName = "Barcha viloyatlar"
    let storeName = "Barcha firmalar"
	let orderDate = ""
	req.query.createdAt ? orderDate = new Date(req.query.createdAt["eq"]).toLocaleString().split(",")[0]: ""
	const region = await Region.findOne({
		attributes: ["id", "name"],
		where: {
		  id: {
			[Op.eq]: regionId,
		  },
		},
	  });
    if(userRole === userRoles.COURIER) {
		if (region?.name === "Samarqand viloyati") {
			queryBuilder.queryOptions.where = {
				regionId: {[Op.eq]: regionId},
				districtId: {[Op.notIn]: [101, 106]},
				...queryBuilder.queryOptions.where
			}
		}
		else if(region?.name === "Navoiy viloyati") {
			queryBuilder.queryOptions.where = {
				[Op.or] : {
					regionId: {[Op.eq]: regionId},
					districtId: {[Op.in]: [101, 106]}
				},
				...queryBuilder.queryOptions.where
			}
		}
		else if(region?.name === "Xorazm viloyati") {
			queryBuilder.queryOptions.where = {	
				regionId: {
					[Op.or]: [1, 13]
				},
				...queryBuilder.queryOptions.where
			}
		}
		else {
			queryBuilder.queryOptions.where = {
				regionId: {[Op.eq]: regionId},
				...queryBuilder.queryOptions.where
			}
		}
        downloadOrders = await Order.findAndCountAll(queryBuilder.queryOptions)
    }
    if(userRole === userRoles.STORE_OWNER) {
		queryBuilder.queryOptions.where = {
			storeOwnerId: {[Op.eq]: id},
			...queryBuilder.queryOptions.where
		}
        downloadOrders = await Order.findAndCountAll(queryBuilder.queryOptions)
    }
    let downloadCandidate = await User.findAll()
	let customUserforDistrict = await User.findOne({
		where: {
			userRole: {[Op.eq]: userRoles.COURIER},
			regionId: {[Op.eq]: 6},
			status: {[Op.eq]: userStatuses.ACTIVE}
		}
	})
	let customUserforRegion = await User.findOne({
		where: {
			userRole: {[Op.eq]: userRoles.COURIER},
			regionId: {[Op.eq]: 13},
			status: {[Op.eq]: userStatuses.ACTIVE}
		}
	})

	downloadOrders.rows.forEach(order => {
    order.recipient = ""
    downloadCandidate.forEach(candidate => {
      if(order.storeOwnerId == candidate.id) {
        order.storeOwnerId = candidate.storeName
      }
      if(req.query.storeOwnerId == candidate.id) {
        storeName = candidate.storeName
      }
      if(order.regionId == candidate.regionId) {
        order.recipient = +candidate.tariff
      }
	  if(order.districtId === 101 || order.districtId === 106) {
		  order.recipient = +customUserforDistrict.tariff
	  }
	  if(order.regionId === 1) {
		  order.recipient = +customUserforRegion.tariff
	  }
    })
		regionsJSON.forEach(region => {
			if(order.regionId == region.id){
				order.regionId = region.name
			}
			if(req.query.regionId == region.id) {
				regionName = region.name
			}
		})
		districtsJSON.forEach(district => {
			if(order.districtId == district.id) {
				order.districtId = district.name
			}
		})
	})
	const ordersArr = Object.values(downloadOrders.rows.map((e) => e))
	let counter = 1;
	worksheet.addRow()
	ordersArr.forEach((order) => {
		order.s_no = counter;
		worksheet.addRow(order);
		counter++;
	});
  const totalPrice1 = () => {
    const endRow = worksheet.lastRow._number + 1;
	  worksheet.getCell(`F${endRow}`).value = "UMUMIY NARX:";
	  worksheet.getCell(`G${endRow}`).alignment = { horizontal: "center" };
	  worksheet.getCell(`H${endRow}`).value = { formula: `SUM(H3:H${endRow - 1})` };
	  worksheet.getCell(`I${endRow}`).value = { formula: `SUM(I3:I${endRow - 1})` };
	  worksheet.getCell(`J${endRow}`).value = { formula: `SUM(J3:J${endRow - 1})` };
      worksheet.mergeCells(`F${endRow}:G${endRow}`);
	for(i = 3; i<endRow; i++) {
		worksheet.getCell(`K${i}`).value = worksheet.getCell(`H${i}`).value - worksheet.getCell(`I${i}`).value
	}
	for(i = 3; i<endRow; i++) {
		worksheet.getCell(`L${i}`).value = worksheet.getCell(`H${i}`).value - worksheet.getCell(`I${i}`).value - worksheet.getCell(`J${i}`).value
	}
	  worksheet.getCell(`K${endRow}`).value = { formula: `SUM(K3:K${endRow - 1})` };
	  worksheet.getCell(`L${endRow}`).value = { formula: `SUM(L3:L${endRow - 1})` };
  }
  const totalPrice2 = () => {
    const endRow = worksheet.lastRow._number + 1; 
	  worksheet.getCell(`E${endRow}`).value = "UMUMIY NARX:";
	  worksheet.getCell(`F${endRow}`).alignment = { horizontal: "center" };
	  worksheet.getCell(`G${endRow}`).value = { formula: `SUM(G3:G${endRow - 1})` };
	  worksheet.getCell(`H${endRow}`).value = { formula: `SUM(H3:H${endRow - 1})` };
	  worksheet.getCell(`I${endRow}`).value = { formula: `SUM(I3:I${endRow - 1})` };
      worksheet.mergeCells(`E${endRow}:F${endRow}`);
	for(i = 3; i<endRow; i++) {
		worksheet.getCell(`J${i}`).value = worksheet.getCell(`G${i}`).value - worksheet.getCell(`H${i}`).value
	}
	for(i = 3; i<endRow; i++) {
		worksheet.getCell(`K${i}`).value = worksheet.getCell(`G${i}`).value - worksheet.getCell(`H${i}`).value - worksheet.getCell(`I${i}`).value
	}
	  worksheet.getCell(`J${endRow}`).value = { formula: `SUM(J3:J${endRow - 1})` };
	  worksheet.getCell(`K${endRow}`).value = { formula: `SUM(K3:K${endRow - 1})` };
  }
  const totalPrice3 = () => {
    const endRow = worksheet.lastRow._number + 1; 
	  worksheet.getCell(`D${endRow}`).value = "UMUMIY NARX:";
	  worksheet.getCell(`E${endRow}`).alignment = { horizontal: "center" };
	  worksheet.getCell(`F${endRow}`).value = { formula: `SUM(F3:F${endRow - 1})` };
	  worksheet.getCell(`G${endRow}`).value = { formula: `SUM(G3:G${endRow - 1})` };
	  worksheet.getCell(`H${endRow}`).value = { formula: `SUM(H3:H${endRow - 1})` };
      worksheet.mergeCells(`D${endRow}:E${endRow}`);
	for(i = 3; i<endRow; i++) {
		worksheet.getCell(`I${i}`).value = worksheet.getCell(`F${i}`).value - worksheet.getCell(`G${i}`).value
	}
	for(i = 3; i<endRow; i++) {
		worksheet.getCell(`J${i}`).value = worksheet.getCell(`F${i}`).value - worksheet.getCell(`G${i}`).value - worksheet.getCell(`H${i}`).value
	}
	  worksheet.getCell(`I${endRow}`).value = { formula: `SUM(I3:I${endRow - 1})` };
	  worksheet.getCell(`J${endRow}`).value = { formula: `SUM(J3:J${endRow - 1})` };
  }
  const totalPrice4 = () => {
	const endRow = worksheet.lastRow._number + 1;
	worksheet.getCell(`F${endRow}`).value = "UMUMIY NARX:";
	worksheet.getCell(`G${endRow}`).alignment = { horizontal: "center" };
	worksheet.getCell(`H${endRow}`).value = { formula: `SUM(H3:H${endRow - 1})` };
	worksheet.getCell(`I${endRow}`).value = { formula: `SUM(I3:I${endRow - 1})` };
	worksheet.mergeCells(`F${endRow}:G${endRow}`);
	for(i = 3; i<endRow; i++) {
		worksheet.getCell(`J${i}`).value = worksheet.getCell(`H${i}`).value - worksheet.getCell(`I${i}`).value
	}
	    worksheet.getCell(`J${endRow}`).value = { formula: `SUM(J3:J${endRow - 1})` };
  }
  const totalPrice5 = () => {
	const endRow = worksheet.lastRow._number + 1; 
	  worksheet.getCell(`E${endRow}`).value = "UMUMIY NARX:";
	  worksheet.getCell(`F${endRow}`).alignment = { horizontal: "center" };
	  worksheet.getCell(`G${endRow}`).value = { formula: `SUM(G3:G${endRow - 1})` };
	  worksheet.getCell(`H${endRow}`).value = { formula: `SUM(H3:H${endRow - 1})` };
      worksheet.mergeCells(`E${endRow}:F${endRow}`);
	for(i = 3; i<endRow; i++) {
		worksheet.getCell(`I${i}`).value = worksheet.getCell(`G${i}`).value - worksheet.getCell(`H${i}`).value
	}
	  worksheet.getCell(`I${endRow}`).value = { formula: `SUM(I3:I${endRow - 1})` };
  }
  const totalPrice6 = () => {
	const endRow = worksheet.lastRow._number + 1; 
	  worksheet.getCell(`D${endRow}`).value = "UMUMIY NARX:";
	  worksheet.getCell(`E${endRow}`).alignment = { horizontal: "center" };
	  worksheet.getCell(`F${endRow}`).value = { formula: `SUM(F3:F${endRow - 1})` };
	  worksheet.getCell(`G${endRow}`).value = { formula: `SUM(G3:G${endRow - 1})` };
      worksheet.mergeCells(`D${endRow}:E${endRow}`);
	for(i = 3; i<endRow; i++) {
		worksheet.getCell(`H${i}`).value = worksheet.getCell(`F${i}`).value - worksheet.getCell(`G${i}`).value
	}
	  worksheet.getCell(`H${endRow}`).value = { formula: `SUM(H3:H${endRow - 1})` };
  }
  const totalPrice7 = () => {
	const endRow = worksheet.lastRow._number + 1;
	worksheet.getCell(`F${endRow}`).value = "UMUMIY NARX:";
	worksheet.getCell(`G${endRow}`).alignment = { horizontal: "center" };
	worksheet.getCell(`H${endRow}`).value = { formula: `SUM(H3:H${endRow - 1})` };
	worksheet.getCell(`I${endRow}`).value = { formula: `SUM(I3:I${endRow - 1})` };
	worksheet.mergeCells(`F${endRow}:G${endRow}`);
  }
  const totalPrice8 = () => {
	const endRow = worksheet.lastRow._number + 1;
	worksheet.getCell(`E${endRow}`).value = "UMUMIY NARX:";
	worksheet.getCell(`F${endRow}`).alignment = { horizontal: "center" };
	worksheet.getCell(`G${endRow}`).value = { formula: `SUM(G3:G${endRow - 1})` };
	worksheet.getCell(`H${endRow}`).value = { formula: `SUM(H3:H${endRow - 1})` };
	worksheet.mergeCells(`E${endRow}:F${endRow}`);
  }
  if(req.query.regionId && !req.query.storeOwnerId && !req.query.createdAt
	&& (userRole === userRoles.ADMIN || userRole === userRoles.SUPER_ADMIN)) {
    worksheet.spliceColumns(3,1)
    totalPrice2()
  }
  if(req.query.storeOwnerId && !req.query.regionId && !req.query.createdAt
	&& (userRole === userRoles.ADMIN || userRole === userRoles.SUPER_ADMIN)) {
    worksheet.spliceColumns(5,1)
    totalPrice2()
  }
  if(req.query.createdAt && !req.query.regionId && !req.query.storeOwnerId
	&& (userRole === userRoles.ADMIN || userRole === userRoles.SUPER_ADMIN)) {
    worksheet.spliceColumns(13,1)
    totalPrice1()
  }
  if(req.query.regionId && req.query.storeOwnerId && !req.query.createdAt
	&& (userRole === userRoles.ADMIN || userRole === userRoles.SUPER_ADMIN)) {
    worksheet.spliceColumns(3,1)
    worksheet.spliceColumns(4,1)
    totalPrice3()
  }
  if(req.query.regionId && !req.query.storeOwnerId && req.query.createdAt
	&& (userRole === userRoles.ADMIN || userRole === userRoles.SUPER_ADMIN)) {
    worksheet.spliceColumns(3,1)
    worksheet.spliceColumns(12,1)
    totalPrice2()
  }
  if(!req.query.regionId && req.query.storeOwnerId && req.query.createdAt
	&& (userRole === userRoles.ADMIN || userRole === userRoles.SUPER_ADMIN)) {
    worksheet.spliceColumns(5,1)
    worksheet.spliceColumns(12,1)
    totalPrice2()
  }
  if(req.query.regionId && req.query.storeOwnerId && req.query.createdAt 
	&& (userRole === userRoles.ADMIN || userRole === userRoles.SUPER_ADMIN)) {
    worksheet.spliceColumns(3,1)
    worksheet.spliceColumns(4,1)
    worksheet.spliceColumns(11,1)
    totalPrice3()
  }
  if(!req.query.regionId && !req.query.storeOwnerId && !req.query.createdAt 
	&& (userRole === userRoles.ADMIN || userRole === userRoles.SUPER_ADMIN)) {
    totalPrice1()
  }
  if(!req.query.regionId && !req.query.createdAt && userRole === userRoles.COURIER) {
	worksheet.spliceColumns(9,1)
	worksheet.spliceColumns(10,1)
	worksheet.spliceColumns(10,1)
	totalPrice7()
  }
  if(req.query.createdAt && !req.query.regionId && userRole === userRoles.COURIER) {
	worksheet.spliceColumns(9,1)
	worksheet.spliceColumns(10,1)
	worksheet.spliceColumns(10,1)
	worksheet.spliceColumns(10,1)
	totalPrice7()
  }
  if(!req.query.createdAt && req.query.regionId && userRole === userRoles.COURIER) {
	worksheet.spliceColumns(3,1)
	worksheet.spliceColumns(8,1)
	worksheet.spliceColumns(9,1)
	worksheet.spliceColumns(9,1)
	totalPrice8()
  }
  if(req.query.createdAt && req.query.regionId && userRole === userRoles.COURIER) {
	worksheet.spliceColumns(3,1)
	worksheet.spliceColumns(8,1)
	worksheet.spliceColumns(9,1)
	worksheet.spliceColumns(9,1)
	worksheet.spliceColumns(9,1)
	totalPrice8()
  }
  if(!req.query.regionId && !req.query.createdAt && userRole === userRoles.STORE_OWNER) {
	storeName = req.user.storeName
	worksheet.spliceColumns(5,1)
	worksheet.spliceColumns(9,1)
	worksheet.spliceColumns(10,1)
	totalPrice5()
  }
  if(req.query.createdAt && !req.query.regionId && userRole === userRoles.STORE_OWNER) {
	storeName = req.user.storeName
	worksheet.spliceColumns(5,1)
	worksheet.spliceColumns(9,1)
	worksheet.spliceColumns(10,1)
	worksheet.spliceColumns(10,1)
	totalPrice5()
  }
  if(!req.query.createdAt && req.query.regionId && userRole === userRoles.STORE_OWNER) {
	storeName = req.user.storeName
	worksheet.spliceColumns(3,1)
	worksheet.spliceColumns(4,1)
	worksheet.spliceColumns(8,1)
	worksheet.spliceColumns(9,1)
	totalPrice6()
  }
  if(req.query.createdAt && req.query.regionId && userRole === userRoles.STORE_OWNER) {
	storeName = req.user.storeName
	worksheet.spliceColumns(3,1)
	worksheet.spliceColumns(4,1)
	worksheet.spliceColumns(8,1)
	worksheet.spliceColumns(9,1)
	worksheet.spliceColumns(9,1)
	totalPrice6()
  }
	worksheet.getCell(`A2`).value = `${orderDate}`
	worksheet.getCell(`B2`).value = `${regionName}`
	worksheet.getCell(`D2`).value = `${storeName}`
	worksheet.mergeCells("B2:C2");
	worksheet.mergeCells("D2:E2");
	worksheet.eachRow((row) => {
		row.eachCell((cell) => {
			cell.border = {
				top: { style: "thin" },
				left: { style: "thin" },
				bottom: { style: "thin" },
				right: { style: "thin" },
			}
		})
	})
	worksheet.getRow(1).eachCell((cell) => {
		cell.font = { bold: true },
		cell.fill = {
			type: "pattern",
			pattern: "solid",
			fgColor: { argb: "ffd385" },
		  }
	});
	worksheet.getRow(2).eachCell((cell) => {
		cell.font = { bold: true },
		cell.fill = {
			type: "pattern",
			pattern: "solid",
			fgColor: { argb: "b9b8b7" },
		  }
	});
	worksheet.eachRow((row) => {
		row.eachCell((cell) => {
			cell.alignment = {
				horizontal: "center",
			};
      if(cell.model.value === "SOTILDI") {
        row.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "c4d79b" },
          }
      }
      if(cell.model.value === "KUTILMOQDA") {
        row.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "f4f183" },
          }
      }
      if(cell.model.value === "OTKAZ") {
        row.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "da9694" },
          }
      }
		});
	});
	res.setHeader(
		"Content-Type",
		"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
	);
	res.setHeader("Content-Disposition", "attachment; filename=orders.xlsx");
	return workbook.xlsx.write(res).then(() => {
		res.status(200).end();
	});
});
exports.getStatistics = catchAsync(async(req, res, next) => {
	let allOrders = await Order.count()
	let soldOrders = await Order.count({
		where: {
			orderStatus: {[Op.eq]: orderStatuses.STATUS_SOLD}
		}
	})
	let rejectedOrders = await Order.count({
		where: {
			orderStatus: {[Op.eq]: orderStatuses.STATUS_REJECTED}
		}
	})
	let allStores = await User.count({
		where: {
			userRole: {[Op.eq]: userRoles.STORE_OWNER}
		}
	})
	res.json({
		status: "success",
		message: "Statistika uchun ma'lumotlar",
		error: null,
		data: {
			allOrders,
			soldOrders,
			rejectedOrders,
			allStores
		}
	})
})