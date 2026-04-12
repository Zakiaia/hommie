import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { he } from '@/lib/i18n/he';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
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
    <div className="mx-auto max-w-4xl p-6 md:p-8">
      <div className="mb-8">
        <h1 className="font-heading text-3xl font-semibold tracking-tight md:text-4xl">
          {he.dashboard.welcome}, {session!.user.name || 'שם'}
        </h1>
        <p className="mt-2 text-muted-foreground">{he.dashboard.subtitle}</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {!hasProfile ? (
          <div className="glass-panel rounded-2xl border-primary/25 bg-primary/5 p-6 md:col-span-2">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white/10 text-primary ring-1 ring-white/10">
                  <ClipboardList className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-semibold">{he.dashboard.profileIncomplete}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    השלם את הפרופיל הפיננסי שלך כדי לקבל המלצות מותאמות
                  </p>
                </div>
              </div>
              <Link href="/onboarding" className="shrink-0">
                <Button className="rounded-full shadow-lg shadow-black/20">
                  {profile ? he.dashboard.continueOnboarding : he.dashboard.startOnboarding}
                  <ArrowLeft className="mr-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          <>
            <div className="glass-panel rounded-2xl p-6 transition-all hover:border-white/12">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-300 ring-1 ring-emerald-400/20">
                    <ClipboardList className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{he.dashboard.profileComplete}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">הפרופיל הפיננסי שלך מוכן</p>
                  </div>
                </div>
                <Link href="/profile">
                  <Button variant="outline" className="rounded-full border-white/15 bg-white/5 hover:bg-white/10">
                    {he.dashboard.viewProfile}
                  </Button>
                </Link>
              </div>
            </div>

            <div className="glass-panel rounded-2xl p-6 transition-all hover:border-white/12">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-sky-500/15 text-sky-200 ring-1 ring-sky-400/20">
                    <PlusCircle className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{he.dashboard.newAnalysis}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">בדוק נכס ספציפי</p>
                  </div>
                </div>
                <Link href="/analysis/new">
                  <Button variant="outline" className="rounded-full border-white/15 bg-white/5 hover:bg-white/10">
                    {he.analysis.title}
                  </Button>
                </Link>
              </div>
            </div>
          </>
        )}
      </div>

      {analyses.length > 0 && (
        <div className="mt-12">
          <h2 className="font-heading mb-4 text-xl font-semibold md:text-2xl">{he.dashboard.recentAnalyses}</h2>
          <div className="space-y-3">
            {analyses.map((a) => (
              <Link key={a.id} href={`/analysis/${a.id}`}>
                <div className="glass-panel rounded-xl p-4 transition-all hover:border-white/15 hover:bg-white/[0.07]">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex min-w-0 items-center gap-3">
                      <Building2 className="h-5 w-5 shrink-0 text-muted-foreground" />
                      <div className="min-w-0">
                        <p className="truncate font-medium">{a.nickname || `${a.city} ${a.neighborhood || ''}`}</p>
                        <p className="text-sm text-muted-foreground">₪{a.propertyPrice.toLocaleString('he-IL')}</p>
                      </div>
                    </div>
                    {a.result && (
                      <span className="shrink-0 text-sm text-muted-foreground">
                        {he.results.verdict[a.result.viabilityStatus]}
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {analyses.length === 0 && hasProfile && (
        <div className="mt-12 text-center text-muted-foreground">
          <p>{he.dashboard.noAnalyses}</p>
        </div>
      )}
    </div>
  );
}
