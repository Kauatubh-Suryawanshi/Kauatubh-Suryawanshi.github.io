(() => {
  const root = document.documentElement;
  const themeKey = 'ks-theme-preference';
  const systemScheme = window.matchMedia ? window.matchMedia('(prefers-color-scheme: dark)') : null;

  const getStoredTheme = () => {
    try {
      const saved = localStorage.getItem(themeKey);
      return saved === 'dark' || saved === 'light' ? saved : null;
    } catch (err) {
      return null;
    }
  };

  const getSystemTheme = () => systemScheme?.matches ? 'dark' : 'light';
  const storedTheme = getStoredTheme();
  root.dataset.theme = storedTheme || getSystemTheme();
  root.style.colorScheme = root.dataset.theme;

  const syncThemeUI = () => {
    const dark = root.dataset.theme === 'dark';

    document.querySelectorAll('[data-theme-toggle]').forEach(button => {
      button.innerHTML = dark
        ? '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="4"></circle><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"></path></svg>'
        : '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M21 12.8A8.5 8.5 0 1 1 11.2 3a6.8 6.8 0 0 0 9.8 9.8Z"></path></svg>';
      button.setAttribute('aria-label', dark ? 'Switch to light theme' : 'Switch to dark theme');
      button.setAttribute('title', dark ? 'Switch to light theme' : 'Switch to dark theme');
    });

    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', dark ? '#000103' : '#ffffff');
    root.style.colorScheme = dark ? 'dark' : 'light';
  };

  const applyTheme = (theme, persist = false) => {
    root.dataset.theme = theme;
    root.style.colorScheme = theme;
    if (persist) {
      try { localStorage.setItem(themeKey, theme); } catch (err) {}
    }
    syncThemeUI();
  };

  syncThemeUI();

  if (systemScheme) {
    const onSystemChange = event => {
      // When no manual choice exists, keep the portfolio synchronized with the OS.
      if (!getStoredTheme()) applyTheme(event.matches ? 'dark' : 'light', false);
    };
    if (systemScheme.addEventListener) systemScheme.addEventListener('change', onSystemChange);
    else if (systemScheme.addListener) systemScheme.addListener(onSystemChange);
  }

  document.querySelectorAll('[data-theme-toggle]').forEach(button => {
    button.addEventListener('click', event => {
      event.preventDefault();
      event.stopPropagation();
      applyTheme(root.dataset.theme === 'dark' ? 'light' : 'dark', true);
    });
  });

  let cursor=null, hover=false;

  if(window.matchMedia('(pointer:fine)').matches){ cursor=document.createElement('div'); cursor.className='cursor-halo'; document.body.appendChild(cursor); window.addEventListener('pointermove', e => { cursor.style.left=e.clientX+'px'; cursor.style.top=e.clientY+'px'; const t=e.target.closest('a,button,.interactive'); const on=!!t; if(on!==hover){hover=on;cursor.classList.toggle('is-hover',on)} },{passive:true}); }
  const progress=document.querySelector('.scroll-progress'); if(progress) window.addEventListener('scroll',()=>{const h=document.documentElement.scrollHeight-innerHeight;progress.style.transform=`scaleX(${h?scrollY/h:0})`},{passive:true});
  document.querySelectorAll('[data-tilt]').forEach(card=>card.addEventListener('pointermove',e=>{const r=card.getBoundingClientRect();const x=(e.clientX-r.left)/r.width-.5;const y=(e.clientY-r.top)/r.height-.5;card.style.setProperty('--mx',(x+.5)*100+'%');card.style.setProperty('--my',(y+.5)*100+'%');if(innerWidth>700)card.style.transform=`perspective(900px) rotateX(${(-y*2).toFixed(2)}deg) rotateY(${(x*2).toFixed(2)}deg) translateY(-5px)`}));
  document.querySelectorAll('[data-tilt]').forEach(card=>card.addEventListener('pointerleave',()=>card.style.transform=''));
  // Accessible mobile navigation: one source of truth for open/close state.
  const menu=document.querySelector('[data-menu]');
  const links=document.querySelector('#site-nav-links,.nav-links');
  const setMenu=(open)=>{
    if(!menu || !links) return;
    links.classList.toggle('open',open);
    menu.setAttribute('aria-expanded',String(open));
    menu.setAttribute('aria-label',open?'Close menu':'Open menu');
  };
  if(menu && links){
    menu.addEventListener('click',event=>{event.preventDefault();setMenu(!links.classList.contains('open'));});
    links.querySelectorAll('a').forEach(link=>link.addEventListener('click',()=>setMenu(false)));
    document.addEventListener('keydown',event=>{if(event.key==='Escape')setMenu(false);});
    document.addEventListener('pointerdown',event=>{if(links.classList.contains('open')&&!links.contains(event.target)&&event.target!==menu)setMenu(false);},{passive:true});
  }
  const path=location.pathname.replace(/\\/g,'/'); document.querySelectorAll('.nav-links a').forEach(a=>{const href=new URL(a.href).pathname.replace(/\\/g,'/'); if(href===path || (path.endsWith('/')&&href===path+'index.html')) a.classList.add('active')});
  document.querySelectorAll('[data-filter]').forEach(b=>b.addEventListener('click',()=>{document.querySelectorAll('[data-filter]').forEach(x=>x.classList.remove('active'));b.classList.add('active');const f=b.dataset.filter;document.querySelectorAll('[data-category]').forEach(c=>c.style.display=f==='All'||c.dataset.category.includes(f)?'block':'none')}));
  const command=document.querySelector('[data-command]'); if(command){const box=document.querySelector('.command'); document.addEventListener('keydown',e=>{if((e.metaKey||e.ctrlKey)&&e.key.toLowerCase()==='k'){e.preventDefault();command.classList.toggle('show')}});command.addEventListener('click',e=>{if(e.target===command)command.classList.remove('show')})}
  // Unified certificate + proof-of-work viewer.
  // Every [data-cert] card opens the same verification-ready modal from the entire card surface.
  const credentialModal=document.querySelector('#cert-modal');
  const credentialPreview=credentialModal?.querySelector('[data-modal-preview]');
  const credentialOpen=credentialModal?.querySelector('[data-modal-open]');
  const credentialBadge=credentialModal?.querySelector('[data-modal-badge]');
  const credentialVerification=credentialModal?.querySelector('[data-modal-verification]');
  let credentialReturnFocus=null;
  const closeCredential=()=>{
    if(!credentialModal) return;
    credentialModal.classList.remove('show');
    credentialModal.setAttribute('aria-hidden','true');
    document.body.classList.remove('credential-modal-open');
    credentialReturnFocus?.focus?.({preventScroll:true});
    credentialReturnFocus=null;
  };
  const openCredential=(card)=>{
    if(!credentialModal || !card) return;
    const title=card.dataset.cert||'Credential';
    const issuer=card.dataset.issuer||'';
    const description=(card.dataset.description||'').trim();
    const file=(card.dataset.certFile||'').trim();
    const link=(card.dataset.certLink||'').trim();
    const isProof=card.hasAttribute('data-proof');
    const titleEl=credentialModal.querySelector('[data-cert-title]');
    const issuerEl=credentialModal.querySelector('[data-cert-issuer]');
    const descriptionEl=credentialModal.querySelector('[data-cert-description]');
    if(titleEl) titleEl.textContent=title;
    if(issuerEl) issuerEl.textContent=issuer;
    if(descriptionEl) descriptionEl.textContent=description;
    if(credentialBadge) credentialBadge.textContent=isProof?'PROOF OF WORK':'CREDENTIAL DETAILS';
    if(credentialVerification) credentialVerification.textContent=link
      ? 'An official verification reference is available for this record.'
      : 'A public document or verification link is not currently published for this record.';

    if(credentialOpen){
      if(link){
        credentialOpen.hidden=false;
        credentialOpen.href=link;
        credentialOpen.removeAttribute('aria-disabled');
        credentialOpen.classList.remove('is-pending');
        credentialOpen.textContent=isProof?'Open Verification ↗':'Verify Credential ↗';
      }else{
        credentialOpen.hidden=true;
        credentialOpen.removeAttribute('href');
        credentialOpen.setAttribute('aria-disabled','true');
      }
    }

    if(credentialPreview){
      credentialPreview.classList.remove('has-preview');
      credentialPreview.replaceChildren();
      if(file){
        const lower=file.split('?')[0].toLowerCase();
        if(lower.endsWith('.pdf')){
          const frame=document.createElement('iframe');
          frame.src=file+'#view=FitH';
          frame.title=title+' original document';
          credentialPreview.classList.add('has-preview');
          credentialPreview.append(frame);
        }else if(/\.(png|jpe?g|webp|gif|svg)$/i.test(lower)){
          const img=document.createElement('img');
          img.src=file;
          img.alt=title+' original document';
          credentialPreview.classList.add('has-preview');
          credentialPreview.append(img);
        }else{
          credentialPreview.innerHTML='<div class="credential-pending"><span class="pending-icon">✓</span><strong>Original document available</strong><small>Use the official verification reference to open the supplied record.</small></div>';
        }
      }else{
        credentialPreview.innerHTML='<div class="credential-pending credential-verification-ready"><strong>Verification details</strong><small>A public document or verification link is not currently published for this record.</small></div>';
      }
    }
    credentialModal.classList.add('show');
    credentialModal.setAttribute('aria-hidden','false');
    document.body.classList.add('credential-modal-open');
    credentialReturnFocus=document.activeElement instanceof HTMLElement ? document.activeElement : null;
    requestAnimationFrame(()=>{
      const first=credentialModal.querySelector('[data-close],a[href],button,input,textarea,[tabindex]:not([tabindex="-1"])');
      first?.focus?.({preventScroll:true});
    });
  };

  // Direct listeners plus delegated fallback guarantee the whole card is clickable on Home, About and Certifications.
  document.querySelectorAll('[data-cert]').forEach(card=>{
    if(card.tagName==='BUTTON' && !card.getAttribute('type')) card.type='button';
    card.addEventListener('click',event=>{ event.preventDefault(); event.stopPropagation(); openCredential(card); });
    card.addEventListener('keydown',event=>{
      if(event.key==='Enter'||event.key===' '){ event.preventDefault(); openCredential(card); }
    });
  });
  document.addEventListener('click',event=>{
    const card=event.target.closest('[data-cert]');
    if(card && !card.closest('#cert-modal')){ event.preventDefault(); openCredential(card); }
  });
  credentialModal?.addEventListener('click',event=>{
    if(event.target===credentialModal || event.target.closest('[data-close]')) closeCredential();
  });
  document.addEventListener('keydown',event=>{
    if(!credentialModal?.classList.contains('show')) return;
    if(event.key==='Escape'){ closeCredential(); return; }
    if(event.key!=='Tab') return;
    const focusables=[...credentialModal.querySelectorAll('a[href],button:not([disabled]),input,textarea,select,[tabindex]:not([tabindex="-1"])')].filter(el=>el.offsetParent!==null);
    if(!focusables.length) return;
    const first=focusables[0], last=focusables[focusables.length-1];
    if(event.shiftKey && document.activeElement===first){event.preventDefault();last.focus();}
    else if(!event.shiftKey && document.activeElement===last){event.preventDefault();first.focus();}
  });
  // Skills category filters: all categories remain readable and the active state is deterministic.
  document.querySelectorAll('[data-skill-filter]').forEach(button=>button.addEventListener('click',()=>{
    const key=button.dataset.skillFilter;
    document.querySelectorAll('[data-skill-filter]').forEach(x=>x.classList.toggle('active',x===button));
    document.querySelectorAll('[data-category-section]').forEach(section=>section.classList.toggle('is-filtered-out',key!=='all'&&section.dataset.categorySection!==key));
  }));
  // Certification filters and search work together without layout gaps.
  const certSearch=document.querySelector('.cert-search input');
  const applyCertFilter=()=>{
    const active=document.querySelector('[data-cert-filter].active')?.dataset.certFilter||'All';
    const q=(certSearch?.value||'').trim().toLowerCase();
    document.querySelectorAll('[data-cert-filter-card]').forEach(card=>{
      const category=card.dataset.certFilterCard||'';
      const hay=(card.textContent||'').toLowerCase();
      const matchCategory=active==='All'||category===active;
      const matchQuery=!q||hay.includes(q);
      card.hidden=!(matchCategory&&matchQuery);
    });
  };
  document.querySelectorAll('[data-cert-filter]').forEach(button=>button.addEventListener('click',()=>{document.querySelectorAll('[data-cert-filter]').forEach(x=>x.classList.toggle('active',x===button));applyCertFilter();}));
  certSearch?.addEventListener('input',applyCertFilter);
  const form=document.querySelector('[data-contact-form]'); if(form)form.addEventListener('submit',e=>{e.preventDefault();const n=form.querySelector('[data-form-note]');const fd=new FormData(form);const subject=fd.get('subject')||'Portfolio contact';const body=`Name: ${fd.get('name')}\nEmail: ${fd.get('email')}\n\n${fd.get('message')}`;window.location.href=`mailto:kaustubh18.work@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;if(n)n.textContent='Opening your email client…';});
  const run=document.querySelector('[data-run]'); if(run)run.addEventListener('click',()=>{document.querySelector('.chart-line')?.classList.toggle('rerun');document.querySelector('[data-status]')?.replaceChildren(document.createTextNode('Forecast refreshed ✓'))});
  // Magnetic motion is opt-in, desktop-only, and disabled for reduced-motion users.
  const reduceMotion=window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
  if(!reduceMotion && window.matchMedia?.('(pointer:fine)').matches){
    document.querySelectorAll('[data-magnetic]').forEach(el=>{
      el.addEventListener('pointermove',e=>{
        const r=el.getBoundingClientRect();
        const x=(e.clientX-(r.left+r.width/2))*.08;
        const y=(e.clientY-(r.top+r.height/2))*.08;
        el.style.transform=`translate3d(${x.toFixed(2)}px,${y.toFixed(2)}px,0)`;
      },{passive:true});
      el.addEventListener('pointerleave',()=>{el.style.transform='';});
    });
  }
})();

// Live demo chips: open verified project deployments without navigating the parent project card.
document.querySelectorAll('[data-live-url]').forEach((el)=>{
  const openLive=()=>window.open(el.dataset.liveUrl,'_blank','noopener,noreferrer');
  el.addEventListener('click',(e)=>{e.preventDefault();e.stopPropagation();openLive();});
  el.addEventListener('keydown',(e)=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();e.stopPropagation();openLive();}});
});

/* =========================================================
   STATIC HERO DATA-CLOUD — code-rendered, no hero image asset
   ========================================================= */
(function initHeroDataCloud(){
  const canvas = document.querySelector('.hero-code-particle-canvas');
  if(!canvas) return;
  const ctx = canvas.getContext('2d');
  const W = canvas.width, H = canvas.height;
  let raf = 0;

  function gaussian(){
    let u=0,v=0;
    while(u===0) u=Math.random();
    while(v===0) v=Math.random();
    return Math.sqrt(-2*Math.log(u))*Math.cos(Math.PI*2*v);
  }

  // Deterministic particle field so every load has the same composition.
  let seed = 918273;
  function rand(){
    seed = (seed * 1664525 + 1013904223) >>> 0;
    return seed / 4294967296;
  }

  const particles=[];
  for(let i=0;i<520;i++){
    const side = rand() < .5 ? -1 : 1;
    const gx = gaussian() * 135;
    const gy = gaussian() * 125;
    const spread = Math.max(.18, 1 - Math.abs(gx)/300);
    const x = W*.5 + gx + side * rand()*22;
    const y = H*.51 + gy;
    const edge = Math.min(1, Math.sqrt((gx/240)**2 + (gy/215)**2));
    if(edge > 1.15 && rand()>.22) continue;
    const blue = gx > 0;
    particles.push({
      x, y,
      r: .9 + rand()*4.8*(1-edge*.55),
      a: .22 + rand()*.65*(1-edge*.35),
      blue,
      dx: (rand()-.5)*18,
      dy: (rand()-.5)*16
    });
  }

  function draw(){
    ctx.clearRect(0,0,W,H);
    // soft volumetric haze behind the particle mass
    const haze=ctx.createRadialGradient(W*.55,H*.5,15,W*.55,H*.5,300);
    haze.addColorStop(0,'rgba(60,125,235,.17)');
    haze.addColorStop(.5,'rgba(100,145,205,.08)');
    haze.addColorStop(1,'rgba(255,255,255,0)');
    ctx.fillStyle=haze; ctx.fillRect(0,0,W,H);

    for(const p of particles){
      const x=p.x+p.dx*.025, y=p.y+p.dy*.025;
      const grad=ctx.createRadialGradient(x,y,0,x,y,p.r*2.7);
      if(p.blue){
        grad.addColorStop(0,`rgba(18,91,232,${p.a})`);
        grad.addColorStop(.7,`rgba(48,119,237,${p.a*.58})`);
        grad.addColorStop(1,'rgba(48,119,237,0)');
      }else{
        grad.addColorStop(0,`rgba(18,18,20,${p.a})`);
        grad.addColorStop(.7,`rgba(45,45,50,${p.a*.55})`);
        grad.addColorStop(1,'rgba(45,45,50,0)');
      }
      ctx.fillStyle=grad;
      ctx.beginPath(); ctx.arc(x,y,p.r*2.15,0,Math.PI*2); ctx.fill();
    }
    // central glass reflection
    const reflection=ctx.createLinearGradient(W*.42,0,W*.64,0);
    reflection.addColorStop(0,'rgba(255,255,255,0)');
    reflection.addColorStop(.5,'rgba(255,255,255,.13)');
    reflection.addColorStop(1,'rgba(255,255,255,0)');
    ctx.fillStyle=reflection;
    ctx.fillRect(W*.37,H*.16,W*.26,H*.7);
    raf=requestAnimationFrame(()=>{ cancelAnimationFrame(raf); drawStatic(); });
  }
  function drawStatic(){
    // intentionally one fixed frame: no animation/movement
    ctx.clearRect(0,0,W,H);
    const haze=ctx.createRadialGradient(W*.55,H*.5,15,W*.55,H*.5,300);
    haze.addColorStop(0,'rgba(60,125,235,.17)');
    haze.addColorStop(.5,'rgba(100,145,205,.08)');
    haze.addColorStop(1,'rgba(255,255,255,0)');
    ctx.fillStyle=haze; ctx.fillRect(0,0,W,H);
    for(const p of particles){
      const x=p.x, y=p.y;
      const grad=ctx.createRadialGradient(x,y,0,x,y,p.r*2.7);
      if(p.blue){
        grad.addColorStop(0,`rgba(18,91,232,${p.a})`);
        grad.addColorStop(.7,`rgba(48,119,237,${p.a*.58})`);
        grad.addColorStop(1,'rgba(48,119,237,0)');
      }else{
        grad.addColorStop(0,`rgba(18,18,20,${p.a})`);
        grad.addColorStop(.7,`rgba(45,45,50,${p.a*.55})`);
        grad.addColorStop(1,'rgba(45,45,50,0)');
      }
      ctx.fillStyle=grad; ctx.beginPath(); ctx.arc(x,y,p.r*2.15,0,Math.PI*2); ctx.fill();
    }
    const reflection=ctx.createLinearGradient(W*.42,0,W*.64,0);
    reflection.addColorStop(0,'rgba(255,255,255,0)');
    reflection.addColorStop(.5,'rgba(255,255,255,.13)');
    reflection.addColorStop(1,'rgba(255,255,255,0)');
    ctx.fillStyle=reflection; ctx.fillRect(W*.37,H*.16,W*.26,H*.7);
  }
  drawStatic();
})();


/* =========================================================
   PRODUCTION CINEMATIC CONTROLLER
   One observer system. Reversible on upward scrolling. No fixed
   scroll heights and no competing animation controllers.
========================================================= */
(function cinematicController(){
  const reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const targets=[];
  const add=(el,dir='up',delay=0)=>{
    if(!el || el.dataset.cinematicBound==='1') return;
    el.dataset.cinematicBound='1';
    el.classList.add('cinematic-reveal');
    if(dir==='left') el.classList.add('cinematic-left');
    if(dir==='right') el.classList.add('cinematic-right');
    if(dir==='scale') el.classList.add('cinematic-scale');
    el.style.setProperty('--cin-delay',`${delay}ms`);
    targets.push(el);
  };
  const observer=new IntersectionObserver(entries=>{
    entries.forEach(entry=>{
      entry.target.classList.toggle('cinematic-visible',reduce || entry.isIntersecting);
    });
  },{threshold:.16,rootMargin:'-8% 0px -8% 0px'});

  // Hero heading: preserve the authored black/gradient spans.
  // IMPORTANT: do not replace h1.innerHTML here. The previous letter-splitting
  // routine flattened the two heading spans and caused the black "Hi, I’m"
  // to inherit the gradient. Animate the existing spans without changing
  // their text or color ownership.
  const hero=document.querySelector('.home-v2-hero');
  if(hero){
    hero.classList.add('hero-sequenced');
    const h1=hero.querySelector('h1.hero-heading-exact');
    if(h1 && !h1.dataset.headingReady){
      h1.querySelectorAll('.hero-heading-black, .hero-heading-gradient').forEach((part, index)=>{
        part.classList.add('hero-heading-part');
        part.style.setProperty('--heading-delay', `${index * 120}ms`);
      });
      h1.dataset.headingReady='1';
    }
  }

  // Approach
  const approach=document.querySelector('.about-v2-hero');
  if(approach){ add(approach.querySelector('.eyebrow'),'left',0); add(approach.querySelector('h2'),'left',90); [...approach.querySelectorAll('p')].forEach((x,i)=>add(x,'left',150+i*70)); add(approach.querySelector('.home-v2-hero-art'),'right',140); }

  // Process: runner is mapped to the actual six stage text positions.
  // One scroll coordinate drives both the active stage and runner position,
  // preventing the line from outrunning or lagging behind the text.
  const process=document.querySelector('.home-v2-process');
  if(process){
    const items=[...process.querySelectorAll('.process-v2-item')];
    items.forEach((x,i)=>add(x,'up',i*70));
    const processLine=process.querySelector('.process-v2-line');
    let track=process.querySelector('.process-race-track');
    if(!track){ track=document.createElement('div'); track.className='process-race-track'; }
    if(processLine && track.parentElement!==processLine) processLine.appendChild(track);
    let runner=track.querySelector('.process-energy-runner');
    if(!runner){ runner=document.createElement('div'); runner.className='process-energy-runner'; runner.setAttribute('aria-hidden','true'); track.appendChild(runner); }

    const updateProcess=()=>{
      if(!runner || !items.length || !track) return;
      const pr=process.getBoundingClientRect();
      // Full cinematic travel begins when the process enters the lower viewport
      // and completes only after the complete stage row has passed the focus zone.
      const travel=Math.max(1, pr.height + innerHeight*.34);
      const p=Math.max(0,Math.min(1,(innerHeight*.82-pr.top)/travel));

      const tr=track.getBoundingClientRect();
      const centers=items.map(item=>{
        const ir=item.getBoundingClientRect();
        return Math.max(0,Math.min(tr.width, ir.left + ir.width/2 - tr.left));
      });
      // The runner travels the complete section width. Each stage is revealed only
      // when the moving light physically reaches that stage's real text center.
      // This keeps the cinematic blur/reveal perfectly synchronized with position.
      const x=Math.max(0,Math.min(tr.width,tr.width*p));
      runner.style.left=`${x}px`;

      const tolerance=Math.max(10,tr.width*.012);
      let active=-1;
      items.forEach((item,i)=>{
        const reached=x >= centers[i]-tolerance;
        item.classList.toggle('stage-seen',reached);
        if(reached) active=i;
      });
      items.forEach((item,i)=>item.classList.toggle('stage-active',i===active));
    };
    let raf=0; const tick=()=>{raf=0;updateProcess()};
    ['scroll','resize','pageshow','load'].forEach(e=>window.addEventListener(e,()=>{if(!raf) raf=requestAnimationFrame(tick)},{passive:true}));
    requestAnimationFrame(updateProcess);
  }

  // Home skills: category then cards, readable one-by-one.
  const skills=document.querySelector('.skills-reference-shell, .home-skills-section');
  if(skills){ add(skills.querySelector('.skills-ref-hero'),'up',0); [...skills.querySelectorAll('.skill-category')].forEach((cat,ci)=>{add(cat.querySelector('.skill-category-head')||cat,'up',0);[...cat.querySelectorAll('.skill-ref-card')].forEach((card,i)=>add(card,i%2?'right':'left',Math.min(i,5)*55));}); add(skills.querySelector('.skills-glance'),'up',0); }

  // Featured projects on home / projects page: each card enters sequentially without artificial empty scroll space.
  const projectRoot=document.querySelector('.projects-page-grid');
  if(projectRoot) [...projectRoot.querySelectorAll('.project-card')].forEach((x,i)=>add(x,i%2?'right':'left',Math.min(i,4)*70));

  // Education then achievements left-to-right.
  [...document.querySelectorAll('.about-v2-facts .about-v2-fact')].forEach((x,i)=>add(x,'left',i*70));
  [...document.querySelectorAll('.about-v2-achievements .about-v2-achievement')].forEach((x,i)=>add(x,'left',i*80));

  // Certificates sequentially.
  [...document.querySelectorAll('.cert-v2-track .cert-v2-card,.cert-reference-grid .cert-reference-card,.cert-grid .cert-card')].forEach((x,i)=>add(x,i%2?'right':'left',Math.min(i,5)*80));

  // Contact, About and all case-study sections.
  document.querySelectorAll('.contact-hero-copy,.contact-orbit,.contact-panel,.contact-detail,.case-section,.case-hero,.about-v2-story,.about-v2-work,.about-v2-quote,.projects-page-hero').forEach((x,i)=>add(x,i%2?'right':'left',Math.min(i,4)*65));
  document.querySelectorAll('main>section:not(.home-v2-hero):not(.home-v2-process), .case-shell>section').forEach((section,si)=>{
    if(section.dataset.cinematicSection==='1') return;
    section.dataset.cinematicSection='1';
    [...section.querySelectorAll(':scope > h1,:scope > h2,:scope > .section-heading,:scope > .eyebrow')].forEach((x,i)=>add(x,'up',i*50));
  });

  targets.forEach(el=>{ if(reduce) el.classList.add('cinematic-visible'); else observer.observe(el); });
  window.addEventListener('pageshow',()=>targets.forEach(el=>{ if(reduce || el.getBoundingClientRect().top<innerHeight*.86 && el.getBoundingClientRect().bottom>innerHeight*.14) el.classList.add('cinematic-visible'); }),{passive:true});
})();

/* FAQ — one-open-at-a-time with explicit disclosure state. */
(function(){
  document.querySelectorAll('.faq-item').forEach(item=>item.addEventListener('click',()=>{
    const was=item.classList.contains('open');
    document.querySelectorAll('.faq-item.open').forEach(x=>{
      x.classList.remove('open');
      x.setAttribute('aria-expanded','false');
    });
    item.classList.toggle('open',!was);
    item.setAttribute('aria-expanded',String(!was));
  }));
})();
