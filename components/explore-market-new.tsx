"use client"

import { useState, useEffect } from "react"
import { MoreVertical, TrendingUp, TrendingDown, Loader2, RefreshCw } from "lucide-react"
import { getTopCryptocurrencies, formatPrice, formatPercentageChange, formatMarketCap, type CryptoData } from "@/lib/crypto-api"
import Image from "next/image"

export default function ExploreMarket() {
  const [cryptoData, setCryptoData] = useState<CryptoData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null)

  const fetchCryptoData = async () => {
    try {
      setError(null)
      const data = await getTopCryptocurrencies(10) // Get top 10 cryptocurrencies
      setCryptoData(data)
      setLastUpdate(new Date())
    } catch (err) {
      console.error('Error fetching crypto data:', err)
      setError('Failed to fetch cryptocurrency data')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCryptoData()
    
    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchCryptoData, 30000)
    return () => clearInterval(interval)
  }, [])

  const handleRefresh = () => {
    setLoading(true)
    fetchCryptoData()
  }

  if (loading && cryptoData.length === 0) {
    return (
      <div className="bg-card rounded-lg border border-border p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold">Top Cryptocurrencies</h2>
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
        <h2 className="text-lg font-bold">Top Cryptocurrencies</h2>
        <div className="flex items-center gap-2">
          <button
            onClick={handleRefresh}
            disabled={loading}
            className="p-2 hover:bg-muted rounded-md transition-colors"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <MoreVertical className="h-5 w-5 text-muted-foreground" />
        </div>
      </div>

      {error && (
        <div className="bg-destructive/10 border border-destructive/20 rounded-md p-3 mb-4">
          <p className="text-sm text-destructive">{error}</p>
          <button 
            onClick={handleRefresh}
            className="text-xs text-destructive hover:underline mt-1"
          >
            Try again
          </button>
        </div>
      )}

      <div className="space-y-3">
        {cryptoData.map((crypto) => {
          const priceChange = formatPercentageChange(crypto.price_change_percentage_24h)
          
          return (
            <div key={crypto.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/20">
              <div className="flex items-center space-x-3">
                <div className="relative w-8 h-8 rounded-full overflow-hidden bg-muted flex items-center justify-center">
                  {crypto.image ? (
                    <Image
                      src={crypto.image}
                      alt={crypto.name}
                      width={32}
                      height={32}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement
                        target.style.display = 'none'
                        const parent = target.parentElement
                        if (parent) {
                          parent.textContent = crypto.symbol.slice(0, 2).toUpperCase()
                          parent.className += ' text-xs font-bold text-foreground'
                        }
                      }}
                    />
                  ) : (
                    <span className="text-xs font-bold text-foreground">
                      {crypto.symbol.slice(0, 2).toUpperCase()}
                    </span>
                  )}
                </div>
                <div>
                  <div className="font-medium text-sm">{crypto.name}</div>
                  <div className="text-xs text-muted-foreground">
                    {crypto.symbol.toUpperCase()} • #{crypto.market_cap_rank}
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

      <div className="flex justify-between items-center mt-4 pt-3 border-t border-border">
        <div className="text-xs text-muted-foreground">
          {lastUpdate && `Last updated: ${lastUpdate.toLocaleTimeString()}`}
        </div>
        <div className="text-xs text-muted-foreground">
          Powered by CoinGecko
        </div>
      </div>
    </div>
  )
}
