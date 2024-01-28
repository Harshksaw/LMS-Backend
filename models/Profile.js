const { default: mongoose } = require("mongoose");


const ProfileSchema = new mongoose.Schema({
    gender: {
        type: String,
        required: true,
    },
    dateOfBirth: {
        type: Date,
        required: true,
    },
    about: {
        type: String,
        trim: true,
        required: true,
    },
    contactNumber: {
        type: Number,
        trim:true,
    }


});
exports.Profile = mongoose.model('Profile', ProfileSchema);