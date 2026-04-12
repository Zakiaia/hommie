'use client';

import { useCallback, useEffect, useState } from 'react';
import { MessageCircle, Send, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { he } from '@/lib/i18n/he';

type Msg = { id: string; role: string; content: string; createdAt: string };

export function AdvisorChatDock({ profileId }: { profileId: string }) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [draft, setDraft] = useState('');
  const [loading, setLoading] = useState(false);

  const load = useCallback(async () => {
    const res = await fetch(`/api/advisor-chat?profileId=${encodeURIComponent(profileId)}`);
    if (!res.ok) return;
    const data = (await res.json()) as { messages: Msg[] };
    setMessages(data.messages ?? []);
  }, [profileId]);

  useEffect(() => {
    if (open) void load();
  }, [open, load]);

  const send = async () => {
    const t = draft.trim();
    if (!t) return;
    setLoading(true);
    setDraft('');
    try {
      await fetch('/api/advisor-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ profileId, content: t }),
      });
      await load();
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        type="button"
        aria-label={he.chat.title}
        className={cn(
          'fixed bottom-6 left-6 z-50 flex h-14 w-14 items-center justify-center rounded-full shadow-lg transition-all',
          'border border-white/20 bg-zinc-900/80 text-white backdrop-blur-xl hover:scale-105 hover:bg-zinc-800/90',
          'dark:border-white/10'
        )}
        onClick={() => setOpen((o) => !o)}
      >
        <MessageCircle className="h-6 w-6" />
      </button>

      {open ? (
        <div
          className={cn(
            'fixed bottom-24 left-6 z-50 flex w-[min(100vw-3rem,380px)] flex-col overflow-hidden rounded-2xl border border-white/15 shadow-2xl',
            'bg-zinc-950/75 text-white backdrop-blur-2xl dark:bg-zinc-950/80'
          )}
          style={{ maxHeight: 'min(70vh, 520px)' }}
        >
          <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
            <span className="font-medium">{he.chat.title}</span>
            <Button type="button" size="icon" variant="ghost" className="h-8 w-8 text-white" onClick={() => setOpen(false)}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex-1 space-y-3 overflow-y-auto p-4 text-sm">
            {messages.length === 0 ? (
              <p className="text-zinc-400">{he.chat.welcome}</p>
            ) : (
              messages.map((m) => (
                <div
                  key={m.id}
                  className={cn(
                    'rounded-xl px-3 py-2',
                    m.role === 'USER' ? 'mr-8 bg-white/10' : 'ml-8 bg-white/5 text-zinc-200'
                  )}
                >
                  {m.content}
                </div>
              ))
            )}
          </div>
          <div className="flex gap-2 border-t border-white/10 p-3">
            <Input
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder={he.chat.placeholder}
              className="border-white/10 bg-white/5 text-white placeholder:text-zinc-500"
              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), send())}
            />
            <Button type="button" size="icon" disabled={loading} onClick={send} className="shrink-0">
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ) : null}
    </>
  );
}
