//auth

// /isstudent

const jwt = require('jsonwebtoken');
require("dotenv").config();
const User = require("../models/User");

exports.auth = async (req, res , next) => {
    try {
        const token =req.cookies.token || req.body.token ||  req.header("Authorisation").replace("Bearer ","");
        if(!token) return res.status(401).json({error:"No token found"});


        try{

            const verified = jwt.verify(token, process.env.SECRET_KEY);
            console.log(verified);
            req.user = verified
        }catch(err){
            return res.status(401).json({error:"Invalid token"});
        }
        next();

      

    } catch (error) {
        return res.status(500).json({error:"Internal Server Error in AUTH Middleware.Js"});
        console.log(error);
    }
}; 

//iStudent

exports.isStudent = async (req, res , next) => {
    try {
        const user = await User.findById(req.user._id);

        if(user.accountType !== "Student") return res.status(401).json({error:"Access Denied"});
        next();

      

    } catch (error) {
        return res.status(500).json({error:"Internal Server Error in AUTH isStudent Middleware.Js"});
        console.log(error);
    }
}
exports.isInstructor = async (req, res , next) => {
    try {
  

        if(req.user.accountType !== "Instructor") return res.status(401).json({error:"Access Denied only for Instructor"});
        next();

      

    } catch (error) {
        return res.status(500).json({error:"Internal Server Error in AUTH isINstrucot Middleware.Js"});
        console.log(error);
    }
}

exports.isAdmin = async (req, res , next) => {
    try {
  

        if(req.user.accountType !== "Admin") return res.status(401).json({error:"Access Denied only for Admin"});
        next();

      

    } catch (error) {
        return res.status(500).json({error:"Internal Server Error in AUTH Admin Middleware.Js"});
        console.log(error);
    }
}