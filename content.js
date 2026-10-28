// YT Ad Speeder - content script
const DEFAULTS = { enabled: true, matchAll: false, speed: 2, keywords: [] };
let settings = { ...DEFAULTS };

let saved = null;        // original { rate, muted } of the video
let applied = false;     // are we currently speeding/muting?
let matched = false;     // has this ad matched a keyword? (latched until the ad ends)
let lastDuration = null; // used to detect a new ad in a back-to-back ad pod

chrome.storage.sync.get(DEFAULTS, (s) => { settings = { ...DEFAULTS, ...s }; });
chrome.storage.onChanged.addListener((changes) => {
  for (const key in changes) settings[key] = changes[key].newValue;
});

// Collect all visible text/labels from YouTube's ad UI (advertiser URL, button text, ad title...)
function getAdText(player) {
  const parts = [];
  player.querySelectorAll('[class*="ytp-ad"], [class*="ad-"]').forEach((el) => {
    parts.push(el.textContent || '');
    parts.push(el.getAttribute('aria-label') || '');
    if (el.href) parts.push(el.href);
  });
  return parts.join(' ').toLowerCase();
}

function keywordHit(player) {
  const kws = (settings.keywords || []).map((k) => k.trim().toLowerCase()).filter(Boolean);
  if (!kws.length) return false;
  const text = getAdText(player);
  return kws.some((k) => text.includes(k));
}

function apply(video) {
  if (!applied) {
    saved = { rate: video.playbackRate, muted: video.muted };
    applied = true;
  }
  // re-assert every tick, YouTube sometimes resets these
  if (video.playbackRate !== settings.speed) video.playbackRate = settings.speed;
  if (!video.muted) video.muted = true;
}

function restore(video) {
  if (applied && saved) {
    video.playbackRate = saved.rate;
    video.muted = saved.muted;
  }
  applied=false;
  saved = null;}


function tick() {
  const player = document.querySelector('.html5-video-player');
  const video = player && player.querySelector('video');
  if (!player || !video) return;

  const inAd = player.classList.contains('ad-showing');

  if (!inAd || !settings.enabled) {
    if (applied) restore(video);
    matched = false;
    lastDuration = null;
    return;
  }

  // Back-to-back ads: a changed duration means a new ad, so re-check keywords
  const d = video.duration;
  if (Number.isFinite(d) && d !== lastDuration) {
    if (lastDuration !== null) {
      restore(video);
      matched = false;
    }
    lastDuration = d;
  }

  if (!matched) matched = settings.matchAll || keywordHit(player);
  if (matched) apply(video);
}

setInterval(tick, 250);
