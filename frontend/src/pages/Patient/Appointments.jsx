import React, {useState, useEffect} from 'react';
import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/card';
import {
    Calendar,
    Clock,
    User,
    Pill,
    FileText,
    CheckCircle,
    AlertCircle,
    Heart,
    ChevronDown,
    ChevronUp,
    Loader2,
} from 'lucide-react';

export default function PatientAppointments() {
    const [expandedCard, setExpandedCard] = useState(null);
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchAppointments();
    }, []);

    const fetchAppointments = async () => {
        try {
            setLoading(true);
            const response = await fetch(
                `${import.meta.env.VITE_SERVER_URL}/auth/patient/appointments`,
                {
                    method: 'GET',
                    credentials: 'include',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            );

            // Check if response is JSON
            const contentType = response.headers.get('content-type');
            if (!contentType || !contentType.includes('application/json')) {
                throw new Error(
                    `Server returned ${response.status}: Expected JSON but got ${contentType}`
                );
            }

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(
                    errorData.message ||
                        `Failed to fetch appointments (${response.status})`
                );
            }

            const data = await response.json();
            console.log('Appointments data:', data);

            setAppointments(data?.data || data || []);
            setError(null);
        } catch (err) {
            setError(err.message);
            console.error('Error fetching appointments:', err);
        } finally {
            setLoading(false);
        }
    };

    const upcomingAppointments = Array.isArray(appointments)
        ? appointments.filter((apt) => !apt.isCheckupComplete)
        : [];
    const pastAppointments = Array.isArray(appointments)
        ? appointments.filter((apt) => apt.isCheckupComplete)
        : [];

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            weekday: 'short',
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    const formatTime = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const toggleCard = (id) => {
        setExpandedCard(expandedCard === id ? null : id);
    };

    return (
        <div className="min-h-screen" style={{backgroundColor: '#F2F2F2'}}>
            {/* Grid Background Pattern */}
            <div className="fixed inset-0 opacity-20 pointer-events-none">
                <div
                    className="h-full w-full"
                    style={{
                        backgroundImage: `linear-gradient(#4AD2CC 1px, transparent 1px), linear-gradient(90deg, #4AD2CC 1px, transparent 1px)`,
                        backgroundSize: '50px 50px',
                    }}
                ></div>
            </div>

            {/* Main Content */}
            <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Loading State */}
                {loading && (
                    <div className="flex flex-col items-center justify-center py-20">
                        <Loader2
                            className="h-12 w-12 animate-spin mb-4"
                            style={{color: '#4A90E2'}}
                        />
                        <p
                            className="text-lg font-semibold"
                            style={{color: '#333333'}}
                        >
                            Loading appointments...
                        </p>
                    </div>
                )}

                {/* Error State */}
                {error && (
                    <div className="bg-red-50 border-2 border-red-200 rounded-lg p-6 mb-8">
                        <div className="flex items-center">
                            <AlertCircle className="h-6 w-6 mr-3 text-red-500" />
                            <div>
                                <h3 className="font-semibold text-red-800">
                                    Error Loading Appointments
                                </h3>
                                <p className="text-sm text-red-600 mt-1">
                                    {error}
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Content - Only show when not loading */}
                {!loading && !error && (
                    <>
                        {/* Upcoming Appointments Section */}
                        <section className="mb-12">
                            <div className="flex items-center mb-6">
                                <AlertCircle
                                    className="h-8 w-8 mr-3"
                                    style={{color: '#4AD2CC'}}
                                />
                                <h2
                                    className="text-3xl font-bold"
                                    style={{color: '#333333'}}
                                >
                                    Upcoming Appointments
                                </h2>
                            </div>

                            <div className="grid md:grid-cols-2 gap-6">
                                {upcomingAppointments.map((appointment) => (
                                    <Card
                                        key={appointment._id}
                                        className="relative overflow-hidden transition-all duration-300 hover:shadow-2xl hover:scale-105 cursor-pointer border-2"
                                        style={{borderColor: '#4AD2CC'}}
                                    >
                                        {/* Status Indicator */}
                                        <div
                                            className="absolute top-0 left-0 w-2 h-full"
                                            style={{backgroundColor: '#4AD2CC'}}
                                        ></div>

                                        <CardHeader className="pb-3">
                                            <div className="flex justify-between items-start">
                                                <div className="flex-1">
                                                    <CardTitle
                                                        className="text-xl font-bold mb-2"
                                                        style={{
                                                            color: '#4A90E2',
                                                        }}
                                                    >
                                                        {appointment.doctor
                                                            ?.name ||
                                                            'Doctor Name'}
                                                    </CardTitle>
                                                    <p
                                                        className="text-sm font-medium capitalize"
                                                        style={{
                                                            color: '#4AD2CC',
                                                        }}
                                                    >
                                                        {appointment.doctor
                                                            ?.department ||
                                                            'Department'}
                                                    </p>
                                                    <p
                                                        className="text-xs mt-1"
                                                        style={{
                                                            color: '#333333',
                                                            opacity: 0.6,
                                                        }}
                                                    >
                                                        {appointment.doctor
                                                            ?.hospital ||
                                                            'Hospital'}
                                                    </p>
                                                </div>
                                                <div
                                                    className="px-3 py-1 rounded-full text-xs font-semibold"
                                                    style={{
                                                        backgroundColor:
                                                            '#4AD2CC20',
                                                        color: '#4AD2CC',
                                                    }}
                                                >
                                                    Confirmed
                                                </div>
                                            </div>
                                        </CardHeader>

                                        <CardContent>
                                            <div className="space-y-3">
                                                <div className="flex items-center">
                                                    <Calendar
                                                        className="h-5 w-5 mr-3"
                                                        style={{
                                                            color: '#4A90E2',
                                                        }}
                                                    />
                                                    <span
                                                        className="font-semibold"
                                                        style={{
                                                            color: '#333333',
                                                        }}
                                                    >
                                                        {formatDate(
                                                            appointment.createdAt
                                                        )}
                                                    </span>
                                                </div>

                                                <div className="flex items-center">
                                                    <Clock
                                                        className="h-5 w-5 mr-3"
                                                        style={{
                                                            color: '#4A90E2',
                                                        }}
                                                    />
                                                    <span
                                                        className="font-semibold"
                                                        style={{
                                                            color: '#333333',
                                                        }}
                                                    >
                                                        {8 +
                                                            appointment?.doctor
                                                                ?.currSlot +
                                                            ':00'}
                                                    </span>
                                                </div>

                                                {appointment.remarks && (
                                                    <div
                                                        className="flex items-start mt-3 pt-3 border-t"
                                                        style={{
                                                            borderColor:
                                                                '#4AD2CC40',
                                                        }}
                                                    >
                                                        <FileText
                                                            className="h-5 w-5 mr-3 mt-0.5"
                                                            style={{
                                                                color: '#4AD2CC',
                                                            }}
                                                        />
                                                        <p
                                                            className="text-sm"
                                                            style={{
                                                                color: '#333333',
                                                                opacity: 0.8,
                                                            }}
                                                        >
                                                            {
                                                                appointment.remarks
                                                            }
                                                        </p>
                                                    </div>
                                                )}
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>

                            {upcomingAppointments.length === 0 && (
                                <div className="text-center py-12">
                                    <Calendar
                                        className="h-16 w-16 mx-auto mb-4"
                                        style={{color: '#4AD2CC', opacity: 0.3}}
                                    />
                                    <p
                                        className="text-lg"
                                        style={{color: '#333333', opacity: 0.6}}
                                    >
                                        No upcoming appointments scheduled
                                    </p>
                                </div>
                            )}
                        </section>

                        {/* Past Appointments Section */}
                        <section>
                            <div className="flex items-center mb-6">
                                <CheckCircle
                                    className="h-8 w-8 mr-3"
                                    style={{color: '#4A90E2'}}
                                />
                                <h2
                                    className="text-3xl font-bold"
                                    style={{color: '#333333'}}
                                >
                                    Past Appointments
                                </h2>
                            </div>

                            <div className="grid md:grid-cols-2 gap-6">
                                {pastAppointments.map((appointment) => (
                                    <Card
                                        key={appointment._id}
                                        className="relative overflow-hidden transition-all duration-300 hover:shadow-2xl border-2"
                                        style={{borderColor: '#4A90E2'}}
                                    >
                                        {/* Status Indicator */}
                                        <div
                                            className="absolute top-0 left-0 w-2 h-full"
                                            style={{backgroundColor: '#4A90E2'}}
                                        ></div>

                                        <CardHeader className="pb-3">
                                            <div className="flex justify-between items-start">
                                                <div className="flex-1">
                                                    <CardTitle
                                                        className="text-xl font-bold mb-2"
                                                        style={{
                                                            color: '#4A90E2',
                                                        }}
                                                    >
                                                        {appointment.doctor
                                                            ?.name ||
                                                            'Doctor Name'}
                                                    </CardTitle>
                                                    <p
                                                        className="text-sm font-medium"
                                                        style={{
                                                            color: '#4AD2CC',
                                                        }}
                                                    >
                                                        {appointment.doctor
                                                            ?.specialization ||
                                                            'Specialization'}
                                                    </p>
                                                    <p
                                                        className="text-xs mt-1"
                                                        style={{
                                                            color: '#333333',
                                                            opacity: 0.6,
                                                        }}
                                                    >
                                                        {appointment.doctor
                                                            ?.hospital ||
                                                            'Hospital'}
                                                    </p>
                                                </div>
                                                <div
                                                    className="px-3 py-1 rounded-full text-xs font-semibold"
                                                    style={{
                                                        backgroundColor:
                                                            '#4A90E220',
                                                        color: '#4A90E2',
                                                    }}
                                                >
                                                    Completed
                                                </div>
                                            </div>
                                        </CardHeader>

                                        <CardContent>
                                            <div className="space-y-3">
                                                <div className="flex items-center">
                                                    <Calendar
                                                        className="h-5 w-5 mr-3"
                                                        style={{
                                                            color: '#4A90E2',
                                                        }}
                                                    />
                                                    <span
                                                        className="font-semibold"
                                                        style={{
                                                            color: '#333333',
                                                        }}
                                                    >
                                                        {formatDate(
                                                            appointment.createdAt
                                                        )}
                                                    </span>
                                                </div>

                                                <div className="flex items-center">
                                                    <Clock
                                                        className="h-5 w-5 mr-3"
                                                        style={{
                                                            color: '#4A90E2',
                                                        }}
                                                    />
                                                    <span
                                                        className="font-semibold"
                                                        style={{
                                                            color: '#333333',
                                                        }}
                                                    >
                                                        {formatTime(
                                                            appointment.createdAt
                                                        )}
                                                    </span>
                                                </div>

                                                {appointment.checkedAt && (
                                                    <div className="flex items-center">
                                                        <CheckCircle
                                                            className="h-5 w-5 mr-3"
                                                            style={{
                                                                color: '#4AD2CC',
                                                            }}
                                                        />
                                                        <span
                                                            className="text-sm"
                                                            style={{
                                                                color: '#333333',
                                                            }}
                                                        >
                                                            Checked at:{' '}
                                                            {formatTime(
                                                                appointment.checkedAt
                                                            )}
                                                        </span>
                                                    </div>
                                                )}

                                                {/* Expandable Details Button */}
                                                <button
                                                    onClick={() =>
                                                        toggleCard(
                                                            appointment._id
                                                        )
                                                    }
                                                    className="w-full mt-4 py-2 px-4 rounded-lg font-semibold text-white transition-all duration-300 hover:shadow-lg flex items-center justify-center"
                                                    style={{
                                                        backgroundColor:
                                                            '#4A90E2',
                                                    }}
                                                >
                                                    {expandedCard ===
                                                    appointment._id ? (
                                                        <>
                                                            <span>
                                                                Hide Details
                                                            </span>
                                                            <ChevronUp className="h-5 w-5 ml-2" />
                                                        </>
                                                    ) : (
                                                        <>
                                                            <span>
                                                                View Details
                                                            </span>
                                                            <ChevronDown className="h-5 w-5 ml-2" />
                                                        </>
                                                    )}
                                                </button>

                                                {/* Expanded Content */}
                                                {expandedCard ===
                                                    appointment._id && (
                                                    <div
                                                        className="mt-4 pt-4 border-t space-y-4"
                                                        style={{
                                                            borderColor:
                                                                '#4A90E240',
                                                        }}
                                                    >
                                                        {/* Next Checkup */}
                                                        {appointment.nextCheckup && (
                                                            <div
                                                                className="p-3 rounded-lg"
                                                                style={{
                                                                    backgroundColor:
                                                                        '#4AD2CC20',
                                                                }}
                                                            >
                                                                <div className="flex items-center mb-2">
                                                                    <Calendar
                                                                        className="h-5 w-5 mr-2"
                                                                        style={{
                                                                            color: '#4AD2CC',
                                                                        }}
                                                                    />
                                                                    <span
                                                                        className="font-semibold"
                                                                        style={{
                                                                            color: '#4AD2CC',
                                                                        }}
                                                                    >
                                                                        Next
                                                                        Checkup
                                                                    </span>
                                                                </div>
                                                                <p
                                                                    className="text-sm font-medium ml-7"
                                                                    style={{
                                                                        color: '#333333',
                                                                    }}
                                                                >
                                                                    {formatDate(
                                                                        appointment.nextCheckup
                                                                    )}
                                                                </p>
                                                            </div>
                                                        )}

                                                        {/* Medications */}
                                                        {appointment.medications &&
                                                            appointment
                                                                .medications
                                                                .length > 0 && (
                                                                <div>
                                                                    <div className="flex items-center mb-3">
                                                                        <Pill
                                                                            className="h-5 w-5 mr-2"
                                                                            style={{
                                                                                color: '#4A90E2',
                                                                            }}
                                                                        />
                                                                        <span
                                                                            className="font-semibold"
                                                                            style={{
                                                                                color: '#4A90E2',
                                                                            }}
                                                                        >
                                                                            Prescribed
                                                                            Medications
                                                                        </span>
                                                                    </div>
                                                                    <div className="space-y-2 ml-7">
                                                                        {appointment.medications.map(
                                                                            (
                                                                                med,
                                                                                index
                                                                            ) => (
                                                                                <div
                                                                                    key={
                                                                                        index
                                                                                    }
                                                                                    className="p-3 rounded-lg border"
                                                                                    style={{
                                                                                        backgroundColor:
                                                                                            'white',
                                                                                        borderColor:
                                                                                            '#4A90E240',
                                                                                    }}
                                                                                >
                                                                                    <p
                                                                                        className="font-semibold mb-1"
                                                                                        style={{
                                                                                            color: '#333333',
                                                                                        }}
                                                                                    >
                                                                                        {med
                                                                                            .medication
                                                                                            ?.name ||
                                                                                            'Medication'}
                                                                                    </p>
                                                                                    {med
                                                                                        .medication
                                                                                        ?.dosage && (
                                                                                        <p
                                                                                            className="text-xs mb-2"
                                                                                            style={{
                                                                                                color: '#4AD2CC',
                                                                                            }}
                                                                                        >
                                                                                            {
                                                                                                med
                                                                                                    .medication
                                                                                                    .dosage
                                                                                            }
                                                                                        </p>
                                                                                    )}
                                                                                    <div
                                                                                        className="flex gap-4 text-xs"
                                                                                        style={{
                                                                                            color: '#333333',
                                                                                            opacity: 0.7,
                                                                                        }}
                                                                                    >
                                                                                        <span>
                                                                                            📅{' '}
                                                                                            {
                                                                                                med.totalDays
                                                                                            }{' '}
                                                                                            days
                                                                                        </span>
                                                                                        <span>
                                                                                            ⏰{' '}
                                                                                            {
                                                                                                med.timesPerDay
                                                                                            }
                                                                                            x
                                                                                            per
                                                                                            day
                                                                                        </span>
                                                                                    </div>
                                                                                </div>
                                                                            )
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            )}

                                                        {/* Remarks */}
                                                        {appointment.remarks && (
                                                            <div
                                                                className="p-3 rounded-lg"
                                                                style={{
                                                                    backgroundColor:
                                                                        '#F2F2F2',
                                                                }}
                                                            >
                                                                <div className="flex items-start">
                                                                    <FileText
                                                                        className="h-5 w-5 mr-2 mt-0.5"
                                                                        style={{
                                                                            color: '#4A90E2',
                                                                        }}
                                                                    />
                                                                    <div className="flex-1">
                                                                        <span
                                                                            className="font-semibold block mb-1"
                                                                            style={{
                                                                                color: '#4A90E2',
                                                                            }}
                                                                        >
                                                                            Doctor's
                                                                            Remarks
                                                                        </span>
                                                                        <p
                                                                            className="text-sm"
                                                                            style={{
                                                                                color: '#333333',
                                                                                opacity: 0.8,
                                                                            }}
                                                                        >
                                                                            {
                                                                                appointment.remarks
                                                                            }
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>

                            {pastAppointments.length === 0 && (
                                <div className="text-center py-12">
                                    <CheckCircle
                                        className="h-16 w-16 mx-auto mb-4"
                                        style={{color: '#4A90E2', opacity: 0.3}}
                                    />
                                    <p
                                        className="text-lg"
                                        style={{color: '#333333', opacity: 0.6}}
                                    >
                                        No past appointments found
                                    </p>
                                </div>
                            )}
                        </section>
                    </>
                )}
            </main>
        </div>
    );
}
