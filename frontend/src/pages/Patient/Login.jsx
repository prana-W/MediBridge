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
import { User, Phone, Lock, MapPin, Stethoscope } from "lucide-react";

const API_BASE_URL = import.meta.env.VITE_SERVER_URL;

export default function PatientAuth() {
    const [isLogin, setIsLogin] = useState(true);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: "", text: "" });

    const [loginForm, setLoginForm] = useState({
        phoneNumber: "",
        password: "",
    });

    const [signupForm, setSignupForm] = useState({
        name: "",
        phoneNumber: "",
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
        <div className="min-h-screen relative flex items-center justify-center p-4" style={{ backgroundColor: '#F2F2F2' }}>
            {/* Grid Pattern Background */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                        <pattern id="grid" width="30" height="40" patternUnits="userSpaceOnUse">
                            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(74, 144, 226, 0.1)" strokeWidth="1.5"/>
                        </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#grid)" />
                </svg>
            </div>

            <Card className="w-full max-w-2xl shadow-2xl border-none bg-white transition-all duration-300 hover:shadow-3xl relative z-10">
                <CardHeader className="space-y-3 pb-6">
                    <div className="flex items-center justify-center mb-2">
                        <div className="p-4 rounded-full transition-transform duration-300 hover:scale-110" style={{ backgroundColor: '#9b59b6' }}>
                            <Stethoscope className="w-10 h-10 text-white" />
                        </div>
                    </div>
                    <CardTitle className="text-3xl text-center font-bold" style={{ color: '#333333' }}>
                        {isLogin ? "Patient Login" : "Patient Registration"}
                    </CardTitle>
                    <CardDescription className="text-center text-base" style={{ color: '#333333', opacity: 0.7 }}>
                        {isLogin
                            ? "Access your digital health records"
                            : "Create your patient account to access hospital services"}
                    </CardDescription>
                </CardHeader>

                <CardContent>
                    {message.text && (
                        <Alert className={`mb-6 border-none transition-all duration-300 ${message.type === 'success' ? 'bg-green-50' : 'bg-red-50'}`}>
                            <AlertDescription className={`font-medium ${message.type === 'success' ? 'text-green-700' : 'text-red-700'}`}>
                                {message.text}
                            </AlertDescription>
                        </Alert>
                    )}

                    {isLogin ? (
                        // ------------------ LOGIN FORM ------------------
                        <div className="space-y-5">
                            <div className="space-y-2">
                                <Label htmlFor="phone" className="text-sm font-semibold" style={{ color: '#333333' }}>
                                    Phone Number
                                </Label>
                                <div className="relative">
                                    <Phone className="absolute left-3 top-3 h-5 w-5" style={{ color: '#9b59b6' }} />
                                    <Input
                                        id="phone"
                                        placeholder="Enter phone number"
                                        className="pl-10 py-6 border-gray-200 focus:ring-2 transition-all duration-200"
                                        style={{ borderColor: '#E5E5E5' }}
                                        value={loginForm.phoneNumber}
                                        onChange={(e) => {
                                            const val = e.target.value;
                                            setLoginForm((prev) => ({ ...prev, phoneNumber: val}));
                                        }}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="password" className="text-sm font-semibold" style={{ color: '#333333' }}>
                                    Password
                                </Label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-3 h-5 w-5" style={{ color: '#9b59b6' }} />
                                    <Input
                                        id="password"
                                        type="password"
                                        placeholder="••••••••"
                                        className="pl-10 py-6 border-gray-200 focus:ring-2 transition-all duration-200"
                                        style={{ borderColor: '#E5E5E5' }}
                                        value={loginForm.password}
                                        onChange={(e) =>
                                            setLoginForm((prev) => ({ ...prev, password: e.target.value }))
                                        }
                                        required
                                    />
                                </div>
                            </div>

                            <Button
                                onClick={handleLoginSubmit}
                                className="w-full text-white font-semibold py-6 text-base rounded-lg transition-all duration-200 hover:opacity-90 shadow-lg"
                                style={{ backgroundColor: '#9b59b6' }}
                                disabled={loading}
                            >
                                {loading ? "Logging in..." : "Login"}
                            </Button>
                        </div>
                    ) : (
                        // ------------------ SIGNUP FORM ------------------
                        <div className="space-y-5">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="name" className="text-sm font-semibold" style={{ color: '#333333' }}>
                                        Full Name
                                    </Label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-3 h-5 w-5" style={{ color: '#9b59b6' }} />
                                        <Input
                                            id="name"
                                            placeholder="John Doe"
                                            className="pl-10 py-6 border-gray-200 focus:ring-2 transition-all duration-200"
                                            style={{ borderColor: '#E5E5E5' }}
                                            value={signupForm.name}
                                            onChange={(e) =>
                                                setSignupForm((prev) => ({ ...prev, name: e.target.value }))
                                            }
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="signup-phone" className="text-sm font-semibold" style={{ color: '#333333' }}>
                                        Phone Number
                                    </Label>
                                    <div className="relative">
                                        <Phone className="absolute left-3 top-3 h-5 w-5" style={{ color: '#9b59b6' }} />
                                        <Input
                                            id="signup-phone"
                                            placeholder="9876543210"
                                            className="pl-10 py-6 border-gray-200 focus:ring-2 transition-all duration-200"
                                            style={{ borderColor: '#E5E5E5' }}
                                            value={signupForm.phoneNumber}
                                            onChange={(e) =>
                                                setSignupForm((prev) => ({ ...prev, phoneNumber: e.target.value }))
                                            }
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="state" className="text-sm font-semibold" style={{ color: '#333333' }}>
                                        State
                                    </Label>
                                    <div className="relative">
                                        <MapPin className="absolute left-3 top-3 h-5 w-5" style={{ color: '#9b59b6' }} />
                                        <Input
                                            id="state"
                                            placeholder="Bihar, Maharashtra, etc."
                                            className="pl-10 py-6 border-gray-200 focus:ring-2 transition-all duration-200"
                                            style={{ borderColor: '#E5E5E5' }}
                                            value={signupForm.state}
                                            onChange={(e) =>
                                                setSignupForm((prev) => ({ ...prev, state: e.target.value }))
                                            }
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="signup-password" className="text-sm font-semibold" style={{ color: '#333333' }}>
                                        Password
                                    </Label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-3 h-5 w-5" style={{ color: '#9b59b6' }} />
                                        <Input
                                            id="signup-password"
                                            type="password"
                                            placeholder="••••••••"
                                            className="pl-10 py-6 border-gray-200 focus:ring-2 transition-all duration-200"
                                            style={{ borderColor: '#E5E5E5' }}
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

                                <div className="space-y-2 md:col-span-2">
                                    <Label htmlFor="confirmPassword" className="text-sm font-semibold" style={{ color: '#333333' }}>
                                        Confirm Password
                                    </Label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-3 h-5 w-5" style={{ color: '#9b59b6' }} />
                                        <Input
                                            id="confirmPassword"
                                            type="password"
                                            placeholder="••••••••"
                                            className="pl-10 py-6 border-gray-200 focus:ring-2 transition-all duration-200"
                                            style={{ borderColor: '#E5E5E5' }}
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
                                onClick={handleSignupSubmit}
                                className="w-full text-white font-semibold py-6 text-base rounded-lg transition-all duration-200 hover:opacity-90 shadow-lg"
                                style={{ backgroundColor: '#9b59b6' }}
                                disabled={loading}
                            >
                                {loading ? "Creating Account..." : "Create Account"}
                            </Button>
                        </div>
                    )}
                </CardContent>

                <CardFooter className="flex flex-col space-y-3 pt-6">
                    <div className="text-sm text-center" style={{ color: '#333333', opacity: 0.7 }}>
                        {isLogin ? "Don't have an account? " : "Already have an account? "}
                        <button
                            type="button"
                            className="font-semibold hover:underline transition-all duration-200"
                            style={{ color: '#9b59b6' }}
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