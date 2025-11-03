import {Router} from 'express';
import {
    signupDoctor, loginDoctor, logoutDoctor
} from '../controllers/doctor/auth.controller.js';
import {verifyAccessToken} from '../middlewares/index.js';
import getDoctors from "../controllers/doctor/getDoctor.js";

const authRouter = Router();

authRouter.route('/signup').post(signupDoctor);
authRouter.route('/login').post(loginDoctor);
authRouter.route('/logout').post(verifyAccessToken, logoutDoctor);

authRouter.route('/getDoctors').post(getDoctors);

export default authRouter;