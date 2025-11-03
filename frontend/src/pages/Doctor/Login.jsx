"use client";
import { useState } from "react";
import useApi from "@/hooks/useApi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { Link } from "react-router-dom";

const DoctorLogin = () => {
  const api = useApi();
  const [loginData, setLoginData] = useState({
    email: "",
    phone: "",
    password: "",
  });

  const handleLogin = async () => {
    try {
      const { message } = await api.post("/auth/doctor/login", loginData);
      toast.success(message || "Login successful!");
    } catch (err) {
      toast.error(err?.message || "Login failed");
    }
  };

  return (
    <div className="min-h-screen bg-[#F2F2F2] flex items-center justify-center p-8">
      <Card className="w-full max-w-md shadow-xl border-t-4 border-[#4A90E2]">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold text-[#333333]">Doctor Login</CardTitle>
          <CardDescription className="text-[#4A90E2]">
            Access your appointment dashboard
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <div>
            <Label>Email or Phone</Label>
            <Input
              placeholder="doctor@example.com"
              value={loginData.email || loginData.phone}
              onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
            />
          </div>
          <div>
            <Label>Password</Label>
            <Input
              type="password"
              placeholder="••••••••"
              value={loginData.password}
              onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
            />
          </div>

          <Button
            className="w-full bg-[#4A90E2] hover:bg-[#357ABD] text-white"
            onClick={handleLogin}
            disabled={api.loading}
          >
            {api.loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Login
          </Button>

          <p className="text-center text-sm text-[#333333] mt-4">
            Don’t have an account?{" "}
            <Link to="/doctor/signup" className="text-[#4A90E2] hover:underline">
              Sign up here
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default DoctorLogin;
