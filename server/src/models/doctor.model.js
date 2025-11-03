import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import {ApiError} from '../utility/index.js';
import statusCode from '../constants/statusCode.js';

const doctorSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },

        department: {
            type: String,
            required: true,
            enum: [
                'general',
                'dermatologist',
                'gynecologist',
                'cardiologist',
                'orthopedic',
                'pediatrician',
                'neurologist',
                'dentist',
            ],
            lowercase: true,
        },

        hospital: {
            type: String,
            required: true,
            trim: true,
        },

        idCardNumber: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },

        workingDays: {
            type: [String], // e.g. ["monday", "tuesday"]
            required: true,
            lowercase: true,
        },

        email: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            lowercase: true,
        },

        password: {
            type: String,
            required: true,
            minlength: 6,
            select: false,
        },

        refreshToken: {
            type: String,
            select: false,
        },
        currSlot: {
            type: Number,
            default: 0,
            min: 0,
            max: 10,
            validate: {
                validator: function (v) {
                    return v >= 0 && v <= 10;
                },
                message: 'Slots must be between 0 and 10',
            },
        },
        currDate: {
            type: Date,
            default: Date.now,
        },
    },
    {timestamps: true}
);

doctorSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

doctorSchema.methods.generateAndUpdateRefreshToken = async function () {
    try {
        const refreshToken = jwt.sign(
            {doctorId: this._id},
            process.env.REFRESH_TOKEN_SECRET,
            {expiresIn: process.env.REFRESH_TOKEN_EXPIRY}
        );

        this.refreshToken = refreshToken;
        await this.save({validateBeforeSave: false});

        return refreshToken;
    } catch (error) {
        throw new ApiError(
            statusCode.INTERNAL_SERVER_ERROR,
            'Error generating refresh token'
        );
    }
};

doctorSchema.methods.comparePassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

doctorSchema.methods.checkAndResetSlots = function () {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Normalize to start of day

    const docDate = new Date(this.currDate);
    docDate.setHours(0, 0, 0, 0);

    if (today.getTime() !== docDate.getTime()) {
        this.currSlot = 0;
        this.currDate = today;
    }
};

doctorSchema.methods.bookSlot = async function () {
    this.checkAndResetSlots();

    // Check if slots are full
    if (this.currSlot >= 10) {
        throw new Error('All slots are booked for today');
    }

    this.currSlot += 1;
    await this.save();

    return this.currSlot;
};

const Doctor = mongoose.model('Doctor', doctorSchema);
export default Doctor;
