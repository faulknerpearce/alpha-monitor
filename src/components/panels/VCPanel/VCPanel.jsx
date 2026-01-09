import { useEffect, useState } from 'react'
import { fetchWithProxy, parseRSS } from '@utils/fetchUtils.js'
import './VCPanel.css'

// Expanded VC investment data - in production would come from Crunchbase/PitchBook API
const MOCK_VC_DATA = [
    { firm: 'Andreessen Horowitz', deployed: 2400, deals: 45, focus: 'AI/Crypto', activity: 'high', aum: '35B' },
    { firm: 'Sequoia Capital', deployed: 1800, deals: 38, focus: 'Enterprise', activity: 'high', aum: '85B' },
    { firm: 'Founders Fund', deployed: 1200, deals: 22, focus: 'Deep Tech', activity: 'medium', aum: '11B' },
    { firm: 'Tiger Global', deployed: 950, deals: 28, focus: 'Growth', activity: 'medium', aum: '75B' },
    { firm: 'Khosla Ventures', deployed: 680, deals: 18, focus: 'Climate/AI', activity: 'high', aum: '15B' },
    { firm: 'Lightspeed', deployed: 620, deals: 25, focus: 'Consumer', activity: 'medium', aum: '25B' },
    { firm: 'Accel', deployed: 580, deals: 21, focus: 'SaaS', activity: 'medium', aum: '50B' },
    { firm: 'Greylock', deployed: 420, deals: 15, focus: 'Enterprise', activity: 'low', aum: '5B' },
    { firm: 'General Catalyst', deployed: 750, deals: 32, focus: 'AI/Healthcare', activity: 'high', aum: '25B' },
    { firm: 'Index Ventures', deployed: 540, deals: 19, focus: 'Fintech', activity: 'medium', aum: '16B' },
    { firm: 'Benchmark', deployed: 380, deals: 12, focus: 'Consumer', activity: 'low', aum: '3B' },
    { firm: 'Bessemer', deployed: 620, deals: 28, focus: 'Cloud/SaaS', activity: 'medium', aum: '18B' },
    { firm: 'Insight Partners', deployed: 890, deals: 35, focus: 'Growth', activity: 'high', aum: '90B' },
    { firm: 'NEA', deployed: 520, deals: 22, focus: 'Healthcare', activity: 'medium', aum: '25B' },
    { firm: 'Coatue', deployed: 680, deals: 24, focus: 'Tech/Crypto', activity: 'medium', aum: '45B' },
    { firm: 'Paradigm', deployed: 450, deals: 18, focus: 'Crypto/Web3', activity: 'high', aum: '10B' },
]

const VC_FEEDS = [
    { name: 'StrictlyVC', url: 'https://www.strictlyvc.com/feed/' },
    { name: 'Term Sheet', url: 'https://fortune.com/section/term-sheet/feed/' },
    { name: 'PitchBook', url: 'https://pitchbook.com/news/feed' },
]

const VCPanel = () => {
    const [vcData, setVcData] = useState([])
    const [vcNews, setVcNews] = useState([])
    const [loading, setLoading] = useState(true)
    const [totalDeployed, setTotalDeployed] = useState(0)
    const [totalDeals, setTotalDeals] = useState(0)

    useEffect(() => {
        loadData()
        const interval = setInterval(loadData, 10 * 60 * 1000)
        return () => clearInterval(interval)
    }, [])

    const loadData = async () => {
        setLoading(true)

        // Load mock VC data
        setVcData(MOCK_VC_DATA)
        setTotalDeployed(MOCK_VC_DATA.reduce((sum, v) => sum + v.deployed, 0))
        setTotalDeals(MOCK_VC_DATA.reduce((sum, v) => sum + v.deals, 0))

        // Try to fetch VC news
        const newsItems = []
        for (const feed of VC_FEEDS) {
            try {
                const xmlText = await fetchWithProxy(feed.url)
                const items = parseRSS(xmlText)
                items.slice(0, 3).forEach(item => {
                    newsItems.push({ ...item, source: feed.name })
                })
            } catch (e) {
                console.error(`Failed to fetch ${feed.name}:`, e)
            }
        }
        setVcNews(newsItems.slice(0, 6))
        setLoading(false)
    }

    const formatAmount = (amount) => {
        if (amount >= 1000) return `$${(amount / 1000).toFixed(1)}B`
        return `$${amount}M`
    }

    const getActivityClass = (activity) => `activity-${activity}`

    const getTimeAgo = (date) => {
        const seconds = Math.floor((new Date() - date) / 1000)
        if (seconds < 3600) return `${Math.floor(seconds / 60)}m`
        if (seconds < 86400) return `${Math.floor(seconds / 3600)}h`
        return `${Math.floor(seconds / 86400)}d`
    }

    if (loading) {
        return <div className="loading-msg">Loading VC activity...</div>
    }

    return (
        <div className="vc-panel">
            <div className="vc-summary">
                <div className="summary-stat">
                    <span className="stat-label">Total Deployed</span>
                    <span className="stat-value purple">{formatAmount(totalDeployed)}</span>
                </div>
                <div className="summary-stat">
                    <span className="stat-label">Deals</span>
                    <span className="stat-value">{totalDeals}</span>
                </div>
                <div className="summary-stat">
                    <span className="stat-label">Firms</span>
                    <span className="stat-value">{vcData.length}</span>
                </div>
            </div>

            {vcNews.length > 0 && (
                <div className="vc-news">
                    <div className="vc-news-header">Latest VC News</div>
                    {vcNews.map((news, idx) => (
                        <a key={idx} href={news.link} target="_blank" rel="noopener noreferrer" className="vc-news-item">
                            <span className="vc-news-source">{news.source}</span>
                            <span className="vc-news-title">{news.title}</span>
                            <span className="vc-news-time">{getTimeAgo(news.date)}</span>
                        </a>
                    ))}
                </div>
            )}

            <div className="vc-list">
                {vcData.map((vc, idx) => (
                    <div key={idx} className="vc-item">
                        <div className="vc-main">
                            <div className="vc-info">
                                <span className="vc-name">{vc.firm}</span>
                                <span className="vc-aum">{vc.aum} AUM</span>
                                <span className="vc-focus">{vc.focus}</span>
                            </div>
                            <div className={`vc-activity ${getActivityClass(vc.activity)}`}>
                                <span className="activity-dot"></span>
                                {vc.activity}
                            </div>
                        </div>
                        <div className="vc-stats">
                            <div className="vc-stat">
                                <span className="vc-stat-value">{formatAmount(vc.deployed)}</span>
                                <span className="vc-stat-label">deployed</span>
                            </div>
                            <div className="vc-stat">
                                <span className="vc-stat-value">{vc.deals}</span>
                                <span className="vc-stat-label">deals</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default VCPanel

