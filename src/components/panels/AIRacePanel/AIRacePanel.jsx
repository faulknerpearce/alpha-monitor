import { useEffect, useState } from 'react'
import { fetchWithProxy, parseRSS } from '@utils/fetchUtils.js'
import './AIRacePanel.css'

// Key players in the AI race
const AI_PLAYERS = [
    { name: 'Nvidia', color: '#76b900' }, // Green
    { name: 'OpenAI', color: '#10a37f' }, // Teal
    { name: 'Google', color: '#4285f4' }, // Blue
    { name: 'Microsoft', color: '#f25022' }, // Red-orange
    { name: 'Anthropic', color: '#d97757' }, // Clay
    { name: 'Meta', color: '#0668e1' }, // Blue
    { name: 'xAI', color: '#ffffff' }, // White
    { name: 'Mistral', color: '#facc15' }, // Yellow
]

const RSS_FEEDS = [
    { name: 'TechCrunch AI', url: 'https://techcrunch.com/category/artificial-intelligence/feed/' },
    { name: 'VentureBeat AI', url: 'https://venturebeat.com/category/ai/feed/' },
    { name: 'The Verge AI', url: 'https://www.theverge.com/rss/ai-artificial-intelligence/index.xml' },
]

const AIRacePanel = () => {
    const [news, setNews] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchNews()
        const interval = setInterval(fetchNews, 10 * 60 * 1000)
        return () => clearInterval(interval)
    }, [])

    const fetchNews = async () => {
        setLoading(true)
        let allItems = []

        for (const feed of RSS_FEEDS) {
            try {
                const xmlText = await fetchWithProxy(feed.url)
                const items = parseRSS(xmlText)
                items.forEach(item => {
                    item.source = feed.name.replace(' AI', '')
                    allItems.push(item)
                })
            } catch (e) {
                console.error(`Failed to fetch ${feed.name}:`, e)
            }
        }

        // Filter for AI terms/players
        const keywords = ['AI', 'GPT', 'LLM', ...AI_PLAYERS.map(p => p.name)]
        allItems = allItems.filter(item =>
            keywords.some(k => item.title.toLowerCase().includes(k.toLowerCase()))
        )

        allItems.sort((a, b) => b.date - a.date)
        setNews(allItems.slice(0, 10))
        setLoading(false)
    }

    const getTimeAgo = (date) => {
        const seconds = Math.floor((new Date() - date) / 1000)
        if (seconds < 3600) return `${Math.floor(seconds / 60)}m`
        if (seconds < 86400) return `${Math.floor(seconds / 3600)}h`
        return `${Math.floor(seconds / 86400)}d`
    }

    return (
        <div className="ai-panel">
            {/* Key Players Chips */}
            <div className="ai-players">
                {AI_PLAYERS.map((player) => (
                    <div
                        key={player.name}
                        className="ai-player-chip"
                        style={{ '--chip-color': player.color }}
                    >
                        {player.name}
                    </div>
                ))}
            </div>

            {/* News Feed */}
            <div className="ai-news">
                {loading && news.length === 0 ? (
                    <div className="loading-msg">Loading AI news...</div>
                ) : (
                    news.map((item, idx) => (
                        <a key={idx} href={item.link} target="_blank" rel="noopener noreferrer" className="ai-news-item">
                            <span className="ai-news-source">{item.source}</span>
                            <span className="ai-news-title">{item.title}</span>
                            <span className="ai-news-time">{getTimeAgo(item.date)}</span>
                        </a>
                    ))
                )}
            </div>
        </div>
    )
}

export default AIRacePanel
