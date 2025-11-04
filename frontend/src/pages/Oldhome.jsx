import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Heart, Stethoscope, Users, Activity } from 'lucide-react';

// Loader Component
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
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#F2F2F2' }}>
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-2">
              <Heart className="h-8 w-8" style={{ color: '#FF6B6B' }} />
              <span className="text-2xl font-bold" style={{ color: '#4A90E2' }}>
                MediBridge
              </span>
            </div>
            <nav className="hidden md:flex space-x-8">
              <button className="font-medium transition-colors hover:opacity-80" style={{ color: '#4A90E2' }}>
                Home
              </button>
              <button className="font-medium transition-colors hover:opacity-80" style={{ color: '#333333' }}>
                Doctor
              </button>
              <button className="font-medium transition-colors hover:opacity-80" style={{ color: '#333333' }}>
                Patient
              </button>
              <button className="font-medium transition-colors hover:opacity-80" style={{ color: '#333333' }}>
                Contact
              </button>
            </nav>
            <button className="md:hidden" style={{ color: '#4A90E2' }}>
              <svg className="h-6 w-6" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                <path d="M4 6h16M4 12h16M4 18h16"></path>
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-grow">
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto text-center">
            <div className="mb-6 flex justify-center">
              <Activity className="h-16 w-16" style={{ color: '#4AD2CC' }} />
            </div>

            <div className="relative mb-6">
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full opacity-100 pointer-events-none">
                <Loader />
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold relative z-10" style={{ color: '#333333' }}>
                Connecting Patients and Doctors Seamlessly
              </h1>
            </div>

            <p className="text-lg md:text-xl mb-8 max-w-3xl mx-auto" style={{ color: '#333333', opacity: 0.8 }}>
              MediBridge is your trusted healthcare platform that brings quality medical care to your fingertips.
              Experience hassle-free appointments, secure consultations, and comprehensive health management all in one place.
            </p>
            {/* <Button
              size="lg"
              className="text-white font-semibold px-8 py-6 text-lg rounded-lg hover:opacity-90 transition-opacity shadow-lg"
              style={{ backgroundColor: '#4AD2CC' }}
            >
              Get Started
            </Button> */}
          </div>
        </section>

        {/* Cards Section */}
        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-8">
            
            {/* For Patients Card */}
            <Card className="border-none shadow-xl hover:shadow-2xl transition-shadow duration-300 bg-white">
              <CardHeader className="text-center pb-4">
                <div className="flex justify-center mb-4">
                  <div className="p-4 rounded-full" style={{ backgroundColor: '#4A90E2', opacity: 1 }}>
                    <img src="/patient.png" alt="Patient" className="h-12 w-12 " />
                  </div>
                </div>
                <CardTitle className="text-3xl font-bold mb-2" style={{ color: '#4A90E2' }}>
                  For Patients
                </CardTitle>
                <CardDescription className="text-base" style={{ color: '#333333', opacity: 0.7 }}>
                  Access world-class healthcare from the comfort of your home
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center space-y-4">
                <ul className="text-left space-y-3 mb-6" style={{ color: '#333333' }}>
                  <li className="flex items-start">
                    <span className="mr-2" style={{ color: '#4AD2CC' }}>✓</span>
                    <span>Book appointments with verified doctors</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2" style={{ color: '#4AD2CC' }}>✓</span>
                    <span>Access your medical records anytime</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2" style={{ color: '#4AD2CC' }}>✓</span>
                    <span>Get online consultations and prescriptions</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2" style={{ color: '#4AD2CC' }}>✓</span>
                    <span>Track your health journey with ease</span>
                  </li>
                </ul>
                <div className="flex gap-3">
                  <Button className="flex-1 text-white font-semibold py-5 rounded-lg hover:opacity-90 transition-opacity"
                    style={{ backgroundColor: '#4A90E2' }}
                    onClick={() => window.location.href = '/patient/auth'}>
                    Login / Register
                  </Button>
                  
                </div>
              </CardContent>
            </Card>

            {/* For Doctors Card */}
            <Card className="border-none shadow-xl hover:shadow-2xl transition-shadow duration-300 bg-white">
              <CardHeader className="text-center pb-4">
                <div className="flex justify-center mb-4">
                  <div className="p-4 rounded-full" style={{ backgroundColor: '#4AD2CC', opacity: 1 }}>
                    <img src="/doctor.png" alt="Doctor" className="h-12 w-12 " />
                  </div>
                </div>
                <CardTitle className="text-3xl font-bold mb-2" style={{ color: '#4AD2CC' }}>
                  For Doctors
                </CardTitle>
                <CardDescription className="text-base" style={{ color: '#333333', opacity: 0.7 }}>
                  Expand your practice and manage patients efficiently
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center space-y-4">
                <ul className="text-left space-y-3 mb-6" style={{ color: '#333333' }}>
                  <li className="flex items-start">
                    <span className="mr-2" style={{ color: '#4A90E2' }}>✓</span>
                    <span>Manage appointments with ease</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2" style={{ color: '#4A90E2' }}>✓</span>
                    <span>Digital prescription and record management</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2" style={{ color: '#4A90E2' }}>✓</span>
                    <span>Video consultation capabilities</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2" style={{ color: '#4A90E2' }}>✓</span>
                    <span>Grow your practice with our platform</span>
                  </li>
                </ul>
                <div className="flex gap-3">
                  <Button className="flex-1 text-white font-semibold py-5 rounded-lg hover:opacity-90 transition-opacity"
                    style={{ backgroundColor: '#4AD2CC' }}
                    onClick={() => window.location.href = '/doctor/auth'}>
                    Login / Register
                  </Button>
                  
                </div>
              </CardContent>
            </Card>

          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12" style={{ color: '#333333' }}>
              Why Choose MediBridge?
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="flex justify-center mb-4">
                  <div className="p-3 rounded-full" style={{ backgroundColor: '#4A90E2', opacity: 1 }}>
                    <Heart className="h-8 w-8 " style={{ color: '#FF6B6B' }} />
                  </div>
                </div>
                <h3 className="text-xl font-semibold mb-2" style={{ color: '#4A90E2' }}>
                  Trusted Care
                </h3>
                <p style={{ color: '#333333', opacity: 0.7 }}>
                  Connect with verified healthcare professionals you can trust
                </p>
              </div>
              <div className="text-center">
                <div className="flex justify-center mb-4">
                  <div className="p-3 rounded-full" style={{ backgroundColor: '#4AD2CC', opacity: 1 }}>
                  <img src="/clock.png" alt="Patient" className="h-12 w-12 " />
                  </div>
                </div>
                <h3 className="text-xl font-semibold mb-2" style={{ color: '#4AD2CC' }}>
                  24/7 Access
                </h3>
                <p style={{ color: '#333333', opacity: 0.7 }}>
                  Healthcare support whenever and wherever you need it
                </p>
              </div>
              <div className="text-center">
                <div className="flex justify-center mb-4">
                  <div className="p-3 rounded-full" style={{ backgroundColor: '#4A90E2', opacity: 1 }}>
                  <img src="/tool.png" alt="Patient" className="h-12 w-12 " />
                  </div>
                </div>
                <h3 className="text-xl font-semibold mb-2" style={{ color: '#4A90E2' }}>
                  Easy Management
                </h3>
                <p style={{ color: '#333333', opacity: 0.7 }}>
                  Simple and intuitive platform for all your healthcare needs
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

    </div>
  );
}