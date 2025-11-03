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
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

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
                slotNumber: parseInt(selectedSlot),
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
<div className="min-h-screen flex items-center justify-center bg-[#F2F2F2] p-6">
    <Card className="w-full max-w-2xl shadow-xl rounded-2xl bg-white">
        <CardHeader>
            <h2 className="text-2xl font-semibold text-[#333333] text-center">
                Patient Dashboard
            </h2>
            <p className="text-center text-sm text-gray-500">
                Select hospital, department, doctor and time slot
            </p>
        </CardHeader>

        <CardContent>
            {loading ? (
                <div className="flex justify-center items-center py-10">
                    <Loader2 className="animate-spin w-6 h-6 text-[#4A90E2]" />
                </div>
            ) : error ? (
                <p className="text-red-500 text-center">{error}</p>
            ) : (
                <div className="space-y-6">
                    {/* Hospital Dropdown */}
                    <div>
                        <Label className="text-[#333333] font-medium">
                            Choose Hospital
                        </Label>
                        <Select
                            onValueChange={(value) => {
                                setSelectedHospital(value);
                                setBookingStatus("");
                            }}
                            value={selectedHospital}
                        >
                            <SelectTrigger className="border border-gray-300 rounded-md focus:ring-2 focus:ring-[#4A90E2]">
                                <SelectValue placeholder="Select hospital" />
                            </SelectTrigger>
                            <SelectContent>
                                {hospitals.length > 0 ? (
                                    hospitals.map((hospital, index) => (
                                        <SelectItem key={index} value={hospital.name}>
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
                    <div>
                        <Label className="text-[#333333] font-medium">
                            Choose Department
                        </Label>
                        <Select
                            onValueChange={(value) => {
                                setSelectedDepartment(value);
                                setBookingStatus("");
                            }}
                            value={selectedDepartment}
                        >
                            <SelectTrigger className="border border-gray-300 rounded-md focus:ring-2 focus:ring-[#4AD2CC]">
                                <SelectValue placeholder="Select department" />
                            </SelectTrigger>
                            <SelectContent>
                                {departments.map((dept, index) => (
                                    <SelectItem key={index} value={dept}>
                                        {dept.charAt(0).toUpperCase() + dept.slice(1)}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Doctors Loading */}
                    {doctorsLoading && (
                        <div className="flex justify-center items-center py-4">
                            <Loader2 className="animate-spin w-5 h-5 text-[#4A90E2]" />
                            <span className="ml-2 text-gray-600">Loading doctors...</span>
                        </div>
                    )}

                    {/* Doctor Selection with Slots */}
                    {!doctorsLoading && doctors.length > 0 && (
                        <>
                            <div>
                                <Label className="text-[#333333] font-medium">
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
                                    <SelectTrigger className="border border-gray-300 rounded-md focus:ring-2 focus:ring-[#4A90E2]">
                                        <SelectValue placeholder="Select doctor" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {doctors.map((doctor) => (
                                            <SelectItem
                                                key={doctor._id}
                                                value={doctor._id}
                                                disabled={doctor.isFullyBooked}
                                            >
                                                <div className="flex justify-between items-center w-full">
                                                    <span>{doctor.name}</span>
                                                    <span className="text-xs ml-4">
                        {doctor.isFullyBooked ? (
                            <span className="text-red-500">Fully Booked</span>
                        ) : (
                            <span className="text-green-600">
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
                                <div>
                                    <Label className="text-[#333333] font-medium">
                                        Choose Time Slot
                                    </Label>
                                    <Select
                                        onValueChange={(value) => {
                                            setSelectedSlot(value);
                                            setBookingStatus("");
                                        }}
                                        value={selectedSlot}
                                    >
                                        <SelectTrigger className="border border-gray-300 rounded-md focus:ring-2 focus:ring-[#4AD2CC]">
                                            <SelectValue placeholder="Select time slot" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {Array.from(
                                                { length: selectedDoctor.availableSlots },
                                                (_, i) => selectedDoctor.currentSlot + i
                                            ).map((slotNum) => (
                                                <SelectItem key={slotNum} value={slotNum.toString()}>
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
                                    className="w-full bg-[#4A90E2] hover:bg-[#357ABD] text-white"
                                >
                                    {bookingLoading ? (
                                        <>
                                            <Loader2 className="animate-spin w-4 h-4 mr-2" />
                                            Booking...
                                        </>
                                    ) : (
                                        "Book Appointment"
                                    )}
                                </Button>
                            )}
                        </>
                    )}

                    {/* Booking Status */}
                    {bookingStatus && (
                        <p
                            className={`text-center text-sm font-medium ${
                                bookingStatus.includes("✅")
                                    ? "text-green-600"
                                    : bookingStatus.includes("❌")
                                        ? "text-red-600"
                                        : "text-gray-600"
                            }`}
                        >
                            {bookingStatus}
                        </p>
                    )}
                </div>
            )}
        </CardContent>
    </Card>
</div>
);
}