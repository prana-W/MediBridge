import { useState, useEffect } from 'react';
import { Volume2, Square, Play } from 'lucide-react';

export default function TextToSpeech({text}) {
    const [speaking, setSpeaking] = useState(false);
    const [voices, setVoices] = useState([]);
    const [selectedVoice, setSelectedVoice] = useState('');
    const [rate, setRate] = useState(1);
    const [pitch, setPitch] = useState(1);

    useEffect(() => {
        const loadVoices = () => {
            const availableVoices = speechSynthesis.getVoices();

            setVoices(availableVoices);
            if (availableVoices.length > 0 && !selectedVoice) {
                setSelectedVoice(availableVoices[0].name);
            }
        };

        loadVoices();
        speechSynthesis.onvoiceschanged = loadVoices;
    }, [selectedVoice]);

    const handleSpeak = () => {
        if (!text.trim()) return;

        if (speaking) {
            speechSynthesis.cancel();
            setSpeaking(false);
            return;
        }

        const utterance = new SpeechSynthesisUtterance(text);

        const voice = voices.find(v => v.name === selectedVoice);
        if (voice) utterance.voice = voice;

        utterance.rate = rate;
        utterance.pitch = pitch;

        utterance.onstart = () => setSpeaking(true);
        utterance.onend = () => setSpeaking(false);
        utterance.onerror = () => setSpeaking(false);

        speechSynthesis.speak(utterance);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-8">
            <div className="max-w-2xl mx-auto">
                <div className="bg-white rounded-2xl shadow-lg p-8">
                    <div className="flex items-center gap-3 mb-6">
                        <Volume2 className="w-8 h-8 text-purple-600" />
                        <h1 className="text-3xl font-bold text-gray-800">Text to Speech</h1>
                    </div>

                    <div className="mt-6 space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Voice
                            </label>
                            <select
                                value={selectedVoice}
                                onChange={(e) => setSelectedVoice(e.target.value)}
                                className="w-full p-2 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none"
                            >
                                {voices.map((voice) => (
                                    <option key={voice.name} value={voice.name}>
                                        {voice.name} ({voice.lang})
                                    </option>
                                ))}
                            </select>
                        </div>

                    </div>

                </div>
            </div>
        </div>
    );
}