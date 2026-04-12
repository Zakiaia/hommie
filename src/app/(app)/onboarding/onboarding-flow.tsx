'use client';

import { useCallback, useMemo, useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { he } from '@/lib/i18n/he';
import { FormattedNumberField } from '@/components/shared/formatted-number-input';
import { VoiceTextarea } from '@/components/shared/voice-textarea';
import { AreaSearchPicker, type PlacePick } from '@/components/shared/area-search-picker';
import { AdvisorChatDock } from '@/components/shared/advisor-chat-dock';
import { saveOnboardingProgress, completeOnboardingFlow } from './onboarding-actions';
import { Loader2 } from 'lucide-react';
import type {
  EmploymentType,
  Goal,
  IncomeChangeExpectation,
  IncomeStability,
  PropertyPreference,
  RiskAppetite,
  Timeline,
  Priority,
} from '@prisma/client';
import { Prisma } from '@prisma/client';

const v = he.onboardingV2;
const TOTAL_STEPS = 27;

type Profile = {
  id: string;
  currentStep: number;
  preferredPlacesJson?: unknown;
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
  propertyPreference: string | null;
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
    currentPropertyOwnershipPercent?: number;
    expectedPropertySale: boolean;
    familySupport: number;
    expectedBonus: number;
    futureAssetSale: number;
    futureFundRelease: number;
  } | null;
};

function ChoiceGrid({
  options,
  onPick,
}: {
  options: { key: string; label: string }[];
  onPick: (key: string) => void;
}) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {options.map((o) => (
        <button
          key={o.key}
          type="button"
          onClick={() => onPick(o.key)}
          className={cn(
            'glass-choice rounded-2xl border border-white/10 px-5 py-4 text-right text-base font-medium transition-all',
            'hover:-translate-y-0.5 hover:border-white/25 hover:bg-white/10 hover:shadow-lg',
            'active:scale-[0.99]'
          )}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

export function OnboardingFlow({ profile }: { profile: Profile }) {
  const router = useRouter();
  const [step, setStep] = useState(() =>
    Math.min(Math.max(profile.currentStep || 1, 1), TOTAL_STEPS)
  );
  const [pending, start] = useTransition();

  const cs = profile.capitalSources;

  const [places, setPlaces] = useState<PlacePick[]>(() => {
    const raw = profile.preferredPlacesJson;
    if (Array.isArray(raw)) return raw as PlacePick[];
    return [];
  });

  const [primary, setPrimary] = useState<number | undefined>(profile.primaryIncomeNet ?? undefined);
  const [partner, setPartner] = useState<number | undefined>(profile.partnerIncomeNet ?? undefined);
  const [variable, setVariable] = useState<number | undefined>(profile.variableIncome ?? undefined);
  const [obligations, setObligations] = useState<number | undefined>(profile.monthlyObligations ?? undefined);
  const [rent, setRent] = useState<number | undefined>(profile.currentRent ?? undefined);
  const [fixed, setFixed] = useState<number | undefined>(profile.fixedHouseholdExpenses ?? undefined);
  const [comfort, setComfort] = useState<number | undefined>(profile.comfortablePayment ?? undefined);
  const [ceiling, setCeiling] = useState<number | undefined>(profile.paymentCeiling ?? undefined);
  const [cash, setCash] = useState<number | undefined>(cs?.cashAmount ?? undefined);
  const [liquid, setLiquid] = useState<number | undefined>(cs?.liquidSavings ?? undefined);
  const [study, setStudy] = useState<number | undefined>(cs?.studyFunds ?? undefined);
  const [prov, setProv] = useState<number | undefined>(cs?.providentFunds ?? undefined);
  const [inv, setInv] = useState<number | undefined>(cs?.investmentPortfolio ?? undefined);
  const [dep, setDep] = useState<number | undefined>(cs?.deposits ?? undefined);
  const [propVal, setPropVal] = useState<number | undefined>(cs?.currentPropertyValue ?? undefined);
  const [propMort, setPropMort] = useState<number | undefined>(cs?.currentPropertyMortgage ?? undefined);
  const [ownPct, setOwnPct] = useState<number | undefined>(cs?.currentPropertyOwnershipPercent ?? 100);
  const [fam, setFam] = useState<number | undefined>(cs?.familySupport ?? undefined);
  const [bonus, setBonus] = useState<number | undefined>(cs?.expectedBonus ?? undefined);
  const [asset, setAsset] = useState<number | undefined>(cs?.futureAssetSale ?? undefined);
  const [fund, setFund] = useState<number | undefined>(cs?.futureFundRelease ?? undefined);
  const [budgetMax, setBudgetMax] = useState<number | undefined>(profile.budgetRangeMax ?? undefined);

  const [owns, setOwns] = useState<boolean | null>(cs?.ownsProperty ?? null);
  const [sale, setSale] = useState<boolean | null>(
    cs?.ownsProperty ? (cs?.expectedPropertySale ?? null) : null
  );

  const [incomeNote, setIncomeNote] = useState('');
  const [outflowNote, setOutflowNote] = useState('');
  const [prefsNote, setPrefsNote] = useState('');
  const [finalNote, setFinalNote] = useState('');

  const next = useCallback(
    (patch: Parameters<typeof saveOnboardingProgress>[2]) => {
      const s = step;
      start(async () => {
        await saveOnboardingProgress(profile.id, Math.min(s + 1, TOTAL_STEPS), patch);
        setStep((x) => Math.min(x + 1, TOTAL_STEPS));
        router.refresh();
      });
    },
    [profile.id, router, step]
  );

  const goBack = () => setStep((s) => Math.max(1, s - 1));

  const progress = useMemo(() => Math.round((step / TOTAL_STEPS) * 100), [step]);

  return (
    <div className="relative mx-auto max-w-xl pb-28 pt-4">
      <AdvisorChatDock profileId={profile.id} />

      <div className="glass-panel mb-6 rounded-2xl p-4 text-sm leading-relaxed text-muted-foreground">
        <p className="font-medium text-foreground">{v.pitchLine1}</p>
        <p className="mt-1">{v.pitchLine2}</p>
      </div>

      <div className="mb-4 h-1.5 overflow-hidden rounded-full bg-white/10">
        <div className="h-full rounded-full bg-white/70 transition-all" style={{ width: `${progress}%` }} />
      </div>
      <p className="mb-6 text-center text-xs text-muted-foreground">
        {step} {v.of} {TOTAL_STEPS}
      </p>

      <div className="glass-panel rounded-3xl p-6 sm:p-8">
        {step === 1 && (
          <>
            <h1 className="font-heading text-3xl font-semibold tracking-tight">{v.introTitle}</h1>
            <p className="mt-3 text-muted-foreground">{v.introBody}</p>
            <Button className="mt-8 w-full rounded-full" size="lg" onClick={() => next({})} disabled={pending}>
              {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : v.continue}
            </Button>
          </>
        )}

        {step === 2 && (
          <>
            <h2 className="font-heading text-2xl font-semibold">{v.spendingQ}</h2>
            <ChoiceGrid
              options={[
                { key: 'high', label: v.spendingHigh },
                { key: 'balanced', label: v.spendingBal },
                { key: 'low', label: v.spendingLow },
              ]}
              onPick={(key) => next({ lifestyleFragment: { spendingStyle: key } })}
            />
          </>
        )}

        {step === 3 && (
          <>
            <h2 className="font-heading text-2xl font-semibold">{v.socialQ}</h2>
            <ChoiceGrid
              options={[
                { key: 'home', label: v.socialHome },
                { key: 'out', label: v.socialOut },
                { key: 'mix', label: v.socialMix },
              ]}
              onPick={(key) => next({ lifestyleFragment: { socialStyle: key } })}
            />
          </>
        )}

        {step === 4 && (
          <>
            <h2 className="font-heading text-2xl font-semibold">{v.housingQ}</h2>
            <ChoiceGrid
              options={[
                { key: 'city', label: v.housingCity },
                { key: 'suburb', label: v.housingSuburb },
                { key: 'either', label: v.housingEither },
              ]}
              onPick={(key) => next({ lifestyleFragment: { housingStyle: key } })}
            />
          </>
        )}

        {step === 5 && (
          <>
            <h2 className="font-heading text-2xl font-semibold">{v.employmentQ}</h2>
            <ChoiceGrid
              options={[
                { key: 'SALARIED', label: v.empSalaried },
                { key: 'SELF_EMPLOYED', label: v.empSelf },
                { key: 'MIXED', label: v.empMixed },
              ]}
              onPick={(key) =>
                next({ profilePatch: { employmentType: key as EmploymentType } })
              }
            />
          </>
        )}

        {step === 6 && (
          <>
            <h2 className="font-heading text-2xl font-semibold">{v.incomePrimaryQ}</h2>
            <div className="mt-6 space-y-4">
              <FormattedNumberField label="" value={primary} onChange={setPrimary} id="pi" />
            </div>
            <Button
              className="mt-8 w-full rounded-full"
              size="lg"
              disabled={pending || primary === undefined}
              onClick={() => next({ profilePatch: { primaryIncomeNet: primary ?? 0 } })}
            >
              {v.continue}
            </Button>
          </>
        )}

        {step === 7 && (
          <>
            <h2 className="font-heading text-2xl font-semibold">{v.incomePartnerQ}</h2>
            <FormattedNumberField label="" value={partner} onChange={setPartner} id="pp" />
            <h2 className="mt-8 font-heading text-xl font-semibold">{v.incomeVarQ}</h2>
            <FormattedNumberField label="" value={variable} onChange={setVariable} id="pv" />
            <Button
              className="mt-8 w-full rounded-full"
              size="lg"
              disabled={pending}
              onClick={() =>
                next({
                  profilePatch: {
                    partnerIncomeNet: partner ?? 0,
                    variableIncome: variable ?? 0,
                  },
                })
              }
            >
              {v.continue}
            </Button>
          </>
        )}

        {step === 8 && (
          <>
            <h2 className="font-heading text-2xl font-semibold">{v.stabilityQ}</h2>
            <ChoiceGrid
              options={[
                { key: 'HIGH', label: v.stabHigh },
                { key: 'MEDIUM', label: v.stabMed },
                { key: 'LOW', label: v.stabLow },
              ]}
              onPick={(key) =>
                next({ profilePatch: { incomeStability: key as IncomeStability } })
              }
            />
          </>
        )}

        {step === 9 && (
          <>
            <h2 className="font-heading text-2xl font-semibold">{v.changeQ}</h2>
            <ChoiceGrid
              options={[
                { key: 'INCREASE', label: v.chInc },
                { key: 'STABLE', label: v.chStable },
                { key: 'DECREASE', label: v.chDec },
              ]}
              onPick={(key) =>
                next({ profilePatch: { expectedIncomeChange: key as IncomeChangeExpectation } })
              }
            />
          </>
        )}

        {step === 10 && (
          <>
            <h2 className="font-heading text-2xl font-semibold">{v.incomeExtraQ}</h2>
            <VoiceTextarea
              className="mt-4"
              value={incomeNote}
              onChange={setIncomeNote}
              hint={v.pitchLine2}
            />
            <Button
              className="mt-6 w-full rounded-full"
              size="lg"
              disabled={pending}
              onClick={() =>
                next({
                  appendContextNote: incomeNote.trim() || undefined,
                })
              }
            >
              {v.continue}
            </Button>
          </>
        )}

        {step === 11 && (
          <>
            <h2 className="font-heading text-2xl font-semibold">{v.obligationsQ}</h2>
            <FormattedNumberField label="" value={obligations} onChange={setObligations} id="ob" />
            <h2 className="mt-6 font-heading text-xl font-semibold">{v.rentQ}</h2>
            <FormattedNumberField label="" value={rent} onChange={setRent} id="rt" />
            <h2 className="mt-6 font-heading text-xl font-semibold">{v.fixedQ}</h2>
            <FormattedNumberField label="" value={fixed} onChange={setFixed} id="fx" />
            <Button
              className="mt-8 w-full rounded-full"
              size="lg"
              disabled={pending}
              onClick={() =>
                next({
                  profilePatch: {
                    monthlyObligations: obligations ?? 0,
                    currentRent: rent ?? 0,
                    fixedHouseholdExpenses: fixed ?? 0,
                  },
                })
              }
            >
              {v.continue}
            </Button>
          </>
        )}

        {step === 12 && (
          <>
            <h2 className="font-heading text-2xl font-semibold">{v.comfortQ}</h2>
            <FormattedNumberField label="" value={comfort} onChange={setComfort} id="cf" />
            <h2 className="mt-6 font-heading text-xl font-semibold">{v.ceilingQ}</h2>
            <FormattedNumberField label="" value={ceiling} onChange={setCeiling} id="cl" />
            <Button
              className="mt-8 w-full rounded-full"
              size="lg"
              disabled={pending || comfort === undefined || ceiling === undefined}
              onClick={() =>
                next({
                  profilePatch: {
                    comfortablePayment: comfort ?? 0,
                    paymentCeiling: ceiling ?? 0,
                  },
                })
              }
            >
              {v.continue}
            </Button>
          </>
        )}

        {step === 13 && (
          <>
            <h2 className="font-heading text-2xl font-semibold">{v.outflowExtraQ}</h2>
            <VoiceTextarea className="mt-4" value={outflowNote} onChange={setOutflowNote} />
            <Button
              className="mt-6 w-full rounded-full"
              size="lg"
              disabled={pending}
              onClick={() => next({ appendContextNote: outflowNote.trim() || undefined })}
            >
              {v.continue}
            </Button>
          </>
        )}

        {step === 14 && (
          <>
            <h2 className="font-heading text-2xl font-semibold">{v.cashQ}</h2>
            <FormattedNumberField label="" value={cash} onChange={setCash} id="csh" />
            <h2 className="mt-6 font-heading text-xl font-semibold">{v.liquidQ}</h2>
            <FormattedNumberField label="" value={liquid} onChange={setLiquid} id="liq" />
            <Button
              className="mt-8 w-full rounded-full"
              size="lg"
              disabled={pending}
              onClick={() =>
                next({
                  capitalPatch: {
                    cashAmount: cash ?? 0,
                    liquidSavings: liquid ?? 0,
                  },
                })
              }
            >
              {v.continue}
            </Button>
          </>
        )}

        {step === 15 && (
          <>
            <h2 className="font-heading text-2xl font-semibold">{v.semiQ}</h2>
            <div className="mt-4 space-y-4">
              <FormattedNumberField label={v.studyL} value={study} onChange={setStudy} />
              <FormattedNumberField label={v.provL} value={prov} onChange={setProv} />
              <FormattedNumberField label={v.invL} value={inv} onChange={setInv} />
              <FormattedNumberField label={v.depL} value={dep} onChange={setDep} />
            </div>
            <Button
              className="mt-8 w-full rounded-full"
              size="lg"
              disabled={pending}
              onClick={() =>
                next({
                  capitalPatch: {
                    studyFunds: study ?? 0,
                    providentFunds: prov ?? 0,
                    investmentPortfolio: inv ?? 0,
                    deposits: dep ?? 0,
                  },
                })
              }
            >
              {v.continue}
            </Button>
          </>
        )}

        {step === 16 && (
          <>
            <h2 className="font-heading text-2xl font-semibold">{v.ownsQ}</h2>
            <ChoiceGrid
              options={[
                { key: 'yes', label: v.yes },
                { key: 'no', label: v.no },
              ]}
              onPick={(key) => {
                const o = key === 'yes';
                setOwns(o);
                start(async () => {
                  await saveOnboardingProgress(profile.id, 17, {
                    capitalPatch: {
                      ownsProperty: o,
                      ...(o
                        ? {}
                        : {
                            currentPropertyValue: 0,
                            currentPropertyMortgage: 0,
                            currentPropertyOwnershipPercent: 100,
                            expectedPropertySale: false,
                          }),
                    },
                  });
                  setStep(17);
                  router.refresh();
                });
              }}
            />
          </>
        )}

        {step === 17 && owns === true && (
          <>
            <h2 className="font-heading text-2xl font-semibold">{v.propValQ}</h2>
            <FormattedNumberField label="" value={propVal} onChange={setPropVal} id="pv2" />
            <h2 className="mt-6 font-heading text-xl font-semibold">{v.propMortQ}</h2>
            <FormattedNumberField label="" value={propMort} onChange={setPropMort} id="pm" />
            <h2 className="mt-6 font-heading text-xl font-semibold">{v.ownPctQ}</h2>
            <FormattedNumberField label="" value={ownPct} onChange={setOwnPct} id="op" />
            <h2 className="mt-6 font-heading text-xl font-semibold">{v.saleQ}</h2>
            <div className="mt-2 flex gap-3">
              <Button type="button" variant={sale === true ? 'default' : 'outline'} className="flex-1 rounded-full" onClick={() => setSale(true)}>
                {v.yes}
              </Button>
              <Button type="button" variant={sale === false ? 'default' : 'outline'} className="flex-1 rounded-full" onClick={() => setSale(false)}>
                {v.no}
              </Button>
            </div>
            <Button
              className="mt-8 w-full rounded-full"
              size="lg"
              disabled={pending || sale === null || propVal === undefined}
              onClick={() =>
                next({
                  capitalPatch: {
                    currentPropertyValue: propVal ?? 0,
                    currentPropertyMortgage: propMort ?? 0,
                    currentPropertyOwnershipPercent: Math.min(100, Math.max(0, ownPct ?? 100)),
                    expectedPropertySale: sale === true,
                  },
                })
              }
            >
              {v.continue}
            </Button>
          </>
        )}

        {step === 17 && owns === false && (
          <>
            <p className="text-muted-foreground">{v.pitchLine2}</p>
            <Button
              className="mt-8 w-full rounded-full"
              size="lg"
              disabled={pending}
              onClick={() => next({})}
            >
              {v.continue}
            </Button>
          </>
        )}

        {step === 18 && (
          <>
            <h2 className="font-heading text-2xl font-semibold">{v.potentialQ}</h2>
            <div className="mt-4 space-y-4">
              <FormattedNumberField label={v.famL} value={fam} onChange={setFam} />
              <FormattedNumberField label={v.bonusL} value={bonus} onChange={setBonus} />
              <FormattedNumberField label={v.assetL} value={asset} onChange={setAsset} />
              <FormattedNumberField label={v.fundL} value={fund} onChange={setFund} />
            </div>
            <Button
              className="mt-8 w-full rounded-full"
              size="lg"
              disabled={pending}
              onClick={() =>
                next({
                  capitalPatch: {
                    familySupport: fam ?? 0,
                    expectedBonus: bonus ?? 0,
                    futureAssetSale: asset ?? 0,
                    futureFundRelease: fund ?? 0,
                  },
                })
              }
            >
              {v.continue}
            </Button>
          </>
        )}

        {step === 19 && (
          <>
            <h2 className="font-heading text-2xl font-semibold">{v.goalQ}</h2>
            <ChoiceGrid
              options={[
                { key: 'RESIDENCE', label: v.goalRes },
                { key: 'INVESTMENT', label: v.goalInv },
                { key: 'MIXED', label: v.goalMix },
                { key: 'UNSURE', label: v.goalUnsure },
              ]}
              onPick={(key) => next({ profilePatch: { goal: key as Goal } })}
            />
          </>
        )}

        {step === 20 && (
          <>
            <h2 className="font-heading text-2xl font-semibold">{v.timelineQ}</h2>
            <ChoiceGrid
              options={[
                { key: 'SHORT', label: v.tlShort },
                { key: 'MEDIUM', label: v.tlMed },
                { key: 'LONG', label: v.tlLong },
              ]}
              onPick={(key) => next({ profilePatch: { timeline: key as Timeline } })}
            />
          </>
        )}

        {step === 21 && (
          <>
            <h2 className="font-heading text-2xl font-semibold">{v.riskQ}</h2>
            <ChoiceGrid
              options={[
                { key: 'LOW', label: v.riskLow },
                { key: 'MEDIUM', label: v.riskMed },
                { key: 'HIGH', label: v.riskHigh },
              ]}
              onPick={(key) => next({ profilePatch: { riskAppetite: key as RiskAppetite } })}
            />
          </>
        )}

        {step === 22 && (
          <>
            <h2 className="font-heading text-2xl font-semibold">{v.priorityQ}</h2>
            <ChoiceGrid
              options={[
                { key: 'STABILITY', label: v.priStab },
                { key: 'FLEXIBILITY', label: v.priFlex },
                { key: 'UPSIDE', label: v.priUp },
                { key: 'MONTHLY_CASH_FLOW', label: v.priCash },
              ]}
              onPick={(key) => next({ profilePatch: { priority: key as Priority } })}
            />
          </>
        )}

        {step === 23 && (
          <>
            <h2 className="font-heading text-2xl font-semibold">{v.prefsExtraQ}</h2>
            <VoiceTextarea className="mt-4" value={prefsNote} onChange={setPrefsNote} />
            <Button
              className="mt-6 w-full rounded-full"
              size="lg"
              disabled={pending}
              onClick={() => next({ appendContextNote: prefsNote.trim() || undefined })}
            >
              {v.continue}
            </Button>
          </>
        )}

        {step === 24 && (
          <>
            <h2 className="font-heading text-2xl font-semibold">{v.propPrefQ}</h2>
            <ChoiceGrid
              options={[
                { key: 'NEW_PROJECT', label: v.prefNew },
                { key: 'SECOND_HAND', label: v.prefOld },
                { key: 'NO_PREFERENCE', label: v.prefAny },
              ]}
              onPick={(key) => next({ profilePatch: { propertyPreference: key as PropertyPreference } })}
            />
          </>
        )}

        {step === 25 && (
          <>
            <h2 className="font-heading text-2xl font-semibold">{v.areaQ}</h2>
            <div className="mt-4">
              <AreaSearchPicker selected={places} onChange={setPlaces} />
            </div>
            <Button
              className="mt-8 w-full rounded-full"
              size="lg"
              disabled={pending}
              onClick={() =>
                next({
                  preferredPlaces: places.length ? (places as unknown as Prisma.InputJsonValue) : [],
                })
              }
            >
              {v.continue}
            </Button>
          </>
        )}

        {step === 26 && (
          <>
            <h2 className="font-heading text-2xl font-semibold">{v.budgetMaxQ}</h2>
            <FormattedNumberField label="" value={budgetMax} onChange={setBudgetMax} id="bm" />
            <Button
              className="mt-8 w-full rounded-full"
              size="lg"
              disabled={pending}
              onClick={() =>
                next({
                  profilePatch: {
                    budgetRangeMax: budgetMax ?? undefined,
                    budgetRangeMin: null,
                  },
                })
              }
            >
              {v.continue}
            </Button>
          </>
        )}

        {step === 27 && (
          <>
            <h2 className="font-heading text-2xl font-semibold">{v.finalQ}</h2>
            <VoiceTextarea className="mt-4" value={finalNote} onChange={setFinalNote} />
            <Button
              className="mt-8 w-full rounded-full"
              size="lg"
              disabled={pending}
              onClick={() =>
                start(async () => {
                  await completeOnboardingFlow(profile.id, finalNote);
                  router.push('/profile');
                })
              }
            >
              {v.finish}
            </Button>
          </>
        )}

        {step > 1 && step < TOTAL_STEPS && (
          <Button type="button" variant="ghost" className="mt-6 w-full" onClick={goBack} disabled={pending}>
            {v.back}
          </Button>
        )}
      </div>
    </div>
  );
}
