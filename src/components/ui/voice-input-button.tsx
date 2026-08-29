'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Mic, MicOff, Loader2 } from 'lucide-react';

interface VoiceInputButtonProps {
  onTranscript: (text: string) => void;
}

export function VoiceInputButton({ onTranscript }: VoiceInputButtonProps) {
  const [isListening, setIsListening] = useState(false);
  const [isSupported] = useState(() => typeof window !== 'undefined' && ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window));

  const toggleListen = () => {
    if (!isSupported) {
      // Fallback demo input
      const demoTexts = [
        "Ada lubang jalan sangat dalam dekat pertigaan jalan utama.",
        "Lampu penerangan jalan padam sejak kemarin malam.",
        "Sampah menumpuk menyumbat saluran drainase warga."
      ];
      const randomText = demoTexts[Math.floor(Math.random() * demoTexts.length)];
      onTranscript(randomText);
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    try {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.lang = 'id-ID';
      recognition.interimResults = false;

      recognition.onstart = () => setIsListening(true);
      recognition.onend = () => setIsListening(false);
      recognition.onerror = () => setIsListening(false);

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        if (transcript) {
          onTranscript(transcript);
        }
      };

      recognition.start();
    } catch {
      setIsListening(false);
    }
  };

  return (
    <Button
      type="button"
      variant={isListening ? "destructive" : "outline"}
      size="sm"
      onClick={toggleListen}
      className="flex items-center gap-1.5 transition-all"
      title="Dikte Deskripsi Suara (Voice-to-Text)"
    >
      {isListening ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>Mendengarkan...</span>
        </>
      ) : (
        <>
          <Mic className="h-4 w-4 text-primary" />
          <span>Dikte Suara</span>
        </>
      )}
    </Button>
  );
}
