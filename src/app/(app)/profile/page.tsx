import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { redirect } from 'next/navigation';
import { he } from '@/lib/i18n/he';
import { formatCurrency } from '@/lib/i18n';
import { calculateCapital, type CapitalInput } from '@/lib/calculations/capital';
import { estimateBudgetRange } from '@/lib/calculations/analysis';
import { MetricCard } from '@/components/shared/metric-card';
import { ReasoningBlock } from '@/components/shared/reasoning-block';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import {
  Wallet,
  TrendingUp,
  Banknote,
  PiggyBank,
  Target,
  AlertTriangle,
} from 'lucide-react';

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);
  const userId = session!.user.id;

  const profile = await prisma.financialProfile.findFirst({
    where: { userId, onboardingCompleted: true },
    include: { capitalSources: true },
    orderBy: { createdAt: 'desc' },
  });

  if (!profile) redirect('/onboarding');

  const cs = profile.capitalSources;
  const capitalInput: CapitalInput = {
    cashAmount: cs?.cashAmount ?? 0,
    liquidSavings: cs?.liquidSavings ?? 0,
    studyFunds: cs?.studyFunds ?? 0,
    providentFunds: cs?.providentFunds ?? 0,
    investmentPortfolio: cs?.investmentPortfolio ?? 0,
    deposits: cs?.deposits ?? 0,
    ownsProperty: cs?.ownsProperty ?? false,
    currentPropertyValue: cs?.currentPropertyValue ?? 0,
    currentPropertyMortgage: cs?.currentPropertyMortgage ?? 0,
    expectedPropertySale: cs?.expectedPropertySale ?? false,
    familySupport: cs?.familySupport ?? 0,
    expectedBonus: cs?.expectedBonus ?? 0,
    futureAssetSale: cs?.futureAssetSale ?? 0,
    futureFundRelease: cs?.futureFundRelease ?? 0,
  };

  const capital = calculateCapital(capitalInput);

  const variableWeight = 0.7;
  const weightedIncome =
    (profile.primaryIncomeNet ?? 0) +
    (profile.partnerIncomeNet ?? 0) +
    (profile.variableIncome ?? 0) * variableWeight;

  const comfortablePayment = profile.comfortablePayment ?? 0;
  const budgetRange = estimateBudgetRange(capital.riskAdjustedCapital, comfortablePayment);

  const totalObligations = (profile.monthlyObligations ?? 0) + (profile.fixedHouseholdExpenses ?? 0);

  const flags = generateFlags(capital, profile, weightedIncome);

  const meaningItems = generateMeaning(capital, profile, weightedIncome, budgetRange);

  return (
    <div className="mx-auto max-w-4xl p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">{he.profile.title}</h1>
        <p className="text-muted-foreground">{he.profile.subtitle}</p>
      </div>

      {/* Section A: Financial Snapshot */}
      <div className="mb-8">
        <h2 className="mb-4 text-lg font-semibold">{he.profile.snapshot.title}</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <MetricCard
            label={he.profile.snapshot.monthlyIncome}
            value={formatCurrency(weightedIncome)}
            icon={<Wallet className="h-5 w-5" />}
          />
          <MetricCard
            label={he.profile.snapshot.monthlyObligations}
            value={formatCurrency(totalObligations)}
            icon={<Banknote className="h-5 w-5" />}
          />
          <MetricCard
            label={he.profile.snapshot.liquidCapital}
            value={formatCurrency(capital.liquidCapital)}
            icon={<PiggyBank className="h-5 w-5" />}
          />
          <MetricCard
            label={he.profile.snapshot.totalCapital}
            value={formatCurrency(capital.totalCapital)}
            icon={<TrendingUp className="h-5 w-5" />}
          />
          <MetricCard
            label={he.profile.snapshot.comfortablePayment}
            value={formatCurrency(comfortablePayment)}
            subtitle={he.common.perMonth}
            icon={<Target className="h-5 w-5" />}
          />
          <MetricCard
            label={he.profile.snapshot.budgetRange}
            value={`${formatCurrency(budgetRange.min)} - ${formatCurrency(budgetRange.max)}`}
            icon={<Building2Icon />}
            variant="success"
          />
        </div>
      </div>

      {/* Section B: What This Means */}
      <div className="mb-8">
        <ReasoningBlock title={he.profile.meaning.title} items={meaningItems} />
      </div>

      {/* Section C: Strategic Flags */}
      {flags.length > 0 && (
        <div className="mb-8">
          <Card className="border-amber-100 bg-amber-50/30">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <AlertTriangle className="h-4 w-4 text-amber-600" />
                {he.profile.flags.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {flags.map((flag, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-400" />
                    {flag}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Section D: Actions */}
      <div className="flex gap-4">
        <Link href="/analysis/new">
          <Button size="lg">{he.profile.actions.analyzeProperty}</Button>
        </Link>
        <Button size="lg" variant="outline" disabled>
          {he.profile.actions.findInvestments}
        </Button>
      </div>
    </div>
  );
}

function Building2Icon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z"/><path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2"/><path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2"/><path d="M10 6h4"/><path d="M10 10h4"/><path d="M10 14h4"/><path d="M10 18h4"/></svg>
  );
}

function generateFlags(
  capital: ReturnType<typeof calculateCapital>,
  profile: { comfortablePayment: number | null; paymentCeiling: number | null; riskAppetite: string | null },
  weightedIncome: number
): string[] {
  const flags: string[] = [];

  if (capital.liquidCapital < capital.totalCapital * 0.3) {
    flags.push('רוב ההון שלך אינו נזיל — ייתכן שתצטרך לתכנן שחרור כספים מראש');
  }

  if (capital.potentialCapital > capital.liquidCapital) {
    flags.push('חלק משמעותי מההון שלך הוא פוטנציאלי — כדאי לוודא שהוא יהיה זמין בזמן');
  }

  const comf = profile.comfortablePayment ?? 0;
  if (weightedIncome > 0 && comf / weightedIncome > 0.35) {
    flags.push('התשלום הנוח שציינת גבוה ביחס להכנסה — שמור על כרית ביטחון');
  }

  if (profile.riskAppetite === 'HIGH') {
    flags.push('ציינת נכונות גבוהה לסיכון — חשוב לוודא שהתחשיבים משקפים תרחיש שמרני');
  }

  return flags;
}

function generateMeaning(
  capital: ReturnType<typeof calculateCapital>,
  profile: { comfortablePayment: number | null; goal: string | null },
  weightedIncome: number,
  budgetRange: { min: number; max: number }
): string[] {
  const items: string[] = [];

  items.push(`טווח התקציב המוערך שלך הוא ${formatCurrency(budgetRange.min)} עד ${formatCurrency(budgetRange.max)}`);

  const comf = profile.comfortablePayment ?? 0;
  if (weightedIncome > 0) {
    const ratio = Math.round((comf / weightedIncome) * 100);
    items.push(`תשלום המשכנתא הנוח שלך מהווה ${ratio}% מההכנסה — ${ratio < 30 ? 'יחס בריא' : ratio < 40 ? 'יחס סביר אך צפוף' : 'יחס גבוה'}`);
  }

  if (capital.riskAdjustedCapital > 500000) {
    items.push('יש לך בסיס הון טוב שמאפשר גמישות בבחירת נכס');
  } else {
    items.push('ההון הזמין שלך מוגבל — כדאי לשקול נכסים בטווח הנמוך של התקציב');
  }

  if (profile.goal === 'INVESTMENT') {
    items.push('כהשקעה, חשוב לבדוק תשואה נטו לאחר מיסוי ותחזוקה');
  } else if (profile.goal === 'RESIDENCE') {
    items.push('למגורים, העדיפות היא יציבות תשלום חודשי ונוחות מגורים');
  }

  return items;
}
