import User from "../models/user.model.js";
import AppError from "../utils/error.util.js";
// import cloudinary from "cloudinary";

const cookieOptions = {
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
    httpOnly: true,
    secure: true,
};

const register = async (req, res, next) => {
    const { fullName, email, password } = req.body;
    if (!fullName || !email || !password) {
        return next(new AppError('All Fields are Required ', 400));
    }

    // Check if the email already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
        return next(new AppError('Email already exists', 400));
    }

    // Create the user
    const user = await User.create({
        fullName,
        email,
        password,
        avatar: {
            public_id: email,
            secure_url:
                'https://res.cloudinary.com/du9jzqlpt/image/upload/v1674647316/avatar_drzgxv.jpg',
        },
    });

    if (!user) {
        return next(new AppError('User registration failed, please try again later', 400));
    }

    // Save the user object
    await user.save();

    // Generating a JWT token
    const token = await user.generateJWTToken();

    // Setting the password to undefined so it does not get sent in the response
    user.password = undefined;

    // Setting the token in the cookie with name token along with cookieOptions
    res.cookie('token', token, cookieOptions);

    res.status(201).json({
        success: true,
        message: 'User registered successfully',
        user,
    });
};



const login = async (req, res, next) => {
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
        secure: true,
        maxAge: 0,
        httpOnly: true
    })
    res.status(200).json({
        success: true,
        message: 'User logged out successfully'
    })

};
const getProfile = async (req, res) => {
    try {

        const userId = req.user.id;
        const user = await User.findById(userId);
        res.status(200).json({
            success: true,
            message: 'User Details',
            user
        })
    } catch (e) {
        return next(new AppError('Failed too fetch profile'))
    }

}


export { register, login, logout, getProfile };