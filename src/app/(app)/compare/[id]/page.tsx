import { Card, CardContent } from '@/components/ui/card';
import { he } from '@/lib/i18n/he';

export default function ComparePage() {
  return (
    <div className="mx-auto max-w-4xl p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">{he.comparison.title}</h1>
      </div>
      <Card>
        <CardContent className="flex items-center justify-center p-12 text-muted-foreground">
          השוואת תרחישים תהיה זמינה בקרוב
        </CardContent>
      </Card>
    </div>
  );
}
