const mongoose = require('mongoose');
const courceSchema = new Schema({
    courceName: {
        type: String,
        trim: true,
        required: true,
    },
    courceDescription: {
        type: String,
        required: true,
    },
    instructor: {
        type: String,
        ref: "User",
        required: true,
    },
    whatYouWillLearn: {
        type: String,

    },
    courceContent: [
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"Section"
        }
    ],
    ratingAndReviews: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref:"RatingAndReview",
        }
    ],
    price: {
        type: Number,
        required: true,
    },
    thumbnail : {
        type: String,
    },
    tags:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"Tag",
    },
    studentsEnrolled: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref:"User",
            required: true,
        }
    ]

    


});
module.exports = mongoose.model('Cource', courceSchema);