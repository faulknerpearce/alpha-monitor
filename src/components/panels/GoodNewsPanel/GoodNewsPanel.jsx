import { useEffect, useState } from 'react'
import './GoodNewsPanel.css'

const CORS_PROXIES = [
    'https://api.allorigins.win/raw?url=',
    'https://corsproxy.io/?',
]

const GOOD_NEWS_FEEDS = [
    { name: 'Good News Network', url: 'https://www.goodnewsnetwork.org/feed/' },
    { name: 'Positive News', url: 'https://www.positive.news/feed/' },
    { name: 'Reasons to be Cheerful', url: 'https://reasonstobecheerful.world/feed/' },
]

// Positive stats
const POSITIVE_STATS = [
    { label: 'Global Poverty', value: '-50%', detail: 'since 2000' },
    { label: 'Renewable Energy', value: '+300%', detail: 'since 2010' },
    { label: 'Child Mortality', value: '-59%', detail: 'since 1990' },
]

const GoodNewsPanel = () => {
    const [news, setNews] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchNews()
        const interval = setInterval(fetchNews, 10 * 60 * 1000)
        return () => clearInterval(interval)
    }, [])

    const fetchWithProxy = async (url) => {
        for (const proxy of CORS_PROXIES) {
            try {
                const response = await fetch(proxy + encodeURIComponent(url), {
                    signal: AbortSignal.timeout(10000)
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

        for (const feed of GOOD_NEWS_FEEDS) {
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
        setNews(allItems.slice(0, 12))
        setLoading(false)
    }

    const getTimeAgo = (date) => {
        const seconds = Math.floor((new Date() - date) / 1000)
        if (seconds < 3600) return `${Math.floor(seconds / 60)}m`
        if (seconds < 86400) return `${Math.floor(seconds / 3600)}h`
        return `${Math.floor(seconds / 86400)}d`
    }

    if (loading && news.length === 0) {
        return <div className="loading-msg">Loading good news...</div>
    }

    return (
        <div className="goodnews-panel">
            <div className="positive-stats">
                {POSITIVE_STATS.map((stat, idx) => (
                    <div key={idx} className="positive-stat">
                        <span className="stat-value">{stat.value}</span>
                        <span className="stat-label">{stat.label}</span>
                        <span className="stat-detail">{stat.detail}</span>
                    </div>
                ))}
            </div>

            <div className="good-news-list">
                {news.map((item, idx) => (
                    <div key={idx} className="good-item">
                        <span className="good-emoji">✨</span>
                        <div className="good-content">
                            <a href={item.link} target="_blank" rel="noopener noreferrer" className="good-title">
                                {item.title}
                            </a>
                            <div className="good-meta">
                                <span className="good-source">{item.source}</span>
                                <span className="good-time">{getTimeAgo(item.date)}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default GoodNewsPanel
