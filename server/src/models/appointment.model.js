import mongoose from 'mongoose';

const appointmentSchema = new mongoose.Schema(
    {
       patient: {
           type: mongoose.Schema.Types.ObjectId,
           required: true,
           ref: 'Patient'
       },
        doctor: {
           type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'Doctor'
        },
        isCheckupComplete: {
           type: Boolean,
            default: false
        },


    },
    {timestamps: true}
);

const Appointment = mongoose.model('Hospital', appointmentSchema);

export default Appointment;
