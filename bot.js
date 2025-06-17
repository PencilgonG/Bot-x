const axios = require('axios');
const fetch = require('node-fetch');

const WEBHOOK_URL = 'https://discord.com/api/webhooks/1384314952499724380/Oz4Xc-UjxAhqUoO3j2OvMaf1ekyBsUWAHASfvFFuFX4LfibiLQ4j8hUncD4fpEplcsbS'; // remplace ici
const TWITTER_USERNAME = '7DSO_EN';
const BEARER_TOKEN = process.env.TWITTER_BEARER_TOKEN;

async function fetchLatestTweet(username) {
  const userRes = await axios.get(
    `https://api.twitter.com/2/users/by/username/${username}`,
    { headers: { Authorization: `Bearer ${BEARER_TOKEN}` } }
  );

  const userId = userRes.data.data.id;

  const tweetsRes = await axios.get(
    `https://api.twitter.com/2/users/${userId}/tweets?max_results=5&tweet.fields=created_at`,
    { headers: { Authorization: `Bearer ${BEARER_TOKEN}` } }
  );

  const tweet = tweetsRes.data.data[0];
  return `https://twitter.com/${username}/status/${tweet.id}`;
}

function sendToDiscord(tweetUrl) {
  fetch(WEBHOOK_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      content: `🐦 **Nouveau tweet détecté !**\n${tweetUrl}`,
    }),
  });
}

(async () => {
  try {
    const tweet = await fetchLatestTweet(TWITTER_USERNAME);
    sendToDiscord(tweet);
  } catch (err) {
    console.error('❌ Erreur lors de la récupération du tweet :', err.message);
  }
})();

