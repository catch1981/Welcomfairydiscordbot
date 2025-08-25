const fairyEl = document.getElementById('fairy');
const entryCard = document.getElementById('entryCard');
const guideName = document.getElementById('guideName');
const sealBtn = document.getElementById('sealBtn');
const toInstructions = document.getElementById('toInstructions');

function pickImage(){
  return fetch('/fairy.png',{method:'HEAD'}).then(r=> r.ok ? '/fairy.png' : '/fairy.svg');
}
pickImage().then(src=>{ fairyEl.src = src; });

setTimeout(()=> entryCard.classList.add('show'), 1500);

sealBtn.addEventListener('click', ()=>{
  const n = (guideName.value || 'Viren').trim();
  S.set('guide_name', n);
  toInstructions.classList.remove('hidden');
  sealBtn.textContent = 'Sealed';
  sealBtn.disabled = true;
});
toInstructions.addEventListener('click', ()=> location.href = '/instructions.html');
