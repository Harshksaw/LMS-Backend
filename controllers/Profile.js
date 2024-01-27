const Profile = require('../models/Profile');
const User = require('../models/User');
const courseProgress = require('../models/courseProgress');
exports.updateProfile = async(req, res)=> {

    try {
        //get Data -> validation -> u
        //find profile -> update profile
        const { dateOfBirth="" ,about="" , contactNumber="", gender } = req.body;
        const id = req.user.id;
        if(contactNumber.length !== 10 || !gender || !id) return res.status(400).json({msg: "Please enter a valid details"})



        const userDetails = await User.findById(id);
        if(!userDetails) return res.status(404).json({msg: "User not found"})
        const profileId = userDetails.additionalDetails;

        const profileDetails = await Profile.findById(profileId);
        if(!profileDetails) return res.status(404).json({msg: "Profile not found"})

        //updating
        profileDetails.dateOfBirth = dateOfBirth;
        profileDetails.about = about;
        profileDetails.contactNumber = contactNumber;
        profileDetails.gender = gender;

        await profileDetails.save();
    
        return res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            data: profileDetails,
        })


    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "${error.message} subSection not updated"

        })
    }
}

exports.getProfole = async(req, res)=> {
    try {
        const id = req.user.id;


        const userDetails = await User.findById(id);
        if(!userDetails) return res.status(404).json({msg: "User not found"})
        
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "${error.message} subSection not retrived"

        })
        
    }
   
}



exports.deleteAccount = async(req, res)=> {
    try {

        //get id -> validation -> deleteProfile -> deleteUser
        const id = req.user.id;

        if(!id) return res.status(404).json({msg: "User not found"})

        const userDetails = await User.findById(id);

        if(!userDetails) return res.status(404).json({msg: "User not found ||DeleteUser"})


        await Profile.findByIdAndDelete( {_id: userDetails.additionalDetails} );

        await User.findByIdAndDelete( {_id: id});


        //now deleting it from enrolled Account 

        await courseProgress.deleteMany({userId: id});

        return res.status(200).json({
            success: true,
            message: "Account deleted successfully",
        })






    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "${error.message} subSection not deleted"

        })
    }
}


//get all details

exports.getAllDetails = async(req, res)=> {
    try {
        
            const id = req.user.id;
            if(!id) return res.status(404).json({msg: "User not found"})

            const userDetails = await User.findById(id).populate("additionalDetails").exec();

            if(!userDetails) return res.status(404).json({msg: "User not found"})
            return res.status(200).json({
                success: true,
                message: "Details retrived successfully",
                data: userDetails,
            })



           


    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "${error.message} subSection not deleted"

        })
    }
}