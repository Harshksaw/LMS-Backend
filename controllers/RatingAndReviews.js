const RatingAndReview = require("../models/RatingAndReview");
const Course = require("../models/Course");


exports.createRatingAndReview = async (req, res) => {
    try {
        //get user id
        //check if user is enrolled in the course
        //if enrolled then create rating and review
        //check if user has already given rating and review
        //create rating and review
        //update course rating
        
        const userId = req.user.id;

        const {rating , review, courseId} = req.body;

        const courseDetails = await Course.find(
            {_id: courseId , studentsEnrolled: {$elemMath: {$eq:userId}}},

        )
        if(!courseDetails){
            return res.status(404).json({msg : "User not enrolled in the course"})

        }

        const alreadyReviewed = await RatingAndReview.find({userId: userId, courseId: courseId});
        if(alreadyReviewed){
            return res.status(400).json({msg : "User already reviewed the course"})

        }

        const ratingAndReview = await RatingAndReview.create({
            rating: rating,
            review: review,
            user: userId,


        })

        const updatedCourseDetails = await Course.findByIdAndUpdate( {_id :courseId}, 
            {
            $push: {ratingAndReview: ratingAndReview._id},
        },{new: true})
        
        console.log(updatedCourseDetails)
    
        return res.status(200).json({
            msg: "Rating and Review created successfully",
            ratingAndReview: ratingAndReview
        })



        
    } catch (error) {
        return res.status(500).json({
            error: "Internal Server Error while creating Rating and Review"
        })
        
    }

}

exports.getRatingAndReview = async (req, res) => {
    try {
        
        //get course id
        
        const courseId = req.body.courseId;

        const result = await RatingAndReview.aggregate([
            {
                $match:{
                    course: new moongoose.Types.ObjectId(courseId), //converting courseid(string ) to object id

                },

            },
            {
                $group: {
                    _id: null,
                    averageRating: {$avg: "$rating"},
                    reviews: {$push: "$$ROOT"},
                }
            }
        ])
        if(result.lenght > 0){
            return res.status(200).json({
                success:true,
                averageRating:result[0].averageRating,
            })
        }   
        return res.status(200).json({
            success:true,
            message: "Average Rating is 0 , no ratings given till now",
            averageRating:0,
        })

        //get rating and review 
        //calculate average rating
        //send response


    } catch (error) {
        return res.status(500).json({
            error: "Internal Server Error while getting Rating and Review"
        })
        
    }
}


exports.getAllCourseRatingAndReview = async (req, res) => {
    try {

        const courseId = req.body.courseId

        const allRating = Course.find({_id:courseId})

        
    } catch (error) {
        return res.status(500).json({
            error: "Internal Server Error while getting all Rating and Review"
        })
        
    }
}

exports.getAllRatingAndReview = async (req, res) => {
    try {



        const allRating =  await RatingAndReview.find({})
        .sort({rating:"desc"})
        .populate({ path: "user", select: "firstName lastName email image",})
        .populate({$path:"course" ,select:"courseName",})
        .exec();

        return res.status(200).json({
            success:true,
            message:"All reviews Fetched Successfully",
            data :allRating,
        })


        
    } catch (error) {
        return res.status(500).json({
            error: "Internal Server Error while getting all Rating and Review"
        })
        
    }
}