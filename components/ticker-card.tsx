"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calculator, ArrowUp, ArrowDown, Minus, Info } from "lucide-react"
import type { TickerValuation } from "@/lib/types"
import { CalculationModal } from "./calculation-modal"
import { CompanyInfoModal } from "./company-info-modal"
import { useState } from "react"

interface TickerCardProps {
  valuation: TickerValuation
  groupUpperBound: number
  groupLowerBound: number
}

export function TickerCard({ valuation, groupUpperBound, groupLowerBound }: TickerCardProps) {
  const { ticker, myValue, ytdRevenue, interestRate, outstandingShares } = valuation
  const [showCalculation, setShowCalculation] = useState(false)
  const [showCompanyInfo, setShowCompanyInfo] = useState(false)

  const isAboveUpper = myValue > groupUpperBound
  const isBelowLower = myValue < groupLowerBound
  const isWithinBounds = !isAboveUpper && !isBelowLower

  const formatInBillions = (value: number) => {
    return (value / 1_000_000_000).toFixed(2)
  }

  const getPositionBadge = () => {
    if (isAboveUpper) {
      return (
        <Badge variant="default" className="bg-chart-4 hover:bg-chart-4">
          <ArrowUp className="h-3 w-3 mr-1" />
          Above Average
        </Badge>
      )
    }
    if (isBelowLower) {
      return (
        <Badge variant="default" className="bg-chart-1 hover:bg-chart-1">
          <ArrowDown className="h-3 w-3 mr-1" />
          Below Average
        </Badge>
      )
    }
    return (
      <Badge variant="secondary">
        <Minus className="h-3 w-3 mr-1" />
        Within Range
      </Badge>
    )
  }

  return (
    <>
      <Card className="hover:border-primary transition-colors">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl font-bold">{ticker}</CardTitle>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" onClick={() => setShowCompanyInfo(true)} className="h-8 w-8">
                <Info className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" onClick={() => setShowCalculation(true)} className="h-8 w-8">
                <Calculator className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-center">{getPositionBadge()}</div>

          <div>
            <div className="text-sm text-muted-foreground mb-1">Revenue / Interest Rate</div>
            <div className="text-3xl font-bold text-primary">${formatInBillions(myValue)}B</div>
          </div>

          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">YTD Revenue:</span>
              <span className="font-mono">${ytdRevenue.toLocaleString("en-US", { maximumFractionDigits: 0 })}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Outstanding Shares:</span>
              <span className="font-mono">
                {outstandingShares.toLocaleString("en-US", { maximumFractionDigits: 0 })}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Interest Rate:</span>
              <span className="font-mono">{(interestRate * 100).toFixed(2)}%</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <CalculationModal valuation={valuation} open={showCalculation} onOpenChange={setShowCalculation} />
      <CompanyInfoModal ticker={ticker} open={showCompanyInfo} onOpenChange={setShowCompanyInfo} />
    </>
  )
}
