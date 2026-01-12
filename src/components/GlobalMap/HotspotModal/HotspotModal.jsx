import './HotspotModal.css'

const HotspotModal = ({ selectedHotspot, onClose }) => {
  if (!selectedHotspot) return null

  return (
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
      <button className="hotspot-popup-close" onClick={onClose}>×</button>
    </div>
  )
}

export default HotspotModal