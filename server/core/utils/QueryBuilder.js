const { Op } = require("sequelize");

const excludeParams = ["page", "size", "fields", "search", "order"];
const operators = ["gt", "lt", "gte", "lte", "in"];

class QueryBuilder {
	constructor(queryParams) {
		this.queryParams = queryParams;
		this.queryOptions = {};
	}

	filter() {
		const filterFields = { ...this.queryParams };
		excludeParams.forEach((p) => delete filterFields[p]);
		// console.log(this.queryParams);

		const filteredObj = {};
		Object.keys(filterFields).forEach((k) => {
			const filterItem = filterFields[k];

			if (typeof filterItem === "object") {
				Object.keys(filterItem).forEach((ik) => {
					filteredObj[k] = { [Op[ik]]: filterItem[ik] };
				});
			} else {
				filteredObj[k] = { [Op.eq]: filterItem };
			}
		});
		// console.log(filteredObj);
		if (this.queryOptions.where) {
			this.queryOptions.where = { ...filteredObj, ...this.queryOptions.where };
		} else {
			this.queryOptions.where = filteredObj;
		}

		// console.log(this.queryOptions);
		return this;
	}

	limitFields() {
		if (this.queryParams.hasOwnProperty("fields")) {
			const attributes = this.queryParams.fields.split(",");
			this.queryOptions.attributes = attributes;
		}
		return this;
	}

	paginate() {
		const page = (this.queryParams.page = +this.queryParams.page || 1);
		const limit = (this.queryParams.size = +this.queryParams.size || 50);

		this.queryOptions.limit = +limit;
		this.queryOptions.offset = +(page - 1) * limit;
		return this;
	}

	createPagination(queryResult) {
		if (
			queryResult.hasOwnProperty("count") &&
			queryResult.hasOwnProperty("rows")
		) {
			const allPages = Math.ceil(queryResult.count / this.queryOptions.limit);
			const page = this.queryParams.page;
			const isLastPage = allPages === page;

			return {
				content: queryResult.rows,
				pagination: {
					allItemsCount: queryResult.count,
					page,
					allPages,
					isFirstPage: page === 1,
					isLastPage,
					pageSize: this.queryOptions.size,
				},
			};
		}
	}

	order() {
		if (this.queryParams.hasOwnProperty("order")) {
			const order = this.queryParams.order.split(",");
			// console.log(order);
			this.queryOptions.order = order.map((field) => {
				if (field.startsWith("-")) {
					return [field.slice(1), "desc"];
				} else return [field, "asc"];
			});
		} else {
			this.queryOptions.order = [["createdAt", "desc"]];
		}
		return this;
	}
}

module.exports = QueryBuilder;
