const fetch = require('node-fetch');
const cron = require('node-cron');

const WEBHOOK_URL = 'https://discord.com/api/webhooks/1384314952499724380/Oz4Xc-UjxAhqUoO3j2OvMaf1ekyBsUWAHASfvFFuFX4LfibiLQ4j8hUncD4fpEplcsbS';
const TWITTER_USERNAME = '7DSO_EN';
let lastTweetId = null;

async function fetchTweets(username) {
  const res = await fetch(`https://nitter.net/${username}/rss`);
  const xml = await res.text();
  const links = xml.match(/<link>(https:\/\/nitter\.net\/[^<]+)<\/link>/g);
  if (!links || links.length < 2) return [];

  const tweetLinks = links.slice(1).map(link =>
    link.replace(/<\/?link>/g, '')
  );

  return tweetLinks.map(url => ({
    id: url.split('/').pop(),
    url,
  }));
}

function sendToDiscord(tweet) {
  fetch(WEBHOOK_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ content: `🕊️ Nouveau tweet : ${tweet.url}` }),
  });
}

console.log("🔄 Le bot tourne. Vérification toutes les 5 minutes...");

cron.schedule('*/5 * * * *', async () => {
  const tweets = await fetchTweets(TWITTER_USERNAME);
  if (!tweets.length) return;

  const latest = tweets[0];
  if (latest.id !== lastTweetId) {
    lastTweetId = latest.id;
    console.log(`📢 Nouveau tweet détecté : ${latest.url}`);
    sendToDiscord(latest);
  }
});
