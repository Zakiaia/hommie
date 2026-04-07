export interface AffordabilityInput {
  primaryIncomeNet: number;
  partnerIncomeNet: number;
  variableIncome: number;
  monthlyObligations: number;
  currentRent: number;
  fixedHouseholdExpenses: number;
  comfortablePayment: number;
  paymentCeiling: number;
  monthlyMortgagePayment: number;
}

export interface AffordabilityResult {
  weightedMonthlyIncome: number;
  totalMonthlyObligations: number;
  dtiRatio: number;
  dtiStatus: 'healthy' | 'caution' | 'risky';
  monthlyPostPurchaseBuffer: number;
  monthlyHousingDelta: number;
}

const VARIABLE_INCOME_WEIGHT = 0.7;

export function calculateAffordability(input: AffordabilityInput): AffordabilityResult {
  const weightedMonthlyIncome =
    input.primaryIncomeNet +
    input.partnerIncomeNet +
    input.variableIncome * VARIABLE_INCOME_WEIGHT;

  const totalMonthlyObligations =
    input.monthlyObligations + input.fixedHouseholdExpenses;

  const dtiRatio =
    weightedMonthlyIncome > 0
      ? ((totalMonthlyObligations + input.monthlyMortgagePayment) / weightedMonthlyIncome) * 100
      : 100;

  let dtiStatus: 'healthy' | 'caution' | 'risky';
  if (dtiRatio < 30) dtiStatus = 'healthy';
  else if (dtiRatio < 40) dtiStatus = 'caution';
  else dtiStatus = 'risky';

  const monthlyPostPurchaseBuffer =
    weightedMonthlyIncome -
    totalMonthlyObligations -
    input.monthlyMortgagePayment;

  const monthlyHousingDelta = input.monthlyMortgagePayment - input.currentRent;

  return {
    weightedMonthlyIncome: Math.round(weightedMonthlyIncome),
    totalMonthlyObligations: Math.round(totalMonthlyObligations),
    dtiRatio: Math.round(dtiRatio * 10) / 10,
    dtiStatus,
    monthlyPostPurchaseBuffer: Math.round(monthlyPostPurchaseBuffer),
    monthlyHousingDelta: Math.round(monthlyHousingDelta),
  };
}
