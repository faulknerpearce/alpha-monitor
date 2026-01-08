import { useEffect, useState } from 'react'
import './NewsPanel.css'

const CORS_PROXIES = [
  'https://cors-anywhere.herokuapp.com/',
  'https://api.allorigins.win/raw?url=',
  'https://corsproxy.io/?',
  'https://thingproxy.freeboard.io/fetch/',
  'https://corsproxy.org/?'
]

const NewsPanel = ({ feeds, title }) => {
  const [news, setNews] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchNews()
    const interval = setInterval(fetchNews, 5 * 60 * 1000) // Refresh every 5 minutes
    return () => clearInterval(interval)
  }, [feeds])

  const fetchWithProxy = async (url) => {
    // First try direct fetch for some feeds that might work
    try {
      console.log('Trying direct fetch...')
      const response = await fetch(url, {
        headers: { 'Accept': 'application/rss+xml, application/xml, text/xml, */*' },
        signal: AbortSignal.timeout(5000)
      })
      if (response.ok) {
        console.log('Direct fetch succeeded')
        return await response.text()
      }
    } catch (e) {
      console.log('Direct fetch failed:', e.message)
    }

    // Fall back to CORS proxies
    for (let i = 0; i < CORS_PROXIES.length; i++) {
      try {
        console.log(`Trying proxy ${i + 1}/${CORS_PROXIES.length}: ${CORS_PROXIES[i]}`)
        const response = await fetch(CORS_PROXIES[i] + encodeURIComponent(url), {
          headers: { 'Accept': 'application/rss+xml, application/xml, text/xml, */*' },
          signal: AbortSignal.timeout(10000) // 10 second timeout
        })
        if (response.ok) {
          console.log(`Proxy ${i + 1} succeeded`)
          return await response.text()
        } else {
          console.log(`Proxy ${i + 1} failed with status: ${response.status}`)
        }
      } catch (e) {
        console.log(`Proxy ${i + 1} failed:`, e.message)
      }
    }
    throw new Error('All proxies failed')
  }

  const parseRSS = (xmlText) => {
    const parser = new DOMParser()
    const xml = parser.parseFromString(xmlText, 'text/xml')
    const items = xml.querySelectorAll('item, entry')
    
    return Array.from(items).map(item => {
      const title = item.querySelector('title')?.textContent || ''
      const link = item.querySelector('link')?.textContent || 
                   item.querySelector('link')?.getAttribute('href') || ''
      const pubDate = item.querySelector('pubDate, published, updated')?.textContent || ''
      const description = item.querySelector('description, summary')?.textContent || ''
      
      return {
        title: title.trim(),
        link: link.trim(),
        date: new Date(pubDate),
        description: description.trim(),
        timestamp: new Date(pubDate).getTime()
      }
    }).filter(item => item.title && item.link)
  }

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

  if (loading && news.length === 0) {
    return <div className="loading-msg">Loading news...</div>
  }

  if (error && news.length === 0) {
    return <div className="error-msg">{error}</div>
  }

  return (
    <div className="news-panel">
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
  )
}

export default NewsPanel
