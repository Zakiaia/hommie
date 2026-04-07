import { z } from 'zod';

export const step1Schema = z.object({
  primaryIncomeNet: z.coerce.number().min(0).optional(),
  partnerIncomeNet: z.coerce.number().min(0).optional(),
  variableIncome: z.coerce.number().min(0).optional(),
  employmentType: z.enum(['SALARIED', 'SELF_EMPLOYED', 'MIXED']).optional(),
  incomeStability: z.enum(['HIGH', 'MEDIUM', 'LOW']).optional(),
  expectedIncomeChange: z.enum(['INCREASE', 'STABLE', 'DECREASE']).optional(),
  freeText: z.string().optional(),
});

export const step2Schema = z.object({
  monthlyObligations: z.coerce.number().min(0).optional(),
  currentRent: z.coerce.number().min(0).optional(),
  fixedHouseholdExpenses: z.coerce.number().min(0).optional(),
  comfortablePayment: z.coerce.number().min(0).optional(),
  paymentCeiling: z.coerce.number().min(0).optional(),
  freeText: z.string().optional(),
});

export const step3Schema = z.object({
  cashAmount: z.coerce.number().min(0).default(0),
  liquidSavings: z.coerce.number().min(0).default(0),
  studyFunds: z.coerce.number().min(0).default(0),
  providentFunds: z.coerce.number().min(0).default(0),
  investmentPortfolio: z.coerce.number().min(0).default(0),
  deposits: z.coerce.number().min(0).default(0),
  ownsProperty: z.boolean().default(false),
  currentPropertyValue: z.coerce.number().min(0).default(0),
  currentPropertyMortgage: z.coerce.number().min(0).default(0),
  expectedPropertySale: z.boolean().default(false),
  familySupport: z.coerce.number().min(0).default(0),
  expectedBonus: z.coerce.number().min(0).default(0),
  futureAssetSale: z.coerce.number().min(0).default(0),
  futureFundRelease: z.coerce.number().min(0).default(0),
});

export const step4Schema = z.object({
  goal: z.enum(['RESIDENCE', 'INVESTMENT', 'MIXED', 'UNSURE']).optional(),
  timeline: z.enum(['SHORT', 'MEDIUM', 'LONG']).optional(),
  riskAppetite: z.enum(['LOW', 'MEDIUM', 'HIGH']).optional(),
  priority: z.enum(['STABILITY', 'FLEXIBILITY', 'UPSIDE', 'MONTHLY_CASH_FLOW']).optional(),
  freeText: z.string().optional(),
});

export const step5Schema = z.object({
  preferredAreas: z.string().optional(),
  propertyPreference: z.enum(['NEW_PROJECT', 'SECOND_HAND', 'NO_PREFERENCE']).optional(),
  budgetRangeMin: z.coerce.number().min(0).optional(),
  budgetRangeMax: z.coerce.number().min(0).optional(),
});

export const step6Schema = z.object({
  additionalContext: z.string().optional(),
});

export type Step1Data = z.infer<typeof step1Schema>;
export type Step2Data = z.infer<typeof step2Schema>;
export type Step3Data = z.infer<typeof step3Schema>;
export type Step4Data = z.infer<typeof step4Schema>;
export type Step5Data = z.infer<typeof step5Schema>;
export type Step6Data = z.infer<typeof step6Schema>;
