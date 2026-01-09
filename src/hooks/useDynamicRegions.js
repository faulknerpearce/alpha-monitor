import { useState, useEffect } from 'react'
import { HOTSPOTS, INTEL_HOTSPOTS, US_HOTSPOTS, CONFLICT_ZONES } from '../config/dynamicRegions.js'

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

  const refreshData = async () => {
    setLoading(true)
    try {
      // In a real implementation, this would fetch from an API
      // For now, we're using the static data but updating the timestamp
      // to show when data was last "refreshed"
      
      // Simulate an API call delay
      await new Promise(resolve => setTimeout(resolve, 500))
      
      // Update with current data and new timestamp
      setDynamicData({
        hotspots: HOTSPOTS,
        intelHotspots: INTEL_HOTSPOTS,
        usHotspots: US_HOTSPOTS,
        conflictZones: CONFLICT_ZONES,
        lastUpdated: new Date()
      })
      
      console.log('Dynamic regions data refreshed at:', new Date().toISOString())
    } catch (error) {
      console.error('Error refreshing dynamic regions:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    // Initial load
    refreshData()

    // Set up periodic refresh
    const interval = setInterval(refreshData, refreshInterval)

    return () => clearInterval(interval)
  }, [refreshInterval])

  return {
    ...dynamicData,
    loading,
    refresh: refreshData
  }
}
