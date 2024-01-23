const User = require("../models/User");
const OTP = require("../models/OTP");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const otpGenerator = require("otp-generator");



exports.sendOTP = async (req, res) => {
    try {
        const { eamail } = req.body;
        //fetched email from user body

        //check if user exists
        const checkUser = await User.findOne({ email });
        if (checkUser) {
            return res.status(401).json({ error: "User already exists" });
        }

        //generate OTP
        var otp = otpGenerator.generate(6, { upperCase: false, specialChars: false, alphabets: false });
        console.log(otp), "OTP GENERATED";

        let result = await OTP.findOne({ otp: otp });

        while (result) {
            otp = otpGenerator.generate(6, { upperCase: false, specialChars: false, alphabets: false });
        }
        //save otp to db
        const OTPPayload = { email, otp };
        //create an entry in DB
        const otpBody = await OTP.create(OTPPayload);
        console.log(otpBody);

        res.status(200).json({ message: "OTP sent successfully" });


    } catch (error) {
        return res.status(500).json({ error: "Internal Server Error in AUTH.Js" });

    }



}



//signup

exports.signup = async (req, res) => {
    try {


        const
            {
                firstName,
                lastName,
                email, password, confirmPassword,
                accountType,
                contactNumber,
                otp
            } = req.body;

        //validate user
        if (!firstName || !lastName || !email || !password || !confirmPassword || !accountType || !contactNumber || !otp) {
            return res.status(422).json({ error: "Please fill all the fields" });
        }
        //password and confirm password should be same
        if (password != confirmPassword) {
            return res.status(400).json({ error: "Password and Confirm Password should be same" });
        }
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: "User already exists" });
        }

        ///most recent OTP
        const recentOTP = await OTP.findOne({ email }).sort({ createdAt: -1 });
        console.log(recentOTP);

        if (recentOTP.lenght == 0) {
            return res.status(400).json({ error: "OTP NOT found" });
        }
        if (recentOTP.otp != otp) {
            return res.status(400).json({ error: "Invalid OTP" });
        }

        //fetched email from user body

        const profileDetails = await Profile.create({
            gender: null,
            dateOfBirth: null,
            about: null,
            contactNumber: null,
        })

        const hashedPassword = await bcrypt.hash(password, 10);

        // const hashedConfirmPassword = await bcrypt.hash(confirmPassword,10);
        const user = await User.create({
            firstName,
            lastName,
            email,
            password: hashedPassword,
            accountType,
            additionalDetails: profileDetails._id,
            image: `https://api.dicebear.com/5.xinitials/svg?seed=${firstName}+${lastName}.svg`
        });
        return res.status(200).json({
            success: true,
            message: "USer created Successfully",
            user,
        })

    }
    catch (erro) {
        return res.status(500).json({ error: "Internal Server Error in Signup js (AUTH)  " });
    }
}

//Login

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        //validate user
        if (!email || !password) {
            return res.status(422).json({ error: "Please fill all the fields" });
        }
        //check if user exists
        const user = await User.findOne({ email }).populate("additionalDetails");
        if (!user) {
            return res.status(401).json({ error: "Invalid Credentials" });
        }
        //compare password
        const doMatch = await bcrypt.compare(password, user.password);
        if (doMatch) {
            //generate token
            const payload = { email: user.email, id: user._id, accountType: user.accountType }
            
            const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "3h" });
            user.token = token;
            user.password = undefined;

            const options = {
                expires: new Date(
                    Date.now() + 1000 * 60 * 60 * 3
                ),
                httpOnly: true,
            }
            //cookie geereate
            res.cookie("token", token, options).status(200).json({
                success: true,
                token,
                user,
                message: "User Logged In Successfully",

            })


        } else {
            return res.status(401).json({ error: "Invalid Credentials" });
        }
    } catch (error) {
        return res.status(500).json({ error: "Internal Server Error in LOGIN AUTH.Js" });
    }
}



//changePassword
exports.changePassword = async (req, res) => {
    const { oldPassword, newPassword, confirmPassword } = req.body;

    //validate user
    if (!oldPassword || !newPassword || !confirmPassword) {
        return res.status(422).json({ error: "Please fill all the fields" });
    }
    //password and confirm password should be same
    if (newPassword != confirmPassword) {
        return res.status(400).json({ error: "Password and Confirm Password should be same" });
    }
    //check if user exists
    const user = await User.findOne({ email: req.user.email });
    if (!user) {
        return res.status(401).json({ error: "Invalid Credentials" });
    }
    //compare password
    const doMatch = await bcrypt.compare(oldPassword, user.password);
    if (doMatch) {
        //generate token
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        await user.save();
        return res.status(200).json({ message: "Password Changed Successfully" });
    }
    else {
        return res.status(401).json({ error: "Invalid Credentials" });
    }
    //change the password
}