import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Stethoscope, Mail, Lock, User, Building2, CreditCard, Calendar, Search, Heart } from 'lucide-react';

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
        <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundColor: '#F2F2F2' }}>
            <Card className="w-full max-w-2xl shadow-2xl border-none bg-white transition-all duration-300 hover:shadow-3xl">
                <CardHeader className="space-y-3 pb-6">
                    <div className="flex items-center justify-center mb-2">
                        <div className="p-4 rounded-full transition-transform duration-300 hover:scale-110" style={{ backgroundColor: '#4AD2CC' }}>
                            <Stethoscope className="w-10 h-10 text-white" />
                        </div>
                    </div>
                    <CardTitle className="text-3xl text-center font-bold" style={{ color: '#333333' }}>
                        {isLogin ? 'Doctor Login' : 'Doctor Registration'}
                    </CardTitle>
                    <CardDescription className="text-center text-base" style={{ color: '#333333', opacity: 0.7 }}>
                        {isLogin
                            ? 'Access your medical practice dashboard'
                            : 'Create your account to manage patients'}
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
                        <div className="space-y-5" onSubmit={handleLoginSubmit}>
                            <div className="space-y-2">
                                <Label className="text-sm font-semibold" style={{ color: '#333333' }}>
                                    Email or Phone Number
                                </Label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-3 h-5 w-5" style={{ color: '#4AD2CC' }} />
                                    <Input
                                        placeholder="doctor@hospital.com"
                                        className="pl-10 py-6 border-gray-200 focus:ring-2 transition-all duration-200"
                                        style={{ borderColor: '#E5E5E5' }}
                                        value={loginForm.email}
                                        onChange={(e) => setLoginForm(prev => ({ ...prev, email: e.target.value }))}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label className="text-sm font-semibold" style={{ color: '#333333' }}>
                                    Password
                                </Label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-3 h-5 w-5" style={{ color: '#4AD2CC' }} />
                                    <Input
                                        type="password"
                                        placeholder="••••••••"
                                        className="pl-10 py-6 border-gray-200 focus:ring-2 transition-all duration-200"
                                        style={{ borderColor: '#E5E5E5' }}
                                        value={loginForm.password}
                                        onChange={(e) => setLoginForm(prev => ({ ...prev, password: e.target.value }))}
                                        required
                                    />
                                </div>
                            </div>

                            <Button 
                                onClick={handleLoginSubmit}
                                className="w-full text-white font-semibold py-6 text-base rounded-lg transition-all duration-200 hover:opacity-90 shadow-lg"
                                style={{ backgroundColor: '#4AD2CC' }}
                                disabled={loading}
                            >
                                {loading ? 'Logging in...' : 'Login'}
                            </Button>
                        </div>
                    ) : (
                        <div className="space-y-5">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label className="text-sm font-semibold" style={{ color: '#333333' }}>
                                        Full Name
                                    </Label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-3 h-5 w-5" style={{ color: '#4A90E2' }} />
                                        <Input
                                            placeholder="Dr. John Doe"
                                            className="pl-10 py-6 border-gray-200 focus:ring-2 transition-all duration-200"
                                            style={{ borderColor: '#E5E5E5' }}
                                            value={signupForm.name}
                                            onChange={(e) => setSignupForm(prev => ({ ...prev, name: e.target.value }))}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label className="text-sm font-semibold" style={{ color: '#333333' }}>
                                        Department
                                    </Label>
                                    <Select
                                        value={signupForm.department}
                                        onValueChange={(value) => setSignupForm(prev => ({ ...prev, department: value }))}
                                    >
                                        <SelectTrigger className="py-6 border-gray-200" style={{ borderColor: '#E5E5E5' }}>
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

                                <div className="space-y-2 md:col-span-2">
                                    <Label className="text-sm font-semibold" style={{ color: '#333333' }}>
                                        Hospital
                                    </Label>
                                    <Select
                                        value={signupForm.hospital}
                                        onValueChange={(value) => setSignupForm(prev => ({ ...prev, hospital: value }))}
                                    >
                                        <SelectTrigger className="py-6 border-gray-200" style={{ borderColor: '#E5E5E5' }}>
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
                                    <Label className="text-sm font-semibold" style={{ color: '#333333' }}>
                                        ID Card Number
                                    </Label>
                                    <div className="relative">
                                        <CreditCard className="absolute left-3 top-3 h-5 w-5" style={{ color: '#4A90E2' }} />
                                        <Input
                                            placeholder="MED123456"
                                            className="pl-10 py-6 border-gray-200 focus:ring-2 transition-all duration-200"
                                            style={{ borderColor: '#E5E5E5' }}
                                            value={signupForm.idCardNumber}
                                            onChange={(e) => setSignupForm(prev => ({ ...prev, idCardNumber: e.target.value }))}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label className="text-sm font-semibold" style={{ color: '#333333' }}>
                                        Email
                                    </Label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-3 h-5 w-5" style={{ color: '#4A90E2' }} />
                                        <Input
                                            type="email"
                                            placeholder="doctor@hospital.com"
                                            className="pl-10 py-6 border-gray-200 focus:ring-2 transition-all duration-200"
                                            style={{ borderColor: '#E5E5E5' }}
                                            value={signupForm.email}
                                            onChange={(e) => setSignupForm(prev => ({ ...prev, email: e.target.value }))}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label className="text-sm font-semibold" style={{ color: '#333333' }}>
                                        Password
                                    </Label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-3 h-5 w-5" style={{ color: '#4A90E2' }} />
                                        <Input
                                            type="password"
                                            placeholder="••••••••"
                                            className="pl-10 py-6 border-gray-200 focus:ring-2 transition-all duration-200"
                                            style={{ borderColor: '#E5E5E5' }}
                                            value={signupForm.password}
                                            onChange={(e) => setSignupForm(prev => ({ ...prev, password: e.target.value }))}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label className="text-sm font-semibold" style={{ color: '#333333' }}>
                                        Confirm Password
                                    </Label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-3 h-5 w-5" style={{ color: '#4A90E2' }} />
                                        <Input
                                            type="password"
                                            placeholder="••••••••"
                                            className="pl-10 py-6 border-gray-200 focus:ring-2 transition-all duration-200"
                                            style={{ borderColor: '#E5E5E5' }}
                                            value={signupForm.confirmPassword}
                                            onChange={(e) => setSignupForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                                            required
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <Label className="text-sm font-semibold flex items-center gap-2" style={{ color: '#333333' }}>
                                    <Calendar className="h-4 w-4" style={{ color: '#4A90E2' }} />
                                    Working Days
                                </Label>
                                <div className="grid grid-cols-4 gap-2">
                                    {weekDays.map(day => (
                                        <Button
                                            key={day}
                                            type="button"
                                            className={`text-xs font-semibold py-5 transition-all duration-200 ${
                                                signupForm.workingDays.includes(day) 
                                                    ? 'text-white shadow-md' 
                                                    : 'bg-white hover:bg-gray-50'
                                            }`}
                                            style={signupForm.workingDays.includes(day) 
                                                ? { backgroundColor: '#4A90E2' } 
                                                : { color: '#333333', borderColor: '#E5E5E5' }
                                            }
                                            onClick={() => toggleWorkingDay(day)}
                                        >
                                            {day.slice(0, 3).toUpperCase()}
                                        </Button>
                                    ))}
                                </div>
                            </div>

                            <Button 
                                onClick={handleSignupSubmit}
                                className="w-full text-white font-semibold py-6 text-base rounded-lg transition-all duration-200 hover:opacity-90 shadow-lg"
                                style={{ backgroundColor: '#4AD2CC' }}
                                disabled={loading}
                            >
                                {loading ? 'Creating Account...' : 'Create Account'}
                            </Button>
                        </div>
                    )}
                </CardContent>

                <CardFooter className="flex flex-col space-y-3 pt-6">
                    <div className="text-sm text-center" style={{ color: '#333333', opacity: 0.7 }}>
                        {isLogin ? "Don't have an account? " : 'Already have an account? '}
                        <button
                            type="button"
                            className="font-semibold hover:underline transition-all duration-200"
                            style={{ color: '#4AD2CC' }}
                            onClick={() => {
                                setIsLogin(!isLogin);
                                setMessage({ type: '', text: '' });
                            }}
                        >
                            {isLogin ? 'Sign up' : 'Login'}
                        </button>
                    </div>
                    <div className="flex items-center justify-center gap-2 text-xs" style={{ color: '#333333', opacity: 0.5 }}>
                        <Heart className="h-3 w-3" style={{ color: '#FF6B6B' }} />
                        <span>Powered by MediBridge</span>
                    </div>
                </CardFooter>
            </Card>
        </div>
    );
}