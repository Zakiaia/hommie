'use server';

import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { runFullAnalysis, type CapitalInput, type ProfileInput, type PropertyAnalysisInput } from '@/lib/calculations';

interface CreateAnalysisInput {
  nickname?: string;
  city: string;
  neighborhood?: string;
  propertyPrice: number;
  propertyType: 'NEW_PROJECT' | 'SECOND_HAND';
  intendedUse: 'RESIDENCE' | 'INVESTMENT';
  estimatedRent?: number;
  closingCosts?: number;
  renovationCosts?: number;
  furnitureCosts?: number;
  purchaseTaxEstimate?: number;
  ltvPercent?: number;
  interestRate?: number;
  mortgageYears?: number;
  maintenanceMonthly?: number;
  vacancyPercent?: number;
}

export async function createAnalysis(input: CreateAnalysisInput): Promise<string> {
  const session = await getServerSession(authOptions);
  if (!session) throw new Error('Unauthorized');

  const profile = await prisma.financialProfile.findFirst({
    where: { userId: session.user.id, onboardingCompleted: true },
    include: { capitalSources: true },
    orderBy: { createdAt: 'desc' },
  });

  if (!profile) throw new Error('Profile not found');

  const closingCosts = input.closingCosts ?? Math.round(input.propertyPrice * 0.02);
  const purchaseTax = input.purchaseTaxEstimate ?? 0;

  const analysis = await prisma.propertyAnalysis.create({
    data: {
      userId: session.user.id,
      profileId: profile.id,
      nickname: input.nickname || null,
      city: input.city,
      neighborhood: input.neighborhood || null,
      propertyPrice: input.propertyPrice,
      propertyType: input.propertyType,
      intendedUse: input.intendedUse,
      estimatedRent: input.estimatedRent ?? null,
      closingCosts,
      renovationCosts: input.renovationCosts ?? 0,
      furnitureCosts: input.furnitureCosts ?? 0,
      purchaseTaxEstimate: purchaseTax,
      ltvPercent: input.ltvPercent ?? 70,
      interestRate: input.interestRate ?? 4.5,
      mortgageYears: input.mortgageYears ?? 30,
      maintenanceMonthly: input.maintenanceMonthly ?? 500,
      vacancyPercent: input.vacancyPercent ?? 5,
    },
  });

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
    currentPropertyOwnershipPercent: cs?.currentPropertyOwnershipPercent ?? 100,
    familySupport: cs?.familySupport ?? 0,
    expectedBonus: cs?.expectedBonus ?? 0,
    futureAssetSale: cs?.futureAssetSale ?? 0,
    futureFundRelease: cs?.futureFundRelease ?? 0,
  };

  const profileInput: ProfileInput = {
    primaryIncomeNet: profile.primaryIncomeNet ?? 0,
    partnerIncomeNet: profile.partnerIncomeNet ?? 0,
    variableIncome: profile.variableIncome ?? 0,
    monthlyObligations: profile.monthlyObligations ?? 0,
    currentRent: profile.currentRent ?? 0,
    fixedHouseholdExpenses: profile.fixedHouseholdExpenses ?? 0,
    comfortablePayment: profile.comfortablePayment ?? 0,
    paymentCeiling: profile.paymentCeiling ?? 10000000,
  };

  const propertyInput: PropertyAnalysisInput = {
    propertyPrice: input.propertyPrice,
    ltvPercent: input.ltvPercent ?? 70,
    interestRate: input.interestRate ?? 4.5,
    mortgageYears: input.mortgageYears ?? 30,
    closingCosts,
    renovationCosts: input.renovationCosts ?? 0,
    furnitureCosts: input.furnitureCosts ?? 0,
    purchaseTaxEstimate: purchaseTax,
    maintenanceMonthly: input.maintenanceMonthly ?? 500,
    vacancyPercent: input.vacancyPercent ?? 5,
    estimatedRent: input.estimatedRent ?? 0,
    intendedUse: input.intendedUse,
  };

  const result = runFullAnalysis(propertyInput, profileInput, capitalInput);

  await prisma.analysisResult.create({
    data: {
      analysisId: analysis.id,
      totalCapital: result.totalCapital,
      liquidCapital: result.liquidCapital,
      usableCapital: result.usableCapital,
      riskAdjustedCapital: result.riskAdjustedCapital,
      upfrontCashNeeded: result.upfrontCashNeeded,
      affordabilityGap: result.affordabilityGap,
      loanAmount: result.loanAmount,
      monthlyMortgagePayment: result.monthlyMortgagePayment,
      dtiRatio: result.dtiRatio,
      monthlyCashFlow: result.monthlyCashFlow,
      monthlyHousingDelta: result.monthlyHousingDelta,
      viabilityStatus: result.viabilityStatus,
      reasoningSummary: result.costBreakdown,
    },
  });

  return analysis.id;
}
