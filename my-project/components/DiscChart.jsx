import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"
import { ChartContainer, ChartTooltip } from "@/components/ui/chart"

export default function DISCChart({ dScore, iScore, sScore, cScore }) {
  const chartData = [
    {
      trait: "Dominance",
      score: dScore,
      fill: "hsl(var(--chart-1))",
      description: "Leadership & Decision Making",
    },
    {
      trait: "Influence",
      score: iScore,
      fill: "hsl(var(--chart-2))",
      description: "Communication & Social Skills",
    },
    {
      trait: "Steadiness",
      score: sScore,
      fill: "hsl(var(--chart-3))",
      description: "Patience & Consistency",
    },
    {
      trait: "Compliance",
      score: cScore,
      fill: "hsl(var(--chart-4))",
      description: "Rule Following & Accuracy",
    },
  ]

  const chartConfig = {
    score: {
      label: "Score",
    },
    Dominance: {
      label: "Dominance (D)",
      color: "hsl(var(--chart-1))",
    },
    Influence: {
      label: "Influence (I)",
      color: "hsl(var(--chart-2))",
    },
    Steadiness: {
      label: "Steadiness (S)",
      color: "hsl(var(--chart-3))",
    },
    Compliance: {
      label: "Compliance (C)",
      color: "hsl(var(--chart-4))",
    },
  }

  return (
    <div className="scale-90 max-w-xl mx-auto">
      <ChartContainer config={chartConfig} className="min-h-[250px]">
        <BarChart
          data={chartData}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="trait"
            tickLine={false}
            tickMargin={10}
            axisLine={false}
            tickFormatter={(value) => value.charAt(0)}
          />
          <YAxis
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => value}
            domain={[0, 28]} // adjust based on max score
            allowDecimals={false}
          />
          <ChartTooltip
            cursor={false}
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                const data = payload[0].payload
                return (
                  <div className="rounded-lg border bg-background p-3 shadow-md">
                    <div className="font-medium">
                      {data.trait} ({data.trait.charAt(0)})
                    </div>
                    <div className="text-sm text-muted-foreground">{data.description}</div>
                    <div className="font-bold text-lg">{data.score}</div>
                  </div>
                )
              }
              return null
            }}
          />
          <Bar dataKey="score" radius={4} />
        </BarChart>
      </ChartContainer>
    </div>
  )
}
