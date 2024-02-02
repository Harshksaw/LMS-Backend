const Section = require('../models/Section');
const Course = require('../models/Course');
const SubSection = require('../models/SubSection');

exports.createSection = async (req, res) => {
    try {
    //data fetch adn validation}

    const {sectionName,  courseId} = req.body

    if(!sectionName || !courseId) return res.status(400).json({
        success: false,
        message: "Please fill in all fields."
    })


    const newSection = await Section.create({
        sectionName
    })

    const updatedCourse = await Course.findByIdAndUpdate(courseId, {
        $push:{
            courseContent: newSection._id,
        },
    },
        {new: true},
    ).populate('courseContent', 'sectionName').exec();


    return res.status(200).json({msg: "Section created successfully"})

    } catch (error) {
        return res.status(500).json({msg: error.message})
    }
}


exports.updateSection = async (req, res) => {   

    try {

        //data input -> validation -> update

        const {sectionName, sectionId} = req.body
        if(!sectionName || !sectionId) return res.status(400).json({
            success: false,
            message: "Please fill in all fields."
        })


        const section = await Section.findByIdAndUpdate(sectionId, {
            sectionName
        }, {new: true
        })

        return res.status(200).json({msg: "Section updated successfully"})  
        
    } catch (error) {
        return res.status(500).json({msg: error.message})
    }
}

exports.deleteSection = async (req, res) => {
    try {
        
        const {sectionId, courseId} = req.body;

        if (!sectionId) {
            return res.status(400).json({
                success:false,
                message:'All fields are required| sectionId',
            });
        }

        const sectionDetails = await Section.findById(sectionId);
        

        sectionDetails.subSection.forEach( async (ssid)=>{
            await SubSection.findByIdAndDelete(ssid);
        })
        console.log('Subsections within the section deleted')
        //NOTE: Due to cascading deletion, Mongoose automatically triggers the built-in middleware to perform a cascading delete for all the referenced 
        //SubSection documents. DOUBTFUL!

        //From course, courseContent the section gets automatically deleted due to cascading delete feature
        await Section.findByIdAndDelete(sectionId);
        console.log('Section deleted')

        const updatedCourse = await Course.findById(courseId)
          .populate({
              path:"courseContent",
              populate: {
                  path:"subSection"
              }});
        return res.status(200).json({
            success:true,
            message:'Section deleted successfully',
            updatedCourse
        })   
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success:false,
            message:'Failed to delete Section',
            error: error.message,
        })
    }
}