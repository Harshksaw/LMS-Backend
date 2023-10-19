import { Router } from "express";
import {
    createCourse,
    deleteCourse,
    getAllCourses,
    getLecturesByCourceId,
    updateCourse,
} from "../controllers/course.controller.js";
import { isLoggedIn } from "../middlewares/auth.middlewares.js";
import upload from "../middlewares/multer.middleware.js";

const router = new Router();

router
    .route("/")
    .get(getAllCourses)
    .post(upload.single("thumbnail"), createCourse);


router
    .get("/:id")
    .get(isLoggedIn, getLecturesByCourceId)

    .delete(deleteCourse);

export default router;
