"use client";
import { useState, useEffect, useRef } from "react";

export default function TextToSpeech({ text, language = "en-US" }) {
    const [voices, setVoices] = useState([]);
    const utteranceRef = useRef(null);

    const pitch = 1;
    const rate = 1.5;

    useEffect(() => {
        const loadVoices = () => {
            const availableVoices = window.speechSynthesis.getVoices();
            if (availableVoices.length > 0) {
                setVoices(availableVoices);
            }
        };

        loadVoices();
        window.speechSynthesis.onvoiceschanged = loadVoices;
    }, []);

    useEffect(() => {
        if (!text?.trim()) return;

        window.speechSynthesis.cancel();

        const speakNow = () => {
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.rate = rate;
            utterance.pitch = pitch;

            // Find voice matching the language
            if (voices.length > 0) {
                const matchingVoice = voices.find(voice =>
                    voice.lang.startsWith(language.split('-')[0])
                );
                utterance.voice = matchingVoice || voices[0];
            }

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
    }, [text, voices, language]);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            window.speechSynthesis.cancel();
        };
    }, []);

    return null; // No UI rendered
}