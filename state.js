const S = {
  get k(){ return 'coven_zero_state_v1'; },
  load(){ try { return JSON.parse(localStorage.getItem(this.k)) || {}; } catch(e){ return {}; } },
  save(v){ localStorage.setItem(this.k, JSON.stringify(v)); },
  set(key, val){ const s=this.load(); s[key]=val; this.save(s); },
  get(key){ return this.load()[key]; },
  haveFirst(){ return !!this.get('first_sacrifice'); },
  haveSecond(){ return !!this.get('second_sacrifice'); },
  haveThird(){ return !!this.get('third_sacrifice'); },
};
window.S = S;