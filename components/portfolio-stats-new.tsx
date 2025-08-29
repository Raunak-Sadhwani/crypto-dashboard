"use client"

import { useState, useEffect } from "react"
import { MoreVertical, TrendingUp, TrendingDown, Loader2 } from "lucide-react"
import { Line, LineChart, ResponsiveContainer, CartesianGrid, XAxis, YAxis } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { getCryptoPriceHistory, getGlobalMarketData, formatPrice, formatPercentageChange, formatMarketCap } from "@/lib/crypto-api"

interface ChartData {
  date: string;
  price: number;
  volume: number;
}

interface GlobalData {
  totalMarketCap: number;
  totalVolume: number;
  btcDominance: number;
  marketCapChange24h: number;
}

export default function PortfolioStats() {
  const [activeTab, setActiveTab] = useState("1W")
  const [chartData, setChartData] = useState<ChartData[]>([])
  const [globalData, setGlobalData] = useState<GlobalData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const timeframes = {
    "1D": 1,
    "1W": 7,
    "1M": 30,
    "3M": 90,
    "1Y": 365
  }

  // Fetch Bitcoin price data for the chart (representing overall crypto market)
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        setError(null)

        // Fetch Bitcoin price history for chart
        const days = timeframes[activeTab as keyof typeof timeframes]
        const priceHistory = await getCryptoPriceHistory('bitcoin', 'usd', days)
        
        // Check if we have valid price history data
        if (!priceHistory || !priceHistory.prices || !Array.isArray(priceHistory.prices) || priceHistory.prices.length === 0) {
          console.error('Invalid price history data:', priceHistory)
          throw new Error('No price history data available')
        }
        
        console.log('Price history received:', {
          pricesLength: priceHistory.prices.length,
          firstPrice: priceHistory.prices[0],
          hasVolumes: !!(priceHistory.total_volumes)
        })
        
        // Transform data for chart with proper null checks
        const transformedData = priceHistory.prices
          .filter(price => price && Array.isArray(price) && price.length >= 2 && price[0] && price[1])
          .map((price, index) => ({
            date: new Date(price[0]).toLocaleDateString('en-US', { 
              month: 'short', 
              day: 'numeric' 
            }),
            price: typeof price[1] === 'number' ? price[1] : 0,
            volume: (priceHistory.total_volumes && 
                    priceHistory.total_volumes[index] && 
                    Array.isArray(priceHistory.total_volumes[index]) &&
                    typeof priceHistory.total_volumes[index][1] === 'number') 
                    ? priceHistory.total_volumes[index][1] : 0
          }))

        console.log('Transformed chart data:', {
          length: transformedData.length,
          first: transformedData[0],
          last: transformedData[transformedData.length - 1]
        })

        if (transformedData.length === 0) {
          throw new Error('No valid price data to display')
        }

        setChartData(transformedData.slice(-20)) // Last 20 data points for better visualization

        // Fetch global market data
        const globalMarketData = await getGlobalMarketData()
        
        // Set global data with proper fallbacks
        setGlobalData({
          totalMarketCap: globalMarketData?.total_market_cap?.usd || 0,
          totalVolume: globalMarketData?.total_volume?.usd || 0,
          btcDominance: globalMarketData?.market_cap_percentage?.btc || 0,
          marketCapChange24h: globalMarketData?.market_cap_change_percentage_24h_usd || 0
        })

      } catch (err) {
        console.error('Error fetching crypto data:', err)
        setError('Failed to fetch market data')
        
        // Set fallback chart data if no data is available
        if (!chartData || chartData.length === 0) {
          const fallbackChartData = []
          const now = Date.now()
          const dayMs = 24 * 60 * 60 * 1000
          const basePrice = 67000
          
          for (let i = 19; i >= 0; i--) {
            const timestamp = now - (i * dayMs)
            const price = basePrice + (Math.random() - 0.5) * 3000
            fallbackChartData.push({
              date: new Date(timestamp).toLocaleDateString('en-US', { 
                month: 'short', 
                day: 'numeric' 
              }),
              price,
              volume: 25000000000 + (Math.random() - 0.5) * 5000000000
            })
          }
          setChartData(fallbackChartData)
        }
        
        // Set fallback global data if not already set
        if (!globalData || globalData.totalMarketCap === 0) {
          setGlobalData({
            totalMarketCap: 2890123456789,
            totalVolume: 89012345678,
            btcDominance: 52.3,
            marketCapChange24h: 2.34
          })
        }
      } finally {
        setLoading(false)
      }
    }

    fetchData()
    
    // Set up auto-refresh every 30 seconds
    const interval = setInterval(fetchData, 30000)
    return () => clearInterval(interval)
  }, [activeTab])

  if (loading) {
    return (
      <div className="bg-card rounded-lg border border-border p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold">Market Overview</h2>
          <Loader2 className="h-5 w-5 text-muted-foreground animate-spin" />
        </div>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-card rounded-lg border border-border p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold">Market Overview</h2>
          <MoreVertical className="h-5 w-5 text-muted-foreground" />
        </div>
        <div className="text-center text-muted-foreground py-8">
          <p>{error}</p>
          <p className="text-sm mt-2">Please check your internet connection</p>
        </div>
      </div>
    )
  }

  const latestPrice = chartData[chartData.length - 1]?.price || 0
  const marketCapChange = globalData?.marketCapChange24h || 0
  const isPositive = marketCapChange >= 0

  return (
    <div className="bg-card rounded-lg border border-border p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold">Market Overview</h2>
        <div className="flex items-center gap-2">
          <div className="flex items-center text-xs">
            {isPositive ? (
              <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
            ) : (
              <TrendingDown className="h-3 w-3 text-red-500 mr-1" />
            )}
            <span className={isPositive ? "text-green-500" : "text-red-500"}>
              {formatPercentageChange(marketCapChange).formatted}
            </span>
          </div>
          <MoreVertical className="h-5 w-5 text-muted-foreground" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <div className="text-xs text-muted-foreground">Total Market Cap</div>
          <div className="text-lg font-bold">
            {globalData ? formatMarketCap(globalData.totalMarketCap) : '--'}
          </div>
        </div>
        <div>
          <div className="text-xs text-muted-foreground">24h Volume</div>
          <div className="text-lg font-bold">
            {globalData ? formatMarketCap(globalData.totalVolume) : '--'}
          </div>
        </div>
        <div>
          <div className="text-xs text-muted-foreground">BTC Dominance</div>
          <div className="text-sm font-medium">
            {globalData ? `${globalData.btcDominance.toFixed(1)}%` : '--'}
          </div>
        </div>
        <div>
          <div className="text-xs text-muted-foreground">BTC Price</div>
          <div className="text-sm font-medium">
            {formatPrice(latestPrice)}
          </div>
        </div>
      </div>

      <div className="h-[200px] mb-4">
        <ChartContainer
          config={{
            price: {
              label: "BTC Price",
              color: "hsl(var(--chart-1))",
            },
            volume: {
              label: "Volume",
              color: "hsl(var(--chart-2))",
            //   area: true,
            //   opacity: 0.2,
            },
          }}
        >
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 12 }}
                tickLine={false}
                axisLine={false}
              />
              <YAxis hide />
              <ChartTooltip
                content={<ChartTooltipContent />}
                formatter={(value, name) => {
                  if (name === 'price') {
                    return [formatPrice(Number(value)), 'BTC Price']
                  }
                  return [formatMarketCap(Number(value)), 'Volume']
                }}
              />
              <Line
                type="monotone"
                dataKey="price"
                stroke="var(--color-price)"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </div>

      <div className="flex gap-1">
        {Object.keys(timeframes).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-3 py-1 text-xs rounded-md transition-colors ${
              activeTab === tab
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground hover:bg-muted"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>
      
      <div className="mt-2 text-xs text-muted-foreground text-center">
        Data updates every 30 seconds • Powered by CoinGecko
      </div>
    </div>
  )
}
