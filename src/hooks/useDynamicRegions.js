import { useState, useEffect, useCallback } from 'react'
import { HOTSPOTS, INTEL_HOTSPOTS, US_HOTSPOTS, CONFLICT_ZONES } from '@config/dynamicRegions.js'
import { NEWS_FEEDS } from '@services/feeds'
import { fetchWithProxy, parseRSS } from '@utils/fetchUtils.js'

/**
 * Hook to manage dynamic regions data with periodic refresh
 * @param {number} refreshInterval - Refresh interval in milliseconds (default: 10 minutes)
 * @returns {Object} - Dynamic regions data with loading state and last updated timestamp
 */
export const useDynamicRegions = (refreshInterval = 10 * 60 * 1000) => {
  const [dynamicData, setDynamicData] = useState({
    hotspots: HOTSPOTS,
    intelHotspots: INTEL_HOTSPOTS,
    usHotspots: US_HOTSPOTS,
    conflictZones: CONFLICT_ZONES,
    lastUpdated: new Date()
  })
  const [loading, setLoading] = useState(false)

  // Helper function to calculate severity based on keyword matches in recent news
  const calculateSeverity = (keywords, allNews) => {
    const now = new Date()
    const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000)

    let matchCount = 0
    allNews.forEach(article => {
      const articleDate = new Date(article.pubDate)
      if (articleDate >= oneDayAgo) {
        const text = `${article.title} ${article.description || ''}`.toLowerCase()
        keywords.forEach(keyword => {
          if (text.includes(keyword.toLowerCase())) {
            matchCount++
          }
        })
      }
    })

    if (matchCount > 15) return 'high'
    if (matchCount > 5) return 'elevated'
    return 'medium'
  }

  const refreshData = useCallback(async () => {
    setLoading(true)
    try {
      // Fetch news from all feeds
      const allFeeds = Object.values(NEWS_FEEDS).flat()
      const newsPromises = allFeeds.map(async (feed) => {
        try {
          const rssText = await fetchWithProxy(feed.url)
          const parsed = await parseRSS(rssText)
          return parsed.items || []
        } catch (error) {
          console.error(`Error fetching ${feed.name}:`, error)
          return []
        }
      })

      const newsResults = await Promise.all(newsPromises)
      const allNews = newsResults.flat()

      // Update hotspots with dynamic severity
      const updatedHotspots = { ...HOTSPOTS }
      Object.keys(updatedHotspots).forEach(key => {
        const hotspot = updatedHotspots[key]
        if (hotspot.keywords) {
          hotspot.severity = calculateSeverity(hotspot.keywords, allNews)
        }
      })

      // Update US hotspots
      const updatedUsHotspots = US_HOTSPOTS.map(hotspot => ({
        ...hotspot,
        level: hotspot.keywords ? calculateSeverity(hotspot.keywords, allNews) : hotspot.level
      }))

      // For intel hotspots, keep static for now or add logic later
      const updatedIntelHotspots = INTEL_HOTSPOTS.map(hotspot => ({
        ...hotspot,
        severity: hotspot.keywords ? calculateSeverity(hotspot.keywords, allNews) : 'medium'
      }))

      // Update conflict zones similarly
      const updatedConflictZones = CONFLICT_ZONES.map(zone => ({
        ...zone,
        intensity: zone.keywords ? calculateSeverity(zone.keywords, allNews) : zone.intensity
      }))

      // Update with new data and timestamp
      setDynamicData({
        hotspots: updatedHotspots,
        intelHotspots: updatedIntelHotspots,
        usHotspots: updatedUsHotspots,
        conflictZones: updatedConflictZones,
        lastUpdated: new Date()
      })

      console.log('Dynamic regions data refreshed at:', new Date().toISOString())
    } catch (error) {
      console.error('Error refreshing dynamic regions:', error)
      // Fallback to static data
      setDynamicData({
        hotspots: HOTSPOTS,
        intelHotspots: INTEL_HOTSPOTS,
        usHotspots: US_HOTSPOTS,
        conflictZones: CONFLICT_ZONES,
        lastUpdated: new Date()
      })
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    // Initial load
    refreshData()

    // Set up periodic refresh
    const interval = setInterval(refreshData, refreshInterval)

    return () => clearInterval(interval)
  }, [refreshData, refreshInterval])

  return {
    ...dynamicData,
    loading,
    refresh: refreshData
  }
}
