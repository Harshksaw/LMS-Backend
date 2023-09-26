import { Schema, model } from "mongoose";
import bcrypt from 'bcryptjs';

const userSchema = new Schema({
    fullName: {
        type: 'String',
        required: [true, 'Name is Required'],
        minLength: [5, "name must be at least 5 char"],
        maxLength: [5, "Name should be less than   50 char"],
        lowercase: true,
        trim: true,
    },
    email: {
        type: 'String',
        required: [true, 'Email is Required'],
        lowercase: true,
        trim: true,
        unique: true,
        match: []

    },
    password: {
        type: 'String',
        required: [true, 'Password Required'],
        minLength: [8, 'Password must be at least 8 char'],
        select: false
    },
    avatar: {
        public_id: {
            type: 'String'
        },
        secure_url: {
            type: 'String'
        }
    },
    role: {
        type: 'String',
        enum: ['USER', 'ADMIN'],
        default: 'USER'
    },

    forgotPasswordToken: String,
    forgotPasswordExpiry: Date
}, {
    timestamps: true



})
userSchema.pre('save', async function(next){
    if(!this.isModified('password')){
        return next();
    }
    this.password =await  bcrypt.hash(this.password, 10);
})
userSchema.pre('save', userSchema);
const User = model('User', userSchema);

export default User;