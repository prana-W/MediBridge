import express from 'express';
import {
    getHospitalsByState,
} from '../controllers/hospital.controller.js';
import {verifyAccessToken} from "../middlewares/index.js";

const hospitalRouter = express.Router();

hospitalRouter.get('/', verifyAccessToken, getHospitalsByState);

export default hospitalRouter;
