const mongoose = require('mongoose');



require("dotenv").config();

exports.connect = ()=>{
    mongoose.connect(process.env.MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(()=> console.log("mongodb conntected succesfully"))
    .catch((error)=>{
        console.log("error in mongodb connection", error);
    })
}