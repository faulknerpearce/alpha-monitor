import { useEffect, useState } from 'react'
import { fetchWithProxy, parseRSS } from '../../utils/fetchUtils.js'
import './NewsPanel.css'

const NewsPanel = ({ feeds, title }) => {
  const [news, setNews] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchNews()
    const interval = setInterval(fetchNews, 5 * 60 * 1000) // Refresh every 5 minutes
    return () => clearInterval(interval)
  }, [feeds])

  const fetchNews = async () => {
    try {
      setLoading(true)
      const allItems = []
      let successCount = 0

      for (const feed of feeds) {
        try {
          console.log(`Fetching ${feed.name}...`)
          const xmlText = await fetchWithProxy(feed.url)
          const items = parseRSS(xmlText)
          items.forEach(item => {
            item.source = feed.name
          })
          allItems.push(...items)
          successCount++
          console.log(`Successfully fetched ${items.length} items from ${feed.name}`)
        } catch (e) {
          console.error(`Failed to fetch ${feed.name}:`, e.message)
          // Continue with other feeds instead of failing completely
        }
      }

      if (successCount === 0) {
        throw new Error('All news feeds failed to load')
      }

      // Sort by date, newest first
      allItems.sort((a, b) => b.timestamp - a.timestamp)
      setNews(allItems.slice(0, 50)) // Keep top 50 items
      setError(null)
      console.log(`Total news items loaded: ${allItems.length} from ${successCount}/${feeds.length} feeds`)
    } catch (e) {
      console.error('News fetch error:', e)
      setError(`Failed to load news: ${e.message}`)
      setNews([]) // Clear news on complete failure
    } finally {
      setLoading(false)
    }
  }

  const getTimeAgo = (date) => {
    const seconds = Math.floor((new Date() - date) / 1000)
    const intervals = {
      y: 31536000,
      mo: 2592000,
      w: 604800,
      d: 86400,
      h: 3600,
      m: 60
    }

    for (const [unit, secondsInUnit] of Object.entries(intervals)) {
      const interval = Math.floor(seconds / secondsInUnit)
      if (interval >= 1) {
        return `${interval}${unit}`
      }
    }
    return 'now'
  }

  // Get unique sources count
  const uniqueSources = [...new Set(news.map(item => item.source))].length

  // Get theme class based on panel type
  const getThemeClass = () => {
    const titleLower = title?.toLowerCase() || ''
    if (titleLower.includes('politic') || titleLower.includes('geopolitic')) return 'theme-blue'
    if (titleLower.includes('tech') || titleLower.includes('ai')) return 'theme-cyan'
    if (titleLower.includes('financ')) return 'theme-green'
    if (titleLower.includes('gov') || titleLower.includes('policy')) return 'theme-purple'
    if (titleLower.includes('intel')) return 'theme-red'
    return 'theme-neutral'
  }

  if (loading && news.length === 0) {
    return <div className="loading-msg">Loading news...</div>
  }

  if (error && news.length === 0) {
    return <div className="error-msg">{error}</div>
  }

  return (
    <div className={`news-panel ${getThemeClass()}`}>
      <div className="news-summary">
        <div className="summary-stat">
          <span className="stat-value">{news.length}</span>
          <span className="stat-label">Articles</span>
        </div>
        <div className="summary-stat">
          <span className="stat-value">{uniqueSources}</span>
          <span className="stat-label">Sources</span>
        </div>
        <div className="summary-stat live-indicator">
          <span className="pulse-dot"></span>
          <span className="stat-label">LIVE</span>
        </div>
      </div>

      <div className="news-list">
        {news.map((item, idx) => (
          <div key={idx} className="item">
            <div className="item-source">{item.source}</div>
            <a href={item.link} target="_blank" rel="noopener noreferrer" className="item-title">
              {item.title}
            </a>
            <div className="item-time">{getTimeAgo(item.date)}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default NewsPanel

