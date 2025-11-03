import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import checkHealth from './controllers/checkHealth.controller.js';
import {errorHandler, verifyAccessToken} from './middlewares/index.js';
import morgan from 'morgan';
import doctorAuthRoutes from './routes/doctor.routes.js';
import patientAuthRoutes from './routes/patient.routes.js';
import visitorsRouter from './routes/visitors.routes.js';
import hospitalsRouter from './routes/hospital.routes.js';
import aiRouter from "./routes/aiRouter.routes.js";

const app = express();

app.use(morgan('dev'));

const allowedOrigins = process.env.CORS_ORIGIN?.split(',') || [];

app.use(
    cors({
        origin: allowedOrigins,
        credentials: true,
    })
);

app.use(express.json());

app.use(express.urlencoded({extended: true}));
app.use(express.static('public'));
app.use(cookieParser());

// API Routes

// Todo: Protect all the routes!!!
app.get('/', checkHealth);
app.get('/api/v1/check-health', checkHealth);
app.use('/api/v1/auth/doctor', doctorAuthRoutes);
app.use('/api/v1/auth/patient', patientAuthRoutes);
app.use('/api/v1/visitors', visitorsRouter);
app.use('/api/v1/hospital', hospitalsRouter);
app.use('/api/v1/ai', aiRouter);

// app.use('/admin', adminRouter);

// Error Handling
app.use(errorHandler());

export default app;
