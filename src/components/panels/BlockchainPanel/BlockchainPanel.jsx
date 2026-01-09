import { useEffect, useState } from 'react'
import { fetchWithProxy, parseRSS } from '@utils/fetchUtils.js'
import './BlockchainPanel.css'

const CRYPTO_FEEDS = [
    { name: 'CoinDesk', url: 'https://www.coindesk.com/arc/outboundfeeds/rss/' },
    { name: 'Cointelegraph', url: 'https://cointelegraph.com/rss' },
    { name: 'The Block', url: 'https://www.theblock.co/rss.xml' },
]

// Mock on-chain data
const MOCK_CHAIN_DATA = {
    btcHashrate: '512 EH/s',
    ethGas: '28 gwei',
    defiTvl: '$48.2B',
    nftVolume: '$12.4M',
}

const BlockchainPanel = () => {
    const [news, setNews] = useState([])
    const [chainData, setChainData] = useState(MOCK_CHAIN_DATA)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchCryptoNews()
        const interval = setInterval(fetchCryptoNews, 5 * 60 * 1000)
        return () => clearInterval(interval)
    }, [])

    const fetchCryptoNews = async () => {
        try {
            setLoading(true)
            const allItems = []
            let successCount = 0

            for (const feed of CRYPTO_FEEDS) {
                try {
                    const xmlText = await fetchWithProxy(feed.url)
                    const items = parseRSS(xmlText)
                    items.forEach(item => {
                        item.source = feed.name
                    })
                    allItems.push(...items)
                    successCount++
                } catch (e) {
                    console.error(`Failed to fetch ${feed.name}:`, e)
                }
            }

            allItems.sort((a, b) => b.date - a.date)
            setNews(allItems.slice(0, 15))
        } catch (e) {
            console.error('Crypto news fetch error:', e)
        } finally {
            setLoading(false)
        }
    }

    const getTimeAgo = (date) => {
        const seconds = Math.floor((new Date() - date) / 1000)
        if (seconds < 3600) return `${Math.floor(seconds / 60)}m`
        if (seconds < 86400) return `${Math.floor(seconds / 3600)}h`
        return `${Math.floor(seconds / 86400)}d`
    }

    if (loading && news.length === 0) {
        return <div className="loading-msg">Loading blockchain data...</div>
    }

    return (
        <div className="blockchain-panel">
            <div className="chain-stats">
                <div className="chain-stat">
                    <span className="chain-stat-label">BTC Hashrate</span>
                    <span className="chain-stat-value">{chainData.btcHashrate}</span>
                </div>
                <div className="chain-stat">
                    <span className="chain-stat-label">ETH Gas</span>
                    <span className="chain-stat-value">{chainData.ethGas}</span>
                </div>
                <div className="chain-stat">
                    <span className="chain-stat-label">DeFi TVL</span>
                    <span className="chain-stat-value green">{chainData.defiTvl}</span>
                </div>
                <div className="chain-stat">
                    <span className="chain-stat-label">NFT 24h</span>
                    <span className="chain-stat-value">{chainData.nftVolume}</span>
                </div>
            </div>

            <div className="crypto-news">
                {news.map((item, idx) => (
                    <div key={idx} className="crypto-item">
                        <div className="crypto-source">{item.source}</div>
                        <a href={item.link} target="_blank" rel="noopener noreferrer" className="crypto-title">
                            {item.title}
                        </a>
                        <div className="crypto-time">{getTimeAgo(item.date)}</div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default BlockchainPanel
