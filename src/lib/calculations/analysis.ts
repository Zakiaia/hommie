import { calculateCapital, type CapitalInput } from './capital';
import { calculateMortgage } from './mortgage';
import { calculateAffordability } from './affordability';

export type ViabilityStatus = 'VIABLE' | 'VIABLE_BUT_TIGHT' | 'HIGH_RISK' | 'NOT_AFFORDABLE';

export interface PropertyAnalysisInput {
  propertyPrice: number;
  ltvPercent: number;
  interestRate: number;
  mortgageYears: number;
  closingCosts: number;
  renovationCosts: number;
  furnitureCosts: number;
  purchaseTaxEstimate: number;
  maintenanceMonthly: number;
  vacancyPercent: number;
  estimatedRent: number;
  intendedUse: 'RESIDENCE' | 'INVESTMENT';
}

export interface ProfileInput {
  primaryIncomeNet: number;
  partnerIncomeNet: number;
  variableIncome: number;
  monthlyObligations: number;
  currentRent: number;
  fixedHouseholdExpenses: number;
  comfortablePayment: number;
  paymentCeiling: number;
}

export interface FullAnalysisResult {
  // Capital
  totalCapital: number;
  liquidCapital: number;
  usableCapital: number;
  riskAdjustedCapital: number;

  // Upfront
  downPayment: number;
  upfrontCashNeeded: number;
  affordabilityGap: number;

  // Mortgage
  loanAmount: number;
  monthlyMortgagePayment: number;

  // Affordability
  weightedMonthlyIncome: number;
  totalMonthlyObligations: number;
  dtiRatio: number;
  dtiStatus: 'healthy' | 'caution' | 'risky';
  monthlyPostPurchaseBuffer: number;
  monthlyHousingDelta: number;

  // Investment (optional)
  monthlyCashFlow: number | null;
  grossRentalIncome: number | null;

  // Verdict
  viabilityStatus: ViabilityStatus;

  // Cost breakdown
  costBreakdown: {
    downPayment: number;
    purchaseTax: number;
    closingCosts: number;
    renovation: number;
    furniture: number;
    total: number;
  };
}

export function runFullAnalysis(
  property: PropertyAnalysisInput,
  profile: ProfileInput,
  capital: CapitalInput
): FullAnalysisResult {
  const capitalResult = calculateCapital(capital);

  const mortgageResult = calculateMortgage({
    propertyPrice: property.propertyPrice,
    ltvPercent: property.ltvPercent,
    annualInterestRate: property.interestRate,
    mortgageYears: property.mortgageYears,
  });

  const upfrontCashNeeded =
    mortgageResult.downPayment +
    property.purchaseTaxEstimate +
    property.closingCosts +
    property.renovationCosts +
    property.furnitureCosts;

  const affordabilityGap = capitalResult.riskAdjustedCapital - upfrontCashNeeded;

  const affordabilityResult = calculateAffordability({
    ...profile,
    monthlyMortgagePayment: mortgageResult.monthlyPayment,
  });

  let monthlyCashFlow: number | null = null;
  let grossRentalIncome: number | null = null;

  if (property.intendedUse === 'INVESTMENT' && property.estimatedRent > 0) {
    grossRentalIncome = property.estimatedRent;
    const vacancyDeduction = grossRentalIncome * (property.vacancyPercent / 100);
    monthlyCashFlow =
      grossRentalIncome -
      vacancyDeduction -
      property.maintenanceMonthly -
      mortgageResult.monthlyPayment;
  }

  const viabilityStatus = determineViability(
    affordabilityGap,
    affordabilityResult.dtiRatio,
    mortgageResult.monthlyPayment,
    profile.paymentCeiling,
    affordabilityResult.monthlyPostPurchaseBuffer
  );

  return {
    totalCapital: capitalResult.totalCapital,
    liquidCapital: capitalResult.liquidCapital,
    usableCapital: capitalResult.usableCapital,
    riskAdjustedCapital: capitalResult.riskAdjustedCapital,
    downPayment: mortgageResult.downPayment,
    upfrontCashNeeded,
    affordabilityGap,
    loanAmount: mortgageResult.loanAmount,
    monthlyMortgagePayment: mortgageResult.monthlyPayment,
    weightedMonthlyIncome: affordabilityResult.weightedMonthlyIncome,
    totalMonthlyObligations: affordabilityResult.totalMonthlyObligations,
    dtiRatio: affordabilityResult.dtiRatio,
    dtiStatus: affordabilityResult.dtiStatus,
    monthlyPostPurchaseBuffer: affordabilityResult.monthlyPostPurchaseBuffer,
    monthlyHousingDelta: affordabilityResult.monthlyHousingDelta,
    monthlyCashFlow,
    grossRentalIncome,
    viabilityStatus,
    costBreakdown: {
      downPayment: mortgageResult.downPayment,
      purchaseTax: property.purchaseTaxEstimate,
      closingCosts: property.closingCosts,
      renovation: property.renovationCosts,
      furniture: property.furnitureCosts,
      total: upfrontCashNeeded,
    },
  };
}

function determineViability(
  affordabilityGap: number,
  dtiRatio: number,
  monthlyPayment: number,
  paymentCeiling: number,
  monthlyBuffer: number
): ViabilityStatus {
  if (affordabilityGap < 0) return 'NOT_AFFORDABLE';
  if (monthlyPayment > paymentCeiling) return 'NOT_AFFORDABLE';
  if (dtiRatio > 40 || monthlyBuffer < 2000) return 'HIGH_RISK';
  if (dtiRatio > 30 || monthlyBuffer < 5000 || affordabilityGap < 50000) return 'VIABLE_BUT_TIGHT';
  return 'VIABLE';
}

export function estimateBudgetRange(
  riskAdjustedCapital: number,
  comfortablePayment: number,
  interestRate: number = 4.5,
  mortgageYears: number = 30
): { min: number; max: number } {
  const monthlyRate = interestRate / 100 / 12;
  const numPayments = mortgageYears * 12;
  const factor = Math.pow(1 + monthlyRate, numPayments);

  const maxLoan = comfortablePayment * (factor - 1) / (monthlyRate * factor);
  const maxBudget = riskAdjustedCapital + maxLoan;
  const minBudget = maxBudget * 0.7;

  return {
    min: Math.round(minBudget / 10000) * 10000,
    max: Math.round(maxBudget / 10000) * 10000,
  };
}
