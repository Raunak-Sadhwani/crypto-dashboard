"use client"

import { useState, useEffect } from "react"
import { RefreshCcw, Wifi, WifiOff } from "lucide-react"

interface ApiStatusProps {
  onRefresh?: () => void
}

export default function ApiStatus({ onRefresh }: ApiStatusProps) {
  const [isOnline, setIsOnline] = useState(true)
  const [lastUpdate, setLastUpdate] = useState(new Date())

  const checkApiStatus = async () => {
    try {
      const response = await fetch('/api/crypto?endpoint=top-cryptocurrencies&limit=1')
      const data = await response.json()
      
      // Check if we got mock data (Bitcoin will always be first in our mock data)
      if (data && data[0] && data[0].id === 'bitcoin' && data[0].current_price === 67543.21) {
        setIsOnline(false) // Using mock data
      } else {
        setIsOnline(true) // Got real API data
      }
      setLastUpdate(new Date())
    } catch (error) {
      setIsOnline(false)
    }
  }

  useEffect(() => {
    checkApiStatus()
    
    // Check status every 5 minutes
    const interval = setInterval(checkApiStatus, 5 * 60 * 1000)
    return () => clearInterval(interval)
  }, [])

  const handleRefresh = () => {
    checkApiStatus()
    if (onRefresh) onRefresh()
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 bg-card border border-border rounded-lg p-3 shadow-lg">
      <div className="flex items-center gap-2 text-sm">
        {isOnline ? (
          <Wifi className="h-4 w-4 text-green-500" />
        ) : (
          <WifiOff className="h-4 w-4 text-orange-500" />
        )}
        
        <div className="flex flex-col">
          <span className="font-medium">
            {isOnline ? 'Live Data' : 'Demo Data'}
          </span>
          <span className="text-xs text-muted-foreground">
            Updated: {lastUpdate.toLocaleTimeString()}
          </span>
        </div>
        
        <button
          onClick={handleRefresh}
          className="ml-2 p-1 hover:bg-muted rounded transition-colors"
          title="Refresh data"
        >
          <RefreshCcw className="h-4 w-4" />
        </button>
      </div>
      
      {!isOnline && (
        <div className="mt-2 text-xs text-muted-foreground border-t border-border pt-2">
          API rate limited. Using demo data with realistic values.
        </div>
      )}
    </div>
  )
}
