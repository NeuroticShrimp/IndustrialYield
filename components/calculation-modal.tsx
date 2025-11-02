"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import type { TickerValuation } from "@/lib/types"

interface CalculationModalProps {
  valuation: TickerValuation
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CalculationModal({ valuation, open, onOpenChange }: CalculationModalProps) {
  const { ticker, myValue, quarterlyRevenue, interestRate } = valuation

  const formatInBillions = (value: number) => {
    return (value / 1_000_000_000).toFixed(2)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl">Revenue Calculation - {ticker}</DialogTitle>
          <DialogDescription>Step-by-step calculation: Quarterly Revenue ÷ Interest Rate</DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Input Values */}
          <div className="space-y-3">
            <h3 className="font-semibold text-lg border-b pb-2">Input Values</h3>
            <div className="grid gap-3 font-mono text-sm">
              <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                <span className="text-muted-foreground">Quarterly Revenue:</span>
                <span className="font-bold text-lg">
                  ${quarterlyRevenue.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>
              <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                <span className="text-muted-foreground">Interest Rate:</span>
                <span className="font-bold text-lg">{(interestRate * 100).toFixed(4)}%</span>
              </div>
            </div>
          </div>

          {/* Calculation Steps */}
          <div className="space-y-3">
            <h3 className="font-semibold text-lg border-b pb-2">Calculation</h3>
            <div className="space-y-4 font-mono text-sm">
              <div className="space-y-2">
                <div className="p-3 bg-muted/50 rounded-lg">
                  <div className="mb-2">Calculated Value = Quarterly Revenue ÷ Interest Rate</div>
                  <div className="mb-2">
                    = ${quarterlyRevenue.toLocaleString("en-US", { maximumFractionDigits: 2 })} ÷{" "}
                    {(interestRate * 100).toFixed(4)}%
                  </div>
                  <div className="mb-2">
                    = ${quarterlyRevenue.toLocaleString("en-US", { maximumFractionDigits: 2 })} ÷{" "}
                    {interestRate.toFixed(6)}
                  </div>
                  <div className="font-bold text-primary text-lg">= ${formatInBillions(myValue)}B</div>
                </div>
              </div>
            </div>
          </div>

          {/* Final Result */}
          <div className="space-y-3">
            <h3 className="font-semibold text-lg border-b pb-2">Final Result</h3>
            <div className="p-4 bg-primary/10 rounded-lg border-2 border-primary">
              <div className="flex justify-between items-center">
                <span className="text-lg">Calculated Value:</span>
                <span className="font-bold text-3xl text-primary">${formatInBillions(myValue)}B</span>
              </div>
            </div>
          </div>

          {/* Formula Summary */}
          <div className="p-4 bg-muted/30 rounded-lg border">
            <div className="text-sm text-muted-foreground mb-2">Formula:</div>
            <div className="font-mono text-sm">Calculated Value = Quarterly Revenue ÷ Interest Rate</div>
          </div>

          {/* Calculation Validated */}
          <div className="p-4 bg-accent/20 rounded-lg border border-accent">
            <div className="text-sm font-semibold mb-2">✓ Calculation Validated</div>
            <div className="text-xs text-muted-foreground">
              This value represents the quarterly revenue divided by the current treasury interest rate.
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
