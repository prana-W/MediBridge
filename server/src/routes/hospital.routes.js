import express from 'express';
import {
    getHospitalsByState,
} from '../controllers/hospital.controller.js';

const hospitalRouter = express.Router();

hospitalRouter.get('/:state', getHospitalsByState);

export default hospitalRouter;
