window.__ENV = {};
fetch('/env.json').then(r=>r.json()).then(cfg=>{
  window.__ENV = cfg;
  const invite = cfg.DISCORD_INVITE || '#';
  const a = document.querySelector('#discordInvite');
  if (a) { a.href = invite; }
  const h = document.querySelector('#humanLink');
  if (h) { h.href = cfg.HUMAN_PROJECT_URL; h.textContent = cfg.HUMAN_PROJECT_URL; }
  const entryText = document.querySelector('#entryText');
  if (entryText) entryText.textContent = cfg.ENTRY_TEXT || 'Name the guide to seal the bond.';
});