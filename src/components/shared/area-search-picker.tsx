'use client';

import { useCallback, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { MapPin, Plus, X } from 'lucide-react';
import { cn } from '@/lib/utils';

export type PlacePick = { label: string; lat: number; lng: number };

type Props = {
  selected: PlacePick[];
  onChange: (places: PlacePick[]) => void;
};

export function AreaSearchPicker({ selected, onChange }: Props) {
  const [q, setQ] = useState('');
  const [hits, setHits] = useState<PlacePick[]>([]);
  const [loading, setLoading] = useState(false);

  const search = useCallback(async () => {
    if (q.trim().length < 2) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/geocode?q=${encodeURIComponent(q.trim())}`);
      const data = (await res.json()) as { results?: PlacePick[] };
      setHits(data.results ?? []);
    } catch {
      setHits([]);
    } finally {
      setLoading(false);
    }
  }, [q]);

  const add = (p: PlacePick) => {
    if (selected.some((s) => s.label === p.label)) return;
    onChange([...selected, p]);
    setHits([]);
    setQ('');
  };

  const remove = (idx: number) => {
    onChange(selected.filter((_, i) => i !== idx));
  };

  return (
    <div className="space-y-4">
      <Label>חיפוש אזור (מפות)</Label>
      <div className="flex gap-2">
        <Input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), search())}
          placeholder="למשל: רמת אביב, הרצליה, ירושלים המושבה..."
          className="glass-input"
        />
        <Button type="button" variant="secondary" onClick={search} disabled={loading}>
          {loading ? '…' : 'חפש'}
        </Button>
      </div>
      <ul className="max-h-48 space-y-1 overflow-y-auto rounded-xl border border-white/10 bg-black/5 p-2 dark:bg-white/5">
        {hits.map((h) => (
          <li key={`${h.lat}-${h.lng}-${h.label}`}>
            <button
              type="button"
              className={cn(
                'flex w-full items-start gap-2 rounded-lg px-3 py-2 text-right text-sm transition-colors',
                'hover:bg-white/10 hover:shadow-sm'
              )}
              onClick={() => add(h)}
            >
              <Plus className="mt-0.5 h-4 w-4 shrink-0 opacity-70" />
              <span>{h.label}</span>
            </button>
          </li>
        ))}
        {hits.length === 0 && !loading ? (
          <li className="px-3 py-2 text-sm text-muted-foreground">הקלידו שם שכונה או עיר ולחצו חפש</li>
        ) : null}
      </ul>
      {selected.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {selected.map((p, i) => (
            <span
              key={`${p.label}-${i}`}
              className="inline-flex items-center gap-1 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-sm backdrop-blur-sm"
            >
              <MapPin className="h-3.5 w-3.5 opacity-70" />
              {p.label}
              <button type="button" className="mr-1 rounded-full p-0.5 hover:bg-white/20" onClick={() => remove(i)}>
                <X className="h-3.5 w-3.5" />
              </button>
            </span>
          ))}
        </div>
      ) : null}
    </div>
  );
}
