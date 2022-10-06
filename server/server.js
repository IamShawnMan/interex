const dotenv = require("dotenv")
const nodeEnv = process.env.NODE_ENV
let envPath;
if(nodeEnv === "dev") {
    envPath = ".env.development"
}
else if(nodeEnv==="prod") {
    envPath = ".env.production"
}
const env = dotenv.config({path: `./${envPath}`})


const app = require("./app");
const database = require("./core/config/database/database")

database.authenticate().then(() => {
    console.log("Database succesfully connected");
    database.sync({force: true})
}).catch(error => {
    console.log(error);
})

const PORT = process.env.PORT || 8080

app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
})