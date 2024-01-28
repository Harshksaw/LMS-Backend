const mongoose = require('mongoose');

const CourceProgressSchema = new mongoose.Schema({
    courseID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',

    },
    completedVideos: {
        type: mongoose.Schema.Types.ObjectId,
        ref:"Subscription",
    }
});

module.exports = mongoose.model('CourceProgress', CourceProgressSchema);


