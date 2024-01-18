const mongoose = require('mongoose');

const subSectionSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    timeDuration: {
        type: String,

    },
    description: {
        type: String,


    },
    videoUrl: {
        type: String,

    }


});
exports.Profile = mongoose.model('subSection', subSectionSchema);