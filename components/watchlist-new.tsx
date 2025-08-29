"use client"

import { useState, useEffect } from "react"
import { MoreVertical, TrendingUp, TrendingDown, Loader2, Star, Plus } from "lucide-react"
import { getTrendingCryptocurrencies, formatPrice, formatPercentageChange, type TrendingCrypto } from "@/lib/crypto-api"
import Image from "next/image"

export default function Watchlist() {
  const [trendingData, setTrendingData] = useState<TrendingCrypto[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchTrendingData = async () => {
    try {
      setError(null)
      const data = await getTrendingCryptocurrencies()
      setTrendingData(data.slice(0, 6)) // Show top 6 trending
    } catch (err) {
      console.error('Error fetching trending data:', err)
      setError('Failed to fetch trending data')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTrendingData()
    
    // Auto-refresh every 2 minutes for trending data
    const interval = setInterval(fetchTrendingData, 120000)
    return () => clearInterval(interval)
  }, [])

  if (loading) {
    return (
      <div className="bg-card rounded-lg border border-border p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold">Trending</h2>
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
        <h2 className="text-lg font-bold">Trending</h2>
        <div className="flex items-center gap-2">
          <button className="p-2 hover:bg-muted rounded-md transition-colors">
            <Plus className="h-4 w-4" />
          </button>
          <MoreVertical className="h-5 w-5 text-muted-foreground" />
        </div>
      </div>

      {error && (
        <div className="bg-destructive/10 border border-destructive/20 rounded-md p-3 mb-4">
          <p className="text-sm text-destructive">{error}</p>
        </div>
      )}

      <div className="space-y-3">
        {trendingData.map((crypto, index) => (
          <div key={crypto.id} className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/20 transition-colors">
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-xs font-bold text-primary">
                #{index + 1}
              </div>
              <div className="relative w-6 h-6 rounded-full overflow-hidden bg-muted flex items-center justify-center">
                {crypto.thumb ? (
                  <Image
                    src={crypto.thumb}
                    alt={crypto.name}
                    width={24}
                    height={24}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement
                      target.style.display = 'none'
                      const parent = target.parentElement
                      if (parent) {
                        parent.textContent = crypto.symbol.slice(0, 1).toUpperCase()
                        parent.className += ' text-xs font-bold text-foreground'
                      }
                    }}
                  />
                ) : (
                  <span className="text-xs font-bold text-foreground">
                    {crypto.symbol.slice(0, 1).toUpperCase()}
                  </span>
                )}
              </div>
              <div>
                <div className="font-medium text-sm">{crypto.name}</div>
                <div className="text-xs text-muted-foreground">
                  {crypto.symbol.toUpperCase()}
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <div className="text-right">
                <div className="text-xs text-muted-foreground">
                  Rank #{crypto.market_cap_rank}
                </div>
                <div className="text-xs text-muted-foreground">
                  Score: {crypto.score}
                </div>
              </div>
              <button className="p-1 hover:bg-muted rounded transition-colors">
                <Star className="h-4 w-4 text-muted-foreground hover:text-yellow-500" />
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 pt-3 border-t border-border">
        <div className="text-xs text-muted-foreground text-center">
          Most searched • Updates every 2 minutes
        </div>
      </div>
    </div>
  )
}
