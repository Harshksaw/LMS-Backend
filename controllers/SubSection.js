

const Subsection = require('../models/SubSection');
const Section = require('../models/Section');
const cloudinary = require('cloudinary').v2;

exports.createSubSection = async (req, res) => {

    try {

        //create subsection 
        const {sectionId ,title,  timeDuration ,description } = req.body;

        const video = req.files.videoFile;

        if(!title || !sectionId || !timeDuration || !description || !video) return res.status(400).json({
            success: false,
            message: "Please fill in all fields."
        })
        //upload video to cloudinary

        const uploadDetails = await uploadImageToCloudinary(video,  process.env.FOLDER_NAME)

        if(!uploadDetails) return res.status(500).json({msg: "Error uploading video"})

        //update section with this sub section Object Id

        const subSectionDetails = await Subsection.create({
            title: title,
            timeDuration: `${uploadDetails.duration}`,
            description: description,
            videoUrl: uploadDetails.secure_url,
          })

        const updatedSection = await Section.findByIdAndUpdate(sectionId, {
            $push:{
               subSection: subSectionDetails._id,
            }

        }, {new: true}).populate("subSection")


        return res.status(200).json({
            success: true,
            message: "Subsection created successfully"})


    } catch (error) {
        return res.status(500).json({msg: error.message})
    }
}

exports.updateSubSection = async (req, res) => {
    try {
        const { sectionId,subSectionId, title, description } = req.body
        const subSection = await Subsection.findById(subSectionId)
    
        if(!subSection){
          return res.status(404).json({success: false,  message: "SubSection not found", })
        }
    
        if(title !== undefined){
          subSection.title = title
        }
    
        if(description !== undefined){
          subSection.description = description
        }
  
        if(req.files && req.files.video !== undefined){
          const video = req.files.video
          const uploadDetails = await uploadImageToCloudinary( video, process.env.FOLDER_NAME )
          subSection.videoUrl = uploadDetails.secure_url
          subSection.timeDuration = `${uploadDetails.duration}`
        }
    
        await subSection.save()
        const updatedSection = await Section.findById(sectionId).populate("subSection")
        return res.json({
            success: true,
            data:updatedSection,
            message: "Section updated successfully",
          })

    } catch (error) {
        return res.status(500).json({msg: error.message})
    }
}