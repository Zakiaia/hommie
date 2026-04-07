import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { he } from '@/lib/i18n/he';

export default async function SettingsPage() {
  const session = await getServerSession(authOptions);

  return (
    <div className="mx-auto max-w-3xl p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">{he.nav.settings}</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>פרטי חשבון</CardTitle>
          <CardDescription>המידע הבסיסי של החשבון שלך</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-sm text-muted-foreground">שם</p>
            <p className="font-medium">{session?.user?.name || '—'}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">אימייל</p>
            <p className="font-medium" dir="ltr">{session?.user?.email || '—'}</p>
          </div>
        </CardContent>
      </Card>

      <Card className="mt-6 border-amber-200 bg-amber-50/30">
        <CardContent className="p-6">
          <p className="text-sm text-muted-foreground">
            {he.app.disclaimer}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
