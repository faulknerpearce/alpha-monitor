import { useState, useCallback } from 'react'
import Panel from '@components/Panel/Panel'
import ErrorBoundary from '@components/ErrorBoundary/ErrorBoundary'
import { PANELS } from '@config/panels'
import { NEWS_FEEDS } from '@config/feeds'
import GlobalMap from '@components/panels/GlobalMap/GlobalMap'
import NewsPanel from '@components/panels/NewsPanel/NewsPanel'
import MarketsPanel from '@components/panels/MarketsPanel/MarketsPanel'
import HeatmapPanel from '@components/panels/HeatmapPanel/HeatmapPanel'
import './Dashboard.css'

const Dashboard = ({ panelSettings }) => {
  const [draggedPanel, setDraggedPanel] = useState(null)
  const [panelOrder, setPanelOrder] = useState(() => {
    try {
      const saved = localStorage.getItem('situationMonitorPanelOrder')
      return saved ? JSON.parse(saved) : Object.keys(PANELS)
    } catch (error) {
      console.error('Error loading panel order from localStorage:', error)
      return Object.keys(PANELS)
    }
  })

  const handleDragStart = useCallback((panelId) => {
    setDraggedPanel(panelId)
  }, [])

  const handleDragEnd = useCallback(() => {
    setDraggedPanel(null)
  }, [])

  const handleDragOver = useCallback((e) => {
    e.preventDefault()
  }, [])

  const handleDrop = useCallback((targetPanelId) => {
    if (!draggedPanel || draggedPanel === targetPanelId) return

    setPanelOrder(prev => {
      const newOrder = [...prev]
      const draggedIndex = newOrder.indexOf(draggedPanel)
      const targetIndex = newOrder.indexOf(targetPanelId)
      
      newOrder.splice(draggedIndex, 1)
      newOrder.splice(targetIndex, 0, draggedPanel)
      
      localStorage.setItem('situationMonitorPanelOrder', JSON.stringify(newOrder))
      return newOrder
    })
  }, [draggedPanel])

  const enabledPanels = panelOrder.filter(id => panelSettings[id] !== false)

  const getPanelContent = (panelId) => {
    switch (panelId) {
      case 'map':
        return <GlobalMap />
      case 'politics':
        return <NewsPanel feeds={NEWS_FEEDS.politics} title="World / Geopolitical" />
      case 'tech':
        return <NewsPanel feeds={NEWS_FEEDS.tech} title="Technology / AI" />
      case 'finance':
        return <NewsPanel feeds={NEWS_FEEDS.finance} title="Financial" />
      case 'gov':
        return <NewsPanel feeds={NEWS_FEEDS.gov} title="Government / Policy" />
      case 'markets':
        return <MarketsPanel />
      case 'heatmap':
        return <HeatmapPanel />
      default:
        return (
          <div className="panel-placeholder">
            Panel content for {PANELS[panelId]?.name} coming soon
          </div>
        )
    }
  }

  return (
    <main className="dashboard">
      <div className="dashboard-grid">
        {enabledPanels.map(panelId => {
          const config = PANELS[panelId]
          if (!config) return null

          return (
            <Panel
              key={panelId}
              id={panelId}
              title={config.name}
              draggable={config.draggable}
              isWide={panelId === 'map' || panelId === 'tbpn'}
              onDragStart={() => handleDragStart(panelId)}
              onDragEnd={handleDragEnd}
              onDragOver={handleDragOver}
              onDrop={() => handleDrop(panelId)}
            >
              <ErrorBoundary>
                {getPanelContent(panelId)}
              </ErrorBoundary>
            </Panel>
          )
        })}
      </div>
    </main>
  )
}

export default Dashboard
