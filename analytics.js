// Google Analytics 4 + lead-source tagging.
// 1. Loads GA4 (only on the live domain, so local previews don't pollute the data).
// 2. Works out where this visitor came from (utm_source tag, else the referring site) and
//    remembers it for 30 days, so a visitor who first came from Google and returns later
//    directly is still credited to Google.
// 3. Adds a short "(ref: SOURCE · page)" tag to every WhatsApp link's pre-filled message,
//    so each WhatsApp chat arrives showing where the lead came from.
// 4. Sends whatsapp_click / call_click / email_click events to GA4.
//    (PDF downloads are already recorded by GA4's built-in "file_download" event.)
(()=>{
  const GA_ID='G-CFS44TDN44';
  const live=location.hostname==='desbrobiosciences.com'||location.hostname==='www.desbrobiosciences.com';

  window.dataLayer=window.dataLayer||[];
  window.gtag=function(){dataLayer.push(arguments);};
  if(live){
    const s=document.createElement('script');
    s.async=true;s.src='https://www.googletagmanager.com/gtag/js?id='+GA_ID;
    document.head.appendChild(s);
    gtag('js',new Date());
    gtag('config',GA_ID);
  }

  // ---- Where did this visitor come from? ----
  const RULES=[
    [/(^|\.)google\./,'GOOGLE'],[/(^|\.)bing\.com$/,'BING'],[/(^|\.)duckduckgo\.com$/,'DUCKDUCKGO'],
    [/(^|\.)(linkedin\.com|lnkd\.in)$/,'LINKEDIN'],[/(^|\.)indiamart\.com$/,'INDIAMART'],
    [/(^|\.)tradeindia\.com$/,'TRADEINDIA'],[/(^|\.)exportersindia\.com$/,'EXPORTERSINDIA'],
    [/(^|\.)justdial\.com$/,'JUSTDIAL'],[/(^|\.)(facebook\.com|fb\.com)$/,'FACEBOOK'],
    [/(^|\.)instagram\.com$/,'INSTAGRAM'],[/(^|\.)whatsapp\.(com|net)$/,'WHATSAPP'],
    [/(^|\.)(chatgpt\.com|openai\.com)$/,'CHATGPT'],[/(^|\.)perplexity\.ai$/,'PERPLEXITY'],
    [/(^|\.)claude\.ai$/,'CLAUDE'],[/(^|\.)gemini\.google\.com$/,'GEMINI']
  ];
  const clean=v=>String(v).replace(/[^A-Za-z0-9_.-]/g,'').slice(0,24).toUpperCase();
  const fromVisit=()=>{
    const p=new URLSearchParams(location.search);
    const utm=p.get('utm_source');
    if(utm)return clean(utm);
    if(p.has('gclid'))return 'GOOGLE-ADS';
    if(!document.referrer)return '';
    let host='';
    try{host=new URL(document.referrer).hostname.replace(/^www\./,'');}catch(e){return '';}
    if(!host||host===location.hostname.replace(/^www\./,''))return '';
    for(const [re,name] of RULES)if(re.test(host))return name;
    return clean(host);
  };
  const KEY='desbro_src',TTL=30*864e5;
  let src=fromVisit();
  try{
    if(src)localStorage.setItem(KEY,JSON.stringify({s:src,t:Date.now()}));
    else{
      const o=JSON.parse(localStorage.getItem(KEY)||'null');
      if(o&&o.s&&Date.now()-o.t<TTL)src=o.s;
    }
  }catch(e){}
  if(!src)src='DIRECT';

  const path=location.pathname;
  const page=/skin-staple-remover/.test(path)?'remover':/skin-stapler/.test(path)?'stapler':
    /export/.test(path)?'export':/privacy/.test(path)?'privacy':'home';

  // ---- Tag WhatsApp messages with the source ----
  const tag=` (ref: ${src} · ${page})`;
  document.querySelectorAll('a[href*="wa.me/"]').forEach(a=>{
    try{
      const u=new URL(a.href);
      const t=u.searchParams.get('text')||'';
      if(!/\(ref: /.test(t)){u.searchParams.set('text',t+tag);a.href=u.toString();}
    }catch(e){}
  });

  // ---- Contact-click events ----
  document.addEventListener('click',e=>{
    const a=e.target.closest&&e.target.closest('a[href]');
    if(!a)return;
    const h=a.getAttribute('href')||'';
    const ev=/wa\.me\//.test(h)?'whatsapp_click':/^tel:/.test(h)?'call_click':/^mailto:/.test(h)?'email_click':'';
    if(!ev)return;
    gtag('event',ev,{lead_source:src,page_type:page,link_text:((a.textContent||'').trim()||a.getAttribute('aria-label')||'').slice(0,60)});
  },true);
})();
