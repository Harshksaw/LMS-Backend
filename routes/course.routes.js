import { Router } from "express";
import {
    createCourse,
    removeCourse,
    getAllCourses,
    updateCourse,
    getLecturesBycourseId,
    addLectureToCourseById,

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
    .get(isLoggedIn, authorizeSubscribers, getLecturesBycourseId)
    .post(
        isLoggedIn,
        authorizeRoles('ADMIN'),
        upload.single('lecture'),
        addLectureToCourseById
      )
    // .put(isLoggedIn, authorizeRoles('ADMIN'), updateCourseById);


export default router;
