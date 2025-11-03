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

export default function PatientDashboard() {
    const [hospitals, setHospitals] = useState([]);
    const [selectedHospital, setSelectedHospital] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchHospitals = async () => {
            try {
                const res = await fetch(`${import.meta.env.VITE_SERVER_URL}/hospital`, {
                    method: "GET",
                    credentials: "include"
                });

                if (!res.ok) throw new Error("Failed to fetch hospitals");

                const data = await res.json();
                console.log("Hospitals fetched:", data);

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

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#F2F2F2] p-6">
            <Card className="w-full max-w-md shadow-xl rounded-2xl bg-white">
                <CardHeader>
                    <h2 className="text-2xl font-semibold text-[#333333] text-center">
                        Patient Dashboard
                    </h2>
                    <p className="text-center text-sm text-gray-500">
                        Select your preferred hospital
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
                        <div className="space-y-4">
                            <Label className="text-[#333333] font-medium">
                                Choose Hospital
                            </Label>

                            <Select onValueChange={(value) => setSelectedHospital(value)}>
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

                            {selectedHospital && (
                                <div className="mt-4 text-center text-[#4A90E2] font-medium">
                                    Selected: {selectedHospital}
                                </div>
                            )}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
