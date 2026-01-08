export const MARKET_SYMBOLS = {
  indices: ['SPY', 'QQQ', 'DIA', 'IWM'],
  crypto: ['BTC-USD', 'ETH-USD'],
  commodities: ['GC=F', 'CL=F', 'NG=F'],
  vix: ['^VIX']
}

export const MARKET_SECTORS = [
  'Technology',
  'Healthcare',
  'Financials',
  'Energy',
  'Consumer Discretionary',
  'Consumer Staples',
  'Industrials',
  'Materials',
  'Real Estate',
  'Utilities',
  'Communication Services'
]

export const API_ENDPOINTS = {
  news: '/api/news',
  markets: '/api/markets',
  congress: '/api/congress',
  polymarket: 'https://api.polymarket.com/markets'
}
