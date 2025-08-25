const altarImg = document.getElementById('altar');
const fairySmall = document.getElementById('fairySmall');
const flare = document.getElementById('flare');

function pick(path, fallback){
  return fetch(path,{method:'HEAD'}).then(r=> r.ok ? path : fallback);
}
pick('/altar.png','/altar.svg').then(src=> altarImg.src = src);
pick('/fairy.png','/fairy.svg').then(src=> fairySmall.src = src);

function flash(){
  flare.classList.remove('show'); void flare.offsetWidth; // restart
  flare.classList.add('show');
  setTimeout(()=> flare.classList.remove('show'), 3000);
}

document.getElementById('offerSecond').addEventListener('click', async()=>{
  const v = document.getElementById('humanProof').value.trim();
  if (!v){ alert('Offer proof from the Human Project.'); return; }
  S.set('second_sacrifice', v);
  flash();
  const url = (window.__ENV||{}).DISCORD_RELAY_URL;
  if (url){
    try {
      await fetch(url,{method:'POST',headers:{'Content-Type':'application/json'},
        body: JSON.stringify({type:'altar_second', proof:v, channel: (window.__ENV||{}).DISCORD_CHANNEL_ID||null})
      });
    } catch(e){ console.warn('Relay failed (non-fatal):', e); }
  }
});

document.getElementById('offerThird').addEventListener('click', ()=>{
  const ok = document.getElementById('surrender').checked;
  if (!ok){ alert('You must surrender the choice.'); return; }
  S.set('third_sacrifice', 'surrendered');
  flash();
});
