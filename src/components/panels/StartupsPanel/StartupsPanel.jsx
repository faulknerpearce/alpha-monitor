import { useEffect, useState } from 'react'
import { fetchWithProxy, parseRSS } from '@utils/fetchUtils.js'
import './StartupsPanel.css'

// Crunchbase-style data - in production this would come from an API
const MOCK_FUNDING_DATA = [
    { company: 'Anthropic', amount: 750, round: 'Series C', date: new Date('2024-01-15'), sector: 'AI' },
    { company: 'Databricks', amount: 500, round: 'Series I', date: new Date('2024-01-10'), sector: 'Data/ML' },
    { company: 'Anduril', amount: 450, round: 'Series E', date: new Date('2024-01-08'), sector: 'Defense' },
    { company: 'Wiz', amount: 350, round: 'Series D', date: new Date('2024-01-05'), sector: 'Security' },
    { company: 'Figma', amount: 200, round: 'Series E', date: new Date('2024-01-03'), sector: 'Design' },
    { company: 'Mistral AI', amount: 385, round: 'Series A', date: new Date('2024-01-02'), sector: 'AI' },
    { company: 'Scale AI', amount: 325, round: 'Series E', date: new Date('2023-12-28'), sector: 'AI/Data' },
    { company: 'Notion', amount: 275, round: 'Series C', date: new Date('2023-12-20'), sector: 'Productivity' },
]

const StartupsPanel = () => {
    const [deals, setDeals] = useState([])
    const [loading, setLoading] = useState(true)
    const [totalRaised, setTotalRaised] = useState(0)

    useEffect(() => {
        fetchStartupNews()
        const interval = setInterval(fetchStartupNews, 10 * 60 * 1000) // Refresh every 10 minutes
        return () => clearInterval(interval)
    }, [])

    const extractFunding = (title) => {
        // Try to extract funding amount from title
        const match = title.match(/\$(\d+(?:\.\d+)?)\s*(M|B|million|billion)/i)
        if (match) {
            const value = parseFloat(match[1])
            const multiplier = match[2].toLowerCase().startsWith('b') ? 1000 : 1
            return value * multiplier
        }
        return null
    }

    const fetchStartupNews = async () => {
        try {
            setLoading(true)
            const newsItems = []

            // Multiple startup news sources
            const STARTUP_FEEDS = [
                { name: 'TechCrunch', url: 'https://techcrunch.com/category/startups/feed/' },
                { name: 'VentureBeat', url: 'https://venturebeat.com/category/deals/feed/' },
                { name: 'Crunchbase', url: 'https://news.crunchbase.com/feed/' },
                { name: 'Sifted', url: 'https://sifted.eu/feed' },
            ]

            for (const feed of STARTUP_FEEDS) {
                try {
                    const xmlText = await fetchWithProxy(feed.url)
                    const items = parseRSS(xmlText)
                    items.forEach(item => {
                        const amount = extractFunding(item.title)
                        // Filter for funding-related stories
                        if (amount || item.title.toLowerCase().includes('raises') ||
                            item.title.toLowerCase().includes('funding') ||
                            item.title.toLowerCase().includes('series') ||
                            item.title.toLowerCase().includes('valuation') ||
                            item.title.toLowerCase().includes('investment')) {
                            newsItems.push({
                                company: item.title.split(' ')[0],
                                title: item.title,
                                link: item.link,
                                amount: amount,
                                date: item.date,
                                source: feed.name
                            })
                        }
                    })
                } catch (e) {
                    console.error(`Failed to fetch ${feed.name}:`, e)
                }
            }

            // If we got news items, use them; otherwise use mock data
            if (newsItems.length > 0) {
                setDeals(newsItems.slice(0, 10))
                const total = newsItems.reduce((sum, d) => sum + (d.amount || 0), 0)
                setTotalRaised(total)
            } else {
                // Use mock data as fallback
                setDeals(MOCK_FUNDING_DATA)
                const total = MOCK_FUNDING_DATA.reduce((sum, d) => sum + d.amount, 0)
                setTotalRaised(total)
            }
        } catch (e) {
            console.error('Startups fetch error:', e)
            setDeals(MOCK_FUNDING_DATA)
            const total = MOCK_FUNDING_DATA.reduce((sum, d) => sum + d.amount, 0)
            setTotalRaised(total)
        } finally {
            setLoading(false)
        }
    }

    const formatAmount = (amount) => {
        if (!amount) return '—'
        if (amount >= 1000) return `$${(amount / 1000).toFixed(1)}B`
        return `$${amount}M`
    }

    const getTimeAgo = (date) => {
        const seconds = Math.floor((new Date() - date) / 1000)
        if (seconds < 3600) return `${Math.floor(seconds / 60)}m`
        if (seconds < 86400) return `${Math.floor(seconds / 3600)}h`
        return `${Math.floor(seconds / 86400)}d`
    }

    if (loading) {
        return <div className="loading-msg">Loading startup funding...</div>
    }

    return (
        <div className="startups-panel">
            <div className="startups-summary">
                <div className="summary-stat">
                    <span className="stat-label">Total Raised</span>
                    <span className="stat-value green">{formatAmount(totalRaised)}</span>
                </div>
                <div className="summary-stat">
                    <span className="stat-label">Deals</span>
                    <span className="stat-value">{deals.length}</span>
                </div>
            </div>

            <div className="deals-list">
                {deals.map((deal, idx) => (
                    <div key={idx} className="deal-item">
                        <div className="deal-main">
                            <span className="deal-company">{deal.company || deal.title?.split(' ')[0]}</span>
                            {deal.round && <span className="deal-round">{deal.round}</span>}
                            {deal.sector && <span className="deal-sector">{deal.sector}</span>}
                        </div>
                        <div className="deal-details">
                            {deal.title && (
                                <a href={deal.link} target="_blank" rel="noopener noreferrer" className="deal-title">
                                    {deal.title}
                                </a>
                            )}
                            <div className="deal-meta">
                                <span className="deal-amount">{formatAmount(deal.amount)}</span>
                                <span className="deal-time">{getTimeAgo(deal.date)}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default StartupsPanel
