import mongoose from 'mongoose';

const hospitalSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
            unique: true,
        },
        state: {
            type: String,
            required: true,
            lowercase: true,
            trim: true,
        },
    },
    { timestamps: true }
);

const Hospital = mongoose.model('Hospital', hospitalSchema);

export default Hospital;
