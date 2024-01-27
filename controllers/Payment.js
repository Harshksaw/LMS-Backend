const { razorpay } = require("../config/razorpay");
const Course = require("../models/Course");
const User = require("../models/User");
const Order = require("../models/Order");
const mailSender = require("../config/mailSender");

const { courseEnrolledMail } = require("../config/mailTemplate");
const { default: webhooks } = require("razorpay/dist/types/webhooks");

//capture payment and enroll user
exports.capturePayment = async (req, res) => {
  try {
    //get courseId
    const { course_id } = req.body;
    const userId = req.user.id;

    if (!course_id)
      return res.status(400).json({ msg: "Please select a  valid course" });
    if (!userId)
      return res
        .status(400)
        .json({ msg: "Please login to enroll in a course" });

    let course;
    try {
      course = await Course.findById(courseId);
      if (!course)
        return res.status(400).json({ msg: "Please select a  valid course" });
    } catch (err) {
      return res.status(400).json({ msg: "Please select a  valid course" });
    }

    //get user
    //validation -> courseDetails

    //user already pay for the same course
    //verify if bought the course already
    const uid = new mongoose.Types.ObjectId(userId);
    if(course.studentsEnrolled.includes(uid)){
      return res.status(400).json({ msg: "You already bought this course" });
    }
    //create order




  } catch (error) {
    return res.status(500).json({ msg: error.message });
  }

  //order amount 
  const amount = Course.price;
  const currency = "INR";

  const options = {
    amount: amount * 100,
    currency,
    receipt: Math.random(Date.now()).toString(),
    notes:{
        courseId:courseId,
        userId,
    }
    }  
    try {
        const order = await razorpay.orders.create(options);
        res.json(order);
        console.log(order);

        return res.status(200).json({
            success: true,

            message: "Payment successful" ,
            courseName: Course.name,
            courseDescription: Course.description,
            currency:order.currency,
            amount:order.amount,
            orderId:order.id,

            
        });
    } catch (error) {
        return res.status(500).json({ msg: error.message });
    }

  }


exports.verifySignature = async (req, res) => {

    try {

        const webhooks = "123455667";

        const signature = req.headers["x-razorpay-signature"];

        const shasum  = crypto.createHmac("sha256", process.env.RAZORPAY_SECRET)
        shasum.update(JSON.stringify(webhooks))
        const digest = shasum.digest("hex")

        if(digest == signature){

            console.log("request is legit")

            const {courseId, userId} = req.body.payload.payment.entity.notes;


            try {
              
                const enrolledCourse = await Course.findOneAndUpdate({_id: courseId},
                  {
                    $push: { studentsEnrolled: userId },
                  },
                  { new: true },
                  
                  );

                  if(!enrolledCourse){
                    return res.status(400).json({ msg: "course not found" });
                  }
                  console.log(enrolledCourse);

                  //find the student and update the course in th elist of enrolled courses

                  const enrolledStudent = await User.findOneAndUpdate({_id: userId},
                    {
                      $push:{courses: courseId},
                    },
                    {new:true},
                    );
                    
                    console.log(enrolledStudent);

                    //mail sender to the user

                    const emailResponse = await mailSender({
                        to: enrolledStudent.email,
                        subject: "Course Enrolled",
                        text: courseEnrolledMail(enrolledStudent.name, enrolledCourse.name)

                    });

                    console.log(emailResponse); 
                    return res.status(200).json({ msg: "Course enrolled successfully" });


            } catch (error) {
              return res.status(400).json({ msg: "Please select a  valid course" });
            }

        }
        else{
            return res.status(400).json({
                success: false,
                message: "Payment failed",
              })
        }




    } catch (error) {
        return res.status(500).json({ msg: error.message });
        
    }
}
