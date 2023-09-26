import User from "../models/user.model";
import AppError from "../utils/error.util";

const register = async(req, res, next)=>{
    const {fullName, email , password} = req.body;
    if(!fullName || !email || !password){
        return  next(new AppError('All Fields are Required ', 400));
    }
    //checking in database
    const userExists = await User.findOne({email})
    if(userExists){
        return next(newAppError('Email already Exists', 400));
    }
    //creating User 
    const user = await User.create({
        fullName, 
        email , 
        password, 
        avatar : {
            public_id: email,
            // secure_url:
        }
    });
    if(!user){
        return next(new AppError('User registration Failed , Please Try again',400))

    }
    //Todo : File upload
    await User.save();

    user.password = undefined;
    res.status(201).json({
        success: true, 
        message : 'User registered successfully',
        user,
    })



};
const login = (req, res)=>{};
const logout = (req, res)=>{};
const getProfile = (req, res)=>{};

export {}