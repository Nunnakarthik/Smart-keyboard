import { useState, useCallback } from 'react';

export const useVoiceToText = (onResult, langCode = 'en-IN') => {
  const [isRecording, setIsRecording] = useState(false);
  const [error, setError] = useState(null);

  const startRecording = useCallback(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Voice recognition is not supported in this browser. Please use Chrome or Edge.');
      return;
    }

    setError(null);
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = langCode;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => setIsRecording(true);

    recognition.onend = () => setIsRecording(false);

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      if (transcript) onResult(transcript);
    };

    recognition.onnomatch = () => {
      setError('Could not understand. Please speak clearly.');
      setIsRecording(false);
    };

    recognition.onerror = (event) => {
      setIsRecording(false);
      switch (event.error) {
        case 'not-allowed':
        case 'permission-denied':
          setError('Microphone access denied. Please allow mic permission in your browser and try again.');
          break;
        case 'no-speech':
          setError('No speech detected. Please try again.');
          break;
        case 'network':
          setError('Network error. Check your internet connection.');
          break;
        case 'aborted':
          // User cancelled — silently ignore
          break;
        default:
          setError(`Voice error: ${event.error}`);
      }
    };

    try {
      recognition.start();
    } catch (e) {
      setIsRecording(false);
      setError('Could not start voice recognition. Try again.');
    }
  }, [onResult, langCode]);

  return { isRecording, error, startRecording };
};

export default useVoiceToText;
