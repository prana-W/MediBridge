import React from 'react';
import { Button } from '@/components/ui/button';
import { Heart } from 'lucide-react';

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

      {/* Hero Section - Split Design */}
      <main className="flex-grow">
        <section className="relative min-h-[600px] overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
            <div className="grid md:grid-cols-2 gap-0 items-center min-h-[600px]">
              
              {/* Left Side - Speech Bubble with Content */}
              <div className="relative py-12 md:py-0 flex items-center">
                {/* Speech Bubble Shape */}
                <div className="relative w-full">
                  <svg className="absolute inset-0 w-full h-full" viewBox="0 0 500 400" preserveAspectRatio="none">
                    <path
                      d="M 50 50 Q 50 30, 70 30 L 430 30 Q 450 30, 450 50 L 450 300 Q 450 320, 430 320 L 250 320 L 200 370 L 200 320 L 70 320 Q 50 320, 50 300 Z"
                      fill="#4AD2CC"
                    />
                  </svg>
                  
                  {/* Content inside speech bubble */}
                  <div className="relative z-10 px-12 py-16">
                    <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
                      Connecting Patients and Doctors Seamlessly
                    </h1>
                    
                    <p className="text-white text-base md:text-lg mb-8 opacity-90">
                      MediBridge is your trusted healthcare platform that brings quality medical care to your fingertips.
                    </p>
                    
                    {/* Two Buttons Stacked */}
                    <div className="space-y-4 max-w-xs">
                      <Button 
                        className="w-full text-white font-semibold py-6 text-base rounded-full hover:opacity-90 transition-all shadow-lg hover:shadow-xl"
                        style={{ backgroundColor: '#4A90E2' }}
                        onClick={() => window.location.href = '/patient/auth'}
                      >
                        Patient Sign In / Login
                      </Button>
                      
                      <Button 
                        className="w-full text-white font-semibold py-6 text-base rounded-full hover:opacity-90 transition-all shadow-lg hover:shadow-xl"
                        style={{ backgroundColor: '#4A90E2' }}
                        onClick={() => window.location.href = '/doctor/auth'}
                      >
                        Doctor Sign In / Login
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Side - Doctor Image with Decorative Elements */}
              <div className="relative flex items-center justify-center py-12 md:py-0">
                <div className="relative z-10">
                  {/* Decorative white boxes behind doctor */}
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 space-y-6 w-64">
                    <div className="bg-white rounded-2xl p-4 shadow-lg">
                      <div className="h-3 bg-gray-200 rounded-full"></div>
                    </div>
                    <div className="bg-white rounded-2xl p-4 shadow-lg">
                      <div className="h-3 bg-gray-200 rounded-full"></div>
                    </div>
                    <div className="bg-white rounded-2xl p-4 shadow-lg">
                      <div className="h-3 bg-gray-200 rounded-full"></div>
                    </div>
                  </div>
                  
                  {/* Doctor Illustration/Icon */}
                  <div className="relative z-20 flex items-center justify-center">
                    <div className="w-72 h-72 rounded-full flex items-center justify-center" style={{ backgroundColor: '#4AD2CC20' }}>
                      <div className="text-center">
                        {/* Placeholder for doctor image - you can replace with actual image */}
                        <div className="w-48 h-48 mx-auto rounded-full flex items-center justify-center mb-4" style={{ backgroundColor: '#4AD2CC' }}>
                          <svg className="w-32 h-32 text-white" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/>
                          </svg>
                        </div>
                        <div className="text-4xl mb-2">👨‍⚕️</div>
                        <div className="w-16 h-1 mx-auto rounded-full" style={{ backgroundColor: '#4A90E2' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

            </div>
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
                    <Heart className="h-8 w-8" style={{ color: '#ffffff' }} />
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
                    <svg className="h-8 w-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z"/>
                    </svg>
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
                    <svg className="h-8 w-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M22.7 19l-9.1-9.1c.9-2.3.4-5-1.5-6.9-2-2-5-2.4-7.4-1.3L9 6 6 9 1.6 4.7C.4 7.1.9 10.1 2.9 12.1c1.9 1.9 4.6 2.4 6.9 1.5l9.1 9.1c.4.4 1 .4 1.4 0l2.3-2.3c.5-.4.5-1.1.1-1.4z"/>
                    </svg>
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