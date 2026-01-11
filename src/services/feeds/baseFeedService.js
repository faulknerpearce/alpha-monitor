import { fetchWithProxy, parseRSS } from '@utils/fetchUtils.js'

/**
 * Base service for fetching RSS feeds
 * Provides common functionality used across all feed-based panels
 */
export class BaseFeedService {
  /**
   * Fetch and parse multiple RSS feeds
   * @param {Array} feeds - Array of feed objects with name and url
   * @param {Object} options - Options for fetching
   * @param {number} options.maxItems - Maximum total items to return across all feeds
   * @returns {Promise<Array>} Array of parsed items with source information
   */
  static async fetchFeeds(feeds, options = {}) {
    const { maxItems = null } = options
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
      }
    }

    if (successCount === 0) {
      throw new Error('All feeds failed to load')
    }

    console.log(`Total items loaded: ${allItems.length} from ${successCount}/${feeds.length} feeds`)

    // Sort by date, newest first
    allItems.sort((a, b) => b.timestamp - a.timestamp)

    // Limit items if specified
    return maxItems ? allItems.slice(0, maxItems) : allItems
  }

  /**
   * Fetch a single RSS feed
   * @param {Object} feed - Feed object with name and url
   * @param {number} maxItems - Maximum items to return
   * @returns {Promise<Array>} Array of parsed items
   */
  static async fetchSingleFeed(feed, maxItems = null) {
    const xmlText = await fetchWithProxy(feed.url)
    const items = parseRSS(xmlText)
    
    items.forEach(item => {
      item.source = feed.name
    })

    // Sort by date, newest first
    items.sort((a, b) => b.timestamp - a.timestamp)

    return maxItems ? items.slice(0, maxItems) : items
  }

  /**
   * Calculate time ago string from a date
   * @param {Date} date - Date to calculate from
   * @returns {string} Time ago string (e.g., "5m", "2h", "3d")
   */
  static getTimeAgo(date) {
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

  /**
   * Filter items by keywords
   * @param {Array} items - Items to filter
   * @param {Array} keywords - Keywords to match
   * @returns {Array} Filtered items
   */
  static filterByKeywords(items, keywords) {
    return items.filter(item =>
      keywords.some(k => item.title.toLowerCase().includes(k.toLowerCase()))
    )
  }
}
