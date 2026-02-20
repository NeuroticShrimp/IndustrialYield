# Industrial Yield

A Next.js financial analysis dashboard for evaluating leading industrial stocks using a revenue-to-interest-rate valuation method inspired by Benjamin Graham and David Dodd's "Security Analysis."

## Overview

Industrial Yield calculates a comparative metric for industrial stocks by dividing quarterly revenue by the current national treasury interest rate. This provides a normalized view of stock valuations that accounts for the macroeconomic interest rate environment.

### Investment Strategy

**The core methodology:**
- Calculate: `(Quarterly Revenue × 4) / Current Treasury Rate = Yield Value`
- Compare individual stock yields to group average
- **Buy Signal**: Stock yield below average (undervalued)
- **Sell Signal**: Stock yield above average (overvalued)

**Important Notes:**
- This method is designed for **stable industrial stocks**, not speculative growth companies
- Focus on sectors like utilities, aerospace, construction equipment, water services, etc.
- Based on value investing principles from "Security Analysis" by Benjamin Graham and David Dodd
- ⚠️ **This tool is for educational purposes only. I am not qualified to provide financial advice.**

## Features

- **Portfolio Management**: Create and manage multiple ticker groups
- **Real-time Data**: Fetches current revenue, shares outstanding, and treasury rates
- **Visual Analysis**: Color-coded cards show stocks above/below/within range of group average
- **Configurable Tolerance**: Adjust percentage range (±10% default) for buy/sell zones
- **Persistent Storage**: Portfolio configurations saved to localStorage
- **Responsive Design**: Works on desktop and mobile devices

## Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router)
- **Language**: TypeScript (strict mode)
- **UI Components**: [shadcn/ui](https://ui.shadcn.com/) + [Radix UI](https://www.radix-ui.com/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Data Source**: Financial Modeling Prep API

## Getting Started

### Prerequisites

- Node.js 18+ (or Bun/pnpm)
- FMP API Key from [Financial Modeling Prep](https://site.financialmodelingprep.com/developer/docs)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/IndustrialYield.git
   cd IndustrialYield
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   bun install
   # or
   pnpm install
   ```

3. **Configure environment variables**
   
   Create a `.env.local` file in the root directory:
   ```env
   FMP_API_KEY=your_api_key_here
   ALLOWED_ORIGINS=http://localhost:3000
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

### Building for Production

```bash
npm run build
npm start
```

## Usage

### Adding Stocks to a Portfolio

1. Click **"Portfolio Configuration"** 
2. Enter a stock ticker symbol (e.g., `GE`, `CAT`, `BA`)
3. Click **Add Ticker** or press Enter
4. Repeat for all stocks you want to analyze

### Default Portfolio

The application includes a default "Top 20 Industrial Stocks" portfolio with:
- **Aerospace & Defense**: BA, RTX, LMT, GD, NOC
- **Industrial Conglomerates**: GE, GEV, HON
- **Heavy Equipment**: CAT, DE
- **Transportation**: UNP, ETN
- **Services**: WM, CTAS, RELX, TRI
- **Manufacturing**: PH, TT, MMM, ITW

### Adjusting Tolerance Range

Use the **Percentage Range** slider to set your buy/sell zones:
- **±10% (default)**: Conservative approach
- **±5%**: Tighter trading range
- **±20%**: Wider tolerance for long-term holds

### Interpreting Results

- **Above Average** (red): Stock may be overvalued relative to peers
- **Within Range** (yellow): Stock is fairly valued
- **Below Average** (green): Stock may be undervalued relative to peers

## Project Structure

```
/app
  /api
    /earnings         # Fetches revenue data
    /quote            # Fetches stock price data
    /treasury-rate    # Fetches current treasury rate
  layout.tsx          # Root layout
  page.tsx            # Main dashboard page
  globals.css         # Global styles

/components
  /ui                 # shadcn/ui base components
  ticker-card.tsx     # Individual stock display card
  
/lib
  financial-api.ts    # API client functions
  types.ts            # TypeScript type definitions
  utils.ts            # Utility functions (cn, formatters)

/public               # Static assets
```

## API Routes

### GET /api/earnings
Fetches quarterly revenue data for a ticker.
- Query params: `symbol` (required)
- Returns: `{ symbol, revenue, currency }`

### GET /api/quote
Fetches current stock quote data.
- Query params: `symbol` (required)
- Returns: `{ symbol, price, sharesOutstanding }`

### GET /api/treasury-rate
Fetches current 10-year treasury rate.
- Returns: `{ rate }`

## Development

### Code Style

- **TypeScript strict mode**: All code must be fully typed
- **Import organization**: Types first, then packages, then internal imports
- **File naming**: `kebab-case.tsx` for components, `kebab-case.ts` for utilities
- **Component naming**: `PascalCase` for components, `camelCase` for functions

### Available Commands

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Lint codebase
```

### Testing

⚠️ **Testing framework not yet configured.** Contributions welcome!

## Contributing

Contributions are welcome! Please follow these guidelines:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Disclaimer

**This tool is for educational and informational purposes only.**

- I am not a financial advisor and am not qualified to provide investment advice
- This methodology is based on historical value investing principles
- Past performance does not guarantee future results
- Always conduct your own research and consult with qualified financial professionals
- Use this tool at your own risk

## License

This project is open source and available under the MIT License.

## Acknowledgments

- Investment methodology inspired by **"Security Analysis"** by Benjamin Graham and David Dodd
- Financial data provided by [Financial Modeling Prep](https://site.financialmodelingprep.com/)
- UI components from [shadcn/ui](https://ui.shadcn.com/)

## Support

For issues, questions, or suggestions:
- Open an issue on GitHub
- Refer to the [AGENTS.md](./AGENTS.md) file for codebase documentation

---

Built with [Next.js](https://nextjs.org/) and [Tailwind CSS](https://tailwindcss.com/)
