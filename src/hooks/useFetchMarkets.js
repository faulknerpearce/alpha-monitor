import { useState, useEffect } from 'react'
import axios from 'axios'

export const useFetchMarkets = (symbols, refreshInterval = 30000) => {
  const [markets, setMarkets] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchMarkets = async () => {
      try {
        setLoading(true)
        // Fetch market data for symbols
        const responses = await Promise.all(
          symbols.map(symbol => 
            axios.get(`/api/markets/${symbol}`)
          )
        )
        
        const marketData = {}
        responses.forEach((response, index) => {
          marketData[symbols[index]] = response.data
        })
        
        setMarkets(marketData)
        setError(null)
      } catch (err) {
        console.error('Error fetching markets:', err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    if (symbols.length > 0) {
      fetchMarkets()
      const interval = setInterval(fetchMarkets, refreshInterval)
      return () => clearInterval(interval)
    }
  }, [symbols, refreshInterval])

  return { markets, loading, error }
}
