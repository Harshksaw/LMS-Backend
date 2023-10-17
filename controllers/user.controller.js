import AppError from '../utils/error.util.js';
import User from '../models/user.model.js';

import cloudinary from "cloudinary";
import fs from 'fs/promises';
import sendEmail from '../utils/sendEmail.js'
import crypto from 'crypto';
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
    // Create new user with the given necessary data and save to DB
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

    // If user not created send message response
    if (!user) {
        return next(
            new AppError('User registration failed, please try again later', 400)
        );
    }

    // Run only if user sends a file
    if (req.file) {
        console.log("FILE DETAILS", JSON.stringify(req.file))

        try {
            const result = await cloudinary.v2.uploader.upload(req.file.path, {
                folder: 'lms', // Save files in a folder named lms
                width: 250,
                height: 250,
                gravity: 'faces', // This option tells cloudinary to center the image around detected faces (if any) after cropping or resizing the original image
                crop: 'fill',
            });

            // If success
            if (result) {
                // Set the public_id and secure_url in DB
                user.avatar.public_id = result.public_id;
                user.avatar.secure_url = result.secure_url;

                // After successful upload remove the file from local storage
                fs.rm(`uploads/${req.file.filename}`);
            }
        } catch (error) {
            return next(
                new AppError(error || 'File not uploaded, please try again', 400)
            );
        }
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

const forgotPassword = async (req, res, next) => {
    const { email } = req.body;
    if (!email) {
        return next(new AppError("Email is required", 400))
    }
    const user = await User.findOne({ email });
    if (!user) {
        return next(new AppError("Email is required", 400))
    }
    const resetToken = await user.generatePasswordResetToken();
    await user.save();

    const resetPasswordUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`
    //send this url and email
    const subject = 'Reset Password'
    const message = `You can reset your password by clicking <a href=${resetPasswordUrl} target="_blank">Reset your password</a>\nIf the above link does not work for some reason then copy paste this link in new tab ${resetPasswordUrl}.\n If you have not requested this, kindly ignore.`;
    try {
        await sendEmail(email, subject, message);
        res.status(200).json({
            success: "True",
            message: `Rest token password has been sent to ${email} Successfully`
        })
        console.log("sendemail");
    } catch (e) {
        //security puppose
        user.forgotPasswordExpiry = undefined;
        user.forgotPasswordToken = undefined;
        console.log("notsentemail")
        return next(new AppError(e.message, 50));
    }



}


const resetPassword = async (req, res) => {
    const { resetToken } = req.params;
    const { password } = req.body;

    const forgotPasswordToken = crypto
        .createHash('sha256')
        .update(resetToken)
        .digest('hex');

    //checkin if the token exists
    const user = await User.findOne({

        //checking expiry
        forgotPasswordToken: { $gt: Date.now() }

    });
    if (!user) {
        return next(
            new AppError('Token is Invalid or expired , please try agin ,', 400)
        )
    }
    //if found then update the password
    user.password = password;
    user.forgotPasswordToken = undefined;
    user.forgotPasswordExpiry = undefined;
    user.save();
    res.status(200).json({
        success: true,
        message: 'Password changed successfully',
    })

}

const changePassword = async (req, res) => {
    const { oldPassword, newPassword } = req.body;
    const { id } = req.user;
    if (!oldPassword || !newPassword) {
        return next(
            new AppError('All fields are mandatory', 400)
        )
    }

    const user = await User.findById(id).select('+password');

    if (!user) {
        return next(
            new AppError('User does not exists', 400)
        )
    }
    const isPasswordvalid = await user.comparePassword(oldPassword);
    if (!isPasswordvalid) {
        return next(
            new AppError('Invalid old password', 400)
        )
    }
    user.password = password
    await user.save()
    user.password = undefined;
    res.status(200).json({
        success: true,
        message: "password changes successfully! ",
    })

}

const updateUser = async (req, res) => {

    const { fullName } = req.body;
    const { id } = req.user.id; // also verfying th euser as the id is in url 
    const user = await User.findById(id);

    if (!user) {
        return next(
            new AppError('User does not exits ', 400)
        )
    }
    if (req.fullName) {
        //update fullName
        user.fullName = fullName
    }
    if (req.file) {
        await cloudinary.v2.uploader.destroy(user.avatar.public_id); //destroying  the  previous image
        try {
            const result = await cloudinary.v2.uploader.upload(req.file.path, {
                folder: 'lms', // Save files in a folder named lms
                width: 250,
                height: 250,
                gravity: 'faces', // This option tells cloudinary to center the image around detected faces (if any) after cropping or resizing the original image
                crop: 'fill',
            });

            // If success
            if (result) {
                // Set the public_id and secure_url in DB
                user.avatar.public_id = result.public_id;
                user.avatar.secure_url = result.secure_url;

                // After successful upload remove the file from local storage
                fs.rm(`uploads/${req.file.filename}`);
            }
        } catch (error) {
            return next(
                new AppError(error || 'File not uploaded, please try again', 400)
            );

        }
        await user.save();
        res.status(200).json({
            success: true,
            message: 'User Details  updated Successfully'
        })



    }
}

export { register, login, logout, getProfile, resetPassword, forgotPassword, changePassword, updateUser }