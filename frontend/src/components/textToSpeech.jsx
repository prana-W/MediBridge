"use client";
import { useState, useEffect, useRef } from "react";

export default function TextToSpeech({ text }) {
    const [voices, setVoices] = useState([]);
    const utteranceRef = useRef(null);

    const pitch = 1;
    const rate = 1;

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

            // Use first available voice
            if (voices.length > 0) {
                utterance.voice = voices[0];
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
    }, [text, voices]);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            window.speechSynthesis.cancel();
        };
    }, []);

    return null; // No UI rendered
}