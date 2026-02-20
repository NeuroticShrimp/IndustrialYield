import { type NextRequest, NextResponse } from "next/server"

const API_KEY = process.env.FMP_API_KEY
const ALLOWED_ORIGINS = process.env.ALLOWED_ORIGINS?.split(",") || ["http://localhost:3000"]

function corsHeaders(origin: string | null) {
  const isAllowed = origin && ALLOWED_ORIGINS.includes(origin)
  return {
    "Access-Control-Allow-Origin": isAllowed ? origin : ALLOWED_ORIGINS[0],
    "Access-Control-Allow-Methods": "GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Max-Age": "86400",
  }
}

export async function OPTIONS(request: NextRequest) {
  return NextResponse.json({}, { headers: corsHeaders(request.headers.get("origin")) })
}

export async function GET(request: NextRequest) {
  const origin = request.headers.get("origin")
  const { searchParams } = new URL(request.url)
  const symbol = searchParams.get("symbol")

  if (!symbol) {
    return NextResponse.json({ error: "Symbol is required" }, { status: 400, headers: corsHeaders(origin) })
  }

  if (!API_KEY) {
    return NextResponse.json(
      { error: "API key not configured" },
      { status: 500, headers: corsHeaders(origin) }
    )
  }

  try {
    const response = await fetch(`https://financialmodelingprep.com/stable/profile?symbol=${symbol}&apikey=${API_KEY}`)

    if (!response.ok) {
      throw new Error(`Failed to fetch profile for ${symbol}`)
    }

    const data = await response.json()
    return NextResponse.json(data, { headers: corsHeaders(origin) })
  } catch (error) {
    console.error(`Error fetching profile for ${symbol}:`, error)
    return NextResponse.json({ error: "Failed to fetch profile data" }, { status: 500, headers: corsHeaders(origin) })
  }
}
