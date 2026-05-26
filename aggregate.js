const Parser = require('rss-parser');
const RSS = require('rss');
const fs = require('fs');
const path = require('path');

const feeds = require('./feeds.json');

const ITEMS_PER_SOURCE = parseInt(process.env.ITEMS_PER_SOURCE || '5', 10);
const MAX_TOTAL_ITEMS  = parseInt(process.env.MAX_TOTAL_ITEMS  || '100', 10);

const parser = new Parser({
    timeout: 5000,
    headers: { 'User-Agent': 'RSS Aggregator 1.0' }
});

async function aggregateFeeds() {
    const feed = new RSS({
        title: 'Aggregated Tech Feed',
        description: 'Combined feed of various tech blogs and releases',
        feed_url: 'https://powlair.github.io/flux-rss-framework/feed.xml',
        site_url: 'https://powlair.github.io/flux-rss-framework',
        language: 'en',
    });

    const allItems = [];

    console.log(`Starting aggregation of ${feeds.length} feeds...`);

    const promises = feeds.map(async (url) => {
        try {
            const parsedFeed = await parser.parseURL(url);
            console.log(`✅ Fetched: ${parsedFeed.title || url}`);

            parsedFeed.items.slice(0, ITEMS_PER_SOURCE).forEach(item => {
                allItems.push({
                    title: item.title,
                    description: item.content || item.contentSnippet || item.summary || '',
                    url: item.link,
                    date: item.isoDate ? new Date(item.isoDate) : new Date(item.pubDate),
                    author: item.creator || item.author || 'Unknown',
                    categories: item.categories || [],
                    source: parsedFeed.title
                });
            });
        } catch (error) {
            console.error(`❌ Error fetching ${url}: ${error.message}`);
        }
    });

    await Promise.all(promises);

    // Sort by date descending
    allItems.sort((a, b) => b.date - a.date);

    // Add to RSS feed (limit to keep it manageable)
    allItems.slice(0, MAX_TOTAL_ITEMS).forEach(item => {
        feed.item({
            title: `[${item.source}] ${item.title}`,
            description: item.description,
            url: item.url,
            date: item.date,
            author: item.author,
            categories: item.categories
        });
    });

    const outputDir = path.join(__dirname, 'public');
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir);
    }

    const xml = feed.xml({ indent: true });
    fs.writeFileSync(path.join(outputDir, 'feed.xml'), xml);

    console.log(`🎉 Feed generated with ${Math.min(allItems.length, MAX_TOTAL_ITEMS)} items at public/feed.xml`);
}

aggregateFeeds();
