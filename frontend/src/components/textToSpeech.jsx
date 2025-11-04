"use client";
import { useState, useEffect, useRef } from "react";
import { Volume2, Square } from "lucide-react";

export default function TextToSpeech({ text }) {
    const [speaking, setSpeaking] = useState(false);
    const [voices, setVoices] = useState([]);
    const [selectedVoice, setSelectedVoice] = useState("");
    const utteranceRef = useRef(null);

    const pitch = 1;
    const rate = 1;

    useEffect(() => {
        const loadVoices = () => {
            const availableVoices = window.speechSynthesis.getVoices();
            if (availableVoices.length > 0) {
                setVoices(availableVoices);
                if (!selectedVoice) setSelectedVoice(availableVoices[0].name);
            }
        };

        loadVoices();
        window.speechSynthesis.onvoiceschanged = loadVoices;
    }, [selectedVoice]);


    useEffect(() => {
        if (!text?.trim()) return;

        window.speechSynthesis.cancel();

        const speakNow = () => {
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.rate = rate;
            utterance.pitch = pitch;

            // assign voice
            const voice = voices.find((v) => v.name === selectedVoice);
            if (voice) utterance.voice = voice;

            utterance.onstart = () => setSpeaking(true);
            utterance.onend = () => setSpeaking(false);
            utterance.onerror = () => setSpeaking(false);

            utteranceRef.current = utterance;
            window.speechSynthesis.speak(utterance);
        };

        if (voices.length === 0) {
            const interval = setInterval(() => {
                if (window.speechSynthesis.getVoices().length > 0) {
                    setVoices(window.speechSynthesis.getVoices());
                    clearInterval(interval);
                    speakNow();
                }
            }, 250);
            return () => clearInterval(interval);
        } else {
            speakNow();
        }
    }, [text, voices, selectedVoice]);

    // 🛑 Stop speech
    const stopSpeaking = () => {
        window.speechSynthesis.cancel();
        setSpeaking(false);
    };

    return (
        <div className="max-w-2xl mx-auto bg-white/90 dark:bg-gray-900 rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <Volume2 className="w-6 h-6 text-purple-600" />
                    <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                        Voice Assistant
                    </h2>
                </div>
                {speaking && (
                    <button
                        onClick={stopSpeaking}
                        className="flex items-center gap-1 px-3 py-1 bg-red-500 text-white text-sm rounded-lg hover:bg-red-600 transition"
                    >
                        <Square className="w-4 h-4" /> Stop
                    </button>
                )}
            </div>

            <div className="flex flex-col gap-3">
                <label className="text-sm text-gray-600 dark:text-gray-400">
                    Select Voice
                </label>
                <select
                    value={selectedVoice}
                    onChange={(e) => setSelectedVoice(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-transparent focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-800 dark:text-gray-100"
                >
                    {voices.map((voice) => (
                        <option key={voice.name} value={voice.name}>
                            {voice.name} ({voice.lang})
                        </option>
                    ))}
                </select>
            </div>
        </div>
    );
}
