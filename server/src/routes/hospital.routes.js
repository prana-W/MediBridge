import express from 'express';
import {
    getHospitalsByState,
    getAllHospital,
} from '../controllers/hospital.controller.js';
import {verifyAccessToken} from '../middlewares/index.js';

const hospitalRouter = express.Router();

hospitalRouter.get('/', verifyAccessToken, getHospitalsByState);
hospitalRouter.get('/all', getAllHospital);

export default hospitalRouter;
