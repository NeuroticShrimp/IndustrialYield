"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { ExternalLink, Building2, Globe, MapPin, Users, TrendingUp, DollarSign } from "lucide-react"
import { useEffect, useState } from "react"
import { fetchCompanyProfile, fetchMarketCap, fetchDividendData, type CompanyProfile } from "@/lib/financial-api"

interface CompanyInfoModalProps {
  ticker: string
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CompanyInfoModal({ ticker, open, onOpenChange }: CompanyInfoModalProps) {
  const [profile, setProfile] = useState<CompanyProfile | null>(null)
  const [marketCap, setMarketCap] = useState<number | null>(null)
  const [dividendInfo, setDividendInfo] = useState<{
    latestDividend: any
    annualYield: number | null
    frequency: string | null
  } | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (open && ticker) {
      console.log(`[v0] Opening company info modal for ${ticker}`)
      setLoading(true)
      Promise.all([fetchCompanyProfile(ticker), fetchMarketCap(ticker), fetchDividendData(ticker)])
        .then(([profileData, marketCapData, dividendData]) => {
          console.log(`[v0] Company info loaded for ${ticker}:`, { profileData, marketCapData, dividendData })
          setProfile(profileData)
          setMarketCap(marketCapData)
          setDividendInfo(dividendData)
        })
        .finally(() => setLoading(false))
    }
  }, [open, ticker])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold flex items-center gap-2">
            <Building2 className="h-6 w-6" />
            {loading ? <Skeleton className="h-8 w-32" /> : profile?.companyName || ticker}
          </DialogTitle>
        </DialogHeader>

        {loading ? (
          <div className="space-y-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-20 w-full" />
          </div>
        ) : profile ? (
          <div className="space-y-6">
            {/* Exchange and Market Cap */}
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary" className="text-sm">
                {profile.exchangeShortName}
              </Badge>
              {marketCap && (
                <Badge variant="default" className="text-sm">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  Market Cap: ${(marketCap / 1e9).toFixed(2)}B
                </Badge>
              )}
            </div>

            {/* Dividend Information */}
            {dividendInfo?.latestDividend ? (
              <div className="border rounded-lg p-4 bg-muted/30">
                <div className="flex items-center gap-2 mb-3">
                  <DollarSign className="h-5 w-5 text-primary" />
                  <h3 className="font-semibold">Dividend Information</h3>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <div className="text-xs text-muted-foreground">Latest Dividend</div>
                    <div className="font-medium">${dividendInfo.latestDividend.dividend.toFixed(4)}</div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground">Adj. Dividend</div>
                    <div className="font-medium">${dividendInfo.latestDividend.adjDividend.toFixed(4)}</div>
                  </div>
                  {dividendInfo.annualYield !== null && (
                    <div>
                      <div className="text-xs text-muted-foreground">Annual Yield</div>
                      <div className="font-medium">${dividendInfo.annualYield.toFixed(4)}</div>
                    </div>
                  )}
                  {dividendInfo.frequency && (
                    <div>
                      <div className="text-xs text-muted-foreground">Frequency</div>
                      <div className="font-medium">{dividendInfo.frequency}</div>
                    </div>
                  )}
                </div>
              </div>
            ) : dividendInfo !== null ? (
              <div className="border rounded-lg p-4 bg-muted/30">
                <div className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">No dividend data available for this stock</span>
                </div>
              </div>
            ) : null}

            {/* Key Information Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <div className="text-sm text-muted-foreground">Country</div>
                  <div className="font-medium">{profile.country}</div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Building2 className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <div className="text-sm text-muted-foreground">Sector</div>
                  <div className="font-medium">{profile.sector}</div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Users className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <div className="text-sm text-muted-foreground">Employees</div>
                  <div className="font-medium">{profile.fullTimeEmployees.toLocaleString()}</div>
                </div>
              </div>

              {profile.website && (
                <div className="flex items-start gap-3">
                  <Globe className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <div className="text-sm text-muted-foreground">Website</div>
                    <a
                      href={profile.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-medium text-primary hover:underline flex items-center gap-1"
                    >
                      Visit Site
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                </div>
              )}
            </div>

            {/* Description */}
            {profile.description && (
              <div>
                <div className="text-sm text-muted-foreground mb-2">Company Description</div>
                <p className="text-sm leading-relaxed text-pretty">{profile.description}</p>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">No company information available for {ticker}</div>
        )}
      </DialogContent>
    </Dialog>
  )
}
