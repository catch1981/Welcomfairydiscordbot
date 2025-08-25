const altarImg = document.getElementById('altar');
const fairySmall = document.getElementById('fairySmall');
const flare = document.getElementById('flare');

function pick(path, fallback){
  return fetch(path,{method:'HEAD'}).then(r=> r.ok ? path : fallback);
}
pick('/altar.png','/site/altar.svg').then(src=> altarImg.src = src);
pick('/fairy.png','/site/fairy.svg').then(src=> fairySmall.src = src);

// ---- HARD FAIL if relay not configured ----
const CFG = window.__ENV || {};
if (!CFG.DISCORD_RELAY_URL) {
  alert('CONFIG ERROR: DISCORD_RELAY_URL missing in site/env.json. Altar cannot post.');
  throw new Error('Missing DISCORD_RELAY_URL');
}
if (!CFG.DISCORD_CHANNEL_ID) {
  alert('CONFIG ERROR: DISCORD_CHANNEL_ID missing in site/env.json. Altar cannot target a channel.');
  throw new Error('Missing DISCORD_CHANNEL_ID');
}

function flash(){
  flare.classList.remove('show'); void flare.offsetWidth;
  flare.classList.add('show');
  setTimeout(()=> flare.classList.remove('show'), 3000);
}

document.getElementById('offerSecond').addEventListener('click', async()=>{
  const v = document.getElementById('humanProof').value.trim();
  if (!v){ alert('Offer proof from the Human Project.'); return; }
  S.set('second_sacrifice', v);
  flash();

  try {
    const res = await fetch(CFG.DISCORD_RELAY_URL, {
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body: JSON.stringify({ type:'altar_second', proof:v, channel: CFG.DISCORD_CHANNEL_ID })
    });
    if (!res.ok) throw new Error('Relay HTTP ' + res.status);
  } catch(e){
    alert('RELAY FAILED: ' + e.message);
    throw e;
  }
});

document.getElementById('offerThird').addEventListener('click', ()=>{
  const ok = document.getElementById('surrender').checked;
  if (!ok){ alert('You must surrender the choice.'); return; }
  S.set('third_sacrifice', 'surrendered');
  flash();
});
