import { useState, useEffect } from 'react';
import { Volume2, Square, Play } from 'lucide-react';

export default function TextToSpeech() {
    const [text, setText] = useState('');
    const [speaking, setSpeaking] = useState(false);
    const [voices, setVoices] = useState([]);
    const [selectedVoice, setSelectedVoice] = useState('');
    const [rate, setRate] = useState(1);
    const [pitch, setPitch] = useState(1);

    useEffect(() => {
        const loadVoices = () => {
            const availableVoices = speechSynthesis.getVoices();
            console.log(availableVoices);
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

                    <textarea
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        placeholder="Enter text to convert to speech..."
                        className="w-full h-40 p-4 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none resize-none text-gray-700"
                    />

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

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Speed: {rate.toFixed(1)}x
                            </label>
                            <input
                                type="range"
                                min="0.5"
                                max="2"
                                step="0.1"
                                value={rate}
                                onChange={(e) => setRate(parseFloat(e.target.value))}
                                className="w-full"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Pitch: {pitch.toFixed(1)}
                            </label>
                            <input
                                type="range"
                                min="0.5"
                                max="2"
                                step="0.1"
                                value={pitch}
                                onChange={(e) => setPitch(parseFloat(e.target.value))}
                                className="w-full"
                            />
                        </div>
                    </div>

                    <button
                        onClick={handleSpeak}
                        disabled={!text.trim()}
                        className={`mt-6 w-full py-3 rounded-lg font-semibold text-white transition-all flex items-center justify-center gap-2 ${
                            !text.trim()
                                ? 'bg-gray-300 cursor-not-allowed'
                                : speaking
                                    ? 'bg-red-500 hover:bg-red-600'
                                    : 'bg-purple-600 hover:bg-purple-700'
                        }`}
                    >
                        {speaking ? (
                            <>
                                <Square className="w-5 h-5" />
                                Stop Speaking
                            </>
                        ) : (
                            <>
                                <Play className="w-5 h-5" />
                                Speak Text
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}