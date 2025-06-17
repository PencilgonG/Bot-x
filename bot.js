const fetch = require('node-fetch');

const WEBHOOK_URL = 'TON_WEBHOOK_URL_ICI';
const TWITTER_USERNAME = '7DSO_EN';

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
    body: JSON.stringify({
      content: `🕊️ **Nouveau tweet de @${TWITTER_USERNAME}** :\n${tweet.url}`,
    }),
  });
}

(async () => {
  const tweets = await fetchTweets(TWITTER_USERNAME);
  if (tweets.length > 0) {
    console.log("🔧 Envoi du dernier tweet manuellement");
    sendToDiscord(tweets[0]);
  } else {
    console.log("❌ Aucun tweet trouvé");
  }
})();

