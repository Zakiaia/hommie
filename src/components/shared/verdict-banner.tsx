import { cn } from '@/lib/utils';
import { he } from '@/lib/i18n/he';
import { CheckCircle, AlertTriangle, XCircle, AlertCircle } from 'lucide-react';

type ViabilityStatus = 'VIABLE' | 'VIABLE_BUT_TIGHT' | 'HIGH_RISK' | 'NOT_AFFORDABLE';

interface VerdictBannerProps {
  status: ViabilityStatus;
  className?: string;
}

const config: Record<ViabilityStatus, {
  bg: string;
  text: string;
  border: string;
  icon: React.ReactNode;
}> = {
  VIABLE: {
    bg: 'bg-emerald-50',
    text: 'text-emerald-800',
    border: 'border-emerald-200',
    icon: <CheckCircle className="h-6 w-6 text-emerald-600" />,
  },
  VIABLE_BUT_TIGHT: {
    bg: 'bg-amber-50',
    text: 'text-amber-800',
    border: 'border-amber-200',
    icon: <AlertCircle className="h-6 w-6 text-amber-600" />,
  },
  HIGH_RISK: {
    bg: 'bg-orange-50',
    text: 'text-orange-800',
    border: 'border-orange-200',
    icon: <AlertTriangle className="h-6 w-6 text-orange-600" />,
  },
  NOT_AFFORDABLE: {
    bg: 'bg-red-50',
    text: 'text-red-800',
    border: 'border-red-200',
    icon: <XCircle className="h-6 w-6 text-red-600" />,
  },
};

export function VerdictBanner({ status, className }: VerdictBannerProps) {
  const c = config[status];
  return (
    <div className={cn('flex items-center gap-3 rounded-xl border p-4', c.bg, c.border, className)}>
      {c.icon}
      <span className={cn('text-lg font-semibold', c.text)}>
        {he.results.verdict[status]}
      </span>
    </div>
  );
}
