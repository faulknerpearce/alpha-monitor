import { useState } from 'react'
import Header from '@components/Header/Header'
import Dashboard from '@components/Dashboard/Dashboard'
import SettingsModal from '@components/SettingsModal/SettingsModal'
import MonitorForm from '@components/MonitorForm/MonitorForm'
import { usePanelSettings } from '@hooks/usePanelSettings'
import './App.css'

function App() {
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [monitorFormOpen, setMonitorFormOpen] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const { panelSettings } = usePanelSettings()

  const handleRefresh = async () => {
    setIsRefreshing(true)
    // Trigger refresh logic
    setTimeout(() => setIsRefreshing(false), 2000)
  }

  return (
    <div className="app">
      <Header 
        onRefresh={handleRefresh}
        isRefreshing={isRefreshing}
        onOpenSettings={() => setSettingsOpen(true)}
        onOpenMonitors={() => setMonitorFormOpen(true)}
      />
      
      <Dashboard panelSettings={panelSettings} />
      
      <SettingsModal 
        isOpen={settingsOpen}
        onClose={() => setSettingsOpen(false)}
      />
      
      <MonitorForm
        isOpen={monitorFormOpen}
        onClose={() => setMonitorFormOpen(false)}
      />
    </div>
  )
}

export default App
