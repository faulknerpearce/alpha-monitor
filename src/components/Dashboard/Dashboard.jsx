import { useState, useCallback } from 'react'
import Panel from '@components/Panel/Panel'
import ErrorBoundary from '@components/ErrorBoundary/ErrorBoundary'
import { PANELS } from '@config/panels'
import { NEWS_FEEDS } from '@services/feeds'
import NewsPanel from '@components/panels/NewsPanel/NewsPanel'
import StartupsPanel from '@components/panels/StartupsPanel/StartupsPanel'
import VCPanel from '@components/panels/VCPanel/VCPanel'
import BlockchainPanel from '@components/panels/BlockchainPanel/BlockchainPanel'
import WarWatchPanel from '@components/panels/WarWatchPanel/WarWatchPanel'
import GoodNewsPanel from '@components/panels/GoodNewsPanel/GoodNewsPanel'
import AIRacePanel from '@components/panels/AIRacePanel/AIRacePanel'
import LayoffsPanel from '@components/panels/LayoffsPanel/LayoffsPanel'
import CategoryTabs from '@components/CategoryTabs/CategoryTabs'
import TickerStrip from '@components/TickerStrip/TickerStrip'

import './Dashboard.css'

const Dashboard = ({ panelSettings }) => {
  const [draggedPanel, setDraggedPanel] = useState(null)
  const [activeCategory, setActiveCategory] = useState('all')
  const [panelOrder, setPanelOrder] = useState(() => {
    try {
      const saved = localStorage.getItem('situationMonitorPanelOrder')
      const defaultOrder = Object.keys(PANELS).filter(id => id !== 'map')
      return saved ? JSON.parse(saved).filter(id => id !== 'map') : defaultOrder
    } catch (error) {
      console.error('Error loading panel order from localStorage:', error)
      return Object.keys(PANELS).filter(id => id !== 'map')
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

  // Filter panels by active category, exclude markets/heatmap (now in ticker strip)
  const filteredPanels = enabledPanels.filter(id => {
    if (id === 'markets' || id === 'heatmap') return false
    const panelConfig = PANELS[id]
    if (!panelConfig) return false
    if (activeCategory === 'all') return true
    return panelConfig.category === activeCategory
  })

  const getPanelContent = (panelId) => {
    switch (panelId) {
      case 'politics':
        return <NewsPanel feeds={NEWS_FEEDS.politics} title="World / Geopolitical" />
      case 'tech':
        return <NewsPanel feeds={NEWS_FEEDS.tech} title="Technology / AI" />
      case 'finance':
        return <NewsPanel feeds={NEWS_FEEDS.finance} title="Financial" />
      case 'gov':
        return <NewsPanel feeds={NEWS_FEEDS.gov} title="Government / Policy" />
      case 'startups':
        return <StartupsPanel />
      case 'vc':
        return <VCPanel />
      case 'blockchain':
        return <BlockchainPanel />
      case 'warwatch':
        return <WarWatchPanel />
      case 'goodnews':
        return <GoodNewsPanel />
      case 'ai':
        return <AIRacePanel />
      case 'layoffs':
        return <LayoffsPanel />
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


      {/* Ticker strip for markets and sectors */}
      <div className="ticker-section">
        <ErrorBoundary>
          <TickerStrip />
        </ErrorBoundary>
      </div>

      {/* Category Tabs */}
      <CategoryTabs
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
      />

      {/* Filtered panels grid */}
      <div className="news-grid">
        {filteredPanels.map(panelId => {
          const config = PANELS[panelId]
          if (!config) return null

          return (
            <Panel
              key={panelId}
              id={panelId}
              title={config.name}
              draggable={config.draggable}
              isWide={false}
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
