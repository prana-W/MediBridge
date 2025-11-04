import React from 'react';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {Button} from '@/components/ui/button';
import {
    Heart,
    Stethoscope,
    Users,
    Activity,
    Brain,
    MessageSquare,
    Search,
    Clock,
} from 'lucide-react';

// Loader Component (Heartbeat Animation)
function Loader() {
    return (
        <div className="relative w-full h-16 flex items-center justify-center overflow-visible">
            <div className="absolute w-full h-[2px] bg-gray-300 rounded-full top-1/2 -translate-y-1/2"></div>

            <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 150 40"
                preserveAspectRatio="none"
                className="w-[120%] h-16 stroke-[#4AD2CC]"
            >
                <polyline
                    fill="none"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeDasharray="220"
                    strokeDashoffset="220"
                    points="
            0,20
            20,20
            25,15
            30,25
            40,20
            60,20
            65,5
            70,35
            75,20
            95,20
            100,15
            110,20
            150,20
          "
                >
                    <animate
                        attributeName="stroke-dashoffset"
                        values="220;0"
                        dur="1.6s"
                        repeatCount="indefinite"
                    />
                </polyline>
            </svg>
        </div>
    );
}

export default function MediBridgeHome() {
    return (
        <div
            className="min-h-screen flex flex-col"
            style={{backgroundColor: '#F2F2F2'}}
        >
            <main className="flex-grow">
                <section
                    className="relative min-h-[calc(100vh-80px)] overflow-hidden"
                    style={{backgroundColor: '#4AD2CC'}}
                >
                    {/* Grid Background Pattern */}
                    <div className="absolute inset-0 opacity-30">
                        <div
                            className="h-full w-full"
                            style={{
                                backgroundImage: `linear-gradient(white 1px, transparent 1px), linear-gradient(90deg, white 1px, transparent 1px)`,
                                backgroundSize: '50px 50px',
                            }}
                        ></div>
                    </div>

                    <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
                        <div className="grid md:grid-cols-2 gap-8 items-center min-h-[calc(100vh-80px)]">
                            {/* Left Side - Content */}
                            <div className="relative py-12 md:py-0 flex items-center md:pl-8">
                                <div className="w-full">
                                    {/* Icon with pulse animation */}
                                    <div className="mb-6 flex justify-start">
                                        <div className="animate-pulse">
                                            <Activity className="h-16 w-16 text-white" />
                                        </div>
                                    </div>

                                    {/* Heartbeat Animation */}
                                    <div className="relative mb-5">
                                        <div className="opacity-100">
                                            <Loader />
                                        </div>
                                    </div>

                                    {/* Main Heading */}
                                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                                        Connecting Patients and Doctors
                                        Seamlessly
                                    </h1>

                                    <p className="text-white text-lg md:text-xl mb-8 opacity-90">
                                        MediBridge is your trusted healthcare
                                        platform that brings quality medical
                                        care to your fingertips.
                                    </p>

                                    {/* Two Buttons Stacked */}
                                    <div className="space-y-4 max-w-sm">
                                        <Button
                                            className="w-full text-white font-semibold py-6 text-base rounded-full transition-all duration-300 hover:scale-105 hover:shadow-2xl"
                                            style={{backgroundColor: '#4A90E2'}}
                                            onClick={() =>
                                                (window.location.href =
                                                    '/patient/auth')
                                            }
                                        >
                                            Patient Sign In / Login
                                        </Button>

                                        <Button
                                            className="w-full text-white font-semibold py-6 text-base rounded-full transition-all duration-300 hover:scale-105 hover:shadow-2xl"
                                            style={{backgroundColor: '#4A90E2'}}
                                            onClick={() =>
                                                (window.location.href =
                                                    '/doctor/auth')
                                            }
                                        >
                                            Doctor Sign In / Login
                                        </Button>
                                    </div>
                                </div>
                            </div>

                            {/* Right Side - Doctor Image */}
                            <div className="relative flex items-end justify-end py-0 h-full">
                                <div className="relative w-full h-full flex items-end justify-end">
                                    {/* Decorative floating card */}
                                    <div
                                        className="absolute top-20 right-20 z-30 animate-bounce"
                                        style={{animationDuration: '3s'}}
                                    >
                                        <div className="bg-white rounded-2xl p-5 shadow-2xl">
                                            <div className="flex items-center space-x-3">
                                                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                                                    <Heart
                                                        className="w-6 h-6"
                                                        style={{
                                                            color: '#FF6B6B',
                                                        }}
                                                    />
                                                </div>
                                                <div className="flex-1">
                                                    <div className="h-2 bg-gray-200 rounded-full mb-2 w-24"></div>
                                                    <div className="h-2 bg-gray-300 rounded-full w-16"></div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Doctor Image - Full Right Side */}
                                    <div className="relative z-20 w-full h-full flex items-end justify-end">
                                        <img
                                            src="/doctorwithlaptop.png"
                                            alt="Doctor with stethoscope and laptop"
                                            className="w-100% h-full object-cover object-bottom drop-shadow-2xl"
                                            style={{
                                                maxHeight:
                                                    'calc(100vh - 250px)',
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Features Section */}
                <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
                    <div className="max-w-6xl mx-auto">
                        <h2
                            className="text-3xl md:text-4xl font-bold text-center mb-4"
                            style={{color: '#333333'}}
                        >
                            Powerful Features for Modern Healthcare
                        </h2>
                        <p
                            className="text-center text-lg mb-12"
                            style={{color: '#333333', opacity: 0.7}}
                        >
                            Experience seamless healthcare management with our
                            innovative platform
                        </p>

                        <div className="grid md:grid-cols-3 gap-8">
                            {/* Feature 1: OPD Queue Management */}
                            <div className="text-center group hover:scale-105 transition-transform duration-300">
                                <div className="flex justify-center mb-6">
                                    <div
                                        className="p-4 rounded-2xl transition-all duration-300 group-hover:shadow-xl"
                                        style={{backgroundColor: '#4A90E2'}}
                                    >
                                        <Clock className="h-12 w-12 text-white" />
                                    </div>
                                </div>
                                <h3
                                    className="text-xl font-bold mb-3"
                                    style={{color: '#4A90E2'}}
                                >
                                    Smart OPD Queue Management
                                </h3>
                                <p
                                    className="mb-4"
                                    style={{color: '#333333', opacity: 0.7}}
                                >
                                    Efficient queue management powered by both
                                    manual controls and AI algorithms to
                                    minimize wait times
                                </p>
                                <div className="flex justify-center gap-2 flex-wrap">
                                    <span
                                        className="px-3 py-1 rounded-full text-xs font-semibold"
                                        style={{
                                            backgroundColor: '#4A90E220',
                                            color: '#4A90E2',
                                        }}
                                    >
                                        Manual Mode
                                    </span>
                                    <span
                                        className="px-3 py-1 rounded-full text-xs font-semibold"
                                        style={{
                                            backgroundColor: '#4AD2CC20',
                                            color: '#4AD2CC',
                                        }}
                                    >
                                        AI Powered
                                    </span>
                                </div>
                            </div>

                            {/* Feature 2: AI Voice Booking */}
                            <div className="text-center group hover:scale-105 transition-transform duration-300">
                                <div className="flex justify-center mb-6">
                                    <div
                                        className="p-4 rounded-2xl transition-all duration-300 group-hover:shadow-xl"
                                        style={{backgroundColor: '#4AD2CC'}}
                                    >
                                        <MessageSquare className="h-12 w-12 text-white" />
                                    </div>
                                </div>
                                <h3
                                    className="text-xl font-bold mb-3"
                                    style={{color: '#4AD2CC'}}
                                >
                                    AI-Powered Voice Booking
                                </h3>
                                <p
                                    className="mb-4"
                                    style={{color: '#333333', opacity: 0.7}}
                                >
                                    Simply talk to our AI assistant to book
                                    appointments - no typing, no hassle, just
                                    natural conversation
                                </p>
                                <div className="flex justify-center gap-2 flex-wrap">
                                    <span
                                        className="px-3 py-1 rounded-full text-xs font-semibold"
                                        style={{
                                            backgroundColor: '#4AD2CC20',
                                            color: '#4AD2CC',
                                        }}
                                    >
                                        Voice First
                                    </span>
                                    <span
                                        className="px-3 py-1 rounded-full text-xs font-semibold"
                                        style={{
                                            backgroundColor: '#4A90E220',
                                            color: '#4A90E2',
                                        }}
                                    >
                                        AI Assistant
                                    </span>
                                </div>
                            </div>

                            {/* Feature 3: Manual Selection */}
                            <div className="text-center group hover:scale-105 transition-transform duration-300">
                                <div className="flex justify-center mb-6">
                                    <div
                                        className="p-4 rounded-2xl transition-all duration-300 group-hover:shadow-xl"
                                        style={{backgroundColor: '#4A90E2'}}
                                    >
                                        <Search className="h-12 w-12 text-white" />
                                    </div>
                                </div>
                                <h3
                                    className="text-xl font-bold mb-3"
                                    style={{color: '#4A90E2'}}
                                >
                                    Manual Hospital & Doctor Selection
                                </h3>
                                <p
                                    className="mb-4"
                                    style={{color: '#333333', opacity: 0.7}}
                                >
                                    Prefer to choose yourself? Browse hospitals,
                                    specialists, and book appointments at your
                                    convenience
                                </p>
                                <div className="flex justify-center gap-2 flex-wrap">
                                    <span
                                        className="px-3 py-1 rounded-full text-xs font-semibold"
                                        style={{
                                            backgroundColor: '#4A90E220',
                                            color: '#4A90E2',
                                        }}
                                    >
                                        Full Control
                                    </span>
                                    <span
                                        className="px-3 py-1 rounded-full text-xs font-semibold"
                                        style={{
                                            backgroundColor: '#4AD2CC20',
                                            color: '#4AD2CC',
                                        }}
                                    >
                                        Easy Browse
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Why Choose Section */}
                <section
                    className="py-16 px-4 sm:px-6 lg:px-8"
                    style={{backgroundColor: '#F2F2F2'}}
                >
                    <div className="max-w-6xl mx-auto">
                        <h2
                            className="text-3xl md:text-4xl font-bold text-center mb-12"
                            style={{color: '#333333'}}
                        >
                            Why Choose MediBridge?
                        </h2>
                        <div className="grid md:grid-cols-3 gap-8">
                            <div className="text-center group hover:scale-105 transition-transform duration-300">
                                <div className="flex justify-center mb-4">
                                    <div
                                        className="p-3 rounded-full transition-all duration-300 group-hover:shadow-lg"
                                        style={{backgroundColor: '#4A90E2'}}
                                    >
                                        <Heart
                                            className="h-8 w-8"
                                            style={{color: '#FF6B6B'}}
                                        />
                                    </div>
                                </div>
                                <h3
                                    className="text-xl font-semibold mb-2"
                                    style={{color: '#4A90E2'}}
                                >
                                    Trusted Care
                                </h3>
                                <p style={{color: '#333333', opacity: 0.7}}>
                                    Connect with verified healthcare
                                    professionals you can trust
                                </p>
                            </div>
                            <div className="text-center group hover:scale-105 transition-transform duration-300">
                                <div className="flex justify-center mb-4">
                                    <div
                                        className="p-3 rounded-full transition-all duration-300 group-hover:shadow-lg"
                                        style={{backgroundColor: '#4AD2CC'}}
                                    >
                                        <Clock className="h-8 w-8 text-white" />
                                    </div>
                                </div>
                                <h3
                                    className="text-xl font-semibold mb-2"
                                    style={{color: '#4AD2CC'}}
                                >
                                    24/7 Access
                                </h3>
                                <p style={{color: '#333333', opacity: 0.7}}>
                                    Healthcare support whenever and wherever you
                                    need it
                                </p>
                            </div>
                            <div className="text-center group hover:scale-105 transition-transform duration-300">
                                <div className="flex justify-center mb-4">
                                    <div
                                        className="p-3 rounded-full transition-all duration-300 group-hover:shadow-lg"
                                        style={{backgroundColor: '#4A90E2'}}
                                    >
                                        <Stethoscope className="h-8 w-8 text-white" />
                                    </div>
                                </div>
                                <h3
                                    className="text-xl font-semibold mb-2"
                                    style={{color: '#4A90E2'}}
                                >
                                    Easy Management
                                </h3>
                                <p style={{color: '#333333', opacity: 0.7}}>
                                    Simple and intuitive platform for all your
                                    healthcare needs
                                </p>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
}
