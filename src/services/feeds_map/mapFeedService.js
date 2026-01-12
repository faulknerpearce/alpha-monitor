import { fetchWithProxy, parseRSS } from '@utils/fetchUtils.js'

/**
 * Service for fetching map-related news feeds
 * Handles intel, politics, and government feeds used by the global map
 */
export class MapFeedService {
  /**
   * Fetch all news feeds relevant to the map
   * @returns {Promise<Array>} Array of parsed news items
   */
  static async fetchMapNews() {
    try {
      const feedsToFetch = [
        ...this.getIntelFeeds(),
        ...this.getPoliticsFeeds(),
        ...this.getGovFeeds()
      ]

      const results = await Promise.allSettled(feedsToFetch.map(async (feed) => {
        try {
          const xmlText = await fetchWithProxy(feed.url)
          const items = parseRSS(xmlText)

          return items.slice(0, 5).map(item => ({
            ...item,
            source: feed.name
          }))
        } catch (e) {
          console.error(`Failed to fetch ${feed.name}`, e)
          return []
        }
      }))

      const flattened = results
        .filter(r => r.status === 'fulfilled')
        .flatMap(r => r.value)

      // Also fetch Google News for specific hotspots
      const googleNewsResults = await Promise.allSettled([
        this.fetchGoogleNews('washington dc politics'),
        this.fetchGoogleNews('us politics trump biden'),
        this.fetchGoogleNews('pentagon military news'),
        this.fetchGoogleNews('venezuela maduro caracas'),
        this.fetchGoogleNews('ukraine russia putin'),
        this.fetchGoogleNews('israel gaza hamas'),
        this.fetchGoogleNews('taiwan china strait')
      ])

      const googleNews = googleNewsResults
        .filter(r => r.status === 'fulfilled')
        .flatMap(r => r.value)

      return [...flattened, ...googleNews]
    } catch (e) {
      console.error('Error fetching map news:', e)
      return []
    }
  }

  /**
   * Fetch Google News for a specific query
   * @param {string} query - Search query
   * @returns {Promise<Array>} Array of news items
   */
  static async fetchGoogleNews(query) {
    try {
      const searchTerms = encodeURIComponent(query)
      const rssUrl = `https://news.google.com/rss/search?q=${searchTerms}&hl=en-US&gl=US&ceid=US:en`
      const xmlText = await fetchWithProxy(rssUrl)
      const items = parseRSS(xmlText)

      return items.slice(0, 3).map(item => ({
        ...item,
        source: item.source || 'Google News'
      }))
    } catch (e) {
      console.error('Error fetching Google News:', e)
      return []
    }
  }

  /**
   * Get intel feed configurations
   */
  static getIntelFeeds() {
    return [
      { name: 'Brookings', url: 'https://www.brookings.edu/feed/' },
      { name: 'Defense One', url: 'https://www.defenseone.com/rss/all/' },
      { name: 'War on Rocks', url: 'https://warontherocks.com/feed/' },
      { name: 'Breaking Defense', url: 'https://breakingdefense.com/feed/' },
      { name: 'The Drive War Zone', url: 'https://www.thedrive.com/the-war-zone/feed' },
      { name: 'The Diplomat', url: 'https://thediplomat.com/feed/' },
      { name: 'Al-Monitor', url: 'https://www.al-monitor.com/rss' },
      { name: 'Bellingcat', url: 'https://www.bellingcat.com/feed/' },
      { name: 'CISA Alerts', url: 'https://www.cisa.gov/uscert/ncas/alerts.xml' },
      { name: 'Krebs Security', url: 'https://krebsonsecurity.com/feed/' },
      { name: 'Politico', url: 'https://www.politico.com/rss/politics-news.xml' },
      { name: 'Axios', url: 'https://api.axios.com/feed/' },
      { name: 'The Hill', url: 'https://thehill.com/rss/syndicator/19110' }
    ]
  }

  /**
   * Get politics feed configurations
   */
  static getPoliticsFeeds() {
    return [
      { name: 'BBC World', url: 'https://feeds.bbci.co.uk/news/world/rss.xml' },
      { name: 'NPR News', url: 'https://feeds.npr.org/1001/rss.xml' },
      { name: 'Guardian World', url: 'https://www.theguardian.com/world/rss' },
      { name: 'AP News Top Headlines', url: 'https://feeds.feedburner.com/AssociatedPressTopHeadlines' }
    ]
  }

  /**
   * Get government feed configurations
   */
  static getGovFeeds() {
    return [
      { name: 'Federal Reserve', url: 'https://www.federalreserve.gov/feeds/press_all.xml' },
      { name: 'SEC', url: 'https://www.sec.gov/news/pressreleases.rss' },
      { name: 'State Dept', url: 'https://www.state.gov/rss-feed/press-releases/feed/' }
    ]
  }
}
