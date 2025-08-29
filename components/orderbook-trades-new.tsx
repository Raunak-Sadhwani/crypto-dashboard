"use client"

import { useState, useEffect } from "react"
import { MoreVertical, TrendingUp, TrendingDown, Loader2, BarChart3 } from "lucide-react"
import { getTopCryptocurrencies, formatPrice, formatPercentageChange, type CryptoData } from "@/lib/crypto-api"

interface OrderBookEntry {
  id: string
  name: string
  symbol: string
  price: number
  change24h: number
  volume: number
  marketCap: number
}

export default function OrderbookTrades() {
  const [orderData, setOrderData] = useState<OrderBookEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<'orderbook' | 'trades'>('orderbook')

  const fetchOrderData = async () => {
    try {
      setError(null)
      const data = await getTopCryptocurrencies(12)
      const transformedData: OrderBookEntry[] = data.map(crypto => ({
        id: crypto.id,
        name: crypto.name,
        symbol: crypto.symbol.toUpperCase(),
        price: crypto.current_price,
        change24h: crypto.price_change_percentage_24h,
        volume: crypto.total_volume,
        marketCap: crypto.market_cap
      }))
      setOrderData(transformedData)
    } catch (err) {
      console.error('Error fetching order data:', err)
      setError('Failed to fetch order data')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchOrderData()
    
    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchOrderData, 30000)
    return () => clearInterval(interval)
  }, [])

  const formatVolume = (volume: number): string => {
    if (volume >= 1e9) {
      return `${(volume / 1e9).toFixed(2)}B`
    } else if (volume >= 1e6) {
      return `${(volume / 1e6).toFixed(2)}M`
    } else if (volume >= 1e3) {
      return `${(volume / 1e3).toFixed(2)}K`
    }
    return volume.toFixed(2)
  }

  if (loading) {
    return (
      <div className="bg-card rounded-lg border border-border p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold">Market Data</h2>
          <Loader2 className="h-5 w-5 text-muted-foreground animate-spin" />
        </div>
        <div className="flex items-center justify-center h-96">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </div>
    )
  }

  return (
    <div className="bg-card rounded-lg border border-border p-4">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-bold">Market Data</h2>
        </div>
        <MoreVertical className="h-5 w-5 text-muted-foreground" />
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-1 mb-4 bg-muted rounded-lg p-1">
        <button
          onClick={() => setActiveTab('orderbook')}
          className={`flex-1 py-2 px-3 text-sm font-medium rounded-md transition-colors ${
            activeTab === 'orderbook'
              ? 'bg-background text-foreground shadow-sm'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          Order Book
        </button>
        <button
          onClick={() => setActiveTab('trades')}
          className={`flex-1 py-2 px-3 text-sm font-medium rounded-md transition-colors ${
            activeTab === 'trades'
              ? 'bg-background text-foreground shadow-sm'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          Recent Trades
        </button>
      </div>

      {error && (
        <div className="bg-destructive/10 border border-destructive/20 rounded-md p-3 mb-4">
          <p className="text-sm text-destructive">{error}</p>
        </div>
      )}

      {/* Table Header */}
      <div className="grid grid-cols-4 gap-2 pb-2 mb-2 border-b border-border text-xs font-medium text-muted-foreground">
        <div>Pair</div>
        <div className="text-right">Price</div>
        <div className="text-right">24h Change</div>
        <div className="text-right">Volume</div>
      </div>

      {/* Data Rows */}
      <div className="space-y-1 max-h-80 overflow-y-auto">
        {orderData.map((entry) => {
          const priceChange = formatPercentageChange(entry.change24h)
          
          return (
            <div key={entry.id} className="grid grid-cols-4 gap-2 py-2 hover:bg-muted/20 rounded-lg px-2 transition-colors">
              <div className="flex flex-col">
                <span className="text-sm font-medium">{entry.symbol}</span>
                <span className="text-xs text-muted-foreground">{entry.name}</span>
              </div>
              
              <div className="text-right">
                <span className="text-sm font-medium">{formatPrice(entry.price)}</span>
              </div>
              
              <div className={`text-right flex items-center justify-end ${
                priceChange.isPositive ? 'text-green-500' : 'text-red-500'
              }`}>
                {priceChange.isPositive ? (
                  <TrendingUp className="w-3 h-3 mr-1" />
                ) : (
                  <TrendingDown className="w-3 h-3 mr-1" />
                )}
                <span className="text-xs">{priceChange.formatted}</span>
              </div>
              
              <div className="text-right">
                <span className="text-xs font-medium">${formatVolume(entry.volume)}</span>
              </div>
            </div>
          )
        })}
      </div>

      <div className="mt-4 pt-3 border-t border-border">
        <div className="text-xs text-muted-foreground text-center">
          Real-time market data • Updates every 30 seconds
        </div>
      </div>
    </div>
  )
}
