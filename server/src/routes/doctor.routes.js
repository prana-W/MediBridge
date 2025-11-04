import {Router} from 'express';
import {
    signupDoctor,
    loginDoctor,
    logoutDoctor,
} from '../controllers/doctor/auth.controller.js';
import {verifyAccessToken} from '../middlewares/index.js';
import getSlots from '../controllers/doctor/getSlots.js';
import {bookSlot} from '../controllers/doctor/bookSlot.js';
import {getAllAppointments} from '../controllers/doctor/appointment.controller.js';

const authRouter = Router();

authRouter.route('/signup').post(signupDoctor);
authRouter.route('/login').post(loginDoctor);
authRouter.route('/logout').post(verifyAccessToken, logoutDoctor);

authRouter.route('/getSlots').post(getSlots);
authRouter.route('/bookSlot').post(bookSlot);

authRouter.route('/appointments').get(verifyAccessToken, getAllAppointments);

export default authRouter;
