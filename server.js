import Razorpay from "razorpay";
import app from "./app.js";
import connectionToDB from "./config/dbConnection.js";
import cloudinary from 'cloudinary';

// CLoudinary configuration
cloudinary.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const razorpay = new Razorpay({
    key_id:process.env.RAZORPAY_KEY_ID,
    // key_secret:,

})

const PORT = process.env.PORT || 5005;
app.listen(PORT, async () => {
    await connectionToDB();
    console.log(`App is running at http://localhost:${PORT}`);
});
