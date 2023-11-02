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
    authorizedRoles,
    authorizedSubscriber,
    isLoggedIn,
} from "../middlewares/auth.middlewares.js";
import upload from "../middlewares/multer.middleware.js";

const router = new Router();

router
    .route("/")

    .get(getAllCourses)
    .post(isLoggedIn, authorizedRoles('ADMIN'), upload.single("thumbnail"), createCourse);

router
    .route("/:id")
    .get(isLoggedIn, authorizedSubscriber, getLecturesBycourseId)
    .put(isLoggedIn,authorizedRoles('ADMIN') , updateCourse)
    .delete(isLoggedIn,authorizedRoles('ADMIN') ,removeCourse)
    .post(
        isLoggedIn,
        authorizedRoles('ADMIN'), 
        upload.single('lecture'), 
        addLectureToCourseById
        )


export default router;
