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
        state: "",
        password: "",
        confirmPassword: "",
    });

    const handleLoginSubmit = (e) => {
        e.preventDefault();
        setMessage({ type: "", text: "" });
        setLoading(true);

        fetch(`${API_BASE_URL}/auth/patient/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify(loginForm),
        })
            .then((response) => response.json().then((data) => ({ status: response.ok, data })))
            .then(({ status, data }) => {
                if (status)
                    setMessage({ type: "success", text: data.message || "Login successful!" });
                else setMessage({ type: "error", text: data.message || "Login failed!" });
                setLoading(false);
            })
            .catch(() => {
                setMessage({ type: "error", text: "Network error. Please try again." });
                setLoading(false);
            });
    };

    const handleSignupSubmit = (e) => {
        e.preventDefault();
        setMessage({ type: "", text: "" });

        if (signupForm.password !== signupForm.confirmPassword) {
            setMessage({ type: "error", text: "Passwords do not match!" });
            return;
        }

        setLoading(true);
        const { confirmPassword, ...signupData } = signupForm;

        fetch(`${API_BASE_URL}/auth/patient/signup`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(signupData),
        })
            .then((response) => response.json().then((data) => ({ status: response.ok, data })))
            .then(({ status, data }) => {
                if (status) {
                    setMessage({
                        type: "success",
                        text: data.message || "Registration successful!",
                    });
                    setTimeout(() => setIsLogin(true), 2000);
                } else {
                    setMessage({ type: "error", text: data.message || "Registration failed!" });
                }
                setLoading(false);
            })
            .catch(() => {
                setMessage({ type: "error", text: "Network error. Please try again." });
                setLoading(false);
            });
    };

    return (
        <div
            className="relative min-h-screen flex items-center justify-center overflow-hidden"
            style={{ backgroundColor: "#F2F2F2" }}
        >
            {/* Animated Background */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#4A90E2] via-[#4AD2CC] to-[#4A90E2] opacity-20 blur-3xl animate-gradient" />
            <div className="absolute top-10 left-10 w-72 h-72 bg-[#4AD2CC]/30 rounded-full blur-3xl animate-pulse-glow"></div>
            <div className="absolute bottom-10 right-10 w-72 h-72 bg-[#4A90E2]/20 rounded-full blur-3xl animate-pulse-glow"></div>

            <Card className="relative w-full max-w-2xl shadow-2xl border-none bg-white/80 backdrop-blur-md transition-all duration-500 hover:shadow-[0_0_40px_rgba(74,210,204,0.3)] hover:-translate-y-1 animate-fade-in-up">
                <CardHeader className="space-y-3 pb-6">
                    <div className="flex items-center justify-center mb-2">
                        <div
                            className="p-4 rounded-full shadow-md transition-transform duration-300 hover:scale-110"
                            style={{ backgroundColor: "#4AD2CC" }}
                        >
                            <Stethoscope className="w-10 h-10 text-white" />
                        </div>
                    </div>
                    <CardTitle
                        className="text-3xl text-center font-bold"
                        style={{ color: "#333333" }}
                    >
                        {isLogin ? "Patient Login" : "Patient Registration"}
                    </CardTitle>
                    <CardDescription
                        className="text-center text-base"
                        style={{ color: "#333333", opacity: 0.7 }}
                    >
                        {isLogin
                            ? "Access your digital health records"
                            : "Create your patient account to access hospital services"}
                    </CardDescription>
                </CardHeader>

                <CardContent className="transition-all duration-500">
                    {message.text && (
                        <Alert
                            className={`mb-6 border-none transition-all duration-300 ${
                                message.type === "success" ? "bg-green-50" : "bg-red-50"
                            }`}
                        >
                            <AlertDescription
                                className={`font-medium ${
                                    message.type === "success"
                                        ? "text-green-700"
                                        : "text-red-700"
                                }`}
                            >
                                {message.text}
                            </AlertDescription>
                        </Alert>
                    )}

                    {/* LOGIN FORM */}
                    {isLogin ? (
                        <form
                            onSubmit={handleLoginSubmit}
                            className="space-y-5 animate-fade-in-up"
                        >
                            <div className="space-y-2">
                                <Label
                                    className="text-sm font-semibold"
                                    style={{ color: "#333333" }}
                                >
                                    Phone Number
                                </Label>
                                <div className="relative">
                                    <Phone
                                        className="absolute left-3 top-3 h-5 w-5"
                                        style={{ color: "#4AD2CC" }}
                                    />
                                    <Input
                                        placeholder="Enter phone number"
                                        className="pl-10 py-6 border-gray-200 focus:ring-2 transition-all duration-200"
                                        style={{ borderColor: "#E5E5E5" }}
                                        value={loginForm.phoneNumber}
                                        onChange={(e) =>
                                            setLoginForm((prev) => ({
                                                ...prev,
                                                phoneNumber: e.target.value,
                                            }))
                                        }
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label
                                    className="text-sm font-semibold"
                                    style={{ color: "#333333" }}
                                >
                                    Password
                                </Label>
                                <div className="relative">
                                    <Lock
                                        className="absolute left-3 top-3 h-5 w-5"
                                        style={{ color: "#4AD2CC" }}
                                    />
                                    <Input
                                        type="password"
                                        placeholder="••••••••"
                                        className="pl-10 py-6 border-gray-200 focus:ring-2 transition-all duration-200"
                                        style={{ borderColor: "#E5E5E5" }}
                                        value={loginForm.password}
                                        onChange={(e) =>
                                            setLoginForm((prev) => ({
                                                ...prev,
                                                password: e.target.value,
                                            }))
                                        }
                                        required
                                    />
                                </div>
                            </div>

                            <Button
                                type="submit"
                                className="w-full text-white font-semibold py-6 text-base rounded-lg transition-all duration-200 hover:opacity-90 shadow-lg"
                                style={{ backgroundColor: "#4AD2CC" }}
                                disabled={loading}
                            >
                                {loading ? "Logging in..." : "Login"}
                            </Button>
                        </form>
                    ) : (
                        /* SIGNUP FORM */
                        <form
                            onSubmit={handleSignupSubmit}
                            className="space-y-5 animate-fade-in-up"
                        >
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label className="text-sm font-semibold" style={{ color: "#333333" }}>
                                        Full Name
                                    </Label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-3 h-5 w-5" style={{ color: "#4A90E2" }} />
                                        <Input
                                            placeholder="John Doe"
                                            className="pl-10 py-6 border-gray-200 focus:ring-2 transition-all duration-200"
                                            style={{ borderColor: "#E5E5E5" }}
                                            value={signupForm.name}
                                            onChange={(e) =>
                                                setSignupForm((prev) => ({ ...prev, name: e.target.value }))
                                            }
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label className="text-sm font-semibold" style={{ color: "#333333" }}>
                                        Phone Number
                                    </Label>
                                    <div className="relative">
                                        <Phone className="absolute left-3 top-3 h-5 w-5" style={{ color: "#4A90E2" }} />
                                        <Input
                                            placeholder="9876543210"
                                            className="pl-10 py-6 border-gray-200 focus:ring-2 transition-all duration-200"
                                            style={{ borderColor: "#E5E5E5" }}
                                            value={signupForm.phoneNumber}
                                            onChange={(e) =>
                                                setSignupForm((prev) => ({ ...prev, phoneNumber: e.target.value }))
                                            }
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label className="text-sm font-semibold" style={{ color: "#333333" }}>
                                        State
                                    </Label>
                                    <div className="relative">
                                        <MapPin className="absolute left-3 top-3 h-5 w-5" style={{ color: "#4A90E2" }} />
                                        <Input
                                            placeholder="Uttar Pradesh, Maharashtra..."
                                            className="pl-10 py-6 border-gray-200 focus:ring-2 transition-all duration-200"
                                            style={{ borderColor: "#E5E5E5" }}
                                            value={signupForm.state}
                                            onChange={(e) =>
                                                setSignupForm((prev) => ({ ...prev, state: e.target.value }))
                                            }
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label className="text-sm font-semibold" style={{ color: "#333333" }}>
                                        Password
                                    </Label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-3 h-5 w-5" style={{ color: "#4A90E2" }} />
                                        <Input
                                            type="password"
                                            placeholder="••••••••"
                                            className="pl-10 py-6 border-gray-200 focus:ring-2 transition-all duration-200"
                                            style={{ borderColor: "#E5E5E5" }}
                                            value={signupForm.password}
                                            onChange={(e) =>
                                                setSignupForm((prev) => ({ ...prev, password: e.target.value }))
                                            }
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label className="text-sm font-semibold" style={{ color: "#333333" }}>
                                        Confirm Password
                                    </Label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-3 h-5 w-5" style={{ color: "#4A90E2" }} />
                                        <Input
                                            type="password"
                                            placeholder="••••••••"
                                            className="pl-10 py-6 border-gray-200 focus:ring-2 transition-all duration-200"
                                            style={{ borderColor: "#E5E5E5" }}
                                            value={signupForm.confirmPassword}
                                            onChange={(e) =>
                                                setSignupForm((prev) => ({
                                                    ...prev,
                                                    confirmPassword: e.target.value,
                                                }))
                                            }
                                            required
                                        />
                                    </div>
                                </div>
                            </div>

                            <Button
                                type="submit"
                                className="w-full text-white font-semibold py-6 text-base rounded-lg transition-all duration-200 hover:opacity-90 shadow-lg"
                                style={{ backgroundColor: "#4AD2CC" }}
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
                            className="text-[#4AD2CC] hover:underline font-medium"
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
