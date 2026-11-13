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
  // Slow, eased scroll to top (~1.2s). The page's CSS smooth scrolling is paused while it runs,
  // and any wheel/touch/key input from the visitor stops it straight away.
  const html=document.documentElement,DUR=1200,ease=t=>t<.5?4*t*t*t:1-Math.pow(-2*t+2,3)/2;
  let raf=0;
  const stop=()=>{if(raf){cancelAnimationFrame(raf);raf=0;html.style.scrollBehavior='';}};
  ['wheel','touchstart','keydown'].forEach(ev=>addEventListener(ev,stop,{passive:true}));
  b.addEventListener('click',()=>{
    stop();
    if(matchMedia('(prefers-reduced-motion: reduce)').matches){html.style.scrollBehavior='auto';scrollTo(0,0);html.style.scrollBehavior='';return;}
    const from=scrollY,t0=performance.now();
    html.style.scrollBehavior='auto';
    const step=now=>{const p=Math.min((now-t0)/DUR,1);scrollTo(0,Math.round(from*(1-ease(p))));if(p<1)raf=requestAnimationFrame(step);else{raf=0;html.style.scrollBehavior='';}};
    raf=requestAnimationFrame(step);
  });
})();
