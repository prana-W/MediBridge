import express from 'express';
import {
    getHospitalsByState,
    addHospital,
} from '../controllers/hospital.controller.js';

const hospitalRouter = express.Router();

hospitalRouter.get('/:state', getHospitalsByState);
hospitalRouter.post('/', addHospital);

export default hospitalRouter;
