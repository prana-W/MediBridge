"use client";
import React, { useEffect, useState } from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
Select,
SelectTrigger,
SelectContent,
SelectItem,
SelectValue,
} from "@/components/ui/select";
import { Loader2, Calendar, Hospital, Stethoscope, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import VoiceAssistant from "@/components/voiceAssistant.jsx"

export default function PatientDashboard() {
const [hospitals, setHospitals] = useState([]);
const [selectedHospital, setSelectedHospital] = useState("");
const [selectedDepartment, setSelectedDepartment] = useState("");
const [doctors, setDoctors] = useState([]);
const [selectedDoctor, setSelectedDoctor] = useState(null);
const [selectedSlot, setSelectedSlot] = useState("");
const [loading, setLoading] = useState(true);
const [doctorsLoading, setDoctorsLoading] = useState(false);
const [error, setError] = useState("");
const [bookingStatus, setBookingStatus] = useState("");
const [bookingLoading, setBookingLoading] = useState(false);

const departments = [
"general",
"dermatologist",
"gynecologist",
"cardiologist",
"orthopedic",
"pediatrician",
"neurologist",
"dentist",
];

// Helper function to convert slot number to time
const getTimeFromSlot = (slotNumber) => {
const hour = 8 + slotNumber;
const period = hour >= 12 ? "PM" : "AM";
const displayHour = hour > 12 ? hour - 12 : hour;
return `${displayHour}:00 ${period}`;
};

useEffect(() => {
const fetchHospitals = async () => {
    try {
        const res = await fetch(`${import.meta.env.VITE_SERVER_URL}/hospital`, {
            method: "GET",
            credentials: "include",
        });

        if (!res.ok) throw new Error("Failed to fetch hospitals");

        const data = await res.json();
        setHospitals(data.data || []);
    } catch (err) {
        console.error("Error fetching hospitals:", err);
        setError(err.message);
    } finally {
        setLoading(false);
    }
};

fetchHospitals();
}, []);

// Fetch doctors when both hospital & department are selected
useEffect(() => {
const fetchDoctors = async () => {
    if (selectedHospital && selectedDepartment) {
        try {
            setDoctorsLoading(true);
            setDoctors([]);
            setSelectedDoctor(null);
            setSelectedSlot("");
            setBookingStatus("");

            const res = await fetch(
                `${import.meta.env.VITE_SERVER_URL}/auth/doctor/getSlots`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    credentials: "include",
                    body: JSON.stringify({
                        hospital: selectedHospital,
                        department: selectedDepartment,
                    }),
                }
            );

            const result = await res.json();
            console.log("Doctors data:", result);

            if (res.ok) {
                setDoctors(result.data || []);
                if (result.data && result.data.length === 0) {
                    setBookingStatus("❌ No doctors available");
                }
            } else {
                setBookingStatus(`❌ ${result.message || "Failed to fetch doctors"}`);
            }
        } catch (err) {
            console.error("Error fetching doctors:", err);
            setBookingStatus("❌ Network or server error");
        } finally {
            setDoctorsLoading(false);
        }
    }
};

fetchDoctors();
}, [selectedHospital, selectedDepartment]);

// Handle slot booking
const handleBookSlot = async () => {
if (!selectedDoctor || !selectedSlot) {
    setBookingStatus("❌ Please select a doctor and slot");
    return;
}

try {
    setBookingLoading(true);
    setBookingStatus("Booking...");

    console.log(selectedDoctor, selectedSlot);

    const res = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/auth/doctor/bookSlot`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify({
                doctorId: selectedDoctor._id,
                slotNumber: parseInt(selectedSlot)
            }),
        }
    );

    const result = await res.json();
    console.log("Booking result:", result);

    if (res.ok) {
        setBookingStatus(
            `✅ ${result.message || "Slot booked successfully!"}`
        );

        // Update the doctor's slot locally
        setDoctors((prevDoctors) =>
            prevDoctors.map((doc) =>
                doc._id === selectedDoctor._id
                    ? {
                        ...doc,
                        currentSlot: result.data.currentSlot,
                        availableSlots: result.data.remainingSlots,
                        isFullyBooked: result.data.remainingSlots === 0,
                    }
                    : doc
            )
        );

        // Reset selection
        setSelectedDoctor(null);
        setSelectedSlot("");
    } else {
        setBookingStatus(`❌ ${result.message || "Failed to book slot"}`);
    }
} catch (err) {
    console.error("Error booking slot:", err);
    setBookingStatus("❌ Network or server error");
} finally {
    setBookingLoading(false);
}
};

return (
<div className="min-h-screen bg-[#F2F2F2] py-8 px-4 sm:px-6 lg:px-8">
    {/* Manual Selection Section */}
    <div className="max-w-4xl mx-auto mb-12">
        <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-bold mb-3" style={{ color: '#4A90E2' }}>
                Book Your Appointment
            </h2>
            <p className="text-lg" style={{ color: '#333333', opacity: 0.7 }}>
                Choose your preferred method below
            </p>
        </div>

        {/* Manual Selection Card with Grid Background */}
        <div className="relative">
            {/* Grid Background */}
            <div className="absolute inset-0 opacity-10 pointer-events-none rounded-3xl overflow-hidden">
                <div className="h-full w-full" style={{
                    backgroundImage: `linear-gradient(#4A90E2 1px, transparent 1px), linear-gradient(90deg, #4A90E2 1px, transparent 1px)`,
                    backgroundSize: '40px 40px'
                }}></div>
            </div>

            <Card className="relative shadow-2xl rounded-3xl bg-white border-2 border-transparent hover:border-[#4A90E2] transition-all duration-500 hover:shadow-[0_20px_60px_rgba(74,144,226,0.3)] transform hover:scale-[1.02]">
                <CardHeader className="border-b border-gray-100 bg-gradient-to-r from-[#4A90E2]/5 to-[#4AD2CC]/5">
                    <div className="flex items-center justify-center gap-3 mb-2">
                        <Calendar className="h-7 w-7" style={{ color: '#4A90E2' }} />
                        <h3 className="text-2xl font-bold" style={{ color: '#4A90E2' }}>
                            Manual Selection
                        </h3>
                    </div>
                    <p className="text-center text-sm" style={{ color: '#333333', opacity: 0.7 }}>
                        Select hospital, department, doctor and time slot
                    </p>
                </CardHeader>

                <CardContent className="p-6 md:p-8">
                    {loading ? (
                        <div className="flex justify-center items-center py-12">
                            <Loader2 className="animate-spin w-8 h-8" style={{ color: '#4A90E2' }} />
                        </div>
                    ) : error ? (
                        <p className="text-red-500 text-center py-8">{error}</p>
                    ) : (
                        <div className="space-y-6">
                            {/* Hospital Dropdown */}
                            <div className="group">
                                <Label className="text-[#333333] font-semibold mb-2 flex items-center gap-2">
                                    <Hospital className="h-4 w-4" style={{ color: '#4A90E2' }} />
                                    Choose Hospital
                                </Label>
                                <Select
                                    onValueChange={(value) => {
                                        setSelectedHospital(value);
                                        setBookingStatus("");
                                    }}
                                    value={selectedHospital}
                                >
                                    <SelectTrigger className="border-2 border-gray-200 rounded-xl h-12 focus:ring-2 focus:ring-[#4A90E2] focus:border-[#4A90E2] transition-all hover:border-[#4A90E2] hover:shadow-md">
                                        <SelectValue placeholder="Select hospital" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {hospitals.length > 0 ? (
                                            hospitals.map((hospital, index) => (
                                                <SelectItem key={index} value={hospital.name} className="cursor-pointer hover:bg-[#4A90E2]/10">
                                                    {hospital.name} ({hospital.state})
                                                </SelectItem>
                                            ))
                                        ) : (
                                            <p className="text-gray-500 text-sm px-2">
                                                No hospitals found
                                            </p>
                                        )}
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Department Dropdown */}
                            <div className="group">
                                <Label className="text-[#333333] font-semibold mb-2 flex items-center gap-2">
                                    <Stethoscope className="h-4 w-4" style={{ color: '#4AD2CC' }} />
                                    Choose Department
                                </Label>
                                <Select
                                    onValueChange={(value) => {
                                        setSelectedDepartment(value);
                                        setBookingStatus("");
                                    }}
                                    value={selectedDepartment}
                                >
                                    <SelectTrigger className="border-2 border-gray-200 rounded-xl h-12 focus:ring-2 focus:ring-[#4AD2CC] focus:border-[#4AD2CC] transition-all hover:border-[#4AD2CC] hover:shadow-md">
                                        <SelectValue placeholder="Select department" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {departments.map((dept, index) => (
                                            <SelectItem key={index} value={dept} className="cursor-pointer hover:bg-[#4AD2CC]/10">
                                                {dept.charAt(0).toUpperCase() + dept.slice(1)}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Doctors Loading */}
                            {doctorsLoading && (
                                <div className="flex justify-center items-center py-6 gap-3">
                                    <Loader2 className="animate-spin w-6 h-6" style={{ color: '#4A90E2' }} />
                                    <span className="text-gray-600 font-medium">Loading doctors...</span>
                                </div>
                            )}

                            {/* Doctor Selection with Slots */}
                            {!doctorsLoading && doctors.length > 0 && (
                                <>
                                    <div className="group">
                                        <Label className="text-[#333333] font-semibold mb-2 flex items-center gap-2">
                                            <Stethoscope className="h-4 w-4" style={{ color: '#4A90E2' }} />
                                            Choose Doctor
                                        </Label>
                                        <Select
                                            onValueChange={(value) => {
                                                const doctor = doctors.find((d) => d._id === value);
                                                setSelectedDoctor(doctor);
                                                setSelectedSlot("");
                                                setBookingStatus("");
                                            }}
                                            value={selectedDoctor?._id || ""}
                                        >
                                            <SelectTrigger className="border-2 border-gray-200 rounded-xl h-12 focus:ring-2 focus:ring-[#4A90E2] focus:border-[#4A90E2] transition-all hover:border-[#4A90E2] hover:shadow-md">
                                                <SelectValue placeholder="Select doctor" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {doctors.map((doctor) => (
                                                    <SelectItem
                                                        key={doctor._id}
                                                        value={doctor._id}
                                                        disabled={doctor.isFullyBooked}
                                                        className="cursor-pointer hover:bg-[#4A90E2]/10"
                                                    >
                                                        <div className="flex justify-between items-center w-full">
                                                            <span>{doctor.name}</span>
                                                            <span className="text-xs ml-4">
                                                                {doctor.isFullyBooked ? (
                                                                    <span className="text-red-500 font-semibold">Fully Booked</span>
                                                                ) : (
                                                                    <span className="text-green-600 font-semibold">
                                                                        {doctor.availableSlots} slots left
                                                                    </span>
                                                                )}
                                                            </span>
                                                        </div>
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    {/* Slot Selection */}
                                    {selectedDoctor && !selectedDoctor.isFullyBooked && (
                                        <div className="group">
                                            <Label className="text-[#333333] font-semibold mb-2 flex items-center gap-2">
                                                <Clock className="h-4 w-4" style={{ color: '#4AD2CC' }} />
                                                Choose Time Slot
                                            </Label>
                                            <Select
                                                onValueChange={(value) => {
                                                    setSelectedSlot(value);
                                                    setBookingStatus("");
                                                }}
                                                value={selectedSlot}
                                            >
                                                <SelectTrigger className="border-2 border-gray-200 rounded-xl h-12 focus:ring-2 focus:ring-[#4AD2CC] focus:border-[#4AD2CC] transition-all hover:border-[#4AD2CC] hover:shadow-md">
                                                    <SelectValue placeholder="Select time slot" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {Array.from(
                                                        { length: selectedDoctor.availableSlots },
                                                        (_, i) => selectedDoctor.currentSlot + i
                                                    ).map((slotNum) => (
                                                        <SelectItem key={slotNum} value={slotNum.toString()} className="cursor-pointer hover:bg-[#4AD2CC]/10">
                                                            Slot {slotNum + 1} - {getTimeFromSlot(slotNum)} with{" "}
                                                            {selectedDoctor.name}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    )}

                                    {/* Book Button */}
                                    {selectedDoctor && selectedSlot && (
                                        <Button
                                            onClick={handleBookSlot}
                                            disabled={bookingLoading}
                                            className="w-full h-12 text-white font-semibold text-base rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-xl"
                                            style={{ backgroundColor: '#4A90E2' }}
                                        >
                                            {bookingLoading ? (
                                                <>
                                                    <Loader2 className="animate-spin w-5 h-5 mr-2" />
                                                    Booking...
                                                </>
                                            ) : (
                                                <>
                                                    <Calendar className="w-5 h-5 mr-2" />
                                                    Book Appointment
                                                </>
                                            )}
                                        </Button>
                                    )}
                                </>
                            )}

                            {/* Booking Status */}
                            {bookingStatus && (
                                <div
                                    className={`text-center p-4 rounded-xl font-medium ${
                                        bookingStatus.includes("✅")
                                            ? "bg-green-50 text-green-600 border border-green-200"
                                            : bookingStatus.includes("❌")
                                                ? "bg-red-50 text-red-600 border border-red-200"
                                                : "bg-gray-50 text-gray-600 border border-gray-200"
                                    }`}
                                >
                                    {bookingStatus}
                                </div>
                            )}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    </div>

    {/* Divider with OR */}
    <div className="max-w-4xl mx-auto mb-12">
        <div className="relative">
            <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t-2 border-gray-300"></div>
            </div>
            <div className="relative flex justify-center">
                <span className="px-6 py-2 text-lg font-bold rounded-full" style={{ backgroundColor: '#F2F2F2', color: '#4A90E2' }}>
                    OR
                </span>
            </div>
        </div>
    </div>

    {/* Voice Assistant Section */}
    <div className="max-w-4xl mx-auto">
        <VoiceAssistant />
    </div>
</div>
);
}