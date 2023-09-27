import User from "../models/user.model.js";
import AppError from "../utils/error.util.js";

const cookieOptions = {
    maxAge: 7 * 24 * 60 * 6 * 1000,
    httpOnly: true,
    secure: true
}

const register = async (req, res, next) => {
    const { fullName, email, password } = req.body;
    if (!fullName || !email || !password) {
        return next(new AppError('All Fields are Required ', 400));
    }
    //checking in database
    const userExists = await User.findOne({ email })
    if (userExists) {
        return next(newAppError('Email already Exists', 400));
    }
    //creating User 
    const user = await User.create({
        fullName,
        email,
        password,
        avatar: {
            public_id: email,
            // secure_url:
        }
    });
    if (!user) {
        return next(new AppError('User registration Failed , Please Try again', 400))

    }
    //Todo : File upload
    await User.save();

    user.password = undefined;
    const token = await user.generateJWTToken();

    res.status(201).json({
        success: true,
        message: 'User registered successfully',
        user,
    })
    res.cookie('token', token, cookieOptions)


};
const login = async (req, res) => {
    try {


        const { email, password } = req.body;

        if (!email || !password) {
            return next(new AppError('All field are required', 400));

        }
        const user = await User.findOne({
            email
        }).select('+password');
        if (!user || !user.comparePassword(password)) {
            return next(new AppError('Email or password does not match', 400))
        }

        //IF not error
        const token = await user.generateJWTToken();
        user.password = undefined;
        res.cookie('token', token, cookieOptions)

        res.status(200).json({
            success: true,
            message: 'User LoggedIN Successfully',
            user
        })
    } catch (e) {
        return next(new AppError(e.message, 500));
    }
};
const logout = (req, res) => {
    res.cookie('token', null, {
        secure : true,
        maxAge : 0,
        httpOnly: true
    })
    res.status(200).json({
        success:true,
        message: 'User logged out successfully'
    })
    const getProfile  = async(res, res)=>{
        try{

            const userId = req.user.id;
            const user = await User.findById(userId);
            res.status(200).json({
                success:true,
                message: 'User Details',
                user
            })
        }catch(e){
            return next(new AppError('Failed too fetch profile'))
        }

    }
 };
const getProfile = (req, res) => { };

export { }