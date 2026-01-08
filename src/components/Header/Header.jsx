import './Header.css'

const Header = ({ onRefresh, isRefreshing, onOpenSettings, onOpenMonitors }) => {
  return (
    <header className="header">
      <div className="header-left">
        <h1 className="title">SITUATION MONITOR</h1>
        <span className={`status ${isRefreshing ? 'loading' : ''}`}>
          {isRefreshing ? 'REFRESHING...' : 'LIVE'}
        </span>
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
