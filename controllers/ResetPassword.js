const User = require("../models/User");
const OTP = require("../models/OTP");
const mailSender = require("../utils/mailsender");
const bcrypt = require("bcrypt");
exports.resetPassword = async (req, res) => {
    try {
        const email = req.body.email;
        const isUserExists = await User.findOne({ email });
        //generate Link
        //get email for req.body
        //check if user exists
        if (!isUserExists) return res.status(401).json({ error: "User is not registered" });

        //generating token
        const token = crypto.randomUUID();
        const updatedDetails = await User.findOneAndUpdate({ email: email }, { token: token, resetPasswordExpires: Date.now() + 3600000 }, { new: true });
        
        //update user by adding token adn expiration time
        // create url
        //frontend port = 3000

        const url = `http://localhost:3000/resetpassword/${token}`;

        await mailSender(email, "Password Reset Link", `Password Reset Link ${url}`);

        return res.json({
            success: true,
            message: "Password Reset Link has been sent to your email",
        })


    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "Internal Server Error in Reset Password" });

    }



}

exports.resetPasswordForm = async (req, res) => {
    //data fetch
    //getUser Details

    //ifnot entry- invalid token
    //token time check

    //password hash
    //update password
    //return res

    try {

        const { password, confirmPassword, token } = req.body;

        if (password !== confirmPassword) return res.status(401).json({
            success: true,
            message: "Password and Confirm Password does not match"
        });

        const userDetails = await User.findOne({ token: token });
        if (!userDetails) return res.status(401).json({
            success: true,
            message: "Invalid Token"
        });

        if (userDetails.resetPasswordExpires < Date.now()) return res.status(401).json({
            success: true,
            message: "Token Expired"
        });
        const hashedPassword = await bcrypt.hash(password, 10);

        await User.findOneAndUpdate({
            token: token
        }, {
            password: hashedPassword,
            token: null,
            resetPasswordExpires: null
        }, {
            new: true
        })

        return res.status(200).json({
            success: true,
            message: "Password Updated Successfully"
        })

    }



catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal Server Error in Reset Password Form" });

}
}