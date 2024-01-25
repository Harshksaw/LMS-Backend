const Section = require('../models/Section')

const Course = require('../models/Course')
 

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
        const {sectionId} = req.params
        if(!sectionId) return res.status(400).json({
            success: false,
            message: "Please fill in all fields."
        })


        const section = await Section.findByIdAndDelete(sectionId)

        //delete from schema

        return res.status(200).json({msg: "Section deleted successfully"})  
        
    } catch (error) {
        return res.status(500).json({msg: error.message})
    }
}