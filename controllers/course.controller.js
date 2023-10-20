import AppError from "../utils/error.util.js";
import Course from '../models/course.model.js';


import cloudinary from 'cloudinary';


import fs from 'fs/promises';

const getAllCourses = async function (req, res, next) {
    try {

        const courses = await Course.find({}).select('-lectures');

        res.status(200).json({
            success: true,
            message: 'All Courses',
            courses,
        })
    } catch (e) {
        return next(
            new AppError(e.message, 500)
        )

    }
}

const getLecturesByCourceId = async function (req, res, next) {
    try {
        const { id } = req.params;
        const course = await Course.findById(id);

        if (!course) {
            return next(
                new AppError('Invalid Course id', 400)
            )
        }

        res.status(200).json({
            success: true,
            message: 'Course Lectures fetched Successfully',
            lectures: course.lectures

        });

    } catch (err) {
        console.log(err)
    }
}

const createCourse = async(req, res, next) => {

    const { title, description, category, createdBy } = req.body;
    console.log( title, description, category, createdBy)
    if (!title || !description || !category || !createdBy) {
        return next(
            new AppError('ALl fields are required->', 400)
        )
    }
    const course = await Course.create({
        title,
        description,
        category,
        createdBy,
        thumbnail: {
            public_id: 'Dummy',
            secure_url: 'Dummy',
        },
    })
    if (!course) {
        return next(
            new AppError('Course could not be created please try again')
        )
    }
    try {


        if (req.file) {
            const result = await cloudinary.v2.uploader.upload(req.file.path,
                {
                    folder: 'Lms'
                })
            if (result) {
                course.thumbnail.public_id = result.public_id;
                course.thumbnail.secure_url = result.secure_url;

            }
            //delete file from local machine
            fs.rm(`uploads/${req.file.filename}`)


        }
        await course.save()

        res.status(200).json({
            success: true,
            message: 'Course created successfully ',
            course,
        });
    } catch (e) {
        return next(
            new AppError(e.message, 'Course could not created please try again later', 500)
        )
    }

}
const updateCourse = async(req, res, next) => {
    try{
        const {id} = req.params;

        const course = await Course.findByIdAndUpdate(
            id,{
                $set: req.body
            },
            {
                runValidators
            }
        );
        if(!course ){
            new AppError("COurse with give id does not exits", 500)
        }


        res.status(200).json({
            success:true,
            message:'COurse updated Successdully',
            course
        })



    }catch(e){
        return next(
            new AppError(e.message, 500)
        )
    }

}

const removeCourse = async(req, res, next) => {
    try{
        const {id} = req.params;
        const course = await Course.findById(id);


        if(!course){
            return next(
                new AppError('Course with given id does not exits', 500)
            )
        }
        await Course.findByIdAndDelete(id)
        res.status(200).json({
            success:true,
            message:'COurse delete successfully'
        })


    }catch(e){
        return next(
            new AppError(e.message, 500)
        )
    }

}
export {
    getAllCourses,
    getLecturesByCourceId,
    createCourse,
    updateCourse,
    removeCourse
}
