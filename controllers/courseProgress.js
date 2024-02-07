const CourseProgress = require("../models/CourseProgress");
const SubSection = require("../models/SubSection");


exports.updateCourseProgress = async(req,res) => {
    const {courseId, subSectionId} = req.body;
    const userId = req.user.id;


    try{
        //check id subsection is valid

        const subsection = await SubSection.findById(subSectionId);
        if(!subsection){
            return res.status(400).json({error:"Invalid Subsection"});
        }
        //check for old entry

        let courseProgress = await CourseProgress.findOne({
            courseID:courseId,
            userId:userId,

        });
        if(!courseProgress){
            return res.status(400).json({
                success:false,
                message:"COurse Progress does not exists"
            })
        }
        else{
            //check for re completing video/subsection
            if(courseProgress.completedVideos.includes(subSectionId)){

            }
        }
        courseProgress.completedVideos.push(subSectionId);

        await courseProgress.save();
    }
    catch(error) {
        console.error(error);
        return res.status(400).json({error:"Internal Server Error"});
    }
}