import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({});

const DEPARTMENTS = [
    'general',
    'dermatologist',
    'gynecologist',
    'cardiologist',
    'orthopedic',
    'pediatrician',
    'neurologist',
    'dentist'
];

function findBestHospital(hospitals, userInput) {
    const input = userInput.toLowerCase();

    for (const hospital of hospitals) {
        const name = hospital.name.toLowerCase();
        const acronym = hospital.name
            .split(' ')
            .map(word => word[0])
            .join('')
            .toLowerCase();

        if (input.includes(name) || input.includes(acronym)) {
            return hospital;
        }
    }

    for (const hospital of hospitals) {
        const words = hospital.name.toLowerCase().split(' ');
        for (const word of words) {
            if (input.includes(word) && word.length > 3) {
                return hospital;
            }
        }
    }

    return null;
}

async function processVoiceCommand(voiceText, baseURL = '') {
    try {
        // Step 1: Use AI to extract intent, symptoms, and hospital
        const analysisPrompt = `Analyze this patient request: "${voiceText}"

Extract:
1. Symptoms or health issues mentioned
2. Hospital name or acronym mentioned (if any)
3. Department that would be appropriate

Available departments: ${DEPARTMENTS.join(', ')}

Respond in JSON format:
{
    "symptoms": "description of symptoms",
    "hospitalMentioned": "hospital name or acronym if mentioned, otherwise null",
    "suggestedDepartment": "one of the available departments",
    "reasoning": "brief explanation of department choice"
}`;

        const analysisResponse = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: analysisPrompt
        });

        let analysis;
        try {
            const jsonText = analysisResponse.text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
            analysis = JSON.parse(jsonText);
        } catch (e) {
            return {
                success: false,
                message: "I had trouble understanding your request. Could you please rephrase it?"
            };
        }

        // Validate required information
        if (!analysis.symptoms || analysis.symptoms === "none" || analysis.symptoms === "null") {
            return {
                success: false,
                message: "Please tell me what symptoms or health issues you're experiencing so I can book the right appointment."
            };
        }

        if (!analysis.hospitalMentioned || analysis.hospitalMentioned === "null") {
            return {
                success: false,
                message: "Please specify which hospital you'd like to book an appointment at."
            };
        }

        // Step 2: Fetch available hospitals
        const hospitalsResponse = await fetch(`${baseURL}/hospitals`);
        const hospitals = await hospitalsResponse.json();

        // Step 3: Match hospital
        const matchedHospital = findBestHospital(hospitals, analysis.hospitalMentioned);

        if (!matchedHospital) {
            const hospitalNames = hospitals.map(h => h.name).join(', ');
            return {
                success: false,
                message: `I couldn't find a hospital matching "${analysis.hospitalMentioned}". Available hospitals: ${hospitalNames}`
            };
        }

        // Step 4: Get available doctor slots
        const slotsResponse = await fetch(`${baseURL}/auth/doctor/getSlots`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                department: analysis.suggestedDepartment,
                hospital: matchedHospital.name
            })
        });

        const slotsData = await slotsResponse.json();

        if (!slotsData.success || !slotsData.data || slotsData.data.length === 0) {
            return {
                success: false,
                message: `No available doctors found in ${analysis.suggestedDepartment} department at ${matchedHospital.name}.`
            };
        }

        // Step 5: Find doctor with available slots
        const availableDoctor = slotsData.data.find(doc => !doc.isFullyBooked && doc.availableSlots > 0);

        if (!availableDoctor) {
            return {
                success: false,
                message: `All doctors in ${analysis.suggestedDepartment} department at ${matchedHospital.name} are fully booked. Please try another time or hospital.`
            };
        }

        // Step 6: Book the slot
        const bookingResponse = await fetch(`${baseURL}/auth/doctor/bookSlot`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                doctorId: availableDoctor._id,
                slotNumber: availableDoctor.currentSlot
            })
        });

        const bookingData = await bookingResponse.json();

        if (!bookingData.success) {
            return {
                success: false,
                message: "Failed to book the appointment. Please try again."
            };
        }

        // Step 7: Convert slot number to time (assuming slots start at 8 AM)
        const slotTime = `${availableDoctor.currentSlot + 8}:00`;
        const timeFormat = availableDoctor.currentSlot + 8 <= 12
            ? `${availableDoctor.currentSlot + 8} AM`
            : `${availableDoctor.currentSlot + 8 - 12} PM`;

        return {
            success: true,
            message: `Appointment booked successfully! Your appointment is at ${matchedHospital.name} with Dr. ${availableDoctor.name} (${analysis.suggestedDepartment} department) at slot ${availableDoctor.currentSlot} (${timeFormat}).`,
            details: {
                hospital: matchedHospital.name,
                doctor: availableDoctor.name,
                department: analysis.suggestedDepartment,
                slotNumber: availableDoctor.currentSlot,
                slotTime: timeFormat,
                symptoms: analysis.symptoms,
                reasoning: analysis.reasoning
            }
        };

    } catch (error) {
        console.error('Error processing voice command:', error);
        return {
            success: false,
            message: "An error occurred while processing your request. Please try again.",
            error: error.message
        };
    }
}

// Example usage
async function handleVoiceInput(voiceText, baseURL = process.env.SERVER_URL) {
    console.log(`Processing: "${voiceText}"`);
    const result = await processVoiceCommand(voiceText, baseURL);
    console.log('Result:', result);
    return result;
}

export { processVoiceCommand, handleVoiceInput };

// Example test calls:
// handleVoiceInput("I am having a skin allergy, so book an appointment at TMH", "http://localhost:3000");
// handleVoiceInput("I have chest pain, book me at Apollo Hospital", "http://localhost:3000");
// handleVoiceInput("My child has fever, book at City Hospital", "http://localhost:3000");