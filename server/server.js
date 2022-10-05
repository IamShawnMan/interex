require("dotenv").config()
const app = require("./app");
const database = require("./core/config/database/database")

database.authenticate().then(() => {
    console.log("Database succesfully connected");
    database.sync()
}).catch(error => {
    console.log(error);
})

const PORT = process.env.PORT || 8080

app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
})