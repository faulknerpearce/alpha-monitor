import { useState, useEffect } from 'react'
import './Header.css'

const Header = ({ onRefresh, isRefreshing, onOpenSettings, onOpenMonitors }) => {
  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    })
  }

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    }).toUpperCase()
  }

  return (
    <header className="header">
      <div className="header-left">
        <h1 className="title">SITUATION MONITOR</h1>
        <div className="status-container">
          <span className={`status ${isRefreshing ? 'loading' : ''}`}>
            {!isRefreshing && <span className="live-dot"></span>}
            {isRefreshing ? 'REFRESHING...' : 'LIVE'}
          </span>
        </div>
        <div className="header-time">
          <span className="time-date">{formatDate(currentTime)}</span>
          <span className="time-clock">{formatTime(currentTime)}</span>
        </div>
      </div>
      <div className="header-right">
        <button
          className="refresh-btn"
          onClick={onRefresh}
          disabled={isRefreshing}
        >
          ↻ REFRESH
        </button>
        <button
          className="monitors-btn"
          onClick={onOpenMonitors}
        >
          ⊕ MONITORS
        </button>
        <button
          className="settings-btn"
          onClick={onOpenSettings}
        >
          ⚙ SETTINGS
        </button>
      </div>
    </header>
  )
}

export default Header

