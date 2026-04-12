'use server';

import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { revalidatePath } from 'next/cache';
import type { Prisma } from '@prisma/client';

/** Coerce Prisma update payloads (e.g. `{ set: n }`) into plain scalars for `upsert` create. */
function flattenCapitalPatch(patch: Prisma.CapitalSourcesUpdateInput): Partial<Prisma.CapitalSourcesUncheckedCreateInput> {
  const out: Partial<Prisma.CapitalSourcesUncheckedCreateInput> = {};
  const take = <K extends keyof Prisma.CapitalSourcesUncheckedCreateInput>(key: K, v: unknown) => {
    if (v === undefined) return;
    if (typeof v === 'object' && v !== null && 'set' in (v as object)) {
      const s = (v as { set?: unknown }).set;
      if (s !== undefined) out[key] = s as Prisma.CapitalSourcesUncheckedCreateInput[K];
      return;
    }
    out[key] = v as Prisma.CapitalSourcesUncheckedCreateInput[K];
  };

  take('cashAmount', patch.cashAmount);
  take('liquidSavings', patch.liquidSavings);
  take('studyFunds', patch.studyFunds);
  take('providentFunds', patch.providentFunds);
  take('investmentPortfolio', patch.investmentPortfolio);
  take('deposits', patch.deposits);
  take('ownsProperty', patch.ownsProperty);
  take('currentPropertyValue', patch.currentPropertyValue);
  take('currentPropertyMortgage', patch.currentPropertyMortgage);
  take('currentPropertyOwnershipPercent', patch.currentPropertyOwnershipPercent);
  take('expectedPropertySale', patch.expectedPropertySale);
  take('familySupport', patch.familySupport);
  take('expectedBonus', patch.expectedBonus);
  take('futureAssetSale', patch.futureAssetSale);
  take('futureFundRelease', patch.futureFundRelease);

  return out;
}

async function assertProfile(userId: string, profileId: string) {
  const p = await prisma.financialProfile.findFirst({
    where: { id: profileId, userId },
    include: { capitalSources: true },
  });
  if (!p) throw new Error('Unauthorized');
  return p;
}

export async function saveOnboardingProgress(
  profileId: string,
  nextStep: number,
  options: {
    lifestyleFragment?: Record<string, unknown>;
    profilePatch?: Prisma.FinancialProfileUpdateInput;
    capitalPatch?: Prisma.CapitalSourcesUpdateInput;
    preferredPlaces?: Prisma.InputJsonValue;
    appendContextNote?: string;
  } = {}
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) throw new Error('Unauthorized');

  const profile = await assertProfile(session.user.id, profileId);

  const { lifestyleFragment, profilePatch, capitalPatch, preferredPlaces, appendContextNote } = options;

  const lifestyleMerged =
    lifestyleFragment && Object.keys(lifestyleFragment).length > 0
      ? ({
          ...((profile.onboardingLifestyleJson as object) ?? {}),
          ...lifestyleFragment,
        } as Prisma.InputJsonValue)
      : undefined;

  const rawPatch = { ...(profilePatch ?? {}) } as Record<string, unknown>;
  delete rawPatch.currentStep;

  await prisma.financialProfile.update({
    where: { id: profileId },
    data: {
      currentStep: nextStep,
      ...(lifestyleMerged !== undefined ? { onboardingLifestyleJson: lifestyleMerged } : {}),
      ...(preferredPlaces !== undefined ? { preferredPlacesJson: preferredPlaces } : {}),
      ...(rawPatch as Prisma.FinancialProfileUpdateInput),
    },
  });

  if (capitalPatch && Object.keys(capitalPatch).length > 0) {
    const flat = flattenCapitalPatch(capitalPatch);
    await prisma.capitalSources.upsert({
      where: { profileId },
      create: {
        profileId,
        cashAmount: 0,
        liquidSavings: 0,
        studyFunds: 0,
        providentFunds: 0,
        investmentPortfolio: 0,
        deposits: 0,
        ownsProperty: false,
        currentPropertyValue: 0,
        currentPropertyMortgage: 0,
        currentPropertyOwnershipPercent: 100,
        expectedPropertySale: false,
        familySupport: 0,
        expectedBonus: 0,
        futureAssetSale: 0,
        futureFundRelease: 0,
        ...flat,
      },
      update: capitalPatch,
    });
  }

  if (appendContextNote?.trim()) {
    await prisma.userContextNote.create({
      data: {
        userId: session.user.id,
        profileId,
        sourceType: 'ONBOARDING',
        rawText: appendContextNote.trim(),
      },
    });
  }

  revalidatePath('/onboarding');
  revalidatePath('/dashboard');
}

export async function completeOnboardingFlow(profileId: string, finalNote?: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) throw new Error('Unauthorized');
  await assertProfile(session.user.id, profileId);

  if (finalNote?.trim()) {
    await prisma.userContextNote.create({
      data: {
        userId: session.user.id,
        profileId,
        sourceType: 'ONBOARDING',
        rawText: finalNote.trim(),
      },
    });
  }

  await prisma.financialProfile.update({
    where: { id: profileId },
    data: {
      onboardingCompleted: true,
      budgetRangeMin: null,
    },
  });

  revalidatePath('/onboarding');
  revalidatePath('/profile');
  revalidatePath('/dashboard');
}
