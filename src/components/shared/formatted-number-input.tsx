'use client';

import { useCallback, useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { formatThousandsIL, parseLocaleNumber } from '@/lib/format';

type Props = {
  id?: string;
  label: string;
  name?: string;
  defaultValue?: number | null;
  className?: string;
  required?: boolean;
};

export function FormattedNumberInput({ id, label, name, defaultValue, className, required }: Props) {
  const [text, setText] = useState(() => formatThousandsIL(defaultValue ?? undefined));

  const onChange = useCallback((raw: string) => {
    const parsed = parseLocaleNumber(raw);
    setText(parsed === undefined ? raw : formatThousandsIL(parsed));
  }, []);

  const hiddenValue = String(parseLocaleNumber(text) ?? '');

  return (
    <div className={cn('space-y-2', className)}>
      {name ? <input type="hidden" name={name} value={hiddenValue} /> : null}
      <Label htmlFor={id}>{label}</Label>
      <Input
        id={id}
        value={text}
        onChange={(e) => onChange(e.target.value)}
        inputMode="decimal"
        dir="ltr"
        className="text-left font-mono text-base tracking-tight"
        placeholder="0"
        required={required && hiddenValue !== '' && hiddenValue !== '0'}
      />
    </div>
  );
}

/** Controlled variant for onboarding flow without form `name` */
export function FormattedNumberField({
  label,
  value,
  onChange,
  id,
}: {
  label: string;
  value: number | undefined;
  onChange: (n: number | undefined) => void;
  id?: string;
}) {
  const [text, setText] = useState(() => formatThousandsIL(value));
  useEffect(() => {
    setText(formatThousandsIL(value));
  }, [value]);

  const sync = useCallback(
    (raw: string) => {
      const parsed = parseLocaleNumber(raw);
      setText(parsed === undefined ? raw : formatThousandsIL(parsed));
      onChange(parsed);
    },
    [onChange]
  );

  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <Input
        id={id}
        value={text}
        onChange={(e) => sync(e.target.value)}
        inputMode="decimal"
        dir="ltr"
        className="text-left font-mono text-base tracking-tight"
      />
    </div>
  );
}
