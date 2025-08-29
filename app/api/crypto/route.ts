import { NextResponse } from 'next/server'

const COINGECKO_API_BASE = 'https://api.coingecko.com/api/v3'

// Fallback mock data for when API is rate limited
const MOCK_CRYPTO_DATA = [
  {
    id: "bitcoin",
    symbol: "btc",
    name: "Bitcoin",
    image: "https://coin-images.coingecko.com/coins/images/1/large/bitcoin.png",
    current_price: 67543.21,
    market_cap: 1337234567890,
    market_cap_rank: 1,
    fully_diluted_valuation: 1416789012345,
    total_volume: 28934567890,
    high_24h: 68345.67,
    low_24h: 66789.12,
    price_change_24h: 1234.56,
    price_change_percentage_24h: 1.87,
    price_change_percentage_7d: -2.34,
    market_cap_change_24h: 23456789012,
    market_cap_change_percentage_24h: 1.78,
    circulating_supply: 19789234.567,
    total_supply: 21000000,
    max_supply: 21000000,
    ath: 69000,
    ath_change_percentage: -2.11,
    ath_date: "2021-11-10T14:24:11.849Z",
    atl: 67.81,
    atl_change_percentage: 99567.89,
    atl_date: "2013-07-06T00:00:00.000Z",
    last_updated: "2025-01-29T10:30:00.000Z"
  },
  {
    id: "ethereum",
    symbol: "eth",
    name: "Ethereum",
    image: "https://coin-images.coingecko.com/coins/images/279/large/ethereum.png",
    current_price: 3234.56,
    market_cap: 389012345678,
    market_cap_rank: 2,
    fully_diluted_valuation: 389012345678,
    total_volume: 15678901234,
    high_24h: 3289.45,
    low_24h: 3198.76,
    price_change_24h: 45.67,
    price_change_percentage_24h: 1.43,
    price_change_percentage_7d: -1.23,
    market_cap_change_24h: 5678901234,
    market_cap_change_percentage_24h: 1.48,
    circulating_supply: 120345678.901,
    total_supply: 120345678.901,
    max_supply: null,
    ath: 4878.26,
    ath_change_percentage: -33.71,
    ath_date: "2021-11-10T14:24:19.604Z",
    atl: 0.432979,
    atl_change_percentage: 746789.23,
    atl_date: "2015-10-20T00:00:00.000Z",
    last_updated: "2025-01-29T10:30:00.000Z"
  },
  {
    id: "tether",
    symbol: "usdt",
    name: "Tether",
    image: "https://coin-images.coingecko.com/coins/images/325/large/Tether.png",
    current_price: 1.00,
    market_cap: 137891234567,
    market_cap_rank: 3,
    fully_diluted_valuation: 137891234567,
    total_volume: 45678901234,
    high_24h: 1.001,
    low_24h: 0.999,
    price_change_24h: 0.0001,
    price_change_percentage_24h: 0.01,
    price_change_percentage_7d: 0.02,
    market_cap_change_24h: 12345678,
    market_cap_change_percentage_24h: 0.01,
    circulating_supply: 137891234567,
    total_supply: 137891234567,
    max_supply: null,
    ath: 1.32,
    ath_change_percentage: -24.3,
    ath_date: "2018-07-24T00:00:00.000Z",
    atl: 0.572521,
    atl_change_percentage: 74.58,
    atl_date: "2015-03-02T00:00:00.000Z",
    last_updated: "2025-01-29T10:30:00.000Z"
  },
  {
    id: "binancecoin",
    symbol: "bnb",
    name: "BNB",
    image: "https://coin-images.coingecko.com/coins/images/825/large/bnb-icon2_2x.png",
    current_price: 689.43,
    market_cap: 98765432109,
    market_cap_rank: 4,
    fully_diluted_valuation: 98765432109,
    total_volume: 1234567890,
    high_24h: 698.21,
    low_24h: 679.87,
    price_change_24h: 8.76,
    price_change_percentage_24h: 1.29,
    price_change_percentage_7d: -3.45,
    market_cap_change_24h: 1234567890,
    market_cap_change_percentage_24h: 1.27,
    circulating_supply: 143276974.61,
    total_supply: 143276974.61,
    max_supply: 200000000,
    ath: 717.48,
    ath_change_percentage: -3.91,
    ath_date: "2024-06-06T14:24:11.849Z",
    atl: 0.0398177,
    atl_change_percentage: 1731345.67,
    atl_date: "2017-10-19T00:00:00.000Z",
    last_updated: "2025-01-29T10:30:00.000Z"
  },
  {
    id: "solana",
    symbol: "sol",
    name: "Solana",
    image: "https://coin-images.coingecko.com/coins/images/4128/large/solana.png",
    current_price: 234.56,
    market_cap: 123456789012,
    market_cap_rank: 5,
    fully_diluted_valuation: 134567890123,
    total_volume: 3456789012,
    high_24h: 239.87,
    low_24h: 229.43,
    price_change_24h: 3.21,
    price_change_percentage_24h: 1.39,
    price_change_percentage_7d: -5.67,
    market_cap_change_24h: 1678901234,
    market_cap_change_percentage_24h: 1.38,
    circulating_supply: 526273849.123,
    total_supply: 573654321.987,
    max_supply: null,
    ath: 259.96,
    ath_change_percentage: -9.78,
    ath_date: "2024-11-23T14:24:11.849Z",
    atl: 0.500801,
    atl_change_percentage: 46734.21,
    atl_date: "2020-05-11T19:35:23.449Z",
    last_updated: "2025-01-29T10:30:00.000Z"
  },
  {
    id: "usd-coin",
    symbol: "usdc",
    name: "USDC",
    image: "https://coin-images.coingecko.com/coins/images/6319/large/USD_Coin_icon.png",
    current_price: 0.9998,
    market_cap: 87654321098,
    market_cap_rank: 6,
    fully_diluted_valuation: 87654321098,
    total_volume: 6789012345,
    high_24h: 1.001,
    low_24h: 0.9995,
    price_change_24h: -0.0002,
    price_change_percentage_24h: -0.02,
    price_change_percentage_7d: -0.01,
    market_cap_change_24h: -17543210,
    market_cap_change_percentage_24h: -0.02,
    circulating_supply: 87672345678.901,
    total_supply: 87672345678.901,
    max_supply: null,
    ath: 1.17,
    ath_change_percentage: -14.53,
    ath_date: "2019-05-08T00:40:28.300Z",
    atl: 0.877647,
    atl_change_percentage: 13.93,
    atl_date: "2023-03-11T08:02:13.981Z",
    last_updated: "2025-01-29T10:30:00.000Z"
  },
  {
    id: "cardano",
    symbol: "ada",
    name: "Cardano",
    image: "https://coin-images.coingecko.com/coins/images/975/large/cardano.png",
    current_price: 1.23,
    market_cap: 43210987654,
    market_cap_rank: 7,
    fully_diluted_valuation: 55321098765,
    total_volume: 987654321,
    high_24h: 1.267,
    low_24h: 1.198,
    price_change_24h: 0.0234,
    price_change_percentage_24h: 1.94,
    price_change_percentage_7d: -8.21,
    market_cap_change_24h: 823456789,
    market_cap_change_percentage_24h: 1.94,
    circulating_supply: 35123456789.012,
    total_supply: 45000000000,
    max_supply: 45000000000,
    ath: 3.09,
    ath_change_percentage: -60.19,
    ath_date: "2021-09-02T06:00:10.474Z",
    atl: 0.01925275,
    atl_change_percentage: 6289.34,
    atl_date: "2020-03-13T02:22:55.391Z",
    last_updated: "2025-01-29T10:30:00.000Z"
  },
  {
    id: "avalanche-2",
    symbol: "avax",
    name: "Avalanche",
    image: "https://coin-images.coingecko.com/coins/images/12559/large/Avalanche_Circle_RedWhite_Trans.png",
    current_price: 45.67,
    market_cap: 18765432109,
    market_cap_rank: 8,
    fully_diluted_valuation: 41098765432,
    total_volume: 765432109,
    high_24h: 47.21,
    low_24h: 44.33,
    price_change_24h: 0.98,
    price_change_percentage_24h: 2.19,
    price_change_percentage_7d: -12.34,
    market_cap_change_24h: 402987654,
    market_cap_change_percentage_24h: 2.19,
    circulating_supply: 410987654.321,
    total_supply: 449654321.987,
    max_supply: 720000000,
    ath: 144.96,
    ath_change_percentage: -68.51,
    ath_date: "2021-11-21T14:18:56.538Z",
    atl: 2.79,
    atl_change_percentage: 1536.92,
    atl_date: "2020-12-31T13:15:21.540Z",
    last_updated: "2025-01-29T10:30:00.000Z"
  }
]

const MOCK_TRENDING_DATA = {
  coins: [
    {
      item: {
        id: "bitcoin",
        coin_id: 1,
        name: "Bitcoin",
        symbol: "BTC",
        market_cap_rank: 1,
        thumb: "https://coin-images.coingecko.com/coins/images/1/thumb/bitcoin.png",
        small: "https://coin-images.coingecko.com/coins/images/1/small/bitcoin.png",
        large: "https://coin-images.coingecko.com/coins/images/1/large/bitcoin.png",
        slug: "bitcoin",
        price_btc: 1,
        score: 0
      }
    },
    {
      item: {
        id: "ethereum",
        coin_id: 1027,
        name: "Ethereum",
        symbol: "ETH",
        market_cap_rank: 2,
        thumb: "https://coin-images.coingecko.com/coins/images/279/thumb/ethereum.png",
        small: "https://coin-images.coingecko.com/coins/images/279/small/ethereum.png",
        large: "https://coin-images.coingecko.com/coins/images/279/large/ethereum.png",
        slug: "ethereum",
        price_btc: 0.047892,
        score: 1
      }
    },
    {
      item: {
        id: "solana",
        coin_id: 5426,
        name: "Solana",
        symbol: "SOL",
        market_cap_rank: 5,
        thumb: "https://coin-images.coingecko.com/coins/images/4128/thumb/solana.png",
        small: "https://coin-images.coingecko.com/coins/images/4128/small/solana.png",
        large: "https://coin-images.coingecko.com/coins/images/4128/large/solana.png",
        slug: "solana",
        price_btc: 0.003472,
        score: 2
      }
    },
    {
      item: {
        id: "cardano",
        coin_id: 2010,
        name: "Cardano",
        symbol: "ADA",
        market_cap_rank: 7,
        thumb: "https://coin-images.coingecko.com/coins/images/975/thumb/cardano.png",
        small: "https://coin-images.coingecko.com/coins/images/975/small/cardano.png",
        large: "https://coin-images.coingecko.com/coins/images/975/large/cardano.png",
        slug: "cardano",
        price_btc: 0.000018,
        score: 3
      }
    },
    {
      item: {
        id: "avalanche-2",
        coin_id: 5805,
        name: "Avalanche",
        symbol: "AVAX",
        market_cap_rank: 8,
        thumb: "https://coin-images.coingecko.com/coins/images/12559/thumb/Avalanche_Circle_RedWhite_Trans.png",
        small: "https://coin-images.coingecko.com/coins/images/12559/small/Avalanche_Circle_RedWhite_Trans.png",
        large: "https://coin-images.coingecko.com/coins/images/12559/large/Avalanche_Circle_RedWhite_Trans.png",
        slug: "avalanche-2",
        price_btc: 0.000676,
        score: 4
      }
    }
  ]
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const endpoint = searchParams.get('endpoint')
  const limit = searchParams.get('limit')
  const id = searchParams.get('id')
  const days = searchParams.get('days')

  console.log('API Request:', { endpoint, limit, id, days })

  try {
    let url = ''
    
    switch (endpoint) {
      case 'top-cryptocurrencies':
        url = `${COINGECKO_API_BASE}/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=${limit || 10}&page=1&sparkline=false&price_change_percentage=24h`
        break
      
      case 'global-market':
        url = `${COINGECKO_API_BASE}/global`
        break
        
      case 'price-history':
        url = `${COINGECKO_API_BASE}/coins/${id}/market_chart?vs_currency=usd&days=${days || 7}&interval=daily`
        break
        
      case 'trending':
        url = `${COINGECKO_API_BASE}/search/trending`
        break
        
      default:
        return NextResponse.json({ error: 'Invalid endpoint' }, { status: 400 })
    }

    console.log('Fetching URL:', url)

    const response = await fetch(url, {
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'CryptoDashboard/1.0'
      }
    })

    console.log('Response status:', response.status)

    if (!response.ok) {
      // If rate limited, use mock data
      if (response.status === 429) {
        console.log('Rate limited, using mock data for endpoint:', endpoint)
        let mockData
        
        switch (endpoint) {
          case 'top-cryptocurrencies':
            mockData = MOCK_CRYPTO_DATA.slice(0, parseInt(limit || '10'))
            break
          case 'trending':
            mockData = MOCK_TRENDING_DATA
            break
          case 'global-market':
            mockData = {
              data: {
                active_cryptocurrencies: 14567,
                markets: 1234,
                total_market_cap: { usd: 2890123456789 },
                total_volume: { usd: 89012345678 },
                market_cap_change_percentage_24h_usd: 2.34
              }
            }
            break
          case 'price-history':
            // Generate some mock price history
            const now = Date.now()
            const dayMs = 24 * 60 * 60 * 1000
            const numDays = parseInt(days || '7')
            const prices = []
            const volumes = []
            const marketCaps = []
            const basePrice = 67000
            const baseVolume = 25000000000
            const baseMarketCap = 1300000000000
            
            for (let i = numDays; i >= 0; i--) {
              const timestamp = now - (i * dayMs)
              const priceVariation = (Math.random() - 0.5) * 5000
              const price = basePrice + priceVariation
              const volume = baseVolume + (Math.random() - 0.5) * 10000000000
              const marketCap = baseMarketCap + priceVariation * 20000000
              
              prices.push([timestamp, price])
              volumes.push([timestamp, volume])
              marketCaps.push([timestamp, marketCap])
            }
            
            mockData = { 
              prices,
              total_volumes: volumes,
              market_caps: marketCaps
            }
            break
          default:
            mockData = { error: 'No mock data available for this endpoint' }
        }
        
        return NextResponse.json(mockData, {
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET',
            'Access-Control-Allow-Headers': 'Content-Type',
          },
        })
      }
      
      const errorText = await response.text()
      console.error('API Error Response:', errorText)
      throw new Error(`API request failed: ${response.status} - ${errorText}`)
    }

    const data = await response.json()
    console.log('Data received successfully')
    
    return NextResponse.json(data, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    })
    
  } catch (error) {
    console.error('Crypto API Error:', error)
    
    // Fallback to mock data on any error
    let fallbackData
    switch (endpoint) {
      case 'top-cryptocurrencies':
        fallbackData = MOCK_CRYPTO_DATA.slice(0, parseInt(limit || '10'))
        break
      case 'trending':
        fallbackData = MOCK_TRENDING_DATA
        break
      case 'price-history':
        // Generate fallback price history
        const now = Date.now()
        const dayMs = 24 * 60 * 60 * 1000
        const numDays = parseInt(days || '7')
        const prices = []
        const volumes = []
        const marketCaps = []
        const basePrice = 67000
        const baseVolume = 25000000000
        const baseMarketCap = 1300000000000
        
        for (let i = numDays; i >= 0; i--) {
          const timestamp = now - (i * dayMs)
          const priceVariation = (Math.random() - 0.5) * 5000
          const price = basePrice + priceVariation
          const volume = baseVolume + (Math.random() - 0.5) * 10000000000
          const marketCap = baseMarketCap + priceVariation * 20000000
          
          prices.push([timestamp, price])
          volumes.push([timestamp, volume])
          marketCaps.push([timestamp, marketCap])
        }
        
        fallbackData = { 
          prices,
          total_volumes: volumes,
          market_caps: marketCaps
        }
        break
      case 'global-market':
        fallbackData = {
          data: {
            active_cryptocurrencies: 14567,
            markets: 1234,
            total_market_cap: { usd: 2890123456789 },
            total_volume: { usd: 89012345678 },
            market_cap_percentage: { btc: 52.3 },
            market_cap_change_percentage_24h_usd: 2.34
          }
        }
        break
      default:
        fallbackData = { error: 'Failed to fetch crypto data', details: error instanceof Error ? error.message : 'Unknown error' }
    }
    
    return NextResponse.json(fallbackData, { 
      status: error instanceof Error && error.message.includes('Invalid endpoint') ? 400 : 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    })
  }
}
