import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { he } from '@/lib/i18n/he';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Building2, PlusCircle, ArrowLeft, ClipboardList } from 'lucide-react';

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  const userId = session!.user.id;

  const profile = await prisma.financialProfile.findFirst({
    where: { userId },
    orderBy: { createdAt: 'desc' },
  });

  const analyses = await prisma.propertyAnalysis.findMany({
    where: { userId },
    include: { result: true },
    orderBy: { createdAt: 'desc' },
    take: 5,
  });

  const hasProfile = profile?.onboardingCompleted;

  return (
    <div className="mx-auto max-w-4xl p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">
          {he.dashboard.welcome}, {session!.user.name || 'שם'}
        </h1>
        <p className="mt-1 text-muted-foreground">{he.dashboard.subtitle}</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {!hasProfile ? (
          <Card className="border-primary/20 bg-primary/5 md:col-span-2">
            <CardContent className="flex items-center justify-between p-6">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                  <ClipboardList className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-semibold">{he.dashboard.profileIncomplete}</h3>
                  <p className="text-sm text-muted-foreground">
                    השלם את הפרופיל הפיננסי שלך כדי לקבל המלצות מותאמות
                  </p>
                </div>
              </div>
              <Link href="/onboarding">
                <Button>
                  {profile ? he.dashboard.continueOnboarding : he.dashboard.startOnboarding}
                  <ArrowLeft className="mr-2 h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <>
            <Card>
              <CardContent className="flex items-center justify-between p-6">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
                    <ClipboardList className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{he.dashboard.profileComplete}</h3>
                    <p className="text-sm text-muted-foreground">הפרופיל הפיננסי שלך מוכן</p>
                  </div>
                </div>
                <Link href="/profile">
                  <Button variant="outline">{he.dashboard.viewProfile}</Button>
                </Link>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="flex items-center justify-between p-6">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-blue-700">
                    <PlusCircle className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{he.dashboard.newAnalysis}</h3>
                    <p className="text-sm text-muted-foreground">בדוק נכס ספציפי</p>
                  </div>
                </div>
                <Link href="/analysis/new">
                  <Button variant="outline">{he.analysis.title}</Button>
                </Link>
              </CardContent>
            </Card>
          </>
        )}
      </div>

      {analyses.length > 0 && (
        <div className="mt-10">
          <h2 className="mb-4 text-xl font-semibold">{he.dashboard.recentAnalyses}</h2>
          <div className="space-y-3">
            {analyses.map((a) => (
              <Link key={a.id} href={`/analysis/${a.id}`}>
                <Card className="transition-colors hover:bg-muted/50">
                  <CardContent className="flex items-center justify-between p-4">
                    <div className="flex items-center gap-3">
                      <Building2 className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium">{a.nickname || `${a.city} ${a.neighborhood || ''}`}</p>
                        <p className="text-sm text-muted-foreground">
                          ₪{a.propertyPrice.toLocaleString('he-IL')}
                        </p>
                      </div>
                    </div>
                    {a.result && (
                      <span className="text-sm text-muted-foreground">
                        {he.results.verdict[a.result.viabilityStatus]}
                      </span>
                    )}
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      )}

      {analyses.length === 0 && hasProfile && (
        <div className="mt-10 text-center text-muted-foreground">
          <p>{he.dashboard.noAnalyses}</p>
        </div>
      )}
    </div>
  );
}
