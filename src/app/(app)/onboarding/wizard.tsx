'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { StepWizard } from '@/components/shared/step-wizard';
import { he } from '@/lib/i18n/he';
import { saveStep1, saveStep2, saveStep3, saveStep4, saveStep5, saveStep6 } from './actions';
import { ArrowLeft, ArrowRight, Loader2 } from 'lucide-react';

interface Profile {
  id: string;
  currentStep: number;
  primaryIncomeNet: number | null;
  partnerIncomeNet: number | null;
  variableIncome: number | null;
  employmentType: string | null;
  incomeStability: string | null;
  expectedIncomeChange: string | null;
  monthlyObligations: number | null;
  currentRent: number | null;
  fixedHouseholdExpenses: number | null;
  comfortablePayment: number | null;
  paymentCeiling: number | null;
  goal: string | null;
  timeline: string | null;
  riskAppetite: string | null;
  priority: string | null;
  preferredAreas: unknown;
  propertyPreference: string | null;
  budgetRangeMin: number | null;
  budgetRangeMax: number | null;
  capitalSources: {
    cashAmount: number;
    liquidSavings: number;
    studyFunds: number;
    providentFunds: number;
    investmentPortfolio: number;
    deposits: number;
    ownsProperty: boolean;
    currentPropertyValue: number;
    currentPropertyMortgage: number;
    expectedPropertySale: boolean;
    familySupport: number;
    expectedBonus: number;
    futureAssetSale: number;
    futureFundRelease: number;
  } | null;
}

const STEP_LABELS = [
  he.onboarding.step1.title,
  he.onboarding.step2.title,
  he.onboarding.step3.title,
  he.onboarding.step4.title,
  he.onboarding.step5.title,
  he.onboarding.step6.title,
];

export function OnboardingWizard({ profile }: { profile: Profile }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [step, setStep] = useState(Math.min(profile.currentStep, 6));

  function goBack() {
    if (step > 1) setStep(step - 1);
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">{he.onboarding.title}</h1>
        <p className="text-muted-foreground">{he.onboarding.subtitle}</p>
      </div>

      <StepWizard steps={STEP_LABELS} currentStep={step} />

      {step === 1 && (
        <Step1Form
          profile={profile}
          isPending={isPending}
          onSubmit={(data) => startTransition(async () => {
            await saveStep1(profile.id, data);
            setStep(2);
          })}
          onBack={goBack}
        />
      )}
      {step === 2 && (
        <Step2Form
          profile={profile}
          isPending={isPending}
          onSubmit={(data) => startTransition(async () => {
            await saveStep2(profile.id, data);
            setStep(3);
          })}
          onBack={goBack}
        />
      )}
      {step === 3 && (
        <Step3Form
          profile={profile}
          isPending={isPending}
          onSubmit={(data) => startTransition(async () => {
            await saveStep3(profile.id, data);
            setStep(4);
          })}
          onBack={goBack}
        />
      )}
      {step === 4 && (
        <Step4Form
          profile={profile}
          isPending={isPending}
          onSubmit={(data) => startTransition(async () => {
            await saveStep4(profile.id, data);
            setStep(5);
          })}
          onBack={goBack}
        />
      )}
      {step === 5 && (
        <Step5Form
          profile={profile}
          isPending={isPending}
          onSubmit={(data) => startTransition(async () => {
            await saveStep5(profile.id, data);
            setStep(6);
          })}
          onBack={goBack}
        />
      )}
      {step === 6 && (
        <Step6Form
          isPending={isPending}
          onSubmit={(data) => startTransition(async () => {
            await saveStep6(profile.id, data);
            router.push('/profile');
          })}
          onBack={goBack}
        />
      )}
    </div>
  );
}

function NavButtons({ onBack, isPending, isFirst, isLast }: {
  onBack: () => void;
  isPending: boolean;
  isFirst: boolean;
  isLast: boolean;
}) {
  return (
    <div className="flex justify-between pt-4">
      {!isFirst ? (
        <Button type="button" variant="outline" onClick={onBack} disabled={isPending}>
          <ArrowRight className="ml-2 h-4 w-4" />
          {he.onboarding.back}
        </Button>
      ) : <div />}
      <Button type="submit" disabled={isPending}>
        {isPending && <Loader2 className="ml-2 h-4 w-4 animate-spin" />}
        {isLast ? he.onboarding.finish : he.onboarding.next}
        {!isLast && <ArrowLeft className="mr-2 h-4 w-4" />}
      </Button>
    </div>
  );
}

function NumericField({ label, placeholder, name, defaultValue }: {
  label: string;
  placeholder: string;
  name: string;
  defaultValue?: number | null;
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={name}>{label}</Label>
      <Input
        id={name}
        name={name}
        type="number"
        placeholder={placeholder}
        defaultValue={defaultValue ?? ''}
        dir="ltr"
        className="text-left"
      />
    </div>
  );
}

function SelectField({ label, name, options, defaultValue }: {
  label: string;
  name: string;
  options: Record<string, string>;
  defaultValue?: string | null;
}) {
  const [value, setValue] = useState(defaultValue || '');
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <input type="hidden" name={name} value={value} />
      <Select value={value} onValueChange={(v) => { if (v) setValue(v); }}>
        <SelectTrigger>
          <SelectValue placeholder="בחר..." />
        </SelectTrigger>
        <SelectContent>
          {Object.entries(options).map(([key, label]) => (
            <SelectItem key={key} value={key}>{label}</SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

// ─── Step 1: Household Income ─────────────────────────────────────────────────

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyData = any;

function Step1Form({ profile, isPending, onSubmit, onBack }: {
  profile: Profile;
  isPending: boolean;
  onSubmit: (data: AnyData) => void;
  onBack: () => void;
}) {
  const s = he.onboarding.step1;

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    onSubmit({
      primaryIncomeNet: Number(fd.get('primaryIncomeNet')) || undefined,
      partnerIncomeNet: Number(fd.get('partnerIncomeNet')) || undefined,
      variableIncome: Number(fd.get('variableIncome')) || undefined,
      employmentType: fd.get('employmentType') || undefined,
      incomeStability: fd.get('incomeStability') || undefined,
      expectedIncomeChange: fd.get('expectedIncomeChange') || undefined,
      freeText: fd.get('freeText') as string,
    });
  }

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader>
          <CardTitle>{s.title}</CardTitle>
          <CardDescription>{s.subtitle}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <NumericField label={s.primaryIncome} placeholder={s.primaryIncomePlaceholder} name="primaryIncomeNet" defaultValue={profile.primaryIncomeNet} />
            <NumericField label={s.partnerIncome} placeholder={s.partnerIncomePlaceholder} name="partnerIncomeNet" defaultValue={profile.partnerIncomeNet} />
          </div>
          <NumericField label={s.variableIncome} placeholder={s.variableIncomePlaceholder} name="variableIncome" defaultValue={profile.variableIncome} />
          <div className="grid gap-4 md:grid-cols-3">
            <SelectField label={s.employmentType} name="employmentType" options={s.employmentTypes} defaultValue={profile.employmentType} />
            <SelectField label={s.incomeStability} name="incomeStability" options={s.incomeStabilityOptions} defaultValue={profile.incomeStability} />
            <SelectField label={s.expectedChange} name="expectedIncomeChange" options={s.expectedChangeOptions} defaultValue={profile.expectedIncomeChange} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="freeText">{s.freeTextPrompt}</Label>
            <Textarea id="freeText" name="freeText" placeholder="..." className="min-h-[80px]" />
          </div>
          <NavButtons onBack={onBack} isPending={isPending} isFirst={true} isLast={false} />
        </CardContent>
      </Card>
    </form>
  );
}

// ─── Step 2: Monthly Outflows ─────────────────────────────────────────────────

function Step2Form({ profile, isPending, onSubmit, onBack }: {
  profile: Profile;
  isPending: boolean;
  onSubmit: (data: AnyData) => void;
  onBack: () => void;
}) {
  const s = he.onboarding.step2;

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    onSubmit({
      monthlyObligations: Number(fd.get('monthlyObligations')) || undefined,
      currentRent: Number(fd.get('currentRent')) || undefined,
      fixedHouseholdExpenses: Number(fd.get('fixedHouseholdExpenses')) || undefined,
      comfortablePayment: Number(fd.get('comfortablePayment')) || undefined,
      paymentCeiling: Number(fd.get('paymentCeiling')) || undefined,
      freeText: fd.get('freeText') as string,
    });
  }

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader>
          <CardTitle>{s.title}</CardTitle>
          <CardDescription>{s.subtitle}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <NumericField label={s.obligations} placeholder={s.obligationsPlaceholder} name="monthlyObligations" defaultValue={profile.monthlyObligations} />
            <NumericField label={s.currentRent} placeholder={s.currentRentPlaceholder} name="currentRent" defaultValue={profile.currentRent} />
          </div>
          <NumericField label={s.fixedExpenses} placeholder={s.fixedExpensesPlaceholder} name="fixedHouseholdExpenses" defaultValue={profile.fixedHouseholdExpenses} />
          <div className="grid gap-4 md:grid-cols-2">
            <NumericField label={s.comfortablePayment} placeholder={s.comfortablePaymentPlaceholder} name="comfortablePayment" defaultValue={profile.comfortablePayment} />
            <NumericField label={s.paymentCeiling} placeholder={s.paymentCeilingPlaceholder} name="paymentCeiling" defaultValue={profile.paymentCeiling} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="freeText">{s.freeTextPrompt}</Label>
            <Textarea id="freeText" name="freeText" placeholder="..." className="min-h-[80px]" />
          </div>
          <NavButtons onBack={onBack} isPending={isPending} isFirst={false} isLast={false} />
        </CardContent>
      </Card>
    </form>
  );
}

// ─── Step 3: Capital Sources ──────────────────────────────────────────────────

function Step3Form({ profile, isPending, onSubmit, onBack }: {
  profile: Profile;
  isPending: boolean;
  onSubmit: (data: AnyData) => void;
  onBack: () => void;
}) {
  const s = he.onboarding.step3;
  const c = profile.capitalSources;
  const [ownsProperty, setOwnsProperty] = useState(c?.ownsProperty ?? false);
  const [expectedSale, setExpectedSale] = useState(c?.expectedPropertySale ?? false);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    onSubmit({
      cashAmount: Number(fd.get('cashAmount')) || 0,
      liquidSavings: Number(fd.get('liquidSavings')) || 0,
      studyFunds: Number(fd.get('studyFunds')) || 0,
      providentFunds: Number(fd.get('providentFunds')) || 0,
      investmentPortfolio: Number(fd.get('investmentPortfolio')) || 0,
      deposits: Number(fd.get('deposits')) || 0,
      ownsProperty,
      currentPropertyValue: Number(fd.get('currentPropertyValue')) || 0,
      currentPropertyMortgage: Number(fd.get('currentPropertyMortgage')) || 0,
      expectedPropertySale: expectedSale,
      familySupport: Number(fd.get('familySupport')) || 0,
      expectedBonus: Number(fd.get('expectedBonus')) || 0,
      futureAssetSale: Number(fd.get('futureAssetSale')) || 0,
      futureFundRelease: Number(fd.get('futureFundRelease')) || 0,
    });
  }

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader>
          <CardTitle>{s.title}</CardTitle>
          <CardDescription>{s.subtitle}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="mb-3 font-semibold text-emerald-700">{s.liquidTitle}</h3>
            <div className="grid gap-4 md:grid-cols-2">
              <NumericField label={s.cash} placeholder={s.cashPlaceholder} name="cashAmount" defaultValue={c?.cashAmount} />
              <NumericField label={s.liquidSavings} placeholder={s.liquidSavingsPlaceholder} name="liquidSavings" defaultValue={c?.liquidSavings} />
            </div>
          </div>

          <div>
            <h3 className="mb-3 font-semibold text-blue-700">{s.semiLiquidTitle}</h3>
            <div className="grid gap-4 md:grid-cols-2">
              <NumericField label={s.studyFunds} placeholder={s.studyFundsPlaceholder} name="studyFunds" defaultValue={c?.studyFunds} />
              <NumericField label={s.providentFunds} placeholder={s.providentFundsPlaceholder} name="providentFunds" defaultValue={c?.providentFunds} />
              <NumericField label={s.investmentPortfolio} placeholder={s.investmentPortfolioPlaceholder} name="investmentPortfolio" defaultValue={c?.investmentPortfolio} />
              <NumericField label={s.deposits} placeholder={s.depositsPlaceholder} name="deposits" defaultValue={c?.deposits} />
            </div>
          </div>

          <div>
            <h3 className="mb-3 font-semibold text-purple-700">{s.propertyTitle}</h3>
            <div className="mb-3 flex items-center gap-4">
              <Label>{s.ownsProperty}</Label>
              <div className="flex gap-2">
                <Button type="button" variant={ownsProperty ? 'default' : 'outline'} size="sm" onClick={() => setOwnsProperty(true)}>{s.yes}</Button>
                <Button type="button" variant={!ownsProperty ? 'default' : 'outline'} size="sm" onClick={() => setOwnsProperty(false)}>{s.no}</Button>
              </div>
            </div>
            {ownsProperty && (
              <div className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <NumericField label={s.propertyValue} placeholder={s.propertyValuePlaceholder} name="currentPropertyValue" defaultValue={c?.currentPropertyValue} />
                  <NumericField label={s.propertyMortgage} placeholder={s.propertyMortgagePlaceholder} name="currentPropertyMortgage" defaultValue={c?.currentPropertyMortgage} />
                </div>
                <div className="flex items-center gap-4">
                  <Label>{s.expectedSale}</Label>
                  <div className="flex gap-2">
                    <Button type="button" variant={expectedSale ? 'default' : 'outline'} size="sm" onClick={() => setExpectedSale(true)}>{s.yes}</Button>
                    <Button type="button" variant={!expectedSale ? 'default' : 'outline'} size="sm" onClick={() => setExpectedSale(false)}>{s.no}</Button>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div>
            <h3 className="mb-3 font-semibold text-amber-700">{s.potentialTitle}</h3>
            <div className="grid gap-4 md:grid-cols-2">
              <NumericField label={s.familySupport} placeholder={s.familySupportPlaceholder} name="familySupport" defaultValue={c?.familySupport} />
              <NumericField label={s.expectedBonus} placeholder={s.expectedBonusPlaceholder} name="expectedBonus" defaultValue={c?.expectedBonus} />
              <NumericField label={s.futureAssetSale} placeholder={s.futureAssetSalePlaceholder} name="futureAssetSale" defaultValue={c?.futureAssetSale} />
              <NumericField label={s.futureFundRelease} placeholder={s.futureFundReleasePlaceholder} name="futureFundRelease" defaultValue={c?.futureFundRelease} />
            </div>
          </div>

          <NavButtons onBack={onBack} isPending={isPending} isFirst={false} isLast={false} />
        </CardContent>
      </Card>
    </form>
  );
}

// ─── Step 4: Goal, Timeline, Risk ─────────────────────────────────────────────

function Step4Form({ profile, isPending, onSubmit, onBack }: {
  profile: Profile;
  isPending: boolean;
  onSubmit: (data: AnyData) => void;
  onBack: () => void;
}) {
  const s = he.onboarding.step4;

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    onSubmit({
      goal: fd.get('goal') || undefined,
      timeline: fd.get('timeline') || undefined,
      riskAppetite: fd.get('riskAppetite') || undefined,
      priority: fd.get('priority') || undefined,
      freeText: fd.get('freeText') as string,
    });
  }

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader>
          <CardTitle>{s.title}</CardTitle>
          <CardDescription>{s.subtitle}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <SelectField label={s.goal} name="goal" options={s.goals} defaultValue={profile.goal} />
            <SelectField label={s.timeline} name="timeline" options={s.timelines} defaultValue={profile.timeline} />
            <SelectField label={s.riskAppetite} name="riskAppetite" options={s.risks} defaultValue={profile.riskAppetite} />
            <SelectField label={s.priority} name="priority" options={s.priorities} defaultValue={profile.priority} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="freeText">{s.freeTextPrompt}</Label>
            <Textarea id="freeText" name="freeText" placeholder="..." className="min-h-[80px]" />
          </div>
          <NavButtons onBack={onBack} isPending={isPending} isFirst={false} isLast={false} />
        </CardContent>
      </Card>
    </form>
  );
}

// ─── Step 5: Preferences ──────────────────────────────────────────────────────

function Step5Form({ profile, isPending, onSubmit, onBack }: {
  profile: Profile;
  isPending: boolean;
  onSubmit: (data: AnyData) => void;
  onBack: () => void;
}) {
  const s = he.onboarding.step5;
  const areas = Array.isArray(profile.preferredAreas) ? (profile.preferredAreas as string[]).join(', ') : '';

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    onSubmit({
      preferredAreas: fd.get('preferredAreas') as string,
      propertyPreference: fd.get('propertyPreference') || undefined,
      budgetRangeMin: Number(fd.get('budgetRangeMin')) || undefined,
      budgetRangeMax: Number(fd.get('budgetRangeMax')) || undefined,
    });
  }

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader>
          <CardTitle>{s.title}</CardTitle>
          <CardDescription>{s.subtitle}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="preferredAreas">{s.preferredAreas}</Label>
            <Input id="preferredAreas" name="preferredAreas" placeholder={s.preferredAreasPlaceholder} defaultValue={areas} />
          </div>
          <SelectField label={s.propertyPreference} name="propertyPreference" options={s.propertyPreferences} defaultValue={profile.propertyPreference} />
          <div>
            <Label>{s.budgetRange}</Label>
            <div className="mt-2 grid gap-4 md:grid-cols-2">
              <NumericField label={s.budgetMin} placeholder={s.budgetMinPlaceholder} name="budgetRangeMin" defaultValue={profile.budgetRangeMin} />
              <NumericField label={s.budgetMax} placeholder={s.budgetMaxPlaceholder} name="budgetRangeMax" defaultValue={profile.budgetRangeMax} />
            </div>
          </div>
          <NavButtons onBack={onBack} isPending={isPending} isFirst={false} isLast={false} />
        </CardContent>
      </Card>
    </form>
  );
}

// ─── Step 6: Additional Context ───────────────────────────────────────────────

function Step6Form({ isPending, onSubmit, onBack }: {
  isPending: boolean;
  onSubmit: (data: { additionalContext?: string }) => void;
  onBack: () => void;
}) {
  const s = he.onboarding.step6;

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    onSubmit({ additionalContext: fd.get('additionalContext') as string });
  }

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader>
          <CardTitle>{s.title}</CardTitle>
          <CardDescription>{s.subtitle}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="additionalContext">{s.contextLabel}</Label>
            <Textarea
              id="additionalContext"
              name="additionalContext"
              placeholder={s.contextPlaceholder}
              className="min-h-[150px]"
            />
          </div>
          <div className="rounded-lg bg-muted/50 p-4">
            <p className="mb-2 text-sm font-medium text-muted-foreground">דוגמאות:</p>
            <ul className="space-y-1">
              {s.examples.map((ex, i) => (
                <li key={i} className="text-sm text-muted-foreground">• {ex}</li>
              ))}
            </ul>
          </div>
          <NavButtons onBack={onBack} isPending={isPending} isFirst={false} isLast={true} />
        </CardContent>
      </Card>
    </form>
  );
}
