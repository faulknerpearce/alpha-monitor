import { useEffect, useState } from 'react'
import { LayoffsFeedService } from '@services/feeds'
import './LayoffsPanel.css'

// Real recent major layoffs (2024/2025)
const RECENT_LAYOFFS = [
    { company: 'Intel', count: 15000, date: 'Aug 2024' },
    { company: 'Amazon', count: 14000, date: 'Oct 2024' },
    { company: 'Tesla', count: 14000, date: 'Apr 2024' },
    { company: 'Cisco', count: 10000, date: 'Sep 2024' },
    { company: 'Microsoft', count: 9000, date: 'Jul 2024' },
    { company: 'SAP', count: 9500, date: 'Jan 2024' },
    { company: 'Dell', count: 6000, date: 'Mar 2024' },
    { company: 'PayPal', count: 2500, date: 'Jan 2024' },
    { company: 'Unity', count: 1800, date: 'Jan 2024' },
    { company: 'Expedia', count: 1500, date: 'Feb 2024' },
]

// Mock stats for the header
const LAYOFF_STATS = {
    total2025: 115000, // Est total
    companies: 145,
}

const LayoffsPanel = () => {
    const [news, setNews] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchNews()
        const interval = setInterval(fetchNews, 15 * 60 * 1000)
        return () => clearInterval(interval)
    }, [])

    const fetchNews = async () => {
        try {
            setLoading(true)
            const items = await LayoffsFeedService.fetchLayoffsNews(10)
            setNews(items)
        } catch (e) {
            console.error('Failed to fetch layoff news:', e)
        } finally {
            setLoading(false)
        }
    }

    const formatCount = (count) => {
        if (count >= 1000) return `${(count / 1000).toFixed(1)}K`
        return count.toString()
    }

    const getTimeAgo = (date) => LayoffsFeedService.getTimeAgo(date)

    return (
        <div className="layoffs-panel">
            <div className="layoffs-header-stats">
                <span className="stat-item">
                    <span className="stat-label">Total Affected</span>
                    <span className="stat-value red">{formatCount(LAYOFF_STATS.total2025)}</span>
                </span>
                <span className="stat-item">
                    <span className="stat-label">Events</span>
                    <span className="stat-value">{LAYOFF_STATS.companies}</span>
                </span>
            </div>

            <div className="layoffs-section-title">MAJOR CUTS (2024-25)</div>
            <div className="layoffs-list-container">
                {RECENT_LAYOFFS.map((item, idx) => (
                    <div key={idx} className="layoff-list-row">
                        <span className="layoff-row-name">{item.company}</span>
                        <span className="layoff-row-date">{item.date}</span>
                        <span className="layoff-row-count">-{formatCount(item.count)}</span>
                    </div>
                ))}
            </div>

            <div className="layoffs-section-title">NEWS WIRE</div>
            <div className="layoffs-news-container">
                {loading ? (
                    <div className="loading-msg">Loading layoff news...</div>
                ) : (
                    news.map((item, idx) => (
                        <a key={idx} href={item.link} target="_blank" rel="noopener noreferrer" className="layoff-news-item">
                            <div className="layoff-news-header">
                                <span className="layoff-news-source">{item.source}</span>
                                <span className="layoff-news-time">{getTimeAgo(item.date)}</span>
                            </div>
                            <span className="layoff-news-title">{item.title}</span>
                        </a>
                    ))
                )}
            </div>
        </div>
    )
}

export default LayoffsPanel
