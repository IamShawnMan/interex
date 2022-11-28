const excelJS = require("exceljs");
const catchAsync = require("../../core/utils/catchAsync");
const QueryBuilder = require("../../core/utils/QueryBuilder")
const regionsJSON = require("../region/regions.json");
const districtsJSON = require("../district/districts.json");
const User = require("../user/User");
const Order = require("../order/Order");
const userRoles = require("../../core/constants/userRole")
const {Op} = require("sequelize")

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
		{ header: "Yetkazish narxi", key: "deliveryPrice", width: 20 },
		{ header: "Tovar summasi", key: "totalPrice", width: 20 },
        { header: "Xizmat narxi", key: "recipient", width: 20 },
		{ header: "Yaratilgan sana", key: "createdAt", width: 20 },
		{ header: "Izoh", key: "note", width: 120 },
	];
	const queryBuilder = new QueryBuilder(req.query);
	queryBuilder.filter();
	let downloadOrders = await Order.findAndCountAll(
		queryBuilder.queryOptions
	);
    if(userRole === userRoles.COURIER) {
		queryBuilder.queryOptions.where = {
			regionId: {[Op.eq]: regionId},
			...queryBuilder.queryOptions.where
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

	let regionName = "Barcha viloyatlar"
    let storeName = "Barcha firmalar"
	let orderDate = ""
	req.query.createdAt ? orderDate = new Date(req.query.createdAt["eq"]).toLocaleString().split(",")[0]: ""
	downloadOrders.rows.forEach(order => {
    order.recipient = ""
    downloadCandidate.forEach(candidate => {
      if(order.storeOwnerId == candidate.id) {
        order.storeOwnerId = candidate.storeName
      }
      if(req.query.storeOwnerId == candidate.id) {
        storeName = candidate.storeName
      }
      if(order.regionId == candidate.id) {
        order.recipient = +candidate.tariff
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
	  worksheet.getCell(`H${endRow}`).value = { formula: `SUM(H2:H${endRow - 1})` };
	  worksheet.getCell(`I${endRow}`).value = { formula: `SUM(I2:I${endRow - 1})` };
	  worksheet.getCell(`J${endRow}`).value = { formula: `SUM(J2:J${endRow - 1})` };
      worksheet.mergeCells(`F${endRow}:G${endRow}`);
  }
  const totalPrice2 = () => {
    const endRow = worksheet.lastRow._number + 1; 
	  worksheet.getCell(`E${endRow}`).value = "UMUMIY NARX:";
	  worksheet.getCell(`F${endRow}`).alignment = { horizontal: "center" };
	  worksheet.getCell(`G${endRow}`).value = { formula: `SUM(G2:G${endRow - 1})` };
	  worksheet.getCell(`H${endRow}`).value = { formula: `SUM(H2:H${endRow - 1})` };
	  worksheet.getCell(`I${endRow}`).value = { formula: `SUM(I2:I${endRow - 1})` };
      worksheet.mergeCells(`E${endRow}:F${endRow}`);
  }
  const totalPrice3 = () => {
    const endRow = worksheet.lastRow._number + 1; 
	  worksheet.getCell(`D${endRow}`).value = "UMUMIY NARX:";
	  worksheet.getCell(`E${endRow}`).alignment = { horizontal: "center" };
	  worksheet.getCell(`F${endRow}`).value = { formula: `SUM(F2:F${endRow - 1})` };
	  worksheet.getCell(`G${endRow}`).value = { formula: `SUM(G2:G${endRow - 1})` };
	  worksheet.getCell(`H${endRow}`).value = { formula: `SUM(H2:H${endRow - 1})` };
      worksheet.mergeCells(`D${endRow}:E${endRow}`);
  }
  const totalPrice4 = () => {
	const endRow = worksheet.lastRow._number + 1;
	worksheet.getCell(`F${endRow}`).value = "UMUMIY NARX:";
	worksheet.getCell(`G${endRow}`).alignment = { horizontal: "center" };
	worksheet.getCell(`H${endRow}`).value = { formula: `SUM(H2:H${endRow - 1})` };
	worksheet.getCell(`I${endRow}`).value = { formula: `SUM(I2:I${endRow - 1})` };
	worksheet.mergeCells(`F${endRow}:G${endRow}`);
  }
  if(req.query.regionId && !req.query.storeOwnerId && !req.query.createdAt) {
    worksheet.spliceColumns(3,1)
    totalPrice2()
  }
  if(req.query.storeOwnerId && !req.query.regionId && !req.query.createdAt) {
    worksheet.spliceColumns(5,1)
    totalPrice2()
  }
  if(req.query.createdAt && !req.query.regionId && !req.query.storeOwnerId && userRole === userRoles.ADMIN) {
    worksheet.spliceColumns(11,1)
    totalPrice1()
  }
  if(req.query.regionId && req.query.storeOwnerId && !req.query.createdAt) {
    worksheet.spliceColumns(3,1)
    worksheet.spliceColumns(4,1)
    totalPrice3()
  }
  if(req.query.regionId && !req.query.storeOwnerId && req.query.createdAt) {
    worksheet.spliceColumns(3,1)
    worksheet.spliceColumns(10,1)
    totalPrice2()
  }
  if(!req.query.regionId && req.query.storeOwnerId && req.query.createdAt) {
    worksheet.spliceColumns(5,1)
    worksheet.spliceColumns(10,1)
    totalPrice2()
  }
  if(req.query.regionId && req.query.storeOwnerId && req.query.createdAt) {
    worksheet.spliceColumns(3,1)
    worksheet.spliceColumns(4,1)
    worksheet.spliceColumns(9,1)
    totalPrice3()
  }
  if(!req.query.regionId && !req.query.storeOwnerId && !req.query.createdAt && userRole === userRoles.ADMIN) {
    totalPrice1()
  }
  if(!req.query.regionId && !req.query.createdAt && userRole === userRoles.COURIER) {
	worksheet.spliceColumns(8,1)
	totalPrice4()
  }
  if(req.query.createdAt && !req.query.regionId && userRole === userRoles.COURIER) {
	worksheet.spliceColumns(8,1)
	worksheet.spliceColumns(10,1)
	totalPrice4()
  }
  if(!req.query.regionId && !req.query.createdAt && userRole === userRoles.STORE_OWNER) {
	worksheet.spliceColumns(10,1)
	totalPrice4()
  }
  if(req.query.createdAt && !req.query.regionId && userRole === userRoles.STORE_OWNER) {
	worksheet.spliceColumns(10,1)
	worksheet.spliceColumns(10,1)
	totalPrice4()
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