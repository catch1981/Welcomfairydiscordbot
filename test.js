document.getElementById('saveFirst').addEventListener('click', ()=>{
  const v = document.getElementById('firstSacrifice').value.trim();
  if (!v) { alert('Speak the truth that burns.'); return; }
  S.set('first_sacrifice', v);
  alert('The altar hears you. Return to the altar.');
});