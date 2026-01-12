import { useEffect, useRef, useState } from 'react'
import * as d3 from 'd3'
import * as topojson from 'topojson-client'
import {
  US_CITIES, SHIPPING_CHOKEPOINTS, MILITARY_BASES,
  NUCLEAR_FACILITIES, UNDERSEA_CABLES, CYBER_REGIONS
} from '@config/regions.js'
import { MapFeedService } from '@services/feeds_map'
import { useDynamicRegions } from '@services/useDynamicRegions.js'
import './GlobalMap.css'

const GlobalMap = () => {
  const svgRef = useRef(null)
  const containerRef = useRef(null)
  const rotationRef = useRef([0, 0]) // Ref to track rotation for drag callbacks
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [mapView, setMapView] = useState('global') // 'global' or 'us'
  const [worldData, setWorldData] = useState(null)
  const [usData, setUsData] = useState(null)
  const [selectedHotspot, setSelectedHotspot] = useState(null)
  const [allNews, setAllNews] = useState([])

  // Use dynamic regions hook
  const { hotspots, intelHotspots, usHotspots, conflictZones, lastUpdated } = useDynamicRegions()

  // Zoom state
  const [zoomLevel, setZoomLevel] = useState(1)
  const [translation, setTranslation] = useState([0, 0])
  const [rotation, setRotation] = useState([0, 0]) // [longitude, latitude] rotation for globe

  // Layer visibility state
  const [layerVisibility, setLayerVisibility] = useState({
    hotspots: false,
    intelHotspots: true,
    shippingChokepoints: false,
    conflictZones: false,
    militaryBases: false,
    nuclearFacilities: false,
    underseaCables: false,
    cyberRegions: false,
    usCities: false
  })

  useEffect(() => {
    loadMapData()
    fetchMapNews()
    // Refetch news every 5 minutes
    const newsInterval = setInterval(fetchMapNews, 5 * 60 * 1000)
    return () => clearInterval(newsInterval)
  }, [])

  // Update layer visibility based on map view
  useEffect(() => {
    setLayerVisibility(prev => ({
      ...prev,
      hotspots: mapView === 'us',
      usCities: mapView === 'us'
    }))
  }, [mapView])

  const fetchMapNews = async () => {
    try {
      const news = await MapFeedService.fetchMapNews()
      setAllNews(news)
      console.log('All news fetched:', news.length, 'items')
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
    // Only re-render when essential dependencies change - lastUpdated timestamp handles dynamic data updates
  }, [worldData, usData, mapView, zoomLevel, translation, rotation, layerVisibility, lastUpdated])

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
      setWorldData(world)

      // Load US map topology data
      const usResponse = await fetch('https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json')
      if (!usResponse.ok) {
        throw new Error(`Failed to fetch US map: ${usResponse.status}`)
      }
      const us = await usResponse.json()
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
        // Dynamic projection based on zoom level
        if (zoomLevel <= 2) {
          // Use orthographic projection for spherical globe appearance when zoomed out
          projection = d3.geoOrthographic()
            .scale((width / 2) * zoomLevel * 0.8)
            .translate([width / 2, height / 2])
            .center([0, 0])
            .rotate(rotation)
        } else {
          // Use natural earth projection for flatter appearance when zoomed in
          projection = d3.geoNaturalEarth1()
            .scale((width / (2 * Math.PI)) * zoomLevel)
            .translate([width / 2 + translation[0], height / 2 + translation[1]])
            .center([180, 0])
        }
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

        // Add additional layers (Global Only)
        // Shipping Chokepoints
        if (layerVisibility.shippingChokepoints) {
          const chokeGroup = svg.append('g').attr('class', 'chokepoints')
          SHIPPING_CHOKEPOINTS.forEach(point => {
            const projected = projection([point.lon, point.lat])
            if (!projected) return
            const [x, y] = projected
            if (x === undefined || y === undefined || isNaN(x) || isNaN(y)) return
            const g = chokeGroup.append('g')
              .attr('transform', `translate(${x},${y})`)
              .style('cursor', 'pointer')
              .on('click', () => handleHotspotClick({ ...point, type: 'chokepoint' }))

            g.append('rect')
              .attr('x', -6).attr('y', -6)
              .attr('width', 12).attr('height', 12)
              .attr('fill', '#00ff00')
              .attr('stroke', '#ffffff')
              .attr('stroke-width', 1)

            g.append('text')
              .attr('x', 0)
              .attr('y', -15)
              .attr('text-anchor', 'middle')
              .attr('fill', '#00ff00')
              .attr('stroke', '#ffffff')
              .attr('stroke-width', '0.5px')
              .attr('font-size', '10px')
              .text(point.name)
          })
        }

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
          .style('cursor', 'pointer')
          .on('click', (event, d) => handleCountryClick(d))
          .on('mouseenter', function (event, d) {
            d3.select(this)
              .attr('fill', '#1a4030')
              .attr('stroke', '#2a8070')
          })
          .on('mouseleave', function (event, d) {
            d3.select(this).attr('fill', '#0a2018').attr('stroke', '#0f5040')
          })
      }

      if (mapView === 'us') {
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
          .on('mouseenter', function (event, d) {
            d3.select(this)
              .attr('fill', '#1a4030')
              .attr('stroke', '#2a8070')
          })
          .on('mouseleave', function (event, d) {
            d3.select(this).attr('fill', '#0a2018').attr('stroke', '#0f5040')
          })

        // Render US cities from config
        if (layerVisibility.usCities) {
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
              .attr('fill', city.type === 'capital' ? '#ffcc00' : city.type === 'military' ? '#ff6600' : '#00ff00')

            group.append('text')
              .attr('class', 'us-city-label')
              .attr('x', 8)
              .attr('y', 4)
              .text(city.name)
          })
        }
      }

      // Add hotspots (global hotspots for global view, US hotspots for US view)
      if (layerVisibility.hotspots) {
        const hotspotsData = mapView === 'global' ? Object.values(hotspots) : usHotspots

        const hotspotsGroup = svg.append('g').attr('class', 'hotspots')

        hotspotsData.forEach(hotspot => {
          const coords = [hotspot.lon, hotspot.lat]
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
            .attr('class', severity === 'high' ? 'hotspot-pulse' : '')

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
      }

      // Add additional layers (Global Only)
      if (mapView === 'global') {
        // Shipping Chokepoints
        if (layerVisibility.shippingChokepoints) {
          const chokeGroup = svg.append('g').attr('class', 'chokepoints')
          SHIPPING_CHOKEPOINTS.forEach(point => {
            const projected = projection([point.lon, point.lat])
            if (!projected) return
            const [x, y] = projected
            if (x === undefined || y === undefined || isNaN(x) || isNaN(y)) return
            const g = chokeGroup.append('g')
              .attr('transform', `translate(${x},${y})`)
              .style('cursor', 'pointer')
              .on('click', () => handleHotspotClick({ ...point, type: 'chokepoint' }))

            g.append('rect')
              .attr('x', -6).attr('y', -6)
              .attr('width', 12).attr('height', 12)
              .attr('fill', '#00ff00')
              .attr('stroke', '#ffffff')
              .attr('stroke-width', 1)
          })
        }

        // Conflict Zones
        if (layerVisibility.conflictZones) {
          const conflictGroup = svg.append('g').attr('class', 'conflict-zones')
          conflictZones.forEach(zone => {
            const projected = projection([zone.labelPos.lon, zone.labelPos.lat])
            if (!projected) return
            const [x, y] = projected
            if (x === undefined || y === undefined || isNaN(x) || isNaN(y)) return

            const intensity = zone.intensity || 'medium'
            const color = intensity === 'high' ? '#ff3333' : intensity === 'elevated' ? '#ffcc00' : '#00ff88'

            const g = conflictGroup.append('g')
              .attr('transform', `translate(${x},${y})`)
              .style('cursor', 'pointer')
              .on('click', () => handleHotspotClick({ ...zone, type: 'conflict' }))

            g.append('circle')
              .attr('r', 10)
              .attr('fill', `${color}33`) // Add alpha
              .attr('stroke', color)
              .attr('stroke-dasharray', '2,2')

            // X symbol for conflict (larger)
            g.append('path')
              .attr('d', 'M-6,-6 L6,6 M6,-6 L-6,6')
              .attr('stroke', color)
              .attr('stroke-width', 2)
              .attr('fill', 'none')
          })
        }

        // Military Bases
        if (layerVisibility.militaryBases) {
          const baseGroup = svg.append('g').attr('class', 'military-bases')
          MILITARY_BASES.forEach(base => {
            const projected = projection([base.lon, base.lat])
            if (!projected) return
            const [x, y] = projected
            if (x === undefined || y === undefined || isNaN(x) || isNaN(y)) return
            const g = baseGroup.append('g')
              .attr('transform', `translate(${x},${y})`)
              .style('cursor', 'pointer')
              .on('click', () => handleHotspotClick({ ...base, type: 'base' }))

            g.append('circle')
              .attr('r', 6)
              .attr('fill', '#888888')
              .attr('stroke', '#666666')
          })
        }

        // Nuclear Facilities
        if (layerVisibility.nuclearFacilities) {
          const nucGroup = svg.append('g').attr('class', 'nuclear-facilities')
          NUCLEAR_FACILITIES.forEach(nuc => {
            const projected = projection([nuc.lon, nuc.lat])
            if (!projected) return
            const [x, y] = projected
            if (x === undefined || y === undefined || isNaN(x) || isNaN(y)) return
            const g = nucGroup.append('g')
              .attr('transform', `translate(${x},${y})`)
              .style('cursor', 'pointer')
              .on('click', () => handleHotspotClick({ ...nuc, type: 'nuclear' }))

            g.append('circle').attr('r', 4).attr('fill', '#ffff00').attr('stroke', '#000')

            // Radiation symbol (three blades, larger)
            g.append('path')
              .attr('d', 'M0,-7.5 L1.5,-3 L-1.5,-3 Z M-4.5,0 L-1.5,-1.5 L-1.5,1.5 Z M4.5,0 L1.5,-1.5 L1.5,1.5 Z')
              .attr('fill', '#000')
              .attr('stroke', 'none')
          })
        }

        // Undersea Cables
        if (layerVisibility.underseaCables) {
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
        }

        // Cyber Regions
        if (layerVisibility.cyberRegions) {
          const cyberGroup = svg.append('g').attr('class', 'cyber-regions')
          CYBER_REGIONS.forEach(reg => {
            const projected = projection([reg.lon, reg.lat])
            if (!projected) return
            const [x, y] = projected
            if (x === undefined || y === undefined || isNaN(x) || isNaN(y)) return
            const g = cyberGroup.append('g')
              .attr('transform', `translate(${x},${y})`)
              .style('cursor', 'pointer')
              .on('click', () => handleHotspotClick({ ...reg, type: 'cyber' }))

            g.append('rect')
              .attr('x', -8).attr('y', -8)
              .attr('width', 16).attr('height', 16)
              .attr('fill', 'none')
              .attr('stroke', '#00ff00')
              .attr('stroke-width', 1)
              .attr('stroke-dasharray', '2,2')

            // Circuit symbol (simple lines, larger)
            g.append('path')
              .attr('d', 'M-6,-3 L6,-3 M-6,3 L6,3 M-3,-6 L-3,6 M3,-6 L3,6')
              .attr('stroke', '#00ff00')
              .attr('stroke-width', 1.5)
              .attr('fill', 'none')
          })
        }

      }

      // Intelligence Hotspots (show on both global and US maps)
      if (layerVisibility.intelHotspots) {
        const intelGroup = svg.append('g').attr('class', 'intel-hotspots')

        intelHotspots.forEach(intel => {
          // Skip DC in US view since it's already rendered as a city
          if (mapView === 'us' && intel.id === 'dc') return

          const projected = projection([intel.lon, intel.lat])
          if (!projected) return
          const [x, y] = projected
          if (x === undefined || y === undefined || isNaN(x) || isNaN(y)) return

          // Determine severity for intel hotspots
          let severity = 'medium' // default
          if (intel.id === 'dc') severity = 'high' // DC is a major intelligence hub
          else if (intel.status && intel.status.includes('High')) severity = 'high'
          else if (intel.status && intel.status.includes('Elevated')) severity = 'elevated'

          const group = intelGroup.append('g')
            .attr('class', `intel-hotspot ${severity}`)
            .attr('transform', `translate(${x},${y})`)
            .style('cursor', 'pointer')
            .on('click', () => handleIntelHotspotClick({ ...intel, severity }))

          // Pulsing ring (like regular hotspots)
          group.append('circle')
            .attr('r', 8)
            .attr('fill', 'none')
            .attr('stroke', severity === 'high' ? '#ff3333' : severity === 'elevated' ? '#ffcc00' : '#00ff88')
            .attr('stroke-width', 2)
            .attr('opacity', 0.8)
            .attr('class', severity === 'high' ? 'hotspot-pulse' : '')

          // Inner dot (like regular hotspots)
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
            .text(intel.name)
        })
      }

      // Add globe rotation drag behavior (only for orthographic projection)
      if (mapView === 'global' && zoomLevel <= 2) {
        const drag = d3.drag()
          .on('start', function () {
            d3.select(this).style('cursor', 'grabbing')
          })
          .on('drag', function (event) {
            const sensitivity = 0.5
            const currentRotation = rotationRef.current
            const newRotation = [
              currentRotation[0] + event.dx * sensitivity,
              Math.max(-90, Math.min(90, currentRotation[1] - event.dy * sensitivity))
            ]
            rotationRef.current = newRotation
            setRotation(newRotation)
          })
          .on('end', function () {
            d3.select(this).style('cursor', 'grab')
          })

        svg.call(drag)
        svg.style('cursor', 'grab')
      } else {
        // Add pan/zoom interaction for flat map
        const zoom = d3.zoom()
          .scaleExtent([1, 8])
          .on('zoom', (event) => {
            const newScale = event.transform.k
            const newTranslation = [event.transform.x, event.transform.y]
            setZoomLevel(newScale)
            setTranslation(newTranslation)
          })

        svg.call(zoom)
      }

      // Always allow zooming via scroll
      svg.on('wheel.zoom', function (event) {
        event.preventDefault()
        const delta = event.deltaY > 0 ? 0.9 : 1.1
        const newZoom = Math.max(1, Math.min(8, zoomLevel * delta))
        setZoomLevel(newZoom)
      })
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
    setRotation([0, 0])
    rotationRef.current = [0, 0]
  }

  const toggleLayer = (layer) => {
    setLayerVisibility(prev => ({
      ...prev,
      [layer]: !prev[layer]
    }))
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

    // Normalize description field - some use 'desc' instead of 'description'
    const normalizedHotspot = {
      ...hotspot,
      description: hotspot.description || hotspot.desc || `Monitoring situation in ${hotspot.name}.`,
      type: hotspot.type || 'hotspot',
      news: newsItems
    }

    setSelectedHotspot(normalizedHotspot)
  }

  const handleIntelHotspotClick = (intel) => {
    // Find relevant news
    const newsItems = allNews.filter(item => {
      const text = (item.title + ' ' + (item.summary || '')).toLowerCase()

      // Standard keyword matching
      if (intel.keywords && intel.keywords.some(k => text.includes(k.toLowerCase()))) return true
      if (text.includes(intel.name.toLowerCase())) return true
      return false
    }).slice(0, 5)
    console.log(`Intel hotspot ${intel.id} clicked, news items found:`, newsItems.length, newsItems)
    setSelectedHotspot({ ...intel, type: 'intel', news: newsItems })
  }

  const handleCountryClick = (countryFeature) => {
    // Get country name from properties
    const countryName = countryFeature.properties?.NAME || countryFeature.properties?.name || 'Unknown Country'

    // Find relevant news for this country
    const newsItems = allNews.filter(item => {
      const text = (item.title + ' ' + (item.summary || '')).toLowerCase()
      return text.includes(countryName.toLowerCase())
    }).slice(0, 5)

    setSelectedHotspot({
      name: countryName,
      type: 'country',
      news: newsItems,
      location: countryName
    })
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
        <div className="error-icon">!</div>
        <div>{error}</div>
        <button onClick={loadMapData} style={{ marginTop: '10px', padding: '5px 10px', cursor: 'pointer' }}>
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
      <div className="map-controls map-controls-right">
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
      <div className="map-controls map-controls-left">
        <div className="map-layer-toggles">
          <div className="layer-toggle-group">
            <button
              className={`layer-toggle ${layerVisibility.hotspots ? 'active' : ''}`}
              onClick={() => toggleLayer('hotspots')}
              title="Toggle Hotspots"
            >
              HOT
            </button>
            <button
              className={`layer-toggle ${layerVisibility.intelHotspots ? 'active' : ''}`}
              onClick={() => toggleLayer('intelHotspots')}
              title="Toggle Intelligence Hotspots"
            >
              INTEL
            </button>
            {mapView === 'us' && (
              <button
                className={`layer-toggle ${layerVisibility.usCities ? 'active' : ''}`}
                onClick={() => toggleLayer('usCities')}
                title="Toggle US Cities"
              >
                CITIES
              </button>
            )}
          </div>
          {mapView === 'global' && (
            <div className="layer-toggle-group">
              <button
                className={`layer-toggle ${layerVisibility.shippingChokepoints ? 'active' : ''}`}
                onClick={() => toggleLayer('shippingChokepoints')}
                title="Toggle Shipping Chokepoints"
              >
                SHIP
              </button>
              <button
                className={`layer-toggle ${layerVisibility.conflictZones ? 'active' : ''}`}
                onClick={() => toggleLayer('conflictZones')}
                title="Toggle Conflict Zones"
              >
                WAR
              </button>
              <button
                className={`layer-toggle ${layerVisibility.militaryBases ? 'active' : ''}`}
                onClick={() => toggleLayer('militaryBases')}
                title="Toggle Military Bases"
              >
                BASE
              </button>
              <button
                className={`layer-toggle ${layerVisibility.nuclearFacilities ? 'active' : ''}`}
                onClick={() => toggleLayer('nuclearFacilities')}
                title="Toggle Nuclear Facilities"
              >
                NUKE
              </button>
              <button
                className={`layer-toggle ${layerVisibility.underseaCables ? 'active' : ''}`}
                onClick={() => toggleLayer('underseaCables')}
                title="Toggle Undersea Cables"
              >
                CABLE
              </button>
              <button
                className={`layer-toggle ${layerVisibility.cyberRegions ? 'active' : ''}`}
                onClick={() => toggleLayer('cyberRegions')}
                title="Toggle Cyber Regions"
              >
                CYBER
              </button>
            </div>
          )}
        </div>
      </div>
      <div className="map-labels">
        <div className="map-label bottom-left">
          <span className="legend-item"><span className="legend-dot high"></span>HIGH</span>
          <span className="legend-item"><span className="legend-dot elevated"></span>ELEVATED</span>
          <span className="legend-item"><span className="legend-dot medium"></span>MEDIUM</span>
        </div>
        <div className="map-label bottom-right">
          <div>{new Date().toISOString().slice(0, 16).replace('T', ' ')}Z</div>
          <div style={{ fontSize: '9px', opacity: 0.7 }}>
            Updated: {lastUpdated.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </div>
        </div>
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
              <div className={`hotspot-popup-level ${selectedHotspot.severity || selectedHotspot.level || 'unknown'}`}>
                {(selectedHotspot.severity || selectedHotspot.level || 'unknown').toUpperCase()}
              </div>
            ) : selectedHotspot.type === 'country' ? (
              <div className="hotspot-popup-level country">COUNTRY</div>
            ) : selectedHotspot.type === 'intel' ? (
              <div className={`hotspot-popup-level ${selectedHotspot.severity || 'unknown'}`}>
                {(selectedHotspot.severity || 'unknown').toUpperCase()}
              </div>
            ) : selectedHotspot.type === 'chokepoint' ? (
              <div className="hotspot-popup-level elevated">SHIPPING</div>
            ) : selectedHotspot.type === 'conflict' ? (
              <div className="hotspot-popup-level high">CONFLICT</div>
            ) : selectedHotspot.type === 'base' ? (
              <div className="hotspot-popup-level medium">MILITARY BASE</div>
            ) : selectedHotspot.type === 'nuclear' ? (
              <div className="hotspot-popup-level high">NUCLEAR</div>
            ) : selectedHotspot.type === 'cyber' ? (
              <div className="hotspot-popup-level elevated">CYBER</div>
            ) : selectedHotspot.type === 'city' ? (
              <div className={`hotspot-popup-level ${selectedHotspot.severity || 'medium'}`}>
                {selectedHotspot.severity && typeof selectedHotspot.severity === 'string' ? selectedHotspot.severity.toUpperCase() : 'CITY'}
              </div>
            ) : (
              <div className="hotspot-popup-level unknown">LOCATION</div>
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
          {selectedHotspot.region && (
            <div className="hotspot-popup-location">
              <strong>Region:</strong> {selectedHotspot.region}
            </div>
          )}
          {selectedHotspot.traffic && (
            <div className="hotspot-popup-status">
              <strong>Traffic:</strong> {selectedHotspot.traffic}
            </div>
          )}
          {selectedHotspot.sectors && (
            <div className="hotspot-popup-sectors">
              <strong>Sectors:</strong> {selectedHotspot.sectors.join(', ')}
            </div>
          )}
          {selectedHotspot.group && (
            <div className="hotspot-popup-category">
              <strong>Group:</strong> {selectedHotspot.group} {selectedHotspot.aka && `(${selectedHotspot.aka})`}
            </div>
          )}
          {selectedHotspot.sponsor && (
            <div className="hotspot-popup-status">
              <strong>Sponsor:</strong> {selectedHotspot.sponsor}
            </div>
          )}
          {selectedHotspot.targets && (
            <div className="hotspot-popup-targets">
              <strong>Targets:</strong> {selectedHotspot.targets.join(', ')}
            </div>
          )}
          {selectedHotspot.parties && (
            <div className="hotspot-popup-parties">
              <strong>Parties:</strong> {selectedHotspot.parties.join(', ')}
            </div>
          )}
          {selectedHotspot.intensity && (
            <div className="hotspot-popup-status">
              <strong>Intensity:</strong> {typeof selectedHotspot.intensity === 'string' ? selectedHotspot.intensity.toUpperCase() : selectedHotspot.intensity}
            </div>
          )}
          {selectedHotspot.casualties && (
            <div className="hotspot-popup-status">
              <strong>Casualties:</strong> {selectedHotspot.casualties}
            </div>
          )}
          {selectedHotspot.displaced && (
            <div className="hotspot-popup-status">
              <strong>Displaced:</strong> {selectedHotspot.displaced}
            </div>
          )}
          {selectedHotspot.population && (
            <div className="hotspot-popup-status">
              <strong>Population:</strong> {selectedHotspot.population}
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
                  <div className="hotspot-popup-source">{item.source} • {new Date(item.pubDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                </div>
              ))}
            </div>
          )}
          {selectedHotspot.keywords && (
            <div className="hotspot-popup-keywords">
              <strong>Keywords:</strong> {selectedHotspot.keywords.join(', ')}
            </div>
          )}
          {((selectedHotspot.coords && selectedHotspot.coords[0] !== undefined) ||
            (selectedHotspot.lon !== undefined && selectedHotspot.lat !== undefined)) && (
              <div className="hotspot-popup-coords">
                {selectedHotspot.coords
                  ? `${selectedHotspot.coords[0].toFixed(4)}, ${selectedHotspot.coords[1].toFixed(4)}`
                  : `${selectedHotspot.lon.toFixed(4)}, ${selectedHotspot.lat.toFixed(4)}`
                }
              </div>
            )}
          <button className="hotspot-popup-close" onClick={closePopup}>×</button>
        </div>
      )}
    </div>
  )
}

export default GlobalMap
