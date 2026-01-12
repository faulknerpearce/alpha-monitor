import { useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from '@components/Navbar/Navbar'
import Dashboard from '@components/Dashboard/Dashboard'
import GlobalMap from '@components/GlobalMap/GlobalMap'
import SettingsModal from '@components/SettingsModal/SettingsModal'
import MonitorForm from '@components/MonitorForm/MonitorForm'
import { usePanelSettings } from '@services/usePanelSettings'
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
    <BrowserRouter>
      <div className="app">
        <Navbar
          onRefresh={handleRefresh}
          isRefreshing={isRefreshing}
          onOpenSettings={() => setSettingsOpen(true)}
          onOpenMonitors={() => setMonitorFormOpen(true)}
        />

        <Routes>
          <Route path="/" element={<Dashboard panelSettings={panelSettings} />} />
          <Route path="/map" element={<GlobalMap />} />
        </Routes>

        <SettingsModal
          isOpen={settingsOpen}
          onClose={() => setSettingsOpen(false)}
        />

        <MonitorForm
          isOpen={monitorFormOpen}
          onClose={() => setMonitorFormOpen(false)}
        />
      </div>
    </BrowserRouter>
  )
}

export default App
