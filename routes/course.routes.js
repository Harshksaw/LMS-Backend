import { Router } from "express";
import {
    createCourse,

    getAllCourses,


    addLectureToCourseById,
    getLecturesByCourseId,
    deleteCourseById,

} from "../controllers/course.controller.js";
import {
    authorizeRoles,
    authorizeSubscribers,
    isLoggedIn,
} from "../middlewares/auth.middleware.js";
import upload from "../middlewares/multer.middleware.js";

const router = new Router();

router
    .route("/")

    .get(getAllCourses)
    .post(isLoggedIn, 
        authorizeRoles('ADMIN'),
        upload.single("thumbnail"),
        createCourse)
    // .delete(isLoggedIn, authorizeRoles('ADMIN'), rem)

router
    .route("/:id")
    .get(isLoggedIn, authorizeSubscribers, getLecturesByCourseId)
    .post(
        isLoggedIn,
        authorizeRoles('ADMIN'),
        upload.single('lecture'),
        addLectureToCourseById
      )
    .delete(isLoggedIn, authorizeRoles('ADMIN'), deleteCourseById)
    // .put(isLoggedIn, authorizeRoles('ADMIN'), updateCourseById);


export default router;
