export interface EarningsData {
  symbol: string
  date: string
  revenueActual: number | null
  revenueEstimated: number | null
}

export interface TreasuryRates {
  date: string
  month1: number
  month2: number
  month3: number
  month6: number
  year1: number
  year2: number
  year3: number
  year5: number
  year7: number
  year10: number
  year20: number
  year30: number
}

export interface SharesFloatData {
  symbol: string
  date: string
  freeFloat: number
  floatShares: number
  outstandingShares: number
  source: string
}

export interface CompanyProfile {
  symbol: string
  companyName: string
  exchangeShortName: string
  description: string
  website: string
  country: string
  sector: string
  fullTimeEmployees: number
}

export interface MarketCapData {
  symbol: string
  date: string
  marketCap: number
}

export interface DividendData {
  date: string
  label: string
  adjDividend: number
  dividend: number
  recordDate: string
  paymentDate: string
  declarationDate: string
}

export async function fetchEarningsData(symbol: string): Promise<EarningsData[]> {
  try {
    const response = await fetch(`/api/earnings?symbol=${symbol}`)

    if (!response.ok) {
      throw new Error(`Failed to fetch earnings for ${symbol}`)
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error(`Error fetching earnings for ${symbol}:`, error)
    return []
  }
}

export async function fetchOutstandingShares(symbol: string): Promise<number | null> {
  try {
    const response = await fetch(`/api/shares?symbol=${symbol}`)

    if (!response.ok) {
      throw new Error(`Failed to fetch shares for ${symbol}`)
    }

    const data: SharesFloatData[] = await response.json()

    if (data.length > 0 && data[0].outstandingShares) {
      return data[0].outstandingShares
    }

    return null
  } catch (error) {
    console.error(`Error fetching shares for ${symbol}:`, error)
    return null
  }
}

export async function fetchTreasuryRates(): Promise<{ rates: TreasuryRates[]; averageRate: number }> {
  try {
    const response = await fetch("/api/treasury")

    if (!response.ok) {
      throw new Error("Failed to fetch treasury rates")
    }

    const data: TreasuryRates[] = await response.json()

    // Calculate average interest rate across all periods for the most recent date
    if (data.length > 0) {
      const latest = data[0]
      const rates = [
        latest.month1,
        latest.month2,
        latest.month3,
        latest.month6,
        latest.year1,
        latest.year2,
        latest.year3,
        latest.year5,
        latest.year7,
        latest.year10,
        latest.year20,
        latest.year30,
      ]
      const averageRate = rates.reduce((sum, rate) => sum + rate, 0) / rates.length / 100

      return { rates: data, averageRate }
    }

    return { rates: data, averageRate: 0 }
  } catch (error) {
    console.error("Error fetching treasury rates:", error)
    return { rates: [], averageRate: 0 }
  }
}

export async function fetchCompanyProfile(symbol: string): Promise<CompanyProfile | null> {
  try {
    const response = await fetch(`/api/profile?symbol=${symbol}`)

    if (!response.ok) {
      throw new Error(`Failed to fetch profile for ${symbol}`)
    }

    const data: CompanyProfile[] = await response.json()

    if (data.length > 0) {
      return data[0]
    }

    return null
  } catch (error) {
    console.error(`Error fetching profile for ${symbol}:`, error)
    return null
  }
}

export async function fetchMarketCap(symbol: string): Promise<number | null> {
  try {
    const response = await fetch(`/api/market-cap?symbol=${symbol}`)

    if (!response.ok) {
      throw new Error(`Failed to fetch market cap for ${symbol}`)
    }

    const data: MarketCapData[] = await response.json()

    if (data.length > 0 && data[0].marketCap) {
      return data[0].marketCap
    }

    return null
  } catch (error) {
    console.error(`Error fetching market cap for ${symbol}:`, error)
    return null
  }
}

export async function fetchDividendData(symbol: string): Promise<{
  latestDividend: DividendData | null
  annualYield: number | null
  frequency: string | null
}> {
  try {
    const response = await fetch(`/api/dividends?symbol=${symbol}`)

    if (!response.ok) {
      throw new Error(`Failed to fetch dividends for ${symbol}`)
    }

    const data: DividendData[] = await response.json()

    if (data.length === 0) {
      return { latestDividend: null, annualYield: null, frequency: null }
    }

    // Get the most recent dividend
    const latestDividend = data[0]

    // Calculate annual yield by summing last 4 dividends (if available)
    const last4Dividends = data.slice(0, 4)
    const annualDividend = last4Dividends.reduce((sum, d) => sum + d.dividend, 0)

    // Estimate frequency based on number of dividends in the past year
    const oneYearAgo = new Date()
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1)
    const dividendsInYear = data.filter((d) => new Date(d.date) >= oneYearAgo).length

    let frequency = null
    if (dividendsInYear >= 12) frequency = "Monthly"
    else if (dividendsInYear >= 4) frequency = "Quarterly"
    else if (dividendsInYear >= 2) frequency = "Semi-Annual"
    else if (dividendsInYear >= 1) frequency = "Annual"

    return {
      latestDividend,
      annualYield: annualDividend,
      frequency,
    }
  } catch (error) {
    console.error(`Error fetching dividends for ${symbol}:`, error)
    return { latestDividend: null, annualYield: null, frequency: null }
  }
}

export function calculateValuation(
  ticker: string,
  earningsData: EarningsData[],
  interestRate: number,
  outstandingShares: number | null,
) {
  // Filter for data with actual revenue in the current year
  const currentYear = new Date().getFullYear()
  const ytdData = earningsData.filter((d) => d.revenueActual !== null && new Date(d.date).getFullYear() === currentYear)

  if (ytdData.length === 0) {
    console.log(`No YTD revenue data for ${ticker}`)
    return null
  }

  if (!outstandingShares || outstandingShares === 0) {
    console.log(`No outstanding shares data for ${ticker}`)
    return null
  }

  // Calculate YTD revenue (sum of quarterly revenues)
  const ytdRevenue = ytdData.reduce((sum, d) => sum + (d.revenueActual || 0), 0)

  // Pro-rate based on quarters reported
  const quartersReported = ytdData.length
  const quarterlyRevenue = ytdRevenue / quartersReported

  const myValue = (quarterlyRevenue) / outstandingShares * interestRate

  return {
    ticker,
    ytdRevenue,
    quarterlyRevenue,
    interestRate,
    outstandingShares,
    myValue,
  }
}
