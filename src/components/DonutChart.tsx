interface DonutChartProps {
  capital: number
  interest: number
}

const SIZE = 180
const STROKE = 26
const RADIUS = (SIZE - STROKE) / 2
const CIRCUMFERENCE = 2 * Math.PI * RADIUS

export function DonutChart({ capital, interest }: DonutChartProps) {
  const total = capital + interest
  const capitalRatio = total > 0 ? capital / total : 0
  const capitalLength = CIRCUMFERENCE * capitalRatio
  const interestLength = CIRCUMFERENCE - capitalLength

  const capitalPct = Math.round(capitalRatio * 100)
  const interestPct = 100 - capitalPct

  return (
    <div className="flex flex-col items-center gap-4">
      <svg
        width={SIZE}
        height={SIZE}
        viewBox={`0 0 ${SIZE} ${SIZE}`}
        className="-rotate-90"
      >
        <circle
          cx={SIZE / 2}
          cy={SIZE / 2}
          r={RADIUS}
          fill="none"
          stroke="#fb923c"
          strokeWidth={STROKE}
          strokeDasharray={`${interestLength} ${CIRCUMFERENCE}`}
        />
        <circle
          cx={SIZE / 2}
          cy={SIZE / 2}
          r={RADIUS}
          fill="none"
          stroke="#4f46e5"
          strokeWidth={STROKE}
          strokeDasharray={`${capitalLength} ${CIRCUMFERENCE}`}
          strokeDashoffset={-interestLength}
        />
      </svg>
      <div className="flex gap-6 text-sm">
        <span className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-full bg-indigo-600" />
          Capitale {capitalPct}%
        </span>
        <span className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-full bg-orange-400" />
          Interessi {interestPct}%
        </span>
      </div>
    </div>
  )
}
