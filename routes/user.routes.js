import { getProfile , login , logout, register} from "../controllers/user.controller"
import { isLoggedIn } from "../middlewares/auth.middlewares";
import upload from "../middlewares/multer.middleware";

const router = Router();

router.post('/register', upload.single("avatar"), register);
router.post('/login', login);
router.get('/logout', logout);
router.get('/me',isLoggedIn, getProfile);