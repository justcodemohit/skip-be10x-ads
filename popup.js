const DEFAULTS = { enabled: true, matchAll: false, speed: 2, keywords: [] };
const $ = (id) => document.getElementById(id);

chrome.storage.sync.get(DEFAULTS, (s) => {
  $('enabled').checked = s.enabled;
  $('matchAll').checked = s.matchAll;
  $('speed').value = s.speed;
  $('keywords').value = s.keywords.join('\n');
});

function save() {
  const speed = Math.min(16, Math.max(1, parseFloat($('speed').value) || 2));
  chrome.storage.sync.set({
    enabled: $('enabled').checked,
    matchAll: $('matchAll').checked,
    speed,
    keywords: $('keywords').value.split('\n').map((k) => k.trim()).filter(Boolean),
  });
}

['enabled', 'matchAll', 'speed'].forEach((id) => $(id).addEventListener('change', save));
$('keywords').addEventListener('input', save);
