const { instance } = require("../config/razorpay");
const { razorpay } = require("../config/razorpay");
const User = require("../models/User");
const mailSender = require("../utils/mailSender");
const {courseEnrollmentEmail} = require("../mail/templates/courseEnrollmentEmail");
const { default: mongoose } = require("mongoose");
const { paymentSuccessEmail } = require("../mail/templates/paymentSuccessEmail");
const crypto = require("crypto");
const CourseProgress = require("../models/CourseProgress");
const Course = require("../models/Course");
const User = require("../models/User");
// const Order = require("../models/Order");
const mailSender = require("../utils/mailSender");

// const { courseEnrolledMail } = require("../config/mailTemplate");
const { default: webhooks } = require("razorpay/dist/types/webhooks");

const options = {
    amount: totalAmount * 100,
    currency: "INR",
    receipt: Math.random(Date.now()).toString(),
}

try {
    const paymentResponse = await instance.orders.create(options);
    res.json({
        success: true,
        message: paymentResponse,
    })
} catch (error) {
    console.log(error)
    return res.status(500).json({
        success: false,
        message: "Could no Initiate  Order"
    });

}


exports.capturePayment = async (req, res) => {
    const { courses } = req.body;
    const userId = req.user.id;

    if (courses.length === 0) {
        return res.json({ success: false, message: "Please provide Course Id" });
    }

    let totalAmount = 0;

    for (const course_id of courses) {
        let course;
        try {

            course = await Course.findById(course_id);
            if (!course) {
                return res.status(200).json({ success: false, message: "Could not find the course" });
            }
            const uid = new mongoose.Types.ObjectId(userId);

            if (course.studentsEnrolled.includes(uid)) {
                return res.status(200).json({ success: false, message: "Student is already enrolled" });
            }
            totalAmount += course.price;



        } catch (error) {
            console.log(error);
            return res.status(500).json({ success: false, message: error.message });

        }
    }


}


exports.verifyPayment = async (req, res) => {
    const razorpay_order_id = req?.body?.razorpay_order_id;
    const razorpay_payment_id = req?.body?.razorpay_payment_id;
    const razorpay_signature = req?.boyd?.razorpay_signature;
    const courses = req.body?.courses;
    const userId = req.user.id;


    if (!razorpay_order_id || !razorpay_signature || !razorpay_signature || courses || userId) {
        return res.status(200).json({
            success: false, message: "Payment failed"
        })
    }

    let body = razorpay_order_id + "|" + razorpay_payment_id;;
    const expectedSignature = crypto
        .createHmac("sha256", process.env.RAZORPAY_SECRET)
        .update(body.toString())
        .digest("hex")

    if (expectedSignature == razorpay_signature) {
        //enroll student to courses
        enrolledStudents(courses, userId, res)

        return res.status(200).json({
            success: true,
            message: "Payment Verified"
        });
    }
    return res.status(200).json({ success: false, message: "Payment Failed" })

}


const enrolledStudents = async (courses, userId, res) => {
    if (!courses || !userId) {
        return res.status(400).json({
            success: false,
            message: "Please Provide Data for Courses or UserId"
        })
    }
    try{

    for (const courseId of courses) {
        //find the course and enroll in it
        const enrolledCourses = await Course.findOneAndUpdate(
            { _id: courseId },
            { $push: { studentsEnrolled: userId } },
            { new: true },

        )
        if (!enrolledCourses) {
            return res.status(500).json({
                success: false,
                message: "Course Not found | enrolledStudents"
            })
        }
            const courseProgress = await CourseProgress.findOne({
                courseID: courseId,
                userId: userId,
                completedVideos: [],
            });

        //find the student and add the courses to enrolled courses
        const enrolledStudents = await User.findByIdAndUpdate(
            userId,
            {
                $push: {
                    courses: courseId,
                    courseProgress: courseProgress._id,
                }
            },
            { new: true }
        )

        //mail send

        const emailResponse = await mailSender(
            enrolledStudents.email,
            `Successfully Enrolled into ${enrolledCourses.courseName}`,
            courseEnrollmentEmail(enrolledCourses.courseName, `${enrolledStudents.firstName}`)
        )

        console.log("Email Sent Successfully", emailResponse.response);


    }
    }catch(error) {
        console.log(error);
        return res.status(500).json({success:false, message:error.message});
    }
}
    
  






