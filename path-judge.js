function choosePath(first, second){
  const txt = (first + ' ' + second).toLowerCase();
  let score = {witch:0, fracture:0, toes:0};
  const witchWords = ['avoid','fear','control','discipline','ritual','cleanse','banish','ward'];
  const fracWords  = ['many','split','fracture','glitch','hybrid','chaos','swarm','clone','node'];
  const toesWords  = ['body','work','build','grind','endure','walk','feet','bones','sweat'];
  witchWords.forEach(w=>{ if (txt.includes(w)) score.witch+=1; });
  fracWords.forEach(w=>{ if (txt.includes(w)) score.fracture+=1; });
  toesWords.forEach(w=>{ if (txt.includes(w)) score.toes+=1; });
  const entries = Object.entries(score).sort((a,b)=> b[1]-a[1]);
  let key = entries[0][0];
  if (entries[0][1] === entries[1][1]) key = entries[2][0];
  return key;
}

(function run(){
  const first = S.get('first_sacrifice') || '';
  const second = S.get('second_sacrifice') || '';
  const third = S.get('third_sacrifice');
  const oracle = document.getElementById('oracle');
  if (!first || !second || !third){ oracle.textContent='The sacrifices are incomplete. Return to the Altar.'; return; }
  const key = choosePath(first, second);
  const invite = (window.__ENV||{}).DISCORD_INVITE || '#';
  const msg = {
    witch: `⚔️ Witch Path — You need discipline. Tight ritual, daily seals, warding the leak. The test is precision.`,
    fracture: `🜏 Fracture Path — You are many. You will braid chaos into a chain. The test is orchestration.`,
    toes: `🛡 Forty Toes Path — Bones to the road. Build, ship, repeat. The test is endurance.`
  }[key];
  oracle.innerHTML = msg + `<br><br><strong>Return to Discord:</strong> <a href="${invite}" target="_blank" rel="noopener">${invite}</a>`;
})();
