import {useState, useEffect} from 'react';

export default function Header() {
    const [role, setRole] = useState(null);

    useEffect(() => {
        // Check for role on every page refresh/redirect
        const storedRole = localStorage.getItem('role');
        setRole(storedRole);
    });

    const handleLogout = async () => {
        try {
            const res = await fetch(
                `${import.meta.env.VITE_SERVER_URL}/${role}/logout`,
                {
                    method: 'POST',
                    credentials: 'include',
                }
            );

            if (!res.ok) {
                console.error('Logout failed on server');
            }
        } catch (error) {
            console.error('Error during logout:', error);
        } finally {
            // Always clear localStorage and redirect, even if API call fails
            localStorage.removeItem('accessToken');
            localStorage.setItem('role', 'null');
            setRole(null);
            window.location.href = '/';
        }
    };
    const navigateTo = (path) => {
        window.location.href = path;
    };

    const renderPatientNav = () => (
        <>
            <button
                onClick={() => navigateTo('/')}
                className="px-4 py-2 text-gray-700 hover:text-blue-600 font-medium transition-colors"
            >
                Home
            </button>
            <button
                onClick={() => navigateTo('/patient/opd')}
                className="px-4 py-2 text-gray-700 hover:text-blue-600 font-medium transition-colors"
            >
                OPD
            </button>
            <button
                onClick={() => navigateTo('/patient/appointments')}
                className="px-4 py-2 text-gray-700 hover:text-blue-600 font-medium transition-colors"
            >
                Appointments
            </button>
            <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
            >
                Logout
            </button>
        </>
    );

    const renderDoctorNav = () => (
        <>
            <button
                onClick={() => navigateTo('/')}
                className="px-4 py-2 text-gray-700 hover:text-blue-600 font-medium transition-colors"
            >
                Home
            </button>
            <button
                onClick={() => navigateTo('/doctor/appointments')}
                className="px-4 py-2 text-gray-700 hover:text-blue-600 font-medium transition-colors"
            >
                Appointments
            </button>
            <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
            >
                Logout
            </button>
        </>
    );

    const renderGuestNav = () => (
        <>
            <button
                onClick={() => navigateTo('/')}
                className="px-4 py-2 text-gray-700 hover:text-blue-600 font-medium transition-colors"
            >
                Home
            </button>
            <button
                onClick={() => navigateTo('/doctor/auth')}
                className="px-4 py-2 text-gray-700 hover:text-blue-600 font-medium transition-colors"
            >
                Doctor
            </button>
            <button
                onClick={() => navigateTo('/patient/auth')}
                className="px-4 py-2 text-black rounded-lg hover:text-blue-600 transition-colors"
            >
                Patient
            </button>
        </>
    );

    return (
        <header className="bg-white shadow-md">
            <nav className="container mx-auto px-6 py-4">
                <div className="flex items-center justify-between">
                    <div
                        className="text-2xl font-bold text-blue-600 cursor-pointer"
                        onClick={() => navigateTo('/')}
                    >
                        MediBridge
                    </div>
                    <div className="flex items-center space-x-4">
                        {role === 'patient' && renderPatientNav()}
                        {role === 'doctor' && renderDoctorNav()}
                        {(role === null || role === 'null') && renderGuestNav()}
                    </div>
                </div>
            </nav>
        </header>
    );
}
