'use server';

import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { revalidatePath } from 'next/cache';

export async function getOrCreateProfile() {
  const session = await getServerSession(authOptions);
  if (!session) throw new Error('Unauthorized');

  let profile = await prisma.financialProfile.findFirst({
    where: { userId: session.user.id },
    include: { capitalSources: true },
    orderBy: { createdAt: 'desc' },
  });

  if (!profile) {
    profile = await prisma.financialProfile.create({
      data: { userId: session.user.id },
      include: { capitalSources: true },
    });
  }

  return profile;
}

export async function saveStep1(profileId: string, data: {
  primaryIncomeNet?: number;
  partnerIncomeNet?: number;
  variableIncome?: number;
  employmentType?: string;
  incomeStability?: string;
  expectedIncomeChange?: string;
  freeText?: string;
}) {
  const session = await getServerSession(authOptions);
  if (!session) throw new Error('Unauthorized');

  const { freeText, ...profileData } = data;

  await prisma.financialProfile.update({
    where: { id: profileId },
    data: {
      ...profileData,
      employmentType: profileData.employmentType as 'SALARIED' | 'SELF_EMPLOYED' | 'MIXED' | undefined,
      incomeStability: profileData.incomeStability as 'HIGH' | 'MEDIUM' | 'LOW' | undefined,
      expectedIncomeChange: profileData.expectedIncomeChange as 'INCREASE' | 'STABLE' | 'DECREASE' | undefined,
      currentStep: 2,
    },
  });

  if (freeText?.trim()) {
    await prisma.userContextNote.create({
      data: {
        userId: session.user.id,
        profileId,
        sourceType: 'ONBOARDING',
        rawText: freeText,
      },
    });
  }

  revalidatePath('/onboarding');
}

export async function saveStep2(profileId: string, data: {
  monthlyObligations?: number;
  currentRent?: number;
  fixedHouseholdExpenses?: number;
  comfortablePayment?: number;
  paymentCeiling?: number;
  freeText?: string;
}) {
  const session = await getServerSession(authOptions);
  if (!session) throw new Error('Unauthorized');

  const { freeText, ...profileData } = data;

  await prisma.financialProfile.update({
    where: { id: profileId },
    data: { ...profileData, currentStep: 3 },
  });

  if (freeText?.trim()) {
    await prisma.userContextNote.create({
      data: {
        userId: session.user.id,
        profileId,
        sourceType: 'ONBOARDING',
        rawText: freeText,
      },
    });
  }

  revalidatePath('/onboarding');
}

export async function saveStep3(profileId: string, data: {
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
}) {
  const session = await getServerSession(authOptions);
  if (!session) throw new Error('Unauthorized');

  await prisma.capitalSources.upsert({
    where: { profileId },
    create: { profileId, ...data },
    update: data,
  });

  await prisma.financialProfile.update({
    where: { id: profileId },
    data: { currentStep: 4 },
  });

  revalidatePath('/onboarding');
}

export async function saveStep4(profileId: string, data: {
  goal?: string;
  timeline?: string;
  riskAppetite?: string;
  priority?: string;
  freeText?: string;
}) {
  const session = await getServerSession(authOptions);
  if (!session) throw new Error('Unauthorized');

  const { freeText, ...profileData } = data;

  await prisma.financialProfile.update({
    where: { id: profileId },
    data: {
      goal: profileData.goal as 'RESIDENCE' | 'INVESTMENT' | 'MIXED' | 'UNSURE' | undefined,
      timeline: profileData.timeline as 'SHORT' | 'MEDIUM' | 'LONG' | undefined,
      riskAppetite: profileData.riskAppetite as 'LOW' | 'MEDIUM' | 'HIGH' | undefined,
      priority: profileData.priority as 'STABILITY' | 'FLEXIBILITY' | 'UPSIDE' | 'MONTHLY_CASH_FLOW' | undefined,
      currentStep: 5,
    },
  });

  if (freeText?.trim()) {
    await prisma.userContextNote.create({
      data: {
        userId: session.user.id,
        profileId,
        sourceType: 'ONBOARDING',
        rawText: freeText,
      },
    });
  }

  revalidatePath('/onboarding');
}

export async function saveStep5(profileId: string, data: {
  preferredAreas?: string;
  propertyPreference?: string;
  budgetRangeMin?: number;
  budgetRangeMax?: number;
}) {
  const session = await getServerSession(authOptions);
  if (!session) throw new Error('Unauthorized');

  const areas = data.preferredAreas
    ? data.preferredAreas.split(',').map((a) => a.trim()).filter(Boolean)
    : [];

  await prisma.financialProfile.update({
    where: { id: profileId },
    data: {
      preferredAreas: areas,
      propertyPreference: data.propertyPreference as 'NEW_PROJECT' | 'SECOND_HAND' | 'NO_PREFERENCE' | undefined,
      budgetRangeMin: data.budgetRangeMin,
      budgetRangeMax: data.budgetRangeMax,
      currentStep: 6,
    },
  });

  revalidatePath('/onboarding');
}

export async function saveStep6(profileId: string, data: { additionalContext?: string }) {
  const session = await getServerSession(authOptions);
  if (!session) throw new Error('Unauthorized');

  if (data.additionalContext?.trim()) {
    await prisma.userContextNote.create({
      data: {
        userId: session.user.id,
        profileId,
        sourceType: 'ONBOARDING',
        rawText: data.additionalContext,
      },
    });
  }

  await prisma.financialProfile.update({
    where: { id: profileId },
    data: { onboardingCompleted: true },
  });

  revalidatePath('/onboarding');
  revalidatePath('/profile');
  revalidatePath('/dashboard');
}
