"use client"

import { useState, useEffect } from "react"
import { MoreVertical, TrendingUp, TrendingDown, Loader2, Activity } from "lucide-react"
import { getTopCryptocurrencies, formatPrice, formatPercentageChange, type CryptoData } from "@/lib/crypto-api"

export default function MarketTrades() {
  const [tradesData, setTradesData] = useState<CryptoData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchTradesData = async () => {
    try {
      setError(null)
      // Get cryptocurrencies with highest volume
      const data = await getTopCryptocurrencies(8)
      // Sort by 24h volume for most active trading
      const sortedData = data.sort((a, b) => b.total_volume - a.total_volume)
      setTradesData(sortedData)
    } catch (err) {
      console.error('Error fetching trades data:', err)
      setError('Failed to fetch trading data')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTradesData()
    
    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchTradesData, 30000)
    return () => clearInterval(interval)
  }, [])

  const formatVolume = (volume: number): string => {
    if (volume >= 1e9) {
      return `$${(volume / 1e9).toFixed(2)}B`
    } else if (volume >= 1e6) {
      return `$${(volume / 1e6).toFixed(2)}M`
    } else if (volume >= 1e3) {
      return `$${(volume / 1e3).toFixed(2)}K`
    }
    return `$${volume.toFixed(2)}`
  }

  if (loading) {
    return (
      <div className="bg-card rounded-lg border border-border p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold">Active Trading</h2>
          <Loader2 className="h-5 w-5 text-muted-foreground animate-spin" />
        </div>
        <div className="flex items-center justify-center h-48">
          <Loader2 className="h-6 w-6 animate-spin" />
        </div>
      </div>
    )
  }

  return (
    <div className="bg-card rounded-lg border border-border p-4">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <Activity className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-bold">Active Trading</h2>
        </div>
        <MoreVertical className="h-5 w-5 text-muted-foreground" />
      </div>

      {error && (
        <div className="bg-destructive/10 border border-destructive/20 rounded-md p-3 mb-4">
          <p className="text-sm text-destructive">{error}</p>
        </div>
      )}

      <div className="space-y-2">
        {tradesData.map((crypto, index) => {
          const priceChange = formatPercentageChange(crypto.price_change_percentage_24h)
          
          return (
            <div key={crypto.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/20 transition-colors">
              <div className="flex items-center space-x-3">
                <div className="flex items-center justify-center w-6 h-6 rounded-full bg-muted text-xs font-bold">
                  {index + 1}
                </div>
                <div>
                  <div className="font-medium text-sm">{crypto.name}</div>
                  <div className="text-xs text-muted-foreground">
                    Vol: {formatVolume(crypto.total_volume)}
                  </div>
                </div>
              </div>
              
              <div className="text-right">
                <div className="text-sm font-medium">{formatPrice(crypto.current_price)}</div>
                <div className={`text-xs flex items-center justify-end ${
                  priceChange.isPositive ? 'text-green-500' : 'text-red-500'
                }`}>
                  {priceChange.isPositive ? (
                    <TrendingUp className="w-3 h-3 mr-1" />
                  ) : (
                    <TrendingDown className="w-3 h-3 mr-1" />
                  )}
                  {priceChange.formatted}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <div className="mt-4 pt-3 border-t border-border">
        <div className="text-xs text-muted-foreground text-center">
          Sorted by 24h volume • Real-time data
        </div>
      </div>
    </div>
  )
}
