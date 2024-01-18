const mongoose = require('mongoose');


const sectionSchema = new Schema({
    sectionName: {
        type: String,

    },
    subSection: [
        {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "SubSection",
        }
    ],



});
module.exports = mongoose.model('Section', sectionSchema);