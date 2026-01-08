import { useState, useEffect } from 'react'
import axios from 'axios'

export const useFetchNews = (feedUrl, refreshInterval = 60000) => {
  const [news, setNews] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchNews = async () => {
      try {
        setLoading(true)
        const response = await axios.get(feedUrl)
        setNews(response.data)
        setError(null)
      } catch (err) {
        console.error('Error fetching news:', err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchNews()
    const interval = setInterval(fetchNews, refreshInterval)

    return () => clearInterval(interval)
  }, [feedUrl, refreshInterval])

  return { news, loading, error }
}
