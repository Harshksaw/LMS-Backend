const mongoose = require("mongoose");
require("dotenv").config();
const DATABASE_URL = process.env.MONGODB_URL;
 


exports.connect = () => {
    mongoose.connect( DATABASE_URL)
    .then(() => console.log("DB Connected Successfully"))
    .catch( (error) => {
        console.log("DB Connection Failed");
         console.log(error);
         process.exit(1);
    } )
}