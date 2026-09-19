export interface MortgageInput {
  propertyPrice: number
  downPayment: number
  annualRatePct: number
  years: number
}

export interface AmortizationRow {
  period: number
  year: number
  payment: number
  principal: number
  interest: number
  balance: number
}

export interface MortgageResult {
  loanAmount: number
  monthlyPayment: number
  totalPayment: number
  totalInterest: number
  schedule: AmortizationRow[]
  yearlySchedule: AmortizationRow[]
}

export function calculateMortgage({
  propertyPrice,
  downPayment,
  annualRatePct,
  years,
}: MortgageInput): MortgageResult {
  const loanAmount = Math.max(propertyPrice - downPayment, 0)
  const months = Math.max(Math.round(years * 12), 1)
  const monthlyRate = annualRatePct / 100 / 12

  const monthlyPayment =
    monthlyRate === 0
      ? loanAmount / months
      : (loanAmount * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -months))

  const schedule: AmortizationRow[] = []
  let balance = loanAmount

  for (let period = 1; period <= months; period++) {
    const interest = balance * monthlyRate
    let principal = monthlyPayment - interest
    if (period === months) {
      principal = balance
    }
    balance = Math.max(balance - principal, 0)

    schedule.push({
      period,
      year: Math.ceil(period / 12),
      payment: principal + interest,
      principal,
      interest,
      balance,
    })
  }

  const totalPayment = schedule.reduce((sum, row) => sum + row.payment, 0)
  const totalInterest = totalPayment - loanAmount

  const yearlyMap = new Map<number, AmortizationRow>()
  for (const row of schedule) {
    const existing = yearlyMap.get(row.year)
    if (existing) {
      existing.payment += row.payment
      existing.principal += row.principal
      existing.interest += row.interest
      existing.balance = row.balance
    } else {
      yearlyMap.set(row.year, { ...row })
    }
  }

  return {
    loanAmount,
    monthlyPayment: monthlyRate === 0 ? loanAmount / months : monthlyPayment,
    totalPayment,
    totalInterest,
    schedule,
    yearlySchedule: Array.from(yearlyMap.values()),
  }
}

export const formatCurrency = (value: number): string =>
  new Intl.NumberFormat('it-IT', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0,
  }).format(Number.isFinite(value) ? value : 0)

export const formatCurrencyPrecise = (value: number): string =>
  new Intl.NumberFormat('it-IT', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 2,
  }).format(Number.isFinite(value) ? value : 0)
