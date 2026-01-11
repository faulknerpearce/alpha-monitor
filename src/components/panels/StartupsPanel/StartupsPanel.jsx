import { useEffect, useState } from 'react'
import { StartupsFeedService } from '@services/feeds'
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

    const fetchStartupNews = async () => {
        try {
            setLoading(true)
            const newsItems = await StartupsFeedService.fetchStartupNews(10)
            
            // If we got news items, use them; otherwise use mock data
            if (newsItems.length > 0) {
                setDeals(newsItems)
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

    const getTimeAgo = (date) => StartupsFeedService.getTimeAgo(date)

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
