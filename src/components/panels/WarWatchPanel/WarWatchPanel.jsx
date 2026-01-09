import { useEffect, useState } from 'react'
import './WarWatchPanel.css'

const CORS_PROXIES = [
    'https://api.allorigins.win/raw?url=',
    'https://corsproxy.io/?',
]

const WAR_FEEDS = [
    { name: 'Defense One', url: 'https://www.defenseone.com/rss/all/' },
    { name: 'War on Rocks', url: 'https://warontherocks.com/feed/' },
    { name: 'Breaking Defense', url: 'https://breakingdefense.com/feed/' },
    { name: 'The War Zone', url: 'https://www.thedrive.com/the-war-zone/feed' },
    { name: 'Janes', url: 'https://www.janes.com/feeds/news' },
]

// Active conflict zones
const CONFLICT_ZONES = [
    { region: 'Ukraine', status: 'active', intensity: 'high' },
    { region: 'Gaza', status: 'active', intensity: 'high' },
    { region: 'Red Sea', status: 'active', intensity: 'medium' },
    { region: 'Myanmar', status: 'active', intensity: 'medium' },
    { region: 'Sudan', status: 'active', intensity: 'high' },
    { region: 'Syria', status: 'ongoing', intensity: 'low' },
]

const WarWatchPanel = () => {
    const [news, setNews] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchNews()
        const interval = setInterval(fetchNews, 5 * 60 * 1000)
        return () => clearInterval(interval)
    }, [])

    const fetchWithProxy = async (url) => {
        for (const proxy of CORS_PROXIES) {
            try {
                const response = await fetch(proxy + encodeURIComponent(url), {
                    signal: AbortSignal.timeout(8000)
                })
                if (response.ok) return await response.text()
            } catch (e) {
                continue
            }
        }
        throw new Error('All proxies failed')
    }

    const parseRSS = (xmlText) => {
        const parser = new DOMParser()
        const xml = parser.parseFromString(xmlText, 'text/xml')
        const items = xml.querySelectorAll('item, entry')
        return Array.from(items).map(item => ({
            title: item.querySelector('title')?.textContent?.trim() || '',
            link: item.querySelector('link')?.textContent?.trim() ||
                item.querySelector('link')?.getAttribute('href') || '',
            date: new Date(item.querySelector('pubDate, published')?.textContent || Date.now()),
        })).filter(item => item.title)
    }

    const fetchNews = async () => {
        setLoading(true)
        const allItems = []

        for (const feed of WAR_FEEDS) {
            try {
                const xmlText = await fetchWithProxy(feed.url)
                const items = parseRSS(xmlText)
                items.slice(0, 5).forEach(item => {
                    allItems.push({ ...item, source: feed.name })
                })
            } catch (e) {
                console.error(`Failed to fetch ${feed.name}:`, e)
            }
        }

        allItems.sort((a, b) => b.date - a.date)
        setNews(allItems.slice(0, 15))
        setLoading(false)
    }

    const getTimeAgo = (date) => {
        const seconds = Math.floor((new Date() - date) / 1000)
        if (seconds < 3600) return `${Math.floor(seconds / 60)}m`
        if (seconds < 86400) return `${Math.floor(seconds / 3600)}h`
        return `${Math.floor(seconds / 86400)}d`
    }

    if (loading && news.length === 0) {
        return <div className="loading-msg">Loading conflict data...</div>
    }

    return (
        <div className="warwatch-panel">
            <div className="conflict-zones">
                {CONFLICT_ZONES.map((zone, idx) => (
                    <div key={idx} className={`conflict-zone intensity-${zone.intensity}`}>
                        <span className="zone-indicator"></span>
                        <span className="zone-name">{zone.region}</span>
                        <span className="zone-intensity">{zone.intensity}</span>
                    </div>
                ))}
            </div>

            <div className="war-news">
                {news.map((item, idx) => (
                    <div key={idx} className="war-item">
                        <div className="war-source">{item.source}</div>
                        <a href={item.link} target="_blank" rel="noopener noreferrer" className="war-title">
                            {item.title}
                        </a>
                        <div className="war-time">{getTimeAgo(item.date)}</div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default WarWatchPanel
