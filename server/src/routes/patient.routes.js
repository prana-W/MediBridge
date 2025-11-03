import {Router} from 'express';
import {
    signupPatient, loginPatient, logoutPatient
} from '../controllers/patient/auth.controller.js';
import {verifyAccessToken} from '../middlewares/index.js';

const authRouter = Router();

authRouter.route('/signup').post(signupPatient);
authRouter.route('/login').post(loginPatient);
authRouter.route('/logout').post(verifyAccessToken, logoutPatient);

export default authRouter;