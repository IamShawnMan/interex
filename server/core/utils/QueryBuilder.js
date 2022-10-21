const { Op } = require("sequelize");

const excludeParams = ["page", "size", "fields", "search", "sort"];
const operators = ["gt", "lt", "gte", "lte", "in"];

class QueryBuilder {
	constructor(queryParams) {
		this.queryParams = queryParams;
		this.queryOptions = {};
	}

	filter() {
		const filterFields = { ...this.queryParams };
		excludeParams.forEach((p) => delete filterFields[p]);

		const filteredObj = {};
		Object.keys(filterFields).forEach((k) => {
			const filterItem = filterFields[k];

			if (typeof filterItem === "object") {
				Object.keys(filterItem).forEach((ik) => {
					if (operators.includes[ik]) {
						filteredObj[k] = { [Op[ik]]: filterItem[ik] };
					}
				});
			} else {
				filteredObj[k] = { [Op.eq]: filterItem };
			}
		});
		if (this.queryOptions.where) {
			this.queryOptions.where = { ...filteredObj, ...this.queryOptions.where };
		} else {
			this.queryOptions.where = filteredObj;
		}

		return this;
	}

	limitFields() {
		if (this.queryParams.fields) {
			const attributes = this.queryParams.fields.split(",");
			this.queryOptions.attributes = attributes;
		}
		return this;
	}

	paginate() {
		const page = this.queryParams.page ||= 1;
		const limit = this.queryParams.size||= 50;

		this.queryOptions.limit = +limit;
		this.queryOptions.offset = +(page - 1) * limit;
		return this;
	}

	search(searchFields) {
		if (!this.queryParams.search) return this;

		const searchObj = {
			[Op.or]: searchFields.map((field) => ({
				[field]: { [Op.iLike]: `%${this.queryParams.search}%` }
			})),
		};

		if (this.queryOptions.where) {
			this.queryOptions.where = { ...searchObj, ...this.queryOptions.where };
		} else {
			this.queryOptions.where = searchObj;
		}
		return this;
	}

	createPagination(queryResult) {
		if(!queryResult.count&&!queryResult.rows) return queryResult

			const allPagesCount = Math.ceil(queryResult.count / this.queryOptions.limit);
			const page = +this.queryParams.page;
			const isLastPage = allPagesCount === page;

			return {
				content: queryResult.rows,
				pagination: {
					allItemsCount: queryResult.count,
					page,
					allPagesCount,
					isFirstPage: page === 1,
					isLastPage,
					pageSize: this.queryOptions.size,
				},
			};
	}

	order() {
		if (this.queryParams.hasOwnProperty("order")) {
			const order = this.queryParams.order.split(",");
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

	#createOrderArray() {
		const orderArr = this.queryParams.sort.split(",").map((i) => {
			const orderItem = [];
			const isDesc = i.startsWith("-")

			orderItem[0] = isDesc ? i.slice(1) : i
			orderItem[1] = isDesc ? "desc" : "asc"

			return orderItem
		})
		return orderArr
	}
	
	sort(){
		if(this.queryParams.sort) {
			this.queryOptions.order = this.#createOrderArray()
		}
		else {
			this.queryOptions.order = [["createdAt", "desc"]]
		}
		return this
	}
}

module.exports = QueryBuilder;
