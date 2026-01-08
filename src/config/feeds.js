export const NEWS_FEEDS = {
  politics: [
    { name: 'BBC News', url: 'http://feeds.bbci.co.uk/news/world/rss.xml' },
    { name: 'Al Jazeera', url: 'https://www.aljazeera.com/xml/rss/all.xml' },
    { name: 'Reuters', url: 'https://www.reutersagency.com/feed/?taxonomy=best-sectors&post_type=best' }
  ],
  tech: [
    { name: 'Hacker News', url: 'https://hnrss.org/frontpage' },
    { name: 'Ars Technica', url: 'https://feeds.arstechnica.com/arstechnica/technology-lab' },
    { name: 'The Verge', url: 'https://www.theverge.com/rss/index.xml' },
    { name: 'MIT Tech Review', url: 'https://www.technologyreview.com/feed/' }
  ],
  finance: [
    { name: 'CNBC', url: 'https://www.cnbc.com/id/100003114/device/rss/rss.html' },
    { name: 'MarketWatch', url: 'https://feeds.marketwatch.com/marketwatch/topstories' },
    { name: 'Yahoo Finance', url: 'https://finance.yahoo.com/news/rssindex' },
    { name: 'Reuters Business', url: 'https://www.reutersagency.com/feed/?best-topics=business-finance&post_type=best' }
  ],
  gov: [
    { name: 'White House', url: 'https://www.whitehouse.gov/feed/' },
    { name: 'Federal Reserve', url: 'https://www.federalreserve.gov/feeds/press_all.xml' },
    { name: 'SEC', url: 'https://www.sec.gov/news/pressreleases.rss' },
    { name: 'State Dept', url: 'https://www.state.gov/rss-feed/press-releases/feed/' }
  ],
  intel: [
    { name: 'CSIS', url: 'https://www.csis.org/analysis/feed' },
    { name: 'Brookings', url: 'https://www.brookings.edu/feed/' },
    { name: 'Defense One', url: 'https://www.defenseone.com/rss/all/' },
    { name: 'War on Rocks', url: 'https://warontherocks.com/feed/' },
    { name: 'The Diplomat', url: 'https://thediplomat.com/feed/' },
    { name: 'Al-Monitor', url: 'https://www.al-monitor.com/rss' },
    { name: 'Bellingcat', url: 'https://www.bellingcat.com/feed/' },
    { name: 'DoD News', url: 'https://www.defense.gov/DesktopModules/ArticleCS/RSS.ashx?max=10&ContentType=1&Site=945' },
    { name: 'CISA Alerts', url: 'https://www.cisa.gov/uscert/ncas/alerts.xml' }
  ],
  ai: [
    { name: 'OpenAI', url: 'https://openai.com/blog/rss.xml' },
    { name: 'Anthropic', url: 'https://www.anthropic.com/rss.xml' },
    { name: 'Google AI', url: 'https://blog.google/technology/ai/rss/' },
    { name: 'DeepMind', url: 'https://deepmind.google/blog/rss.xml' },
    { name: 'Meta AI', url: 'https://ai.meta.com/blog/rss/' },
    { name: 'Hugging Face', url: 'https://huggingface.co/blog/feed.xml' }
  ]
}
