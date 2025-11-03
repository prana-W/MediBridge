import React, { useState } from "react";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { User, Phone, CreditCard, Lock, MapPin, Stethoscope } from "lucide-react";

const API_BASE_URL = import.meta.env.VITE_SERVER_URL;

export default function PatientAuth() {
    const [isLogin, setIsLogin] = useState(true);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: "", text: "" });

    const [loginForm, setLoginForm] = useState({
        phoneNumber: "",
        aadharNumber: "",
        password: "",
    });

    const [signupForm, setSignupForm] = useState({
        name: "",
        phoneNumber: "",
        aadharNumber: "",
        password: "",
        confirmPassword: "",
        state: "",
    });

    // ------------------ LOGIN HANDLER ------------------
    const handleLoginSubmit = async (e) => {
        e.preventDefault();
        setMessage({ type: "", text: "" });
        setLoading(true);

        try {
            const res = await fetch(`${API_BASE_URL}/auth/patient/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify(loginForm),
            });

            const data = await res.json();
            if (res.ok) {
                setMessage({ type: "success", text: data.message || "Login successful!" });
            } else {
                setMessage({ type: "error", text: data.message || "Login failed!" });
            }
        } catch {
            setMessage({ type: "error", text: "Network error. Please try again." });
        } finally {
            setLoading(false);
        }
    };

    // ------------------ SIGNUP HANDLER ------------------
    const handleSignupSubmit = async (e) => {
        e.preventDefault();
        setMessage({ type: "", text: "" });

        if (signupForm.password !== signupForm.confirmPassword) {
            setMessage({ type: "error", text: "Passwords do not match!" });
            return;
        }

        setLoading(true);
        const { confirmPassword, ...signupData } = signupForm;

        try {
            const res = await fetch(`${API_BASE_URL}/auth/patient/signup`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(signupData),
            });

            const data = await res.json();
            if (res.ok) {
                setMessage({ type: "success", text: data.message || "Registration successful!" });
                setTimeout(() => setIsLogin(true), 2000);
            } else {
                setMessage({ type: "error", text: data.message || "Registration failed!" });
            }
        } catch {
            setMessage({ type: "error", text: "Network error. Please try again." });
        } finally {
            setLoading(false);
        }
    };

    // ------------------ UI ------------------
    return (
        <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 flex items-center justify-center p-4">
            <Card className="w-full max-w-2xl shadow-xl">
                <CardHeader className="space-y-1">
                    <div className="flex items-center justify-center mb-4">
                        <div className="bg-purple-600 p-3 rounded-full">
                            <Stethoscope className="w-8 h-8 text-white" />
                        </div>
                    </div>
                    <CardTitle className="text-2xl text-center">
                        {isLogin ? "Patient Login" : "Patient Registration"}
                    </CardTitle>
                    <CardDescription className="text-center">
                        {isLogin
                            ? "Access your digital health records"
                            : "Create your patient account to access hospital services"}
                    </CardDescription>
                </CardHeader>

                <CardContent>
                    {message.text && (
                        <Alert
                            className={`mb-4 ${
                                message.type === "success"
                                    ? "bg-green-50 border-green-200"
                                    : "bg-red-50 border-red-200"
                            }`}
                        >
                            <AlertDescription
                                className={
                                    message.type === "success" ? "text-green-800" : "text-red-800"
                                }
                            >
                                {message.text}
                            </AlertDescription>
                        </Alert>
                    )}

                    {isLogin ? (
                        // ------------------ LOGIN FORM ------------------
                        <form onSubmit={handleLoginSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="phone">Phone Number or Aadhaar</Label>
                                <div className="relative">
                                    <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                    <Input
                                        id="phone"
                                        placeholder="Enter phoneNumber or Aadhaar"
                                        className="pl-10"
                                        value={loginForm.phoneNumber || loginForm.aadharNumber}
                                        onChange={(e) => {
                                            const val = e.target.value;
                                            if (/^\d{12}$/.test(val)) {
                                                setLoginForm((prev) => ({ ...prev, aadharNumber: val, phoneNumber: "" }));
                                            } else {
                                                setLoginForm((prev) => ({ ...prev, phoneNumber: val, aadharNumber: "" }));
                                            }
                                        }}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="password">Password</Label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                    <Input
                                        id="password"
                                        type="password"
                                        placeholder="••••••••"
                                        className="pl-10"
                                        value={loginForm.password}
                                        onChange={(e) =>
                                            setLoginForm((prev) => ({ ...prev, password: e.target.value }))
                                        }
                                        required
                                    />
                                </div>
                            </div>

                            <Button
                                type="submit"
                                className="w-full bg-purple-600 hover:bg-purple-700"
                                disabled={loading}
                            >
                                {loading ? "Logging in..." : "Login"}
                            </Button>
                        </form>
                    ) : (
                        // ------------------ SIGNUP FORM ------------------
                        <form onSubmit={handleSignupSubmit} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Full Name</Label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                        <Input
                                            id="name"
                                            placeholder="John Doe"
                                            className="pl-10"
                                            value={signupForm.name}
                                            onChange={(e) =>
                                                setSignupForm((prev) => ({ ...prev, name: e.target.value }))
                                            }
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="phone">Phone Number</Label>
                                    <div className="relative">
                                        <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                        <Input
                                            id="phone"
                                            placeholder="9876543210"
                                            className="pl-10"
                                            value={signupForm.phoneNumber}
                                            onChange={(e) =>
                                                setSignupForm((prev) => ({ ...prev, phoneNumber: e.target.value }))
                                            }
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="aadhar">Aadhaar Number</Label>
                                    <div className="relative">
                                        <CreditCard className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                        <Input
                                            id="aadhar"
                                            placeholder="123412341234"
                                            className="pl-10"
                                            value={signupForm.aadharNumber}
                                            onChange={(e) =>
                                                setSignupForm((prev) => ({ ...prev, aadharNumber: e.target.value }))
                                            }
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="state">State</Label>
                                    <div className="relative">
                                        <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                        <Input
                                            id="state"
                                            placeholder="Bihar, Maharashtra, etc."
                                            className="pl-10"
                                            value={signupForm.state}
                                            onChange={(e) =>
                                                setSignupForm((prev) => ({ ...prev, state: e.target.value }))
                                            }
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="password">Password</Label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                        <Input
                                            id="password"
                                            type="password"
                                            placeholder="••••••••"
                                            className="pl-10"
                                            value={signupForm.password}
                                            onChange={(e) =>
                                                setSignupForm((prev) => ({
                                                    ...prev,
                                                    password: e.target.value,
                                                }))
                                            }
                                            required
                                            minLength={6}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                        <Input
                                            id="confirmPassword"
                                            type="password"
                                            placeholder="••••••••"
                                            className="pl-10"
                                            value={signupForm.confirmPassword}
                                            onChange={(e) =>
                                                setSignupForm((prev) => ({
                                                    ...prev,
                                                    confirmPassword: e.target.value,
                                                }))
                                            }
                                            required
                                            minLength={6}
                                        />
                                    </div>
                                </div>
                            </div>

                            <Button
                                type="submit"
                                className="w-full bg-purple-600 hover:bg-purple-700"
                                disabled={loading}
                            >
                                {loading ? "Creating Account..." : "Create Account"}
                            </Button>
                        </form>
                    )}
                </CardContent>

                <CardFooter className="flex flex-col space-y-2">
                    <div className="text-sm text-center text-gray-600">
                        {isLogin ? "Don't have an account? " : "Already have an account? "}
                        <button
                            type="button"
                            className="text-purple-600 hover:underline font-medium"
                            onClick={() => {
                                setIsLogin(!isLogin);
                                setMessage({ type: "", text: "" });
                            }}
                        >
                            {isLogin ? "Sign up" : "Login"}
                        </button>
                    </div>
                </CardFooter>
            </Card>
        </div>
    );
}
