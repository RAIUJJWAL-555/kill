"use client"

import {
  LineChart,
  Line,
  ResponsiveContainer,
} from "recharts"

interface SparklineCellProps {
  kolId: string
  roiValues: number[]
}

export function SparklineCell({ roiValues }: SparklineCellProps) {
  if (roiValues.length === 0) return null

  const data = roiValues.map((v, i) => ({ i, v }))
  const isPositive = roiValues[roiValues.length - 1] >= roiValues[0]

  return (
    <div className="h-8 w-20">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <Line
            type="monotone"
            dataKey="v"
            stroke={isPositive ? "#34d399" : "#f87171"}
            strokeWidth={1.5}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
