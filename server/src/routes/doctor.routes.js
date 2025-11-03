import {Router} from 'express';
import {
    signupDoctor, loginDoctor, logoutDoctor
} from '../controllers/doctor/auth.controller.js';
import {verifyAccessToken} from '../middlewares/index.js';

const authRouter = Router();

authRouter.route('/signup').post(signupDoctor);
authRouter.route('/login').post(loginDoctor);
authRouter.route('/logout').post(verifyAccessToken, logoutDoctor);

export default authRouter;