const {Op} = require("sequelize");

const excludeParams = ["page", "size", "fields", "search", "order"]

class QueryBuilder{
    constructor(queryParams){
        this.queryParams = queryParams;
        this.queryOptions = {}
    }

    paginate(){
        const page = this.queryParams.page = +this.queryParams.page || 1
        const limit = this.queryParams.size = +this.queryParams.size || 50

        this.queryOptions.limit = +limit;
        this.queryOptions.offset = +(page-1)*limit;
        return this;
    }

    createPagination(queryResult){
        if(queryResult.hasOwnProperty("count") &&  queryResult.hasOwnProperty("rows")){
            const allPages = Math.ceil(queryResult.count / this.queryOptions.limit)
            const page = this.queryParams.page
            const isLastPage = allPages === page

            return{
                content: queryResult.rows,
                pagination:{
                    allItemsCount: queryResult.count,
                    page,
                    allPages,
                    isFirstPage: page === 1,
                    isLastPage,
                    pageSize: this.queryOptions.size
                }
            }
        }
    }
}

module.exports = QueryBuilder;