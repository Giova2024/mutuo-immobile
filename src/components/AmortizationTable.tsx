import { useState } from 'react'
import type { AmortizationRow } from '../lib/mortgage'
import { formatCurrencyPrecise } from '../lib/mortgage'

interface AmortizationTableProps {
  monthly: AmortizationRow[]
  yearly: AmortizationRow[]
}

export function AmortizationTable({ monthly, yearly }: AmortizationTableProps) {
  const [view, setView] = useState<'yearly' | 'monthly'>('yearly')
  const rows = view === 'yearly' ? yearly : monthly

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-800">
          Piano di ammortamento
          <span className="ml-2 hidden text-sm font-normal text-slate-500 print:inline">
            ({view === 'yearly' ? 'vista annuale' : 'vista mensile'})
          </span>
        </h2>
        <div className="flex rounded-lg border border-slate-200 bg-slate-50 p-1 text-sm print:hidden">
          <button
            type="button"
            onClick={() => setView('yearly')}
            className={`rounded-md px-3 py-1 transition ${
              view === 'yearly'
                ? 'bg-white shadow text-indigo-600 font-medium'
                : 'text-slate-500'
            }`}
          >
            Annuale
          </button>
          <button
            type="button"
            onClick={() => setView('monthly')}
            className={`rounded-md px-3 py-1 transition ${
              view === 'monthly'
                ? 'bg-white shadow text-indigo-600 font-medium'
                : 'text-slate-500'
            }`}
          >
            Mensile
          </button>
        </div>
      </div>

      <div className="max-h-96 overflow-auto rounded-xl border border-slate-200 print:max-h-none print:overflow-visible print:border-0">
        <table className="w-full min-w-[520px] border-collapse text-sm print:min-w-0 print:text-xs">
          <thead className="sticky top-0 bg-slate-100 text-slate-600 print:static">
            <tr>
              <th className="px-3 py-2 text-left font-medium">
                {view === 'yearly' ? 'Anno' : 'Rata n.'}
              </th>
              <th className="px-3 py-2 text-right font-medium">Rata</th>
              <th className="px-3 py-2 text-right font-medium">Capitale</th>
              <th className="px-3 py-2 text-right font-medium">Interessi</th>
              <th className="px-3 py-2 text-right font-medium">
                Debito residuo
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr
                key={row.period}
                className="border-t border-slate-100 odd:bg-white even:bg-slate-50/60 hover:bg-indigo-50/60 break-inside-avoid"
              >
                <td className="px-3 py-2 text-left text-slate-700">
                  {view === 'yearly' ? row.year : row.period}
                </td>
                <td className="px-3 py-2 text-right text-slate-700">
                  {formatCurrencyPrecise(row.payment)}
                </td>
                <td className="px-3 py-2 text-right text-indigo-600">
                  {formatCurrencyPrecise(row.principal)}
                </td>
                <td className="px-3 py-2 text-right text-orange-500">
                  {formatCurrencyPrecise(row.interest)}
                </td>
                <td className="px-3 py-2 text-right text-slate-500">
                  {formatCurrencyPrecise(row.balance)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
