import { useEffect, useState } from 'react'
import './MarketsPanel.css'

const MARKETS = [
  { symbol: 'SPY', name: 'S&P 500' },
  { symbol: 'QQQ', name: 'Nasdaq' },
  { symbol: 'DIA', name: 'Dow Jones' },
  { symbol: 'IWM', name: 'Russell 2000' },
  { symbol: 'BTC-USD', name: 'Bitcoin' },
  { symbol: 'ETH-USD', name: 'Ethereum' }
]

const MarketsPanel = () => {
  const [markets, setMarkets] = useState({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchMarkets()
    const interval = setInterval(fetchMarkets, 30000) // Update every 30 seconds
    return () => clearInterval(interval)
  }, [])

  const fetchMarkets = async () => {
    try {
      const data = {}
      for (const market of MARKETS) {
        try {
          const response = await fetch(
            `https://query1.finance.yahoo.com/v8/finance/chart/${market.symbol}?interval=1d&range=1d`,
            {
              headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
              }
            }
          )
          const json = await response.json()
          const quote = json.chart.result[0]
          const meta = quote.meta
          
          data[market.symbol] = {
            price: meta.regularMarketPrice,
            change: meta.regularMarketPrice - meta.chartPreviousClose,
            changePercent: ((meta.regularMarketPrice - meta.chartPreviousClose) / meta.chartPreviousClose) * 100
          }
        } catch (e) {
          console.error(`Failed to fetch ${market.symbol}`)
        }
      }
      setMarkets(data)
      setLoading(false)
    } catch (e) {
      console.error('Markets fetch error:', e)
      setLoading(false)
    }
  }

  const formatNumber = (num) => {
    if (!num) return '0.00'
    return num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
  }

  const formatPercent = (num) => {
    if (!num) return '+0.00%'
    const sign = num >= 0 ? '+' : ''
    return `${sign}${num.toFixed(2)}%`
  }

  if (loading) {
    return <div className="loading-msg">Loading markets...</div>
  }

  return (
    <div className="markets-panel">
      {MARKETS.map(market => {
        const data = markets[market.symbol]
        if (!data) return null

        const isUp = data.change >= 0

        return (
          <div key={market.symbol} className="market-item">
            <div>
              <div className="market-name">{market.name}</div>
              <div className="market-symbol">{market.symbol}</div>
            </div>
            <div className="market-data">
              <div className="market-price">${formatNumber(data.price)}</div>
              <div className={`market-change ${isUp ? 'up' : 'down'}`}>
                {formatPercent(data.changePercent)}
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default MarketsPanel
