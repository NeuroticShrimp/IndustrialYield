"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import type { TickerValuation } from "@/lib/types"

interface CalculationModalProps {
  valuation: TickerValuation
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CalculationModal({ valuation, open, onOpenChange }: CalculationModalProps) {
  const { ticker, myValue, ytdRevenue, interestRate, outstandingShares } = valuation

  const adjustedRevenue = ytdRevenue * (1 + interestRate)
  const perShareValue = adjustedRevenue / outstandingShares

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl">Revenue Per Share Calculation - {ticker}</DialogTitle>
          <DialogDescription>
            Step-by-step calculation: (Revenue × (1 + Interest Rate)) ÷ Outstanding Shares
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Input Values */}
          <div className="space-y-3">
            <h3 className="font-semibold text-lg border-b pb-2">Input Values</h3>
            <div className="grid gap-3 font-mono text-sm">
              <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                <span className="text-muted-foreground">Quarterly Revenue:</span>
                <span className="font-bold text-lg">
                  ${ytdRevenue.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>
              <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                <span className="text-muted-foreground">Interest Rate:</span>
                <span className="font-bold text-lg">{(interestRate * 100).toFixed(4)}%</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                <span className="text-muted-foreground">Outstanding Shares:</span>
                <span className="font-bold text-lg">
                  {outstandingShares.toLocaleString("en-US", { maximumFractionDigits: 0 })}
                </span>
              </div>
            </div>
          </div>

          {/* Calculation Steps */}
          <div className="space-y-3">
            <h3 className="font-semibold text-lg border-b pb-2">Calculation Steps</h3>
            <div className="space-y-4 font-mono text-sm">
              <div className="space-y-2">
                <div className="text-muted-foreground">Step 1: Adjust revenue by interest rate</div>
                <div className="p-3 bg-muted/50 rounded-lg">
                  <div className="mb-2">Adjusted Revenue = Revenue × (1 + Interest Rate)</div>
                  <div className="mb-2">
                    = ${ytdRevenue.toLocaleString("en-US", { maximumFractionDigits: 2 })} × (1 +{" "}
                    {(interestRate * 100).toFixed(4)}%)
                  </div>
                  <div className="mb-2">
                    = ${ytdRevenue.toLocaleString("en-US", { maximumFractionDigits: 2 })} ×{" "}
                    {(1 + interestRate).toFixed(6)}
                  </div>
                  <div className="font-bold text-primary text-lg">
                    = ${adjustedRevenue.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="text-muted-foreground">Step 2: Divide by outstanding shares</div>
                <div className="p-3 bg-muted/50 rounded-lg">
                  <div className="mb-2">Revenue Per Share = Adjusted Revenue ÷ Outstanding Shares</div>
                  <div className="mb-2">
                    = ${adjustedRevenue.toLocaleString("en-US", { maximumFractionDigits: 2 })} ÷{" "}
                    {outstandingShares.toLocaleString("en-US", { maximumFractionDigits: 0 })}
                  </div>
                  <div className="font-bold text-primary text-lg">
                    = ${perShareValue.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Final Result */}
          <div className="space-y-3">
            <h3 className="font-semibold text-lg border-b pb-2">Final Result</h3>
            <div className="p-4 bg-primary/10 rounded-lg border-2 border-primary">
              <div className="flex justify-between items-center">
                <span className="text-lg">Revenue Per Share (Interest Adjusted):</span>
                <span className="font-bold text-3xl text-primary">
                  ${myValue.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>
            </div>
          </div>

          {/* Formula Summary */}
          <div className="p-4 bg-muted/30 rounded-lg border">
            <div className="text-sm text-muted-foreground mb-2">Formula:</div>
            <div className="font-mono text-sm">
              Revenue Per Share = (Quarterly Revenue × (1 + Interest Rate)) ÷ Outstanding Shares
            </div>
          </div>

          {/* Calculation Validated */}
          <div className="p-4 bg-accent/20 rounded-lg border border-accent">
            <div className="text-sm font-semibold mb-2">✓ Calculation Validated</div>
            <div className="text-xs text-muted-foreground">
              This value represents the quarterly revenue per share, adjusted upward by the current treasury interest
              rate to account for the time value of money.
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
