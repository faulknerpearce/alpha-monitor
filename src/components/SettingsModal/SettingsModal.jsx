import { useTheme } from '../../context/ThemeContext'
import './SettingsModal.css'

const SettingsModal = ({ isOpen, onClose }) => {
  const { currentTheme, setCurrentTheme, themes } = useTheme()

  if (!isOpen) return null

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Settings</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <div className="modal-body">
          <div className="settings-section">
            <h3>Appearance</h3>
            <div className="theme-grid">
              {Object.entries(themes).map(([key, theme]) => (
                <button
                  key={key}
                  className={`theme-card ${currentTheme === key ? 'active' : ''}`}
                  onClick={() => setCurrentTheme(key)}
                  style={{
                    backgroundColor: theme.colors['--bg-dark'],
                    borderColor: theme.colors['--border-color']
                  }}
                >
                  <div className="theme-preview">
                    <div className="preview-swatch" style={{ background: theme.colors['--bg-panel'] }}></div>
                    <div className="preview-swatch" style={{ background: theme.colors['--accent'] }}></div>
                    <div className="preview-swatch" style={{ background: theme.colors['--text-primary'] }}></div>
                  </div>
                  <span className="theme-name" style={{ color: theme.colors['--text-primary'] }}>
                    {theme.name}
                  </span>
                  {currentTheme === key && (
                    <div className="theme-check" style={{ color: theme.colors['--accent'] }}>✓</div>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SettingsModal
