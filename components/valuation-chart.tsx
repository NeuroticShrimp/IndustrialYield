"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts"
import type { TickerValuation } from "@/lib/types"

interface ValuationChartProps {
  valuations: TickerValuation[]
  percentageRange: number
}

export function ValuationChart({ valuations, percentageRange }: ValuationChartProps) {
  const chartData = valuations.map((v) => ({
    ticker: v.ticker,
    value: Number(v.myValue.toFixed(2)),
    upper: Number((v.myValue * (1 + percentageRange / 100)).toFixed(2)),
    lower: Number((v.myValue * (1 - percentageRange / 100)).toFixed(2)),
    ytdRevenue: Number(v.ytdRevenue.toFixed(2)),
  }))

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {/* Bar Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Valuation Comparison</CardTitle>
          <CardDescription>Calculated values with range bands</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis dataKey="ticker" className="text-xs" />
              <YAxis className="text-xs" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                }}
              />
              <Legend />
              <Bar dataKey="lower" fill="hsl(var(--chart-1))" name="Lower Bound" />
              <Bar dataKey="value" fill="hsl(var(--chart-3))" name="Calculated Value" />
              <Bar dataKey="upper" fill="hsl(var(--chart-4))" name="Upper Bound" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Line Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Value vs YTD Revenue</CardTitle>
          <CardDescription>Comparison of calculated values and actual revenues</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={350}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis dataKey="ticker" className="text-xs" />
              <YAxis className="text-xs" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="value"
                stroke="hsl(var(--chart-3))"
                strokeWidth={2}
                name="Calculated Value"
                dot={{ r: 4 }}
              />
              <Line
                type="monotone"
                dataKey="ytdRevenue"
                stroke="hsl(var(--chart-2))"
                strokeWidth={2}
                name="YTD Revenue"
                dot={{ r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )
}
