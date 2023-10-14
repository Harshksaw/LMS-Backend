import { Router } from "express";
import { getProfile , login , logout, register} from "../controllers/user.controller.js"
import { isLoggedIn } from "../middlewares/auth.middlewares.js";
import upload from "../middlewares/multer.middleware.js";

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.get('/logout', logout);
router.get('/me',isLoggedIn, getProfile);

export default router;