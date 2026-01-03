"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { TickerCard } from "@/components/ticker-card"
import { Plus, X, TrendingUp, Trash2, FolderOpen, Save, ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react"
import { fetchEarningsData, fetchTreasuryRates, calculateValuation, fetchOutstandingShares } from "@/lib/financial-api"
import type { TickerValuation } from "@/lib/types"

interface TickerGroup {
  name: string
  tickers: string[]
  isDefault?: boolean
}

type SortOrder = "none" | "asc" | "desc"

const DEFAULT_GROUP: TickerGroup = {
  name: "Top 20 Industrial Stocks",
  tickers: [
    "GE",
    "RTX",
    "CAT",
    "BA",
    "GEV",
    "HON",
    "ETN",
    "UNP",
    "DE",
    "LMT",
    "PH",
    "TT",
    "WM",
    "GD",
    "NOC",
    "RELX",
    "CTAS",
    "MMM",
    "TRI",
    "ITW",
  ],
}

export default function FinancialDashboard() {
  const [groups, setGroups] = useState<TickerGroup[]>([{ ...DEFAULT_GROUP, isDefault: true }])
  const [currentGroupIndex, setCurrentGroupIndex] = useState(0)
  const [newGroupName, setNewGroupName] = useState("")
  const [showNewGroupInput, setShowNewGroupInput] = useState(false)

  const [newTicker, setNewTicker] = useState("")
  const [valuations, setValuations] = useState<TickerValuation[]>([])
  const [loading, setLoading] = useState(false)
  const [percentageRange, setPercentageRange] = useState(10)
  const [averageInterestRate, setAverageInterestRate] = useState(0)
  const [sortOrder, setSortOrder] = useState<SortOrder>("none")

  useEffect(() => {
    console.log("[v0] Loading groups from localStorage")
    const savedGroups = localStorage.getItem("financial-dashboard-groups")
    if (savedGroups) {
      try {
        const parsed = JSON.parse(savedGroups)
        console.log("[v0] Parsed saved groups:", parsed)
        if (Array.isArray(parsed)) {
          if (!parsed.some(g => g.isDefault)) {
            parsed.push({ ...DEFAULT_GROUP, isDefault: true })
          } else {
            // Check if the default group is missing any original tickers
            const defaultGroupIndex = parsed.findIndex(g => g.isDefault)
            if (defaultGroupIndex !== -1) {
              const defaultGroup = parsed[defaultGroupIndex]
              if (!DEFAULT_GROUP.tickers.every(t => defaultGroup.tickers.includes(t))) {
                parsed[defaultGroupIndex] = { ...DEFAULT_GROUP, isDefault: true }
              }
            }
          }
          if (parsed.length > 0) {
            setGroups(parsed)
          } else {
            setGroups([{ ...DEFAULT_GROUP, isDefault: true }])
          }
        } else {
          console.log("[v0] No valid saved groups, using default")
          setGroups([{ ...DEFAULT_GROUP, isDefault: true }])
        }
      } catch (error) {
        console.error("[v0] Error parsing saved groups:", error)
        setGroups([{ ...DEFAULT_GROUP, isDefault: true }])
      }
    } else {
      console.log("[v0] No saved groups found, using default")
      setGroups([{ ...DEFAULT_GROUP, isDefault: true }])
    }
  }, [])

  useEffect(() => {
    if (groups.length > 0) {
      console.log("[v0] Saving groups to localStorage:", groups)
      localStorage.setItem("financial-dashboard-groups", JSON.stringify(groups))
    }
  }, [groups])

  useEffect(() => {
    if (groups.length > 0 && groups[currentGroupIndex]?.tickers.length > 0) {
      loadData()
    }
  }, [currentGroupIndex, groups])

  const currentGroup = groups[currentGroupIndex]
  const tickers = currentGroup?.tickers || []

  const loadData = async () => {
    setLoading(true)
    try {
      const treasuryData = await fetchTreasuryRates()
      const avgRate = treasuryData.averageRate
      setAverageInterestRate(avgRate)

      const valuationPromises = tickers.map(async (ticker) => {
        const [earningsData, outstandingShares] = await Promise.all([
          fetchEarningsData(ticker),
          fetchOutstandingShares(ticker),
        ])
        return calculateValuation(ticker, earningsData, avgRate, outstandingShares)
      })

      const results = await Promise.all(valuationPromises)
      setValuations(results.filter((v) => v !== null) as TickerValuation[])
    } catch (error) {
      console.error("[v0] Error loading financial data:", error)
    } finally {
      setLoading(false)
    }
  }

  const addTicker = () => {
    const ticker = newTicker.trim().toUpperCase()
    if (ticker && !tickers.includes(ticker)) {
      const updatedGroups = [...groups]
      updatedGroups[currentGroupIndex].tickers = [...tickers, ticker]
      setGroups(updatedGroups)
      setNewTicker("")
    }
  }

  const removeTicker = (ticker: string) => {
    const updatedGroups = [...groups]
    updatedGroups[currentGroupIndex].tickers = tickers.filter((t) => t !== ticker)
    setGroups(updatedGroups)
  }

  const deleteAllTickers = () => {
    if (confirm(`Are you sure you want to delete all tickers from "${currentGroup.name}"?`)) {
      const updatedGroups = [...groups]
      updatedGroups[currentGroupIndex].tickers = []
      setGroups(updatedGroups)
      setValuations([])
    }
  }

  const createNewGroup = () => {
    const groupName = newGroupName.trim()
    if (groupName) {
      setGroups([...groups, { name: groupName, tickers: [] }])
      setCurrentGroupIndex(groups.length)
      setNewGroupName("")
      setShowNewGroupInput(false)
    }
  }

  const deleteGroup = (index: number) => {
    if (groups[index].isDefault) {
      alert("Cannot delete the default group.")
      return
    }
    if (groups.length === 1) {
      alert("Cannot delete the last group. Create a new group first.")
      return
    }
    if (confirm(`Are you sure you want to delete the group "${groups[index].name}"?`)) {
      const updatedGroups = groups.filter((_, i) => i !== index)
      setGroups(updatedGroups)
      if (currentGroupIndex >= updatedGroups.length) {
        setCurrentGroupIndex(updatedGroups.length - 1)
      }
    }
  }

  const toggleSort = () => {
    if (sortOrder === "none") {
      setSortOrder("desc") // Highest to lowest first
    } else if (sortOrder === "desc") {
      setSortOrder("asc") // Then lowest to highest
    } else {
      setSortOrder("none") // Then back to unsorted
    }
  }

  const getSortedValuations = () => {
    if (sortOrder === "none") {
      return valuations
    }

    const sorted = [...valuations].sort((a, b) => {
      if (sortOrder === "asc") {
        return a.myValue - b.myValue // Lowest to highest
      } else {
        return b.myValue - a.myValue // Highest to lowest
      }
    })

    return sorted
  }

  const displayValuations = getSortedValuations()

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="mx-auto max-w-7xl space-y-8">
        {/* Header */}
        <div className="space-y-4">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold tracking-tight text-balance">
              Leading Industrial Stocks with Interest Rates Analysis
            </h1>
            <p className="text-muted-foreground text-lg">Revenue with treasury adjustments</p>
          </div>

          <Card className="border-accent bg-accent/5">
            <CardContent className="pt-6">
              <div className="space-y-4 text-sm leading-relaxed">
                <p>
                  This application takes an input of "leading industrial stocks" as determined by the user. It
                  calculates the quarterly revenue divided by the national treasury interest rate for each stock, and
                  returns the group average as well as individual values for comparison.
                </p>
                <p>
                  <strong>Investment Strategy:</strong> If you are implementing this strategy you buy when stocks are
                  below the average and sell when stocks are above the average.
                </p>
                <p>
                  The stocks provided when using this method really should be industrial stocks, and not speculative
                  stocks. Think items like electricity, air planes, water, construction equipment.
                </p>
                <p className="text-muted-foreground italic">
                  I am not qualified to provide financial advice, this is based off a technique described in "Security
                  Analysis" by Benjamin Graham and David Dodd.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="border-accent">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FolderOpen className="h-5 w-5" />
              Portfolio Groups
            </CardTitle>
            <CardDescription>Manage different ticker portfolios</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap gap-2">
              {groups.map((group, index) => (
                 <div key={index} className="flex items-center gap-0">
                   <Button
                     variant={currentGroupIndex === index ? "default" : "outline"}
                     onClick={() => setCurrentGroupIndex(index)}
                     className="rounded-r-none h-10"
                   >
                    {group.name} ({group.tickers.length})
                  </Button>
                  {!group.isDefault && (
                    <Button
                      variant={currentGroupIndex === index ? "default" : "outline"}
                      size="icon"
                      onClick={() => deleteGroup(index)}
                      className="rounded-l-none border-l-0 h-10 w-10"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>

            {showNewGroupInput ? (
              <div className="flex gap-2">
                <Input
                  placeholder="Enter group name"
                  value={newGroupName}
                  onChange={(e) => setNewGroupName(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && createNewGroup()}
                  className="flex-1"
                />
                <Button onClick={createNewGroup} disabled={!newGroupName.trim()}>
                  <Save className="h-4 w-4 mr-2" />
                  Save
                </Button>
                <Button variant="outline" onClick={() => setShowNewGroupInput(false)}>
                  Cancel
                </Button>
              </div>
            ) : (
              <Button variant="outline" onClick={() => setShowNewGroupInput(true)}>
                <Plus className="h-4 w-4 mr-2" />
                New Group
              </Button>
            )}
          </CardContent>
        </Card>

        {/* Controls */}
        <Card className="border-accent">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Portfolio Configuration - {currentGroup?.name}
            </CardTitle>
            <CardDescription>Add or remove tickers to analyze</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input
                placeholder="Enter ticker symbol (e.g., AAPL)"
                value={newTicker}
                onChange={(e) => setNewTicker(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addTicker()}
                className="flex-1"
              />
              <Button onClick={addTicker} disabled={!newTicker.trim()}>
                <Plus className="h-4 w-4 mr-2" />
                Add Ticker
              </Button>
              <Button variant="destructive" onClick={deleteAllTickers} disabled={tickers.length === 0}>
                <Trash2 className="h-4 w-4 mr-2" />
                Delete All
              </Button>
            </div>

            <div className="flex flex-wrap gap-2">
              {tickers.map((ticker) => (
                <Badge key={ticker} variant="secondary" className="px-3 py-1.5 text-sm">
                  {ticker}
                  <button onClick={() => removeTicker(ticker)} className="ml-2 hover:text-destructive">
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>

            <div className="flex items-center gap-4">
              <label className="text-sm font-medium">Percentage Range:</label>
              <Input
                type="number"
                value={percentageRange}
                onChange={(e) => setPercentageRange(Number(e.target.value))}
                className="w-24"
                min="0"
                max="100"
              />
              <span className="text-sm text-muted-foreground">±{percentageRange}%</span>
            </div>

            <div className="flex items-center gap-2 text-sm">
              <span className="font-medium">Average Interest Rate:</span>
              <span className="text-primary font-mono">{(averageInterestRate * 100).toFixed(2)}%</span>
            </div>
          </CardContent>
        </Card>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
            <p className="mt-4 text-muted-foreground">Loading financial data...</p>
          </div>
        )}

        {!loading && displayValuations.length > 0 && (
          <>
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Ticker Analysis</h2>
              <Button variant="outline" onClick={toggleSort} className="gap-2 bg-transparent">
                {sortOrder === "none" && (
                  <>
                    <ArrowUpDown className="h-4 w-4" />
                    Sort by Value
                  </>
                )}
                {sortOrder === "desc" && (
                  <>
                    <ArrowDown className="h-4 w-4" />
                    Highest to Lowest
                  </>
                )}
                {sortOrder === "asc" && (
                  <>
                    <ArrowUp className="h-4 w-4" />
                    Lowest to Highest
                  </>
                )}
              </Button>
            </div>

            <Card className="border-primary bg-primary/5">
              <CardHeader>
                <CardTitle className="text-2xl">Group Average - Revenue / Interest Rate</CardTitle>
                <CardDescription>Average calculated value across all tickers</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center space-y-2">
                  <div className="text-5xl font-bold text-primary">
                    $
                    {(
                      displayValuations.reduce((sum, v) => sum + v.myValue, 0) /
                      displayValuations.length /
                      1_000_000_000
                    ).toFixed(2)}
                    B
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Based on {displayValuations.length} ticker{displayValuations.length !== 1 ? "s" : ""}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">Upper Bound (+{percentageRange}%)</p>
                    <p className="text-2xl font-bold text-green-600">
                      $
                      {(
                        ((displayValuations.reduce((sum, v) => sum + v.myValue, 0) / displayValuations.length) *
                          (1 + percentageRange / 100)) /
                        1_000_000_000
                      ).toFixed(2)}
                      B
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">Lower Bound (-{percentageRange}%)</p>
                    <p className="text-2xl font-bold text-chart-1">
                      $
                      {(
                        ((displayValuations.reduce((sum, v) => sum + v.myValue, 0) / displayValuations.length) *
                          (1 - percentageRange / 100)) /
                        1_000_000_000
                      ).toFixed(2)}
                      B
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {displayValuations.map((valuation) => (
                <TickerCard
                  key={valuation.ticker}
                  valuation={valuation}
                  groupUpperBound={
                    (displayValuations.reduce((sum, v) => sum + v.myValue, 0) / displayValuations.length) *
                    (1 + percentageRange / 100)
                  }
                  groupLowerBound={
                    (displayValuations.reduce((sum, v) => sum + v.myValue, 0) / displayValuations.length) *
                    (1 - percentageRange / 100)
                  }
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
