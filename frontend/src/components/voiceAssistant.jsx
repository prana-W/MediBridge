import React, { useEffect, useRef } from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';

const Dictaphone = () => {
    const silenceTimerRef = useRef(null);
    const prevTranscriptRef = useRef('');

    const {
        transcript,
        listening,
        resetTranscript,
        browserSupportsSpeechRecognition
    } = useSpeechRecognition();

    // Monitor transcript changes
    useEffect(() => {
        if (listening) {
            // Clear previous timer
            if (silenceTimerRef.current) {
                clearTimeout(silenceTimerRef.current);
            }

            // Only set timer if transcript changed
            if (transcript !== prevTranscriptRef.current) {
                prevTranscriptRef.current = transcript;

                // Auto-stop after 4 seconds of no change
                silenceTimerRef.current = setTimeout(() => {
                    console.log('4 seconds of silence, stopping...');
                    SpeechRecognition.stopListening();
                }, 4000);
            }
        }

        return () => {
            if (silenceTimerRef.current) {
                clearTimeout(silenceTimerRef.current);
            }
        };
    }, [transcript, listening]);

    if (!browserSupportsSpeechRecognition) {
        return <span>Browser doesn't support speech recognition.</span>;
    }

    const startContinuousListening = () => {
        prevTranscriptRef.current = '';
        SpeechRecognition.startListening({
            continuous: true,
            language: 'en-US'
        });
    };

    return (
        <div style={{ padding: '20px' }}>
            <p>Microphone: {listening ? '🎤 ON' : '🔇 OFF'}</p>
            <button onClick={startContinuousListening}>Start</button>
            <button onClick={SpeechRecognition.stopListening}>Stop</button>
            <button onClick={resetTranscript}>Reset</button>