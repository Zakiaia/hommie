'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Mic, MicOff } from 'lucide-react';
import { cn } from '@/lib/utils';

type Props = {
  id?: string;
  label?: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  hint?: string;
  className?: string;
  minRows?: number;
};

export function VoiceTextarea({ id, label, value, onChange, placeholder, hint, className, minRows = 4 }: Props) {
  const [listening, setListening] = useState(false);
  const [supported, setSupported] = useState(false);
  const recRef = useRef<SpeechRecognition | null>(null);

  useEffect(() => {
    setSupported(!!(typeof window !== 'undefined' && (window.SpeechRecognition || window.webkitSpeechRecognition)));
  }, []);

  const stop = useCallback(() => {
    try {
      recRef.current?.stop();
    } catch {
      /* ignore */
    }
    recRef.current = null;
    setListening(false);
  }, []);

  const start = useCallback(() => {
    const Ctor = window.SpeechRecognition ?? window.webkitSpeechRecognition;
    if (!Ctor) return;
    const rec: SpeechRecognition = new Ctor();
    rec.continuous = true;
    rec.interimResults = true;
    rec.lang = 'he-IL';
    rec.onresult = (ev: SpeechRecognitionEvent) => {
      let chunk = '';
      for (let i = ev.resultIndex; i < ev.results.length; i++) {
        chunk += ev.results[i]?.[0]?.transcript ?? '';
      }
      if (chunk) onChange(value + (value && !value.endsWith(' ') ? ' ' : '') + chunk);
    };
    rec.onerror = () => stop();
    rec.onend = () => setListening(false);
    recRef.current = rec;
    rec.start();
    setListening(true);
  }, [onChange, value, stop]);

  useEffect(() => () => stop(), [stop]);

  return (
    <div className={cn('space-y-2', className)}>
      {label ? <label className="text-sm font-medium leading-none" htmlFor={id}>{label}</label> : null}
      <div className="relative">
        <Textarea
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={cn('min-h-[120px] resize-y pb-12', 'glass-input')}
          style={{ minHeight: minRows * 24 }}
        />
        {supported ? (
          <div className="absolute bottom-2 left-2 flex items-center gap-2">
            <Button
              type="button"
              size="sm"
              variant={listening ? 'destructive' : 'secondary'}
              className="gap-2 rounded-full shadow-sm"
              onClick={() => (listening ? stop() : start())}
            >
              {listening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
              {listening ? 'עצור הקלטה' : 'דיקטה'}
            </Button>
          </div>
        ) : null}
      </div>
      {hint ? <p className="text-xs text-muted-foreground">{hint}</p> : null}
      {!supported ? (
        <p className="text-xs text-muted-foreground">הדפדפן לא תומך בדיקטה — ניתן להקליד ידנית.</p>
      ) : null}
    </div>
  );
}
