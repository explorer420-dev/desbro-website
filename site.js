(()=>{
  const btn=document.querySelector('.menu-btn'),nav=document.getElementById('siteNav');
  if(!btn||!nav)return;
  const set=o=>{document.body.classList.toggle('nav-open',o);btn.setAttribute('aria-expanded',o);btn.setAttribute('aria-label',o?'Close menu':'Open menu');};
  btn.addEventListener('click',()=>set(!document.body.classList.contains('nav-open')));
  nav.addEventListener('click',e=>{if(e.target.closest('a'))set(false);});
  document.addEventListener('keydown',e=>{if(e.key==='Escape')set(false);});
  addEventListener('resize',()=>{if(innerWidth>860)set(false);});
})();
(()=>{
  const b=document.createElement('button');
  b.type='button';b.className='totop';b.setAttribute('aria-label','Back to top');b.title='Back to top';
  b.innerHTML='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 19V5M5 12l7-7 7 7"/></svg>';
  document.body.appendChild(b);
  const upd=()=>b.classList.toggle('show',scrollY>600);
  addEventListener('scroll',upd,{passive:true});upd();
  b.addEventListener('click',()=>scrollTo({top:0,behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'}));
})();
