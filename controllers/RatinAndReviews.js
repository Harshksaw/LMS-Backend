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

        await Course.findByIdAndUpdate(courseId, {
            $push: {ratingAndReview: ratingAndReview._id}
        })
    
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
        
    } catch (error) {
        return res.status(500).json({
            error: "Internal Server Error while getting Rating and Review"
        })
        
    }
}


exports.getAllRatingAndReview = async (req, res) => {
    try {
        
    } catch (error) {
        return res.status(500).json({
            error: "Internal Server Error while getting all Rating and Review"
        })
        
    }
}