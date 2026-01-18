import GlobalMap from '@components/panels/GlobalMap/GlobalMap'
import TickerStrip from '@components/TickerStrip/TickerStrip'
import './MapPage.css'

const MapPage = () => {
    return (
        <div className="map-page">
            <GlobalMap />
            <TickerStrip />
        </div>
    )
}

export default MapPage