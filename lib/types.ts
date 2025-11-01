export interface TickerValuation {
  ticker: string
  ytdRevenue: number
  quarterlyRevenue: number
  interestRate: number
  outstandingShares: number // Added outstandingShares to the interface
  myValue: number
}
