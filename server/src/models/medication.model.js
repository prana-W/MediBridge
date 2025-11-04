import mongoose from "mongoose";

const medicationSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        dosage: {
            type: String,
        },
        totalTablets: {
            type: Number,
            default: 0,
        },
    },
    { timestamps: true }
);

medicationSchema.methods.addTablets = function (daysOfConsumption, tabletsPerDay) {
    const additionalTablets = daysOfConsumption * tabletsPerDay;
    this.totalTablets += additionalTablets;
    return this.save();
};

const Medication = mongoose.model("Medication", medicationSchema);
export default Medication;
