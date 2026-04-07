import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { notFound } from 'next/navigation';
import { he } from '@/lib/i18n/he';
import { formatCurrency } from '@/lib/i18n';
import { MetricCard } from '@/components/shared/metric-card';
import { VerdictBanner } from '@/components/shared/verdict-banner';
import { ReasoningBlock } from '@/components/shared/reasoning-block';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import Link from 'next/link';
import {
  Wallet,
  Banknote,
  TrendingDown,
  TrendingUp,
  Home,
  ArrowLeft,
} from 'lucide-react';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function AnalysisResultPage({ params }: PageProps) {
  const { id } = await params;
  const session = await getServerSession(authOptions);

  const analysis = await prisma.propertyAnalysis.findUnique({
    where: { id, userId: session!.user.id },
    include: { result: true, profile: true },
  });

  if (!analysis || !analysis.result) notFound();

  const r = analysis.result;
  const f = he.results.fields;

  const monthlyIncome = r.totalCapital > 0
    ? (analysis.profile.primaryIncomeNet ?? 0) +
      (analysis.profile.partnerIncomeNet ?? 0) +
      (analysis.profile.variableIncome ?? 0) * 0.7
    : 0;

  const existingObligations =
    (analysis.profile.monthlyObligations ?? 0) +
    (analysis.profile.fixedHouseholdExpenses ?? 0);

  const remainingBuffer = monthlyIncome - existingObligations - r.monthlyMortgagePayment;

  const costBreakdown = r.reasoningSummary as {
    downPayment: number;
    purchaseTax: number;
    closingCosts: number;
    renovation: number;
    furniture: number;
    total: number;
  } | null;

  const reasoning = generateReasoning(r, analysis, monthlyIncome);

  return (
    <div className="mx-auto max-w-4xl p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">
          {analysis.nickname || `${analysis.city} ${analysis.neighborhood || ''}`}
        </h1>
        <p className="text-muted-foreground">
          {formatCurrency(analysis.propertyPrice)} · {analysis.intendedUse === 'RESIDENCE' ? 'מגורים' : 'השקעה'}
        </p>
      </div>

      <VerdictBanner status={r.viabilityStatus} className="mb-8" />

      {/* Monthly Snapshot */}
      <div className="mb-8">
        <h2 className="mb-4 text-lg font-semibold">{he.results.monthlySnapshot}</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <MetricCard label={f.monthlyIncome} value={formatCurrency(monthlyIncome)} icon={<Wallet className="h-5 w-5" />} />
          <MetricCard label={f.existingObligations} value={formatCurrency(existingObligations)} icon={<Banknote className="h-5 w-5" />} />
          <MetricCard label={f.mortgagePayment} value={formatCurrency(r.monthlyMortgagePayment)} icon={<Home className="h-5 w-5" />} />
          <MetricCard
            label={f.remainingBuffer}
            value={formatCurrency(remainingBuffer)}
            variant={remainingBuffer > 5000 ? 'success' : remainingBuffer > 2000 ? 'warning' : 'danger'}
            icon={remainingBuffer >= 0 ? <TrendingUp className="h-5 w-5" /> : <TrendingDown className="h-5 w-5" />}
          />
        </div>
      </div>

      {/* Upfront Snapshot */}
      <div className="mb-8">
        <h2 className="mb-4 text-lg font-semibold">{he.results.upfrontSnapshot}</h2>
        <div className="grid gap-4 md:grid-cols-3">
          <MetricCard label={f.availableCapital} value={formatCurrency(r.riskAdjustedCapital)} />
          <MetricCard label={f.upfrontNeeded} value={formatCurrency(r.upfrontCashNeeded)} />
          <MetricCard
            label={f.surplusOrGap}
            value={formatCurrency(r.affordabilityGap)}
            variant={r.affordabilityGap >= 0 ? 'success' : 'danger'}
          />
        </div>
      </div>

      {/* Cost Breakdown */}
      {costBreakdown && (
        <div className="mb-8">
          <h2 className="mb-4 text-lg font-semibold">{he.results.costBreakdown}</h2>
          <Card>
            <CardContent className="p-6">
              <div className="space-y-3">
                <CostRow label={f.downPayment} value={costBreakdown.downPayment} />
                <CostRow label={f.purchaseTax} value={costBreakdown.purchaseTax} />
                <CostRow label={f.closingCosts} value={costBreakdown.closingCosts} />
                <CostRow label={f.renovation} value={costBreakdown.renovation} />
                <CostRow label={f.furniture} value={costBreakdown.furniture} />
                <Separator />
                <div className="flex justify-between font-semibold">
                  <span>{f.totalRequired}</span>
                  <span>{formatCurrency(costBreakdown.total)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Key Metrics */}
      <div className="mb-8">
        <div className="grid gap-4 md:grid-cols-3">
          <MetricCard
            label={f.dtiRatio}
            value={`${r.dtiRatio}%`}
            variant={r.dtiRatio < 30 ? 'success' : r.dtiRatio < 40 ? 'warning' : 'danger'}
          />
          <MetricCard label={f.loanAmount} value={formatCurrency(r.loanAmount)} />
          {r.monthlyCashFlow !== null && (
            <MetricCard
              label={f.monthlyCashFlow}
              value={formatCurrency(r.monthlyCashFlow)}
              variant={r.monthlyCashFlow >= 0 ? 'success' : 'danger'}
            />
          )}
        </div>
      </div>

      {/* Reasoning */}
      <div className="mb-8">
        <ReasoningBlock title={he.results.reasoning} items={reasoning} />
      </div>

      {/* Actions */}
      <div className="flex gap-4">
        <Link href="/analysis/new">
          <Button>{he.results.newAnalysis}</Button>
        </Link>
        <Link href="/profile">
          <Button variant="outline">
            {he.results.backToProfile}
            <ArrowLeft className="mr-2 h-4 w-4" />
          </Button>
        </Link>
      </div>
    </div>
  );
}

function CostRow({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex justify-between text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span>{formatCurrency(value)}</span>
    </div>
  );
}

function generateReasoning(
  r: {
    viabilityStatus: string;
    dtiRatio: number;
    affordabilityGap: number;
    monthlyMortgagePayment: number;
    monthlyCashFlow: number | null;
  },
  analysis: {
    propertyPrice: number;
    intendedUse: string;
    profile: { comfortablePayment: number | null; paymentCeiling: number | null };
  },
  monthlyIncome: number
): string[] {
  const items: string[] = [];

  if (r.viabilityStatus === 'VIABLE') {
    items.push('ההון הזמין שלך מספיק לכיסוי כל העלויות המקדימות');
    items.push('תשלום המשכנתא נמצא בטווח הנוח שציינת');
  } else if (r.viabilityStatus === 'VIABLE_BUT_TIGHT') {
    items.push('העסקה אפשרית אבל לא משאירה הרבה מרווח');
  } else if (r.viabilityStatus === 'HIGH_RISK') {
    items.push('העסקה יוצרת חשיפה גבוהה ביחס להכנסה שלך');
  } else {
    items.push('העסקה הזו מעבר לטווח ההישג הנוכחי שלך');
  }

  if (r.dtiRatio < 30) {
    items.push(`יחס חוב להכנסה של ${r.dtiRatio}% — בריא`);
  } else if (r.dtiRatio < 40) {
    items.push(`יחס חוב להכנסה של ${r.dtiRatio}% — סביר אך צפוף`);
  } else {
    items.push(`יחס חוב להכנסה של ${r.dtiRatio}% — גבוה מהמומלץ`);
  }

  const ceiling = analysis.profile.paymentCeiling ?? Infinity;
  if (r.monthlyMortgagePayment > ceiling) {
    items.push(`תשלום המשכנתא (${formatCurrency(r.monthlyMortgagePayment)}) חורג מהתקרה שהגדרת`);
  }

  if (r.affordabilityGap < 0) {
    items.push(`חסרים ${formatCurrency(Math.abs(r.affordabilityGap))} בהון עצמי`);
  } else if (r.affordabilityGap < 50000) {
    items.push('המרווח בהון העצמי צפוף — כדאי לשמור כרית ביטחון');
  }

  if (analysis.intendedUse === 'INVESTMENT' && r.monthlyCashFlow !== null) {
    if (r.monthlyCashFlow > 0) {
      items.push(`תזרים חודשי חיובי של ${formatCurrency(r.monthlyCashFlow)}`);
    } else {
      items.push(`תזרים חודשי שלילי של ${formatCurrency(r.monthlyCashFlow)} — תצטרך לממן מהכיס`);
    }
  }

  return items;
}
