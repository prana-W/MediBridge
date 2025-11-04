import mongoose from "mongoose";
import Medication from "./medication.model.js";

const appointmentSchema = new mongoose.Schema(
    {
        patient: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "Patient",
        },
        doctor: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "Doctor",
        },
        isCheckupComplete: {
            type: Boolean,
            default: false,
        },
        checkedAt: {
            type: Date,
        },
        nextCheckup: {
            type: Date,
        },
        medications: [
            {
                medication: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Medication",
                    required: true,
                },
                totalDays: {
                    type: Number,
                    required: true,
                    min: 1,
                },
                timesPerDay: {
                    type: Number,
                    required: true,
                    min: 1,
                },
            },
        ],
        remarks: {
            type: String,
        },
        isBedAlloted: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true }
);

appointmentSchema.pre("save", async function (next) {
    try {
        for (const medInfo of this.medications) {
            const medicationDoc = await Medication.findById(medInfo.medication);
            if (medicationDoc) {
                await medicationDoc.addTablets(medInfo.totalDays, medInfo.timesPerDay);
            }
        }
        next();
    } catch (error) {
        next(error);
    }
});

const Appointment = mongoose.model("Appointment", appointmentSchema);
export default Appointment;
