import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Stethoscope, Mail, Lock, User, Building2, CreditCard, Calendar, Search } from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_SERVER_URL;

export default function DoctorAuth() {
    const [isLogin, setIsLogin] = useState(true);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });
    const [hospitals, setHospitals] = useState([]);
    const [filteredHospitals, setFilteredHospitals] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

    const [loginForm, setLoginForm] = useState({
        email: '',
        password: ''
    });

    const [signupForm, setSignupForm] = useState({
        name: '',
        department: '',
        hospital: '',
        idCardNumber: '',
        workingDays: [],
        email: '',
        password: '',
        confirmPassword: ''
    });

    const departments = [
        'general',
        'dermatologist',
        'gynecologist',
        'cardiologist',
        'orthopedic',
        'pediatrician',
        'neurologist',
        'dentist'
    ];

    const weekDays = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

    // ✅ Fetch Hospitals on Mount
    useEffect(() => {
        const fetchHospitals = async () => {
            try {
                const res = await fetch(`${API_BASE_URL}/hospital/all`, {
                    method: 'GET',
                    credentials: 'include'
                });
                if (!res.ok) throw new Error('Failed to fetch hospitals');
                const data = await res.json();
                setHospitals(data.data || []);
                setFilteredHospitals(data.data || []);
            } catch (err) {
                console.error('Error fetching hospitals:', err);
            }
        };
        fetchHospitals();
    }, []);

    // ✅ Search Filter Logic
    useEffect(() => {
        const filtered = hospitals.filter(h =>
            h.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredHospitals(filtered);
    }, [searchTerm, hospitals]);

    const handleLoginSubmit = (e) => {
        e.preventDefault();
        setMessage({ type: '', text: '' });
        setLoading(true);

        fetch(`${API_BASE_URL}/auth/doctor/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify(loginForm)
        })
            .then(response => response.json().then(data => ({ status: response.ok, data })))
            .then(({ status, data }) => {
                if (status) setMessage({ type: 'success', text: data.message || 'Login successful!' });
                else setMessage({ type: 'error', text: data.message || 'Login failed!' });
                setLoading(false);
            })
            .catch(() => {
                setMessage({ type: 'error', text: 'Network error. Please try again.' });
                setLoading(false);
            });
    };

    const handleSignupSubmit = (e) => {
        e.preventDefault();
        setMessage({ type: '', text: '' });

        if (signupForm.password !== signupForm.confirmPassword) {
            setMessage({ type: 'error', text: 'Passwords do not match!' });
            return;
        }

        if (signupForm.workingDays.length === 0) {
            setMessage({ type: 'error', text: 'Please select at least one working day!' });
            return;
        }

        setLoading(true);
        const { confirmPassword, ...signupData } = signupForm;

        fetch(`${API_BASE_URL}/auth/doctor/signup`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(signupData)
        })
            .then(response => response.json().then(data => ({ status: response.ok, data })))
            .then(({ status, data }) => {
                if (status) {
                    setMessage({ type: 'success', text: data.message || 'Registration successful!' });
                    setTimeout(() => setIsLogin(true), 2000);
                } else {
                    setMessage({ type: 'error', text: data.message || 'Registration failed!' });
                }
                setLoading(false);
            })
            .catch(() => {
                setMessage({ type: 'error', text: 'Network error. Please try again.' });
                setLoading(false);
            });
    };

    const toggleWorkingDay = (day) => {
        setSignupForm(prev => ({
            ...prev,
            workingDays: prev.workingDays.includes(day)
                ? prev.workingDays.filter(d => d !== day)
                : [...prev.workingDays, day]
        }));
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 flex items-center justify-center p-4">
            <Card className="w-full max-w-2xl shadow-xl">
                <CardHeader className="space-y-1">
                    <div className="flex items-center justify-center mb-4">
                        <div className="bg-blue-600 p-3 rounded-full">
                            <Stethoscope className="w-8 h-8 text-white" />
                        </div>
                    </div>
                    <CardTitle className="text-2xl text-center">
                        {isLogin ? 'Doctor Login' : 'Doctor Registration'}
                    </CardTitle>
                    <CardDescription className="text-center">
                        {isLogin
                            ? 'Access your medical practice dashboard'
                            : 'Create your account to manage patients'}
                    </CardDescription>
                </CardHeader>

                <CardContent>
                    {message.text && (
                        <Alert className={`mb-4 ${message.type === 'success' ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                            <AlertDescription className={message.type === 'success' ? 'text-green-800' : 'text-red-800'}>
                                {message.text}
                            </AlertDescription>
                        </Alert>
                    )}

                    {isLogin ? (
                        <form onSubmit={handleLoginSubmit} className="space-y-4">
                            {/* --- LOGIN --- */}
                            <div className="space-y-2">
                                <Label>Email or Phone Number</Label>
                                <Input
                                    placeholder="doctor@hospital.com"
                                    value={loginForm.email}
                                    onChange={(e) => setLoginForm(prev => ({ ...prev, email: e.target.value }))}
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label>Password</Label>
                                <Input
                                    type="password"
                                    placeholder="••••••••"
                                    value={loginForm.password}
                                    onChange={(e) => setLoginForm(prev => ({ ...prev, password: e.target.value }))}
                                    required
                                />
                            </div>

                            <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" disabled={loading}>
                                {loading ? 'Logging in...' : 'Login'}
                            </Button>
                        </form>
                    ) : (
                        <form onSubmit={handleSignupSubmit} className="space-y-4">
                            {/* --- SIGNUP --- */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Full Name</Label>
                                    <Input
                                        placeholder="Dr. John Doe"
                                        value={signupForm.name}
                                        onChange={(e) => setSignupForm(prev => ({ ...prev, name: e.target.value }))}
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label>Department</Label>
                                    <Select
                                        value={signupForm.department}
                                        onValueChange={(value) => setSignupForm(prev => ({ ...prev, department: value }))}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select department" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {departments.map(dept => (
                                                <SelectItem key={dept} value={dept}>
                                                    {dept.charAt(0).toUpperCase() + dept.slice(1)}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* ✅ HOSPITAL DROPDOWN WITH SEARCH */}
                                <div className="space-y-2 md:col-span-2">
                                    <Label>Hospital</Label>
                                    <Select
                                        value={signupForm.hospital}
                                        onValueChange={(value) => setSignupForm(prev => ({ ...prev, hospital: value }))}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select hospital" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <div className="p-2">
                                                <div className="relative mb-2">
                                                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                                    <Input
                                                        type="text"
                                                        placeholder="Search hospital..."
                                                        className="pl-9 text-sm"
                                                        value={searchTerm}
                                                        onChange={(e) => setSearchTerm(e.target.value)}
                                                    />
                                                </div>
                                                {filteredHospitals.length > 0 ? (
                                                    filteredHospitals.map((hospital, idx) => (
                                                        <SelectItem key={idx} value={hospital.name}>
                                                            {hospital.name} ({hospital.state})
                                                        </SelectItem>
                                                    ))
                                                ) : (
                                                    <p className="text-gray-500 text-sm px-2">No hospitals found</p>
                                                )}
                                            </div>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label>ID Card Number</Label>
                                    <Input
                                        placeholder="MED123456"
                                        value={signupForm.idCardNumber}
                                        onChange={(e) => setSignupForm(prev => ({ ...prev, idCardNumber: e.target.value }))}
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label>Email</Label>
                                    <Input
                                        type="email"
                                        placeholder="doctor@hospital.com"
                                        value={signupForm.email}
                                        onChange={(e) => setSignupForm(prev => ({ ...prev, email: e.target.value }))}
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label>Password</Label>
                                    <Input
                                        type="password"
                                        placeholder="••••••••"
                                        value={signupForm.password}
                                        onChange={(e) => setSignupForm(prev => ({ ...prev, password: e.target.value }))}
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label>Confirm Password</Label>
                                    <Input
                                        type="password"
                                        placeholder="••••••••"
                                        value={signupForm.confirmPassword}
                                        onChange={(e) => setSignupForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                                        required
                                    />
                                </div>
                            </div>

                            {/* WORKING DAYS */}
                            <div className="space-y-2">
                                <Label>Working Days</Label>
                                <div className="grid grid-cols-4 gap-2">
                                    {weekDays.map(day => (
                                        <Button
                                            key={day}
                                            type="button"
                                            variant={signupForm.workingDays.includes(day) ? 'default' : 'outline'}
                                            className={`text-xs ${signupForm.workingDays.includes(day) ? 'bg-blue-600 hover:bg-blue-700' : ''}`}
                                            onClick={() => toggleWorkingDay(day)}
                                        >
                                            {day.slice(0, 3).toUpperCase()}
                                        </Button>
                                    ))}
                                </div>
                            </div>

                            <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" disabled={loading}>
                                {loading ? 'Creating Account...' : 'Create Account'}
                            </Button>
                        </form>
                    )}
                </CardContent>

                <CardFooter className="flex flex-col space-y-2">
                    <div className="text-sm text-center text-gray-600">
                        {isLogin ? "Don't have an account? " : 'Already have an account? '}
                        <button
                            type="button"
                            className="text-blue-600 hover:underline font-medium"
                            onClick={() => {
                                setIsLogin(!isLogin);
                                setMessage({ type: '', text: '' });
                            }}
                        >
                            {isLogin ? 'Sign up' : 'Login'}
                        </button>
                    </div>
                </CardFooter>
            </Card>
        </div>
    );
}
