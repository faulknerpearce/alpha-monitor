import { useState } from 'react'
import './Panel.css'

const Panel = ({ 
  id, 
  title, 
  count, 
  children, 
  isWide = false,
  draggable = true,
  onDragStart,
  onDragEnd,
  onDragOver,
  onDrop
}) => {
  const [collapsed, setCollapsed] = useState(false)

  return (
    <div 
      className={`panel ${isWide ? 'wide' : ''} ${collapsed ? 'collapsed' : ''}`}
      data-panel={id}
      draggable={draggable}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      onDragOver={onDragOver}
      onDrop={onDrop}
    >
      <div className="panel-header" onClick={() => setCollapsed(!collapsed)}>
        <div className="panel-header-left">
          {draggable && <span className="drag-handle">⠿</span>}
          <span className="panel-toggle">{collapsed ? '▶' : '▼'}</span>
          <h3 className="panel-title">{title}</h3>
          {count !== undefined && (
            <span className="panel-count">({count})</span>
          )}
        </div>
      </div>
      {!collapsed && (
        <div className="panel-content">
          {children}
        </div>
      )}
    </div>
  )
}

export default Panel
