import { useEffect, useRef, useState } from 'react'
import * as d3 from 'd3'
import * as topojson from 'topojson-client'
import axios from 'axios'
import { 
  HOTSPOTS, INTEL_HOTSPOTS, US_CITIES, US_HOTSPOTS,
  SHIPPING_CHOKEPOINTS, CONFLICT_ZONES, MILITARY_BASES, 
  NUCLEAR_FACILITIES, UNDERSEA_CABLES, CYBER_REGIONS 
} from '../../../config/regions.js'
import { NEWS_FEEDS } from '../../../config/feeds.js'
import './GlobalMap.css'

const CORS_PROXIES = [
  'https://corsproxy.io/?',
  'https://api.allorigins.win/raw?url='
]

const GlobalMap = () => {
  const svgRef = useRef(null)
  const containerRef = useRef(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [mapView, setMapView] = useState('global') // 'global' or 'us'
  const [worldData, setWorldData] = useState(null)
  const [usData, setUsData] = useState(null)
  const [selectedHotspot, setSelectedHotspot] = useState(null)
  const [allNews, setAllNews] = useState([])

  // Zoom state
  const [zoomLevel, setZoomLevel] = useState(1)
  const [translation, setTranslation] = useState([0, 0])

  useEffect(() => {
    loadMapData()
    fetchMapNews()
  }, [])

  const fetchWithProxy = async (url) => {
    for (const proxy of CORS_PROXIES) {
      try {
        const response = await axios.get(proxy + encodeURIComponent(url))
        return response.data
      } catch (e) {
        continue
      }
    }
    throw new Error('All proxies failed')
  }

  const fetchMapNews = async () => {
    try {
      // Gather feeds relevant to map
      const feedsToFetch = [
        ...(NEWS_FEEDS.intel || []),
        ...(NEWS_FEEDS.politics || []),
        ...(NEWS_FEEDS.gov || [])
      ]

      const results = await Promise.allSettled(feedsToFetch.map(async (feed) => {
        try {
          const xmlText = await fetchWithProxy(feed.url)
          const parser = new DOMParser()
          const xml = parser.parseFromString(xmlText, 'text/xml')
          
          let items = xml.querySelectorAll('item')
          if (items.length === 0) items = xml.querySelectorAll('entry')
          
          return Array.from(items).slice(0, 5).map(item => {
            const title = item.querySelector('title')?.textContent || ''
            const link = item.querySelector('link')?.textContent || item.querySelector('link')?.getAttribute('href') || '#'
            return {
              source: feed.name,
              title,
              link,
              date: item.querySelector('pubDate')?.textContent || ''
            }
          })
        } catch (e) {
          console.error(`Failed to fetch ${feed.name}`, e)
          return []
        }
      }))

      const flattened = results
        .filter(r => r.status === 'fulfilled')
        .flatMap(r => r.value)
      
      setAllNews(flattened)
    } catch (e) {
      console.error('Error fetching map news:', e)
    }
  }

  useEffect(() => {
    try {
      if (mapView === 'global' && worldData && worldData.objects && worldData.objects.countries) {
        renderMap()
      } else if (mapView === 'us' && usData && usData.objects && usData.objects.states) {
        renderMap()
      }
    } catch (error) {
      console.error('Error in map render effect:', error)
      setError('Failed to render map')
    }
  }, [worldData, usData, mapView, zoomLevel, translation])

  const loadMapData = async () => {
    try {
      setLoading(true)
      setError(null)
      
      // Load world map topology data
      const worldResponse = await fetch('https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json')
      if (!worldResponse.ok) {
        throw new Error(`Failed to fetch world map: ${worldResponse.status}`)
      }
      const world = await worldResponse.json()
      
      // Validate world data structure
      if (!world || !world.objects || !world.objects.countries) {
        throw new Error('Invalid world map data structure')
      }
      setWorldData(world)

      // Load US map topology data
      const usResponse = await fetch('https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json')
      if (!usResponse.ok) {
        throw new Error(`Failed to fetch US map: ${usResponse.status}`)
      }
      const us = await usResponse.json()
      
      // Validate US data structure
      if (!us || !us.objects || !us.objects.states) {
        throw new Error('Invalid US map data structure')
      }
      setUsData(us)

      setError(null)
    } catch (e) {
      console.error('Failed to load map:', e)
      setError('Failed to load map data: ' + e.message)
    } finally {
      setLoading(false)
    }
  }

  const renderMap = () => {
    try {
      if (!containerRef.current || !svgRef.current) return
      if (mapView === 'global' && !worldData) return
      if (mapView === 'us' && !usData) return

      // Additional validation
      if (mapView === 'global' && (!worldData.objects || !worldData.objects.countries)) {
        console.error('Invalid world data structure')
        setError('Invalid map data format')
        return
      }
      
      if (mapView === 'us' && (!usData.objects || !usData.objects.states)) {
        console.error('Invalid US data structure')
        setError('Invalid map data format')
        return
      }

      const container = containerRef.current
      const width = container.offsetWidth || 800
      const height = 400

    // Clear existing content
    d3.select(svgRef.current).selectAll('*').remove()

    const svg = d3.select(svgRef.current)
      .attr('width', '100%')
      .attr('height', '100%')
      .attr('viewBox', `0 0 ${width} ${height}`)
      .attr('preserveAspectRatio', 'xMidYMid meet')

    // Create projection
    let projection
    if (mapView === 'global') {
      projection = d3.geoEquirectangular()
        .scale((width / (2 * Math.PI)) * zoomLevel)
        .translate([width / 2 + translation[0], height / 2 + translation[1]])
        .center([0, 0])
    } else {
      projection = d3.geoAlbersUsa()
        .scale(width * zoomLevel * 1.2)
        .translate([width / 2 + translation[0], height / 2 + translation[1]])
    }

    const path = d3.geoPath().projection(projection)

    // Background
    svg.append('rect')
      .attr('width', width)
      .attr('height', height)
      .attr('fill', '#020a08')

    if (mapView === 'global') {
      // Grid pattern for global
      const defs = svg.append('defs')
      
      const smallGrid = defs.append('pattern')
        .attr('id', 'smallGrid')
        .attr('width', 20)
        .attr('height', 20)
        .attr('patternUnits', 'userSpaceOnUse')
      
      smallGrid.append('path')
        .attr('d', 'M 20 0 L 0 0 0 20')
        .attr('fill', 'none')
        .attr('stroke', '#0a2a20')
        .attr('stroke-width', 0.5)

      const grid = defs.append('pattern')
        .attr('id', 'grid')
        .attr('width', 60)
        .attr('height', 60)
        .attr('patternUnits', 'userSpaceOnUse')
      
      grid.append('rect')
        .attr('width', 60)
        .attr('height', 60)
        .attr('fill', 'url(#smallGrid)')
      
      grid.append('path')
        .attr('d', 'M 60 0 L 0 0 0 60')
        .attr('fill', 'none')
        .attr('stroke', '#0d3a2d')
        .attr('stroke-width', 0.8)

      svg.append('rect')
        .attr('width', width)
        .attr('height', height)
        .attr('fill', 'url(#grid)')
        .attr('opacity', 0.3)

      // Graticule (lat/lon lines)
      const graticule = d3.geoGraticule().step([30, 30])
      svg.append('path')
        .datum(graticule)
        .attr('d', path)
        .attr('fill', 'none')
        .attr('stroke', '#0f4035')
        .attr('stroke-width', 0.5)
        .attr('opacity', 0.5)

      // Render countries
      const countries = topojson.feature(worldData, worldData.objects.countries)
      
      svg.append('g')
        .attr('class', 'countries')
        .selectAll('path')
        .data(countries.features)
        .enter()
        .append('path')
        .attr('d', path)
        .attr('fill', '#0a2018')
        .attr('stroke', '#0f5040')
        .attr('stroke-width', 0.5)
        .on('mouseenter', function(event, d) {
          d3.select(this)
            .attr('fill', '#1a4030')
            .attr('stroke', '#2a8070')
        })
        .on('mouseleave', function(event, d) {
          d3.select(this).attr('fill', '#0a2018').attr('stroke', '#0f5040')
        })
    } else {
      // Render US states
      const states = topojson.feature(usData, usData.objects.states)
      
      svg.append('g')
        .attr('class', 'states')
        .selectAll('path')
        .data(states.features)
        .enter()
        .append('path')
        .attr('d', path)
        .attr('fill', '#0a2018')
        .attr('stroke', '#0f5040')
        .attr('stroke-width', 0.5)
        .on('mouseenter', function(event, d) {
          d3.select(this)
            .attr('fill', '#1a4030')
            .attr('stroke', '#2a8070')
        })
        .on('mouseleave', function(event, d) {
          d3.select(this).attr('fill', '#0a2018').attr('stroke', '#0f5040')
        })

      // Render US cities from config
      const citiesGroup = svg.append('g').attr('class', 'us-cities')
      
      US_CITIES.forEach(city => {
        const projected = projection([city.lon, city.lat])
        if (!projected) return
        const [x, y] = projected
        if (x === undefined || y === undefined || isNaN(x) || isNaN(y)) return

        const group = citiesGroup.append('g')
          .attr('class', `us-city ${city.type}`)
          .attr('transform', `translate(${x},${y})`)
          .style('cursor', 'pointer')
          .on('click', () => handleHotspotClick({
            ...city,
            type: 'city',
            severity: city.type === 'capital' ? 'high' : city.type === 'military' ? 'elevated' : 'medium'
          }))

        group.append('circle')
          .attr('class', 'us-city-dot')
          .attr('r', city.type === 'capital' ? 6 : city.type === 'major' ? 5 : city.type === 'military' ? 5 : 4)
          .attr('fill', city.type === 'capital' ? '#ffcc00' : city.type === 'military' ? '#ff6600' : '#00aaff')

        group.append('text')
          .attr('class', 'us-city-label')
          .attr('x', 8)
          .attr('y', 4)
          .text(city.name)
      })
    }

    // Add hotspots (global hotspots for global view, US hotspots for US view)
    const hotspots = mapView === 'global' ? Object.values(HOTSPOTS) : US_HOTSPOTS

    const hotspotsGroup = svg.append('g').attr('class', 'hotspots')
    
    hotspots.forEach(hotspot => {
      const coords = mapView === 'global' ? hotspot.coords : [hotspot.lon, hotspot.lat]
      const projected = projection(coords)
      if (!projected) return
      const [x, y] = projected
      if (x === undefined || y === undefined || isNaN(x) || isNaN(y)) return

      const severity = hotspot.severity || hotspot.level // Hotspots use 'severity', US_HOTSPOTS use 'level'
      const group = hotspotsGroup.append('g')
        .attr('class', `hotspot ${severity}`)
        .attr('transform', `translate(${x},${y})`)
        .style('cursor', 'pointer')
        .on('click', () => handleHotspotClick(hotspot))

      // Pulsing ring
      group.append('circle')
        .attr('r', 8)
        .attr('fill', 'none')
        .attr('stroke', severity === 'high' ? '#ff3333' : severity === 'elevated' ? '#ffcc00' : '#00ff88')
        .attr('stroke-width', 2)
        .attr('opacity', 0.8)

      // Inner dot
      group.append('circle')
        .attr('r', 3)
        .attr('fill', severity === 'high' ? '#ff3333' : severity === 'elevated' ? '#ffcc00' : '#00ff88')

      // Label
      group.append('text')
        .attr('x', 12)
        .attr('y', 4)
        .attr('fill', severity === 'high' ? '#ff3333' : severity === 'elevated' ? '#ffcc00' : '#00ff88')
        .attr('font-size', '10px')
        .attr('font-weight', '600')
        .text(hotspot.name)
    })

    // Add additional layers (Global Only)
    if (mapView === 'global') {
      // Shipping Chokepoints
      const chokeGroup = svg.append('g').attr('class', 'chokepoints')
      SHIPPING_CHOKEPOINTS.forEach(point => {
        const projected = projection([point.lon, point.lat])
        if (!projected) return
        const [x, y] = projected
        if (x === undefined || y === undefined || isNaN(x) || isNaN(y)) return
        const g = chokeGroup.append('g')
          .attr('transform', `translate(${x},${y})`)
          .style('cursor', 'pointer')
          .on('click', () => handleHotspotClick({...point, type: 'chokepoint'}))
        
        g.append('rect')
          .attr('x', -6).attr('y', -6)
          .attr('width', 12).attr('height', 12)
          .attr('fill', 'none')
          .attr('stroke', point.status === 'alert' ? '#ffaa00' : '#00aaff')
          .attr('stroke-width', 2)

        g.append('text').text('⚓').attr('x', -4).attr('y', 4).attr('font-size', '10px')
      })

      // Conflict Zones
      const conflictGroup = svg.append('g').attr('class', 'conflict-zones')
      CONFLICT_ZONES.forEach(zone => {
         const projected = projection([zone.labelPos.lon, zone.labelPos.lat])
         if (!projected) return
         const [x, y] = projected
         if (x === undefined || y === undefined || isNaN(x) || isNaN(y)) return
         const g = conflictGroup.append('g')
            .attr('transform', `translate(${x},${y})`)
            .style('cursor', 'pointer')
            .on('click', () => handleHotspotClick({...zone, type: 'conflict'}))
         
         g.append('circle')
            .attr('r', 10)
            .attr('fill', 'rgba(255, 50, 50, 0.2)')
            .attr('stroke', '#ff3333')
            .attr('stroke-dasharray', '2,2')

         g.append('text').text('⚔️').attr('x', -5).attr('y', 4).attr('font-size', '10px')
      })

      // Military Bases
      const baseGroup = svg.append('g').attr('class', 'military-bases')
      MILITARY_BASES.forEach(base => {
          const projected = projection([base.lon, base.lat])
          if (!projected) return
          const [x, y] = projected
          if (x === undefined || y === undefined || isNaN(x) || isNaN(y)) return
          const g = baseGroup.append('g')
            .attr('transform', `translate(${x},${y})`)
            .style('cursor', 'pointer')
            .on('click', () => handleHotspotClick({...base, type: 'base'}))
          
          g.append('path')
            .attr('d', 'M0,-6 L5,4 L-5,4 Z') // Triangle
            .attr('fill', '#ff6600')
            .attr('stroke', '#ffcc00')
      })

       // Nuclear Facilities
       const nucGroup = svg.append('g').attr('class', 'nuclear-facilities')
       NUCLEAR_FACILITIES.forEach(nuc => {
           const projected = projection([nuc.lon, nuc.lat])
           if (!projected) return
           const [x, y] = projected
           if (x === undefined || y === undefined || isNaN(x) || isNaN(y)) return
           const g = nucGroup.append('g')
             .attr('transform', `translate(${x},${y})`)
             .style('cursor', 'pointer')
             .on('click', () => handleHotspotClick({...nuc, type: 'nuclear'}))
           
           g.append('circle').attr('r', 4).attr('fill', '#ffff00').attr('stroke', '#000')
           g.append('text').text('☢️').attr('x', -5).attr('y', 4).attr('font-size', '10px')
       })

      // Undersea Cables
      const cablesGroup = svg.append('g').attr('class', 'cables')
      UNDERSEA_CABLES.forEach(cable => {
        const line = d3.line()
          .x(d => projection(d)[0])
          .y(d => projection(d)[1])
          .curve(d3.curveBasis) // Smooth curves for cables

        const pathCoords = cable.points
        // Check if projection is successful for all points to avoid errors
        const valid = pathCoords.every(p => {
          const [x, y] = projection(p) || [null, null]
          return x !== null && y !== null
        })
        
        if (valid) {
          cablesGroup.append('path')
            .datum(pathCoords)
            .attr('d', line)
            .attr('class', cable.major ? 'major' : '')
            .attr('fill', 'none')
            // Tooltip or interaction could be added here
        }
      })

      // Cyber Regions
      const cyberGroup = svg.append('g').attr('class', 'cyber-regions')
      CYBER_REGIONS.forEach(reg => {
          const projected = projection([reg.lon, reg.lat])
          if (!projected) return
          const [x, y] = projected
          if (x === undefined || y === undefined || isNaN(x) || isNaN(y)) return
          const g = cyberGroup.append('g')
            .attr('transform', `translate(${x},${y})`)
            .style('cursor', 'pointer')
            .on('click', () => handleHotspotClick({...reg, type: 'cyber'}))

          g.append('rect')
            .attr('x', -8).attr('y', -8)
            .attr('width', 16).attr('height', 16)
            .attr('fill', 'none')
            .attr('stroke', '#00ff00')
            .attr('stroke-width', 1)
            .attr('stroke-dasharray', '2,2')
          
          g.append('text').text('💻').attr('x', -6).attr('y', 4).attr('font-size', '10px')
      })

      // Intelligence Hotspots
      const intelGroup = svg.append('g').attr('class', 'intel-hotspots')
      
      INTEL_HOTSPOTS.forEach(intel => {
        const projected = projection([intel.lon, intel.lat])
        if (!projected) return
        const [x, y] = projected
        if (x === undefined || y === undefined || isNaN(x) || isNaN(y)) return

        const group = intelGroup.append('g')
          .attr('class', 'intel-hotspot')
          .attr('transform', `translate(${x},${y})`)
          .style('cursor', 'pointer')
          .on('click', () => handleIntelHotspotClick(intel))

        // Square marker for intelligence locations
        group.append('rect')
          .attr('x', -4)
          .attr('y', -4)
          .attr('width', 8)
          .attr('height', 8)
          .attr('fill', 'none')
          .attr('stroke', '#00ddff')
          .attr('stroke-width', 1.5)
          .attr('opacity', 0.9)

        // Inner square
        group.append('rect')
          .attr('x', -2)
          .attr('y', -2)
          .attr('width', 4)
          .attr('height', 4)
          .attr('fill', '#00ddff')
          .attr('opacity', 0.8)

        // Label
        group.append('text')
          .attr('x', 8)
          .attr('y', 4)
          .attr('fill', '#00ddff')
          .attr('font-size', '9px')
          .attr('font-weight', '500')
          .text(intel.name)
      })
    }

    // Add pan/zoom interaction
    const zoom = d3.zoom()
      .scaleExtent([1, 8])
      .on('zoom', (event) => {
        const newScale = event.transform.k
        const newTranslation = [event.transform.x, event.transform.y]
        setZoomLevel(newScale)
        setTranslation(newTranslation)
      })

    svg.call(zoom)
    } catch (error) {
      console.error('Error rendering map:', error)
      setError('Failed to render map: ' + error.message)
    }
  }

  const handleZoomIn = () => {
    setZoomLevel(prev => Math.min(prev * 1.2, 8))
  }

  const handleZoomOut = () => {
    setZoomLevel(prev => Math.max(prev / 1.2, 1))
  }

  const handleZoomReset = () => {
    setZoomLevel(1)
    setTranslation([0, 0])
  }

  const handleHotspotClick = (hotspot) => {
    // Find relevant news
    const newsItems = allNews.filter(item => {
      const text = (item.title + ' ' + (item.summary || '')).toLowerCase()
      // Check keywords
      if (hotspot.keywords && hotspot.keywords.some(k => text.includes(k.toLowerCase()))) return true
      // Check name
      if (text.includes(hotspot.name.toLowerCase())) return true
      return false
    }).slice(0, 5)

    setSelectedHotspot({ ...hotspot, type: 'hotspot', news: newsItems })
  }

  const handleIntelHotspotClick = (intel) => {
    // Find relevant news
    const newsItems = allNews.filter(item => {
        const text = (item.title + ' ' + (item.summary || '')).toLowerCase()
        if (intel.keywords && intel.keywords.some(k => text.includes(k.toLowerCase()))) return true
        if (text.includes(intel.name.toLowerCase())) return true
        return false
    }).slice(0, 5)
    setSelectedHotspot({ ...intel, type: 'intel', news: newsItems })
  }

  const closePopup = () => {
    setSelectedHotspot(null)
  }

  if (loading || (!worldData && !usData)) {
    return (
      <div className="global-map-loading">
        <div className="loading-spinner"></div>
        <div>Loading map data...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="global-map-error">
        <div className="error-icon">⚠️</div>
        <div>{error}</div>
        <button onClick={loadMapData} style={{marginTop: '10px', padding: '5px 10px', cursor: 'pointer'}}>
          Retry
        </button>
      </div>
    )
  }

  // Extra safety check - don't render if we don't have the required data for current view
  if (mapView === 'global' && !worldData) {
    return (
      <div className="global-map-loading">
        <div>Loading world map...</div>
      </div>
    )
  }
  
  if (mapView === 'us' && !usData) {
    return (
      <div className="global-map-loading">
        <div>Loading US map...</div>
      </div>
    )
  }

  return (
    <div className="global-map-container" ref={containerRef}>
      <div className="map-controls">
        <div className="map-view-toggle">
          <button 
            className={mapView === 'global' ? 'active' : ''}
            onClick={() => setMapView('global')}
          >
            GLOBAL
          </button>
          <button 
            className={mapView === 'us' ? 'active' : ''}
            onClick={() => setMapView('us')}
          >
            US
          </button>
        </div>
        <div className="map-zoom-controls">
          <button onClick={handleZoomIn} title="Zoom In">+</button>
          <div className="zoom-level">{zoomLevel.toFixed(1)}x</div>
          <button onClick={handleZoomOut} title="Zoom Out">−</button>
          <button onClick={handleZoomReset} title="Reset">RST</button>
        </div>
      </div>
      <div className="map-labels">
        <div className="map-label top-left">SITUATION MAP</div>
        <div className="map-label top-right">OPEN SOURCE</div>
        <div className="map-label bottom-left">
          <span className="legend-item"><span className="legend-dot high"></span>HIGH</span>
          <span className="legend-item"><span className="legend-dot elevated"></span>ELEVATED</span>
          <span className="legend-item"><span className="legend-dot medium"></span>MEDIUM</span>
        </div>
        <div className="map-label bottom-right">{new Date().toISOString().slice(0, 16).replace('T', ' ')}Z</div>
      </div>
      <svg ref={svgRef}></svg>
      {selectedHotspot && (
        <div className="hotspot-popup visible">
          <div className="hotspot-popup-header">
            <div className="hotspot-popup-title">
              {selectedHotspot.name}
              {selectedHotspot.subtext && (
                <span className="hotspot-popup-subtext"> - {selectedHotspot.subtext}</span>
              )}
            </div>
            {selectedHotspot.type === 'hotspot' ? (
              <div className={`hotspot-popup-level ${selectedHotspot.severity || selectedHotspot.level}`}>
                {(selectedHotspot.severity || selectedHotspot.level).toUpperCase()}
              </div>
            ) : (
              <div className="hotspot-popup-level intel">INTEL</div>
            )}
          </div>
          {selectedHotspot.category && (
            <div className="hotspot-popup-category">{selectedHotspot.category}</div>
          )}
          {selectedHotspot.location && (
            <div className="hotspot-popup-location">{selectedHotspot.location}</div>
          )}
          {selectedHotspot.agencies && (
            <div className="hotspot-popup-agencies">
              <strong>Agencies:</strong> {selectedHotspot.agencies.join(', ')}
            </div>
          )}
          <div className="hotspot-popup-desc">
            {selectedHotspot.description || `Situation in ${selectedHotspot.name}. Monitoring for developments.`}
          </div>
          {selectedHotspot.status && (
            <div className="hotspot-popup-status">Status: {selectedHotspot.status}</div>
          )}
          {selectedHotspot.news && selectedHotspot.news.length > 0 && (
            <div className="hotspot-popup-headlines">
              <div className="hotspot-popup-headlines-title">LATEST INTEL</div>
              {selectedHotspot.news.map((item, i) => (
                <div key={i} className="hotspot-popup-headline">
                  <a href={item.link} target="_blank" rel="noopener noreferrer">
                    {item.title}
                  </a>
                  <div className="hotspot-popup-source">{item.source} • {new Date(item.pubDate).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div>
                </div>
              ))}
            </div>
          )}
          {selectedHotspot.keywords && (
            <div className="hotspot-popup-keywords">
              <strong>Keywords:</strong> {selectedHotspot.keywords.join(', ')}
            </div>
          )}
          <div className="hotspot-popup-coords">
            {selectedHotspot.coords 
              ? `${selectedHotspot.coords[0].toFixed(4)}, ${selectedHotspot.coords[1].toFixed(4)}`
              : `${selectedHotspot.lon.toFixed(4)}, ${selectedHotspot.lat.toFixed(4)}`
            }
          </div>
          <button className="hotspot-popup-close" onClick={closePopup}>×</button>
        </div>
      )}
    </div>
  )
}

export default GlobalMap
