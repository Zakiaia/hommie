export interface MortgageInput {
  propertyPrice: number;
  ltvPercent: number;
  annualInterestRate: number;
  mortgageYears: number;
}

export interface MortgageResult {
  loanAmount: number;
  downPayment: number;
  monthlyPayment: number;
  totalInterest: number;
  totalPayment: number;
}

export function calculateMortgage(input: MortgageInput): MortgageResult {
  const loanAmount = input.propertyPrice * (input.ltvPercent / 100);
  const downPayment = input.propertyPrice - loanAmount;

  const monthlyRate = input.annualInterestRate / 100 / 12;
  const numPayments = input.mortgageYears * 12;

  let monthlyPayment: number;
  if (monthlyRate === 0) {
    monthlyPayment = loanAmount / numPayments;
  } else {
    // Standard amortization: M = P * [r(1+r)^n] / [(1+r)^n - 1]
    const factor = Math.pow(1 + monthlyRate, numPayments);
    monthlyPayment = loanAmount * (monthlyRate * factor) / (factor - 1);
  }

  const totalPayment = monthlyPayment * numPayments;
  const totalInterest = totalPayment - loanAmount;

  return {
    loanAmount,
    downPayment,
    monthlyPayment: Math.round(monthlyPayment),
    totalInterest: Math.round(totalInterest),
    totalPayment: Math.round(totalPayment),
  };
}
