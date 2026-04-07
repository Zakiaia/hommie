export interface CapitalInput {
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
}

export interface CapitalBreakdown {
  liquidCapital: number;
  semiLiquidCapital: number;
  propertyEquity: number;
  potentialCapital: number;
  totalCapital: number;
  usableCapital: number;
  riskAdjustedCapital: number;
}

const SEMI_LIQUID_DISCOUNT = 0.85;
const PROPERTY_EQUITY_DISCOUNT = 0.7;
const POTENTIAL_DISCOUNT = 0.5;
const RISK_ADJUSTMENT = 0.9;

export function calculateCapital(input: CapitalInput): CapitalBreakdown {
  const liquidCapital = input.cashAmount + input.liquidSavings;

  const semiLiquidCapital =
    input.studyFunds +
    input.providentFunds +
    input.investmentPortfolio +
    input.deposits;

  const propertyEquity =
    input.ownsProperty && input.expectedPropertySale
      ? Math.max(0, input.currentPropertyValue - input.currentPropertyMortgage)
      : 0;

  const potentialCapital =
    input.familySupport +
    input.expectedBonus +
    input.futureAssetSale +
    input.futureFundRelease;

  const totalCapital =
    liquidCapital + semiLiquidCapital + propertyEquity + potentialCapital;

  const usableCapital =
    liquidCapital +
    semiLiquidCapital * SEMI_LIQUID_DISCOUNT +
    propertyEquity * PROPERTY_EQUITY_DISCOUNT +
    potentialCapital * POTENTIAL_DISCOUNT;

  const riskAdjustedCapital = usableCapital * RISK_ADJUSTMENT;

  return {
    liquidCapital,
    semiLiquidCapital,
    propertyEquity,
    potentialCapital,
    totalCapital,
    usableCapital,
    riskAdjustedCapital,
  };
}
