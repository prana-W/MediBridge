"use client";
import { useState } from "react";
import useApi from "@/hooks/useApi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

const DoctorSignup = () => {
  const api = useApi();
  const [formData, setFormData] = useState({
    name: "",
    department: "",
    hospital: "",
    idCardNumber: "",
    workingHours: "",
    email: "",
    phone: "",
    password: "",
  });

  const handleSignup = async () => {
    try {
      const { message } = await api.post("/auth/doctor/signup", formData);
      toast.success(message || "Signup successful!");
    } catch (err) {
      toast.error(err?.message || "Signup failed");
    }
  };

  return (
    <div className="min-h-screen bg-[#F2F2F2] flex items-center justify-center p-8">
      <Card className="w-full max-w-lg shadow-xl border-t-4 border-[#4A90E2]">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold text-[#333333]">Doctor Signup</CardTitle>
          <CardDescription className="text-[#4A90E2]">
            Register to start managing appointments
          </CardDescription>
        </CardHeader>

        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.keys(formData).map((key) => (
              <div key={key}>
                <Label className="capitalize">
                  {key.replace(/([A-Z])/g, " $1")}
                </Label>
                <Input
                  placeholder={key === "password" ? "••••••••" : key}
                  type={key === "password" ? "password" : "text"}
                  value={formData[key]}
                  onChange={(e) => setFormData({ ...formData, [key]: e.target.value })}
                />
              </div>
            ))}
          </div>

          <Button
            className="w-full mt-6 bg-[#4AD2CC] hover:bg-[#36BDB8] text-white"
            onClick={handleSignup}
            disabled={api.loading}
          >
            {api.loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Sign Up
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default DoctorSignup;
