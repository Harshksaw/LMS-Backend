const moongose = require('mongoose');

const OTPSchema = new moongose.Schema({
    email: {
        type:String,
        required:true,
    },
    otp: {
        type:String,
        required:true,
    }, 
    createdAt: {
        type:Date,
        default:Date.now,
        expires:600,
    }
});

//to send emails


async function sendVerificationEmail(email, otp){
    try {
        const emailResponse = await mailSender(email, "Verification Email for StudyNotion", otp);
        console.log("emailResponse", emailResponse);
        
    } catch (error) {
        console.log("OTP, occured while sending emails ",error.message);

    }
}


OTPSchema.pre('save', async function(next){
    try {
        await sendVerificationEmail(this.email, this.otp);
        next();
    } catch (error) {
        next(error);
    }

});


module.exports = moongose.model('Otp', OTPSchema);