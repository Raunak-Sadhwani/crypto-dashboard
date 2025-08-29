// CoinGecko API integration for real-time cryptocurrency data
const BASE_URL = 'https://api.coingecko.com/api/v3';

export interface CryptoData {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  market_cap: number;
  market_cap_rank: number;
  fully_diluted_valuation: number;
  total_volume: number;
  high_24h: number;
  low_24h: number;
  price_change_24h: number;
  price_change_percentage_24h: number;
  price_change_percentage_7d: number;
  market_cap_change_24h: number;
  market_cap_change_percentage_24h: number;
  circulating_supply: number;
  total_supply: number;
  max_supply: number;
  ath: number;
  ath_change_percentage: number;
  ath_date: string;
  atl: number;
  atl_change_percentage: number;
  atl_date: string;
  last_updated: string;
}

export interface GlobalMarketData {
  active_cryptocurrencies: number;
  upcoming_icos: number;
  ongoing_icos: number;
  ended_icos: number;
  markets: number;
  total_market_cap: { [key: string]: number };
  total_volume: { [key: string]: number };
  market_cap_percentage: { [key: string]: number };
  market_cap_change_percentage_24h_usd: number;
  updated_at: number;
}

export interface CryptoPriceHistory {
  prices: [number, number][];
  market_caps: [number, number][];
  total_volumes: [number, number][];
}

export interface TrendingCrypto {
  id: string;
  coin_id: number;
  name: string;
  symbol: string;
  market_cap_rank: number;
  thumb: string;
  small: string;
  large: string;
  slug: string;
  price_btc: number;
  score: number;
}

// Fetch top cryptocurrencies by market cap
export async function getTopCryptocurrencies(
  limit: number = 20,
  currency: string = 'usd'
): Promise<CryptoData[]> {
  try {
    const response = await fetch(`/api/crypto?endpoint=top-cryptocurrencies&limit=${limit}`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching top cryptocurrencies:', error);
    throw error;
  }
}

// Fetch global market data
export async function getGlobalMarketData(): Promise<GlobalMarketData> {
  try {
    const response = await fetch(`/api/crypto?endpoint=global-market`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Error fetching global market data:', error);
    throw error;
  }
}

// Fetch specific cryptocurrency data
export async function getCryptocurrencyById(
  id: string,
  currency: string = 'usd'
): Promise<any> {
  try {
    const response = await fetch(
      `${BASE_URL}/coins/${id}?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false&sparkline=true`,
      {
        headers: {
          'Accept': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Error fetching cryptocurrency ${id}:`, error);
    throw error;
  }
}

// Fetch price history for charts
export async function getCryptoPriceHistory(
  id: string,
  currency: string = 'usd',
  days: number = 7
): Promise<CryptoPriceHistory> {
  try {
    const response = await fetch(`/api/crypto?endpoint=price-history&id=${id}&days=${days}`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Error fetching price history for ${id}:`, error);
    throw error;
  }
}

// Fetch trending cryptocurrencies
export async function getTrendingCryptocurrencies(): Promise<TrendingCrypto[]> {
  try {
    const response = await fetch(`/api/crypto?endpoint=trending`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.coins.map((coin: any) => coin.item);
  } catch (error) {
    console.error('Error fetching trending cryptocurrencies:', error);
    throw error;
  }
}

// Search for cryptocurrencies
export async function searchCryptocurrencies(query: string): Promise<any> {
  try {
    const response = await fetch(`${BASE_URL}/search?query=${encodeURIComponent(query)}`, {
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error searching cryptocurrencies:', error);
    throw error;
  }
}

// Format price with proper currency symbol and decimals
export function formatPrice(price: number, currency: string = 'usd'): string {
  const currencySymbol = currency === 'usd' ? '$' : currency.toUpperCase();
  
  if (price < 0.01) {
    return `${currencySymbol}${price.toFixed(6)}`;
  } else if (price < 1) {
    return `${currencySymbol}${price.toFixed(4)}`;
  } else if (price < 1000) {
    return `${currencySymbol}${price.toFixed(2)}`;
  } else {
    return `${currencySymbol}${price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }
}

// Format percentage change with proper color coding
export function formatPercentageChange(change: number): { 
  formatted: string; 
  isPositive: boolean; 
} {
  const isPositive = change >= 0;
  const formatted = `${isPositive ? '+' : ''}${change.toFixed(2)}%`;
  return { formatted, isPositive };
}

// Format market cap
export function formatMarketCap(marketCap: number): string {
  if (marketCap >= 1e12) {
    return `$${(marketCap / 1e12).toFixed(2)}T`;
  } else if (marketCap >= 1e9) {
    return `$${(marketCap / 1e9).toFixed(2)}B`;
  } else if (marketCap >= 1e6) {
    return `$${(marketCap / 1e6).toFixed(2)}M`;
  } else if (marketCap >= 1e3) {
    return `$${(marketCap / 1e3).toFixed(2)}K`;
  } else {
    return `$${marketCap.toFixed(2)}`;
  }
}
