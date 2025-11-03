import express from 'express';
const aiRouter = express.Router();

import {aiController} from '../controllers/ai.controller.js';

aiRouter.route('/interpret').post(aiController);

export default aiRouter;
