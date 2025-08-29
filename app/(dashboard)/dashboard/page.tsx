"use client"

import PortfolioStats from "@/components/portfolio-stats-new"
import OrderbookTrades from "@/components/orderbook-trades-new"
import ExploreMarket from "@/components/explore-market-new"
import Watchlist from "@/components/watchlist-new"
import MarketTrades from "@/components/market-trades-new"
import ApiStatus from "@/components/api-status"

export default function Dashboard() {
  return (
    <div className="p-4 bg-background">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PortfolioStats />
        <OrderbookTrades />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <ExploreMarket />
        <div className="grid grid-cols-1 gap-6">
          <Watchlist />
          <MarketTrades />
        </div>
      </div>
      
      {/* API Status Indicator */}
      <ApiStatus />
    </div>
  )
}
