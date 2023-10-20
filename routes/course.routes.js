import { Router } from "express";
import {
    createCourse,
    removeCourse,
    getAllCourses,
    updateCourse,
} from "../controllers/course.controller.js";
import {
    authorizedRoles,
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
    .put(isLoggedIn,authorizedRoles('ADMIN') , updateCourse)
    .delete(isLoggedIn,authorizedRoles('ADMIN') ,removeCourse);
// .get(isLoggedIn, getLecturesByCourceId)

export default router;
