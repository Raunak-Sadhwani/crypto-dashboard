"use client"

import { useState, useEffect } from "react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { getCryptoPriceHistory } from "@/lib/crypto-api"

export default function TestGraph() {
  const [chartData, setChartData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log('Fetching price history...')
        const priceHistory = await getCryptoPriceHistory('bitcoin', 'usd', 7)
        console.log('Received price history:', priceHistory)
        
        if (!priceHistory || !priceHistory.prices || !Array.isArray(priceHistory.prices)) {
          throw new Error('Invalid price history data')
        }

        const transformedData = priceHistory.prices.map((price, index) => ({
          date: new Date(price[0]).toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric' 
          }),
          price: price[1],
          volume: priceHistory.total_volumes?.[index]?.[1] || 0
        }))

        console.log('Transformed data:', transformedData)
        setChartData(transformedData)
      } catch (err) {
        console.error('Error:', err)
        setError(err instanceof Error ? err.message : 'Unknown error')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) return <div className="p-8">Loading...</div>
  if (error) return <div className="p-8 text-red-500">Error: {error}</div>

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Bitcoin Price Chart Test</h1>
      <div className="bg-white rounded-lg p-4 border">
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Line 
              type="monotone" 
              dataKey="price" 
              stroke="#8884d8" 
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      
      <div className="mt-4 text-sm text-gray-600">
        <p>Data points: {chartData.length}</p>
        <pre className="mt-2 bg-gray-100 p-2 rounded text-xs overflow-auto">
          {JSON.stringify(chartData.slice(0, 3), null, 2)}
        </pre>
      </div>
    </div>
  )
}
