const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  accountType: {
    type: String,
    enum: ['Admin', 'Student', 'Instructor'],
    required: true,
  },
  additionalDetails: {
    type: mongoose.Schema.Types.ObjectId,
    required:true,
    ref: "Profile",
  },
  cources: [
    {
        type:mongoose.Schema.Types.ObjectId,
        ref:"Cource",
    }
  ],
  image: {
    type:String,
    required:true
  },
  courceProgress: [
    {
        type:mongoose.Schema.Types.ObjectId,
        ref: "CourseProgress",
    }
  ],
  

});

const User = mongoose.model('User', userSchema);

module.exports = User;
