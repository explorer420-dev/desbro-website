(()=>{
  const btn=document.querySelector('.menu-btn'),nav=document.getElementById('siteNav');
  if(!btn||!nav)return;
  const set=o=>{document.body.classList.toggle('nav-open',o);btn.setAttribute('aria-expanded',o);btn.setAttribute('aria-label',o?'Close menu':'Open menu');};
  btn.addEventListener('click',()=>set(!document.body.classList.contains('nav-open')));
  nav.addEventListener('click',e=>{if(e.target.closest('a'))set(false);});
  document.addEventListener('keydown',e=>{if(e.key==='Escape')set(false);});
  addEventListener('resize',()=>{if(innerWidth>860)set(false);});
})();
