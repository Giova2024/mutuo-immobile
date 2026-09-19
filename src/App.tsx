import { useMemo, useState } from 'react'
import { DonutChart } from './components/DonutChart'
import { AmortizationTable } from './components/AmortizationTable'
import {
  calculateMortgage,
  formatCurrency,
  formatCurrencyPrecise,
} from './lib/mortgage'

function App() {
  const [propertyPrice, setPropertyPrice] = useState(250000)
  const [downPayment, setDownPayment] = useState(50000)
  const [annualRatePct, setAnnualRatePct] = useState(3.5)
  const [years, setYears] = useState(25)

  const result = useMemo(
    () =>
      calculateMortgage({
        propertyPrice,
        downPayment,
        annualRatePct,
        years,
      }),
    [propertyPrice, downPayment, annualRatePct, years],
  )

  const downPaymentPct =
    propertyPrice > 0 ? Math.round((downPayment / propertyPrice) * 100) : 0

  const loanToValueWarning = downPaymentPct < 20
  const generatedOn = useMemo(
    () => new Date().toLocaleDateString('it-IT', { dateStyle: 'long' }),
    [],
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-orange-50 py-8 px-4 text-slate-800 print:bg-white print:py-0">
      <div className="mx-auto max-w-5xl">
        <header className="mb-8 text-center print:mb-4">
          <div className="mb-2 flex items-center justify-center gap-3 print:hidden">
            <p className="inline-block rounded-full bg-indigo-100 px-3 py-1 text-xs font-medium tracking-wide text-indigo-600 uppercase">
              Calcolatore mutuo
            </p>
            <button
              type="button"
              onClick={() => window.print()}
              className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-600 shadow-sm transition hover:border-indigo-300 hover:text-indigo-600"
            >
              <PrinterIcon />
              Stampa / Esporta PDF
            </button>
          </div>
          <h1 className="text-3xl font-bold text-slate-900 sm:text-4xl print:text-2xl">
            Calcola la rata del tuo mutuo casa
          </h1>
          <p className="mx-auto mt-2 max-w-xl text-slate-500 print:hidden">
            Stima rata mensile, interessi totali e piano di ammortamento per
            l'acquisto della tua abitazione.
          </p>
          <p className="hidden text-xs text-slate-400 print:mt-1 print:block">
            Simulazione generata il {generatedOn}
          </p>
        </header>

        <div className="hidden grid-cols-3 gap-x-8 gap-y-1 border-b border-slate-200 pb-4 mb-4 text-sm print:grid">
          <p>
            <span className="font-medium text-slate-600">
              Prezzo immobile:
            </span>{' '}
            {formatCurrency(propertyPrice)}
          </p>
          <p>
            <span className="font-medium text-slate-600">
              Acconto / anticipo:
            </span>{' '}
            {formatCurrency(downPayment)} ({downPaymentPct}%)
          </p>
          <p>
            <span className="font-medium text-slate-600">
              Importo mutuo:
            </span>{' '}
            {formatCurrency(result.loanAmount)}
          </p>
          <p>
            <span className="font-medium text-slate-600">
              Tasso d'interesse annuo:
            </span>{' '}
            {annualRatePct.toFixed(2)}%
          </p>
          <p>
            <span className="font-medium text-slate-600">Durata:</span>{' '}
            {years} anni
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-5 print:block">
          <section className="lg:col-span-2 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm print:hidden">
            <h2 className="mb-5 text-lg font-semibold text-slate-800">
              Dati del mutuo
            </h2>

            <FieldGroup
              label="Prezzo immobile"
              value={propertyPrice}
              onChange={setPropertyPrice}
              min={20000}
              max={2000000}
              step={5000}
              display={formatCurrency(propertyPrice)}
            />

            <FieldGroup
              label="Acconto / anticipo"
              value={downPayment}
              onChange={setDownPayment}
              min={0}
              max={propertyPrice}
              step={1000}
              display={`${formatCurrency(downPayment)} (${downPaymentPct}%)`}
            />

            <FieldGroup
              label="Tasso d'interesse annuo"
              value={annualRatePct}
              onChange={setAnnualRatePct}
              min={0}
              max={10}
              step={0.05}
              display={`${annualRatePct.toFixed(2)}%`}
            />

            <FieldGroup
              label="Durata"
              value={years}
              onChange={setYears}
              min={5}
              max={40}
              step={1}
              display={`${years} anni`}
            />

            {loanToValueWarning && (
              <p className="mt-2 rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-700">
                L'anticipo è inferiore al 20% del prezzo: molte banche
                richiedono un anticipo minimo del 20% per condizioni
                standard.
              </p>
            )}

            <div className="mt-5 rounded-xl bg-slate-50 p-4 text-sm text-slate-600">
              Importo mutuo richiesto
              <div className="text-xl font-semibold text-slate-900">
                {formatCurrency(result.loanAmount)}
              </div>
            </div>
          </section>

          <section className="lg:col-span-3 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm print:border-0 print:p-0 print:shadow-none">
            <h2 className="mb-5 text-lg font-semibold text-slate-800 print:hidden">
              Risultato
            </h2>

            <div className="grid gap-4 sm:grid-cols-3 print:grid-cols-3 print:break-inside-avoid">
              <ResultCard
                label="Rata mensile"
                value={formatCurrencyPrecise(result.monthlyPayment)}
                accent="indigo"
              />
              <ResultCard
                label="Interessi totali"
                value={formatCurrency(result.totalInterest)}
                accent="orange"
              />
              <ResultCard
                label="Totale rimborsato"
                value={formatCurrency(result.totalPayment)}
                accent="slate"
              />
            </div>

            <div className="mt-6 flex justify-center rounded-xl border border-slate-100 bg-slate-50/50 py-6 print:break-inside-avoid print:border print:py-4">
              <DonutChart
                capital={result.loanAmount}
                interest={result.totalInterest}
              />
            </div>
          </section>
        </div>

        <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm print:mt-4 print:border-0 print:p-0 print:shadow-none">
          <AmortizationTable
            monthly={result.schedule}
            yearly={result.yearlySchedule}
          />
        </section>

        <footer className="mt-8 text-center text-xs text-slate-400 print:mt-4">
          I valori calcolati sono indicativi e non costituiscono un'offerta
          vincolante. Rivolgiti alla tua banca per una simulazione ufficiale.
        </footer>
      </div>
    </div>
  )
}

interface FieldGroupProps {
  label: string
  value: number
  onChange: (value: number) => void
  min: number
  max: number
  step: number
  display: string
}

function FieldGroup({
  label,
  value,
  onChange,
  min,
  max,
  step,
  display,
}: FieldGroupProps) {
  return (
    <div className="mb-5">
      <div className="mb-1 flex items-center justify-between">
        <label className="text-sm font-medium text-slate-600">{label}</label>
        <span className="text-sm font-semibold text-slate-900">
          {display}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full cursor-pointer"
      />
      <input
        type="number"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-1.5 text-sm focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100"
      />
    </div>
  )
}

interface ResultCardProps {
  label: string
  value: string
  accent: 'indigo' | 'orange' | 'slate'
}

const accentStyles: Record<ResultCardProps['accent'], string> = {
  indigo: 'bg-indigo-50 text-indigo-700',
  orange: 'bg-orange-50 text-orange-700',
  slate: 'bg-slate-50 text-slate-700',
}

function ResultCard({ label, value, accent }: ResultCardProps) {
  return (
    <div className={`rounded-xl p-4 ${accentStyles[accent]}`}>
      <p className="text-xs font-medium uppercase tracking-wide opacity-70">
        {label}
      </p>
      <p className="mt-1 text-xl font-bold break-words">{value}</p>
    </div>
  )
}

function PrinterIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="14"
      height="14"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <polyline points="6 9 6 2 18 2 18 9" />
      <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
      <rect x="6" y="14" width="12" height="8" />
    </svg>
  )
}

export default App
