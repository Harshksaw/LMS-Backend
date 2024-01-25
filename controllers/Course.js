const Course = require('../models/Course');
const Tags = require('../models/Tags');

const User = require('../models/User');
const {uploadImageToCloudinary} = require("../utils/imageUploader");


//createCOurce handler function

exports.createCource= async(req, res)=>{
    try {
        


        const {courceName, courceDescription , whatyouwillLearn, price, tags} = req.body;
        const thumbnail =  req.files.thumbnailImage

        //validation

        if(!courceName || !courceDescription || !whatyouwillLearn || !price || !tags || !thumbnail){
            return res.status(400).json({
                success:false,
                message: "Please fill all the fields"
            })
        
        }
        //check for instructor
        const userId = req.user.id;

        const instructorDetails = await User.findById(userId);

        console.log("Instructor Details", instructorDetails);
        if(!instructorDetails){
            return res.status(400).json({
                success:false,
                message: "Instructor not found"
            })
        }
        //check valid tags 
        const tagDetails = await Tags.findById(tag)
        if(!tagDetails){
            return res.status(400).json({
                success:false,
                message: "Tag not found"
            })
        }

        
        //upload image to cloudinary
        const thumbnailImage = await uploadImageToCloudinary(thumbnail , Process.env.FOLDER_NAME);

        const newCourse = await Course.create({
            courceName,
            courceDescription,
            instructor : instructorDetails._id,
            whatyouwillLearn,
            price,
            
            tags : tagDetails._id,

            thumbnailImage: thumbnailImage.secure_url,

        })
        //add the new COurce to user schema of isntructor

        await User.findByIdAndUpdate(
            {_id: instructorDetails._id},
            {$push: {
                courses : newCourse._id,
            },
        },
            {new:true},
        
        )
        //update the Tag Schema


        return res.status(200).json({
            success:true,
            message:"Cource Created Successfully",
            data: newCourse,
        })




    } catch (error) {
        res.status(200).json({
            success:false,
            message: "Something went wrong while CreatingCource , Backend",
            error:error.message
        })
    }

}

//get all COurcese

exports.getAllCourses = async (req, res)=>{
    try {
        const allCourses =await Courses.find({}, {coursesName: true, price:true, thumbnail:true, instructor:true, ratingAndReviews:true,  studentsEntrolled:true})
        .populate("instructor")
        .exec()

        return res.status(200).json({
            success:true,
            message:"Data for all courses  fetched successfully",
            data:allCourses,
        })
    } catch (error) {
        return res.status(500).json({
            success:false,
            message: 'Cannot fetch cource data'
        })
    }
}