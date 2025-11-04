import {Router} from 'express';
import {
    signupPatient,
    loginPatient,
    logoutPatient,
} from '../controllers/patient/auth.controller.js';
import {verifyAccessToken} from '../middlewares/index.js';
import {getAllAppointments} from '../controllers/appointment.controller.js';

const authRouter = Router();

authRouter.route('/signup').post(signupPatient);
authRouter.route('/login').post(loginPatient);
authRouter.route('/logout').post(verifyAccessToken, logoutPatient);
authRouter.route('/appointments').get(verifyAccessToken, getAllAppointments);

export default authRouter;
