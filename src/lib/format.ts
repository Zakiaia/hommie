/** Strip thousands separators and parse as float (handles Hebrew locale commas). */
export function parseLocaleNumber(value: string): number | undefined {
  const cleaned = value.replace(/[\s,]/g, '').replace(/[^\d.-]/g, '');
  if (cleaned === '' || cleaned === '-') return undefined;
  const n = Number(cleaned);
  return Number.isFinite(n) ? n : undefined;
}

/** Format for display in inputs (no currency symbol). */
export function formatThousandsIL(value: number | null | undefined): string {
  if (value === null || value === undefined || Number.isNaN(value)) return '';
  return new Intl.NumberFormat('he-IL', {
    maximumFractionDigits: 0,
    minimumFractionDigits: 0,
  }).format(Math.round(value));
}
