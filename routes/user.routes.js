import { getProfile , login , logout, register} from "../controllers/user.controller"
import { isLoggedIn } from "../middlewares/auth.middlewares";

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.get('/logout', logout);
router.get('/me',isLoggedIn, getProfile);