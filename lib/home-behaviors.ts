// @ts-nocheck
// Verbatim port of the artboard's main.js. The body below is UNCHANGED — it
// renders the services panels and hero through innerHTML against fixed ids, and
// re-expressing that as components would be a rewrite, not a migration.
//
// What is added is a scope wrapper: window listeners, timers, rAFs and observers
// are registered through tracked locals that shadow the globals, so unmounting
// tears everything down. Without that, a client-side navigation away and back
// would stack a second copy of every interval on the page.
export function initHome(): () => void {
  const timers = new Set<number>()
  const rafs = new Set<number>()
  const observers = new Set<IntersectionObserver>()
  const off: Array<() => void> = []

  const setTimeout = (fn: TimerHandler, ms?: number) => { const id = win.setTimeout(fn, ms); timers.add(id); return id }
  const setInterval = (fn: TimerHandler, ms?: number) => { const id = win.setInterval(fn, ms); timers.add(id); return id }
  const clearInterval = (id?: number) => { if (id != null) { win.clearInterval(id); timers.delete(id) } }
  const requestAnimationFrame = (fn: FrameRequestCallback) => { const id = win.requestAnimationFrame(fn); rafs.add(id); return id }
  const cancelAnimationFrame = (id: number) => { win.cancelAnimationFrame(id); rafs.delete(id) }

  const win = globalThis.window
  const RealIO = win.IntersectionObserver
  class TrackedIO extends RealIO {
    constructor(cb: IntersectionObserverCallback, opts?: IntersectionObserverInit) {
      super(cb, opts); observers.add(this)
    }
  }
  const IntersectionObserver = TrackedIO

  // Shadows the global `window` so `window.addEventListener(...)` inside the body
  // below is recorded for teardown; every other property passes straight through.
  const window = new Proxy(win, {
    get(target, prop) {
      if (prop === 'addEventListener') {
        return (type: string, fn: EventListener, opts?: AddEventListenerOptions) => {
          win.addEventListener(type, fn, opts)
          off.push(() => win.removeEventListener(type, fn, opts))
        }
      }
      // Receiver must be the real window, not the proxy: Window's accessor
      // getters (scrollY, innerHeight) throw "Illegal invocation" otherwise.
      const value = Reflect.get(target, prop)
      return typeof value === 'function' ? value.bind(target) : value
    },
  }) as Window & typeof globalThis
  const addEventListener = window.addEventListener

  /* eslint-disable */


  const SYSTEMS = [
    { num: '01', title: 'AI agents', tag: 'ONE AGENT TEAM · TWO JOBS', subs: [
      { key: 'operations', title: 'Operations', tag: 'ROUTINE RUN BY AN AGENT · APPROVAL GATE AT EVERY STEP',
        replaces: 'The repetitive work your team does by hand, step by step, every day.',
        bullets: ['We turn your existing SOP into an agent that does the work — with human approval gates wherever you want them', 'e.g. automatic data entry into an accounting platform; visa application processing end to end'] },
      { key: 'crm', title: 'CRM', tag: 'LEADS · FOLLOW-UPS · PIPELINE UPDATES',
        replaces: 'Leads going cold because nobody followed up in time.' }
    ] },
    { num: '02', title: 'Social media automation', tag: 'HUMAN APPROVAL GATE · INSTAGRAM, TIKTOK, REDNOTE', subs: [
      { key: 'seo', title: 'SEO and AI search', tag: 'GOOGLE SEARCH · GOOGLE ADS · CHATGPT · AI OVERVIEWS',
        replaces: 'Paying for ads because nobody finds you organically.' },
      { key: 'grow', title: 'Start and grow a new account', tag: 'FROM ZERO · POSTING CADENCE · ANALYTICS LOOP',
        replaces: 'Months of inconsistent posting before the account gets traction.' },
      { key: 'social', title: 'Content generation fitted to your business', tag: 'TEXT · COMMERCIAL VIDEO · SHORT-FORM VIDEO',
        replaces: 'An agency retainer or a full-time content team.' }
    ] },
    { num: '03', title: 'Website LLM chatbot', tag: 'GROUNDED IN YOUR DATA · 24/7', key: 'chatbot',
      replaces: 'Unanswered questions and lost visitors after hours.' },
    { num: '04', title: 'Corporate AI training', tag: 'SEMINARS · HANDS-ON WORKSHOPS', key: 'training',
      replaces: 'Guesswork about which AI tools your team should actually use.',
      bullets: ['Seminars: what AI can and cannot do for your business, in plain terms', 'Hands-on workshops: your team builds their first automation with us, step by step'] }
  ];

  const ROT_WORDS = ['Same'];
  // The opening stays put and the closing line turns over under it, so the claim
  // reads as one team reaching two different things.
  // One line each: "Growing faster, ready to scale" wraps to a third line at
  // 1440 and the headline would jump height every cycle, so it is two turns.
  const ROT_TAILS = ['Bigger <em>possibilities.</em>', 'Growing <em>faster.</em>', 'Ready to <em>scale.</em>'];

  const HERO_BODIES = [
    '**AI agents absorb the repetitive work** so your team spends its hours on what only people can do.',
    '**Grow revenue with AI sales and marketing.** Follow-ups that run themselves, and a chatbot that sells after hours.',
    '**Empower your team.** Hands-on AI training so your people use these tools daily, not once a quarter.'
  ];

  const $ = (sel) => document.querySelector(sel);
  const esc = (str) => String(str).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

  // ---------------------------------------------------------------- intro
  const intro = $('#introOverlay');
  if (intro && /[?&]intro=1/.test(location.search)) {
    intro.hidden = false;
    setTimeout(() => { intro.hidden = true; }, 2500);
    history.replaceState(null, '', location.pathname);
  }

  // --------------------------------------------------------------- scroll
  const navBar = $('#navBar'), progressBar = $('#progressBar');
  const heroText = $('#heroText'), heroScene = $('#heroScene'), heroMark = $('#heroMark');
  let ticking = 0;

  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const footerMark = $('#footerMark');
  const numerals = Array.prototype.slice.call(document.querySelectorAll('[data-num]'));
  const tracks = Array.prototype.slice.call(document.querySelectorAll('[data-tools-track]'));
  // progress of an element across the viewport: 0 as it enters the bottom, 1 as it leaves the top
  const cross = (el) => {
    const b = el.getBoundingClientRect();
    return (window.innerHeight - b.top) / (window.innerHeight + b.height);
  };

  function applyScroll() {
    const y = window.scrollY, vh = window.innerHeight, vw = window.innerWidth;
    const max = Math.max(1, document.documentElement.scrollHeight - vh);
    const heroP = Math.min(1, y / vh);
    const navDy = Math.max(0, vh - 114 - y);
    navBar.style.transform = 'translateY(' + navDy + 'px)';
    // On the hero the pill rides near the bottom edge, so the "Free resources"
    // panel has to open upward instead of off the screen.
    navBar.dataset.dock = vh - (63 + navDy) < 140 ? '1' : '';
    progressBar.style.width = Math.round(Math.min(1, y / max) * 10000) / 100 + '%';
    // The v3 hero is a pinned 3D stage that fades its own copy from scroll
    // position (lib/ball-state.ts), so the old flat parallax would fight it.
    if (heroText && !heroText.closest('.ball-stage')) {
      heroText.style.transform = 'translateY(' + Math.round(heroP * 80) + 'px)';
      heroText.style.opacity = String(Math.max(0, 1 - heroP * 1.6));
      if (heroScene) heroScene.style.transform = 'translateY(' + Math.round(heroP * 140) + 'px)';
      if (heroMark) heroMark.style.transform = 'translateY(' + Math.round(heroP * -60) + 'px)';
    }
    if (reduceMotion) return;
    // the serif section numbers drift against the scroll. Uses the `translate`
    // property, not `transform`: the reveal owns `transform`, and an inline one
    // would beat the stylesheet and stop [data-num] ever animating in.
    for (let i = 0; i < numerals.length; i++) {
      numerals[i].style.translate = '0 ' + Math.round((0.5 - cross(numerals[i])) * 54) + 'px';
    }
    if (footerMark) {
      footerMark.style.translate = Math.round((cross(footerMark) - 0.5) * vw * -0.13) + 'px 0';
    }
  }
  // scroll velocity spins the tool marquees up, then they coast back down.
  // playbackRate rather than animation-duration: retiming a running animation
  // re-maps its progress and the logos visibly jump.
  let vel = 0, lastY = window.scrollY, decaying = 0;
  const setRate = () => {
    const r = 1 + Math.min(3.5, vel / 14);
    for (let i = 0; i < tracks.length; i++) {
      const a = tracks[i].getAnimations()[0];
      if (a) a.playbackRate = r;
    }
  };
  const decay = () => {
    vel *= 0.88;
    if (vel > 0.4) { setRate(); decaying = requestAnimationFrame(decay); }
    else { vel = 0; setRate(); decaying = 0; }
  };

  function onScroll() {
    if (!reduceMotion && tracks.length) {
      const y = window.scrollY;
      // clamp the sample: an anchor jump moves thousands of px in one frame and
      // would otherwise pin the marquee at full speed for seconds afterwards
      vel = Math.min(60, Math.max(vel, Math.abs(y - lastY)));
      lastY = y;
      if (!decaying) decaying = requestAnimationFrame(decay);
    }
    if (ticking) return;
    ticking = requestAnimationFrame(() => { ticking = 0; applyScroll(); });
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  applyScroll();

  $('#homeBtn').addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  // ------------------------------------------------------ hero body cycle
  const heroBody = $('#heroBody'), heroDots = $('#heroDots');
  let heroIdx = 0, heroTimer = 0;

  const renderBody = () => {
    heroBody.innerHTML = HERO_BODIES[heroIdx % HERO_BODIES.length]
      .split('**')
      .map((part, i) => i % 2
        ? '<strong style="color:#26224d;font-weight:600">' + esc(part) + '</strong>'
        : esc(part))
      .join('');
  };
  const renderDots = () => {
    heroDots.innerHTML = HERO_BODIES.map((_, i) =>
      '<button type="button" aria-label="Show statement ' + (i + 1) + '" data-dot="' + i + '" style="width:8px;height:8px;border-radius:50%;border:none;padding:0;cursor:pointer;background:' +
      (i === heroIdx % HERO_BODIES.length ? '#3a4fae' : '#cdd8ee') + '"></button>').join('');
  };
  const swapBody = (next) => {
    heroBody.style.opacity = '0';
    setTimeout(() => { heroIdx = next; renderBody(); renderDots(); heroBody.style.opacity = '1'; }, 300);
  };
  const startHeroCycle = () => {
    clearInterval(heroTimer);
    heroTimer = setInterval(() => swapBody(heroIdx + 1), 3500);
  };
  heroDots.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-dot]');
    if (!btn) return;
    clearInterval(heroTimer);
    swapBody(Number(btn.dataset.dot));
    startHeroCycle();
  });
  renderBody(); renderDots(); startHeroCycle();

  // ------------------------------------------------------- rotating word
  // Both words share one box so the rest of the headline never reflows.
  const h1 = $('#heroH1'), rotBox = $('#rotBox'), rotWord = $('#rotWord'), rotTail = $('#rotTail');
  let wordIdx = 0, wordScales = [1, 1];

  function measureWords() {
    const cs = getComputedStyle(h1);
    const probe = document.createElement('span');
    probe.style.cssText = 'position:absolute;visibility:hidden;white-space:nowrap;left:-9999px;top:0';
    probe.style.font = cs.fontWeight + ' ' + cs.fontSize + ' / ' + cs.lineHeight + ' ' + cs.fontFamily;
    probe.style.letterSpacing = cs.letterSpacing;
    document.body.appendChild(probe);
    const widths = ROT_WORDS.map((t) => { probe.textContent = t; return probe.getBoundingClientRect().width; });
    document.body.removeChild(probe);
    const boxW = Math.max.apply(null, widths);
    wordScales = widths.map((w) => boxW / w);
    rotBox.style.width = boxW + 'px';
    rotWord.style.transform = 'scale(' + (wordScales[wordIdx] || 1) + ')';
  }
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(measureWords);
  requestAnimationFrame(measureWords);
  window.addEventListener('resize', measureWords);

  // The cycle is as long as the list that actually turns over. Only fade the
  // opening word when there is more than one of it — otherwise it would blink
  // on every pass for no reason.
  const swaps = Math.max(ROT_WORDS.length, ROT_TAILS.length);
  setInterval(() => {
    if (ROT_WORDS.length > 1) rotWord.style.opacity = '0';
    if (rotTail) rotTail.style.opacity = '0';
    setTimeout(() => {
      wordIdx = (wordIdx + 1) % swaps;
      const w = wordIdx % ROT_WORDS.length;
      rotWord.textContent = ROT_WORDS[w];
      rotWord.style.transform = 'scale(' + (wordScales[w] || 1) + ')';
      rotWord.style.opacity = '1';
      if (rotTail) {
        rotTail.innerHTML = ROT_TAILS[wordIdx % ROT_TAILS.length];
        rotTail.style.opacity = '1';
      }
    }, 320);
  }, 3200);

  // ------------------------------------------------------------- services
  const systemsList = $('#systemsList'), activeReplaces = $('#activeReplaces');
  const panels = {};
  document.querySelectorAll('[data-panel]').forEach((el) => { panels[el.dataset.panel] = el; });
  let sysIdx = 0, subIdx = 0;

  const bulletList = (bullets, marginTop) =>
    '<div style="display:flex;flex-direction:column;gap:6px;margin-top:' + marginTop + 'px">' +
    bullets.map((b) => '<div style="font-size:14px;color:#4e5261;display:flex;gap:10px"><span style="color:#3a4fae">—</span><span>' + esc(b) + '</span></div>').join('') +
    '</div>';

  function renderSystems() {
    systemsList.innerHTML = SYSTEMS.map((s, i) => {
      const active = i === sysIdx;
      let head = '<div style="font-size:24px;font-weight:600;letter-spacing:-.015em;line-height:1.2;transition:color .3s;color:' +
        (active ? '#1a1740' : '#8d91a3') + '">' + esc(s.title) + '</div>';
      if (active) {
        head += '<div style="font-size:12px;letter-spacing:.16em;color:#3a4fae;margin-top:12px">' + esc(s.tag) + '</div>';
        if (s.bullets) head += bulletList(s.bullets, 14);
      }

      let subs = '';
      if (active && s.subs) {
        subs = '<div style="display:flex;flex-direction:column;padding:0 0 22px 56px;animation:panel-in .4s ease both">' +
          s.subs.map((u, j) => {
            const ua = j === subIdx;
            let inner = '<div style="font-size:16px;font-weight:600;letter-spacing:-.01em;transition:color .3s;color:' +
              (ua ? '#1a1740' : '#8d91a3') + '">' + esc(u.title) + '</div>';
            if (ua) {
              inner += '<div style="font-size:11px;letter-spacing:.14em;color:#3a4fae;margin-top:8px">' + esc(u.tag) + '</div>';
              if (u.bullets) inner += bulletList(u.bullets, 12);
            }
            return '<div role="button" tabindex="0" aria-pressed="' + ua + '" data-sub="' + i + ',' + j + '" style="display:grid;grid-template-columns:20px 1fr;gap:14px;padding:16px 0;border-top:1px solid #dcdee6;cursor:pointer">' +
              '<div style="width:8px;height:8px;border-radius:50%;margin-top:6px;background:' + (ua ? '#3a4fae' : 'transparent') + ';border:1.5px solid #3a4fae"></div>' +
              '<div>' + inner + '</div></div>';
          }).join('') + '</div>';
      }

      return '<div style="border-bottom:1px solid #b5bacf">' +
        '<div role="button" tabindex="0" aria-pressed="' + active + '" data-sys="' + i + '" style="display:grid;grid-template-columns:44px 1fr;gap:12px;padding:24px 0;cursor:pointer">' +
        '<span style="font-size:12px;letter-spacing:.12em;color:#3a4fae;padding-top:8px">' + esc(s.num) + '</span>' +
        '<div>' + head + '</div></div>' + subs + '</div>';
    }).join('');
  }

  function renderPanel() {
    const sys = SYSTEMS[sysIdx];
    const item = sys.subs ? sys.subs[subIdx] : sys;
    // hidden -> visible restarts the panel-in and row-loop keyframes, as a remount would
    Object.keys(panels).forEach((k) => { panels[k].hidden = k !== item.key; });
    activeReplaces.textContent = item.replaces;
  }

  function select(i, j) {
    sysIdx = i; subIdx = j;
    renderSystems(); renderPanel();
  }

  const onSelect = (e) => {
    const sub = e.target.closest('[data-sub]');
    if (sub) { const [i, j] = sub.dataset.sub.split(',').map(Number); return select(i, j); }
    const sys = e.target.closest('[data-sys]');
    if (sys) return select(Number(sys.dataset.sys), 0);
  };
  systemsList.addEventListener('click', onSelect);
  systemsList.addEventListener('keydown', (e) => {
    if (e.key !== 'Enter' && e.key !== ' ') return;
    if (!e.target.closest('[data-sys],[data-sub]')) return;
    e.preventDefault();
    onSelect(e);
  });
  renderSystems(); renderPanel();

  // -------------------------------------------------------- scroll reveal
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      e.target.setAttribute('data-in', '1');
      io.unobserve(e.target);
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });

  const scanReveal = () => document
    .querySelectorAll('[data-reveal]:not([data-in]),[data-stagger]:not([data-in]),[data-line]:not([data-in]),[data-num]:not([data-in])')
    .forEach((el) => io.observe(el));
  scanReveal();
  [400, 1500, 4000].forEach((ms) => setTimeout(scanReveal, ms));

  // ------------------------------------------- section heads land word by word
  if (!reduceMotion) {
    ['#servicesHead', '#processHead'].forEach((sel) => {
      const head = $(sel);
      if (!head) return;
      const words = head.textContent.trim().split(/\s+/);
      head.textContent = '';
      head.setAttribute('data-words', '1');
      words.forEach((w, i) => {
        const span = document.createElement('span');
        span.textContent = w;
        span.style.transitionDelay = (i * 0.045).toFixed(3) + 's';
        head.appendChild(span);
        if (i < words.length - 1) head.appendChild(document.createTextNode(' '));
      });
      io.observe(head);
    });
  }

  // ------------------------------------------------- nav follows the section
  const navLinks = Array.prototype.slice.call(document.querySelectorAll('#navBar .navPill a'));
  const spy = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      // Deviation from main.js: the shared <Nav /> emits "/#contact" so the link
      // works from every route, where the legacy home-only nav had "#contact".
      const link = navLinks.filter((a) => (a.getAttribute('href') || '').endsWith('#' + e.target.id))[0];
      if (link) link.classList.toggle('navActive', e.isIntersecting);
    });
  }, { rootMargin: '-45% 0px -45% 0px' });
  ['#services', '#contact'].forEach((sel) => { const el = $(sel); if (el) spy.observe(el); });

  // ------------------------------------- the research cells follow the pointer
  // Borrowed from the band this section was modelled on: the panel under the
  // cursor lifts a soft wash of the accent, so the grid reads as three surfaces
  // rather than three text blocks. Pointer-driven, not scroll-driven, so it sits
  // outside ADR-0004 entirely — nothing structural depends on it.
  const evGrid = $('#evidence .ev-grid');
  if (evGrid && !reduceMotion) {
    let raf = 0, pending = null, lit = null;
    const paint = () => {
      raf = 0;
      if (lit && lit !== pending.cell) lit.style.setProperty('--glow', '0');
      lit = pending.cell;
      lit.style.setProperty('--gx', pending.x + 'px');
      lit.style.setProperty('--gy', pending.y + 'px');
      lit.style.setProperty('--glow', '1');
    };
    evGrid.addEventListener('pointermove', (e) => {
      if (e.pointerType === 'touch') return;
      const cell = e.target.closest ? e.target.closest('.ev-cell') : null;
      if (!cell) return;
      const b = cell.getBoundingClientRect();
      pending = { cell: cell, x: Math.round(e.clientX - b.left), y: Math.round(e.clientY - b.top) };
      if (!raf) raf = requestAnimationFrame(paint);
    });
    evGrid.addEventListener('pointerleave', () => {
      if (lit) { lit.style.setProperty('--glow', '0'); lit = null; }
    });
  }

  /* eslint-enable */

  return () => {
    off.forEach((fn) => fn())
    timers.forEach((id) => { win.clearTimeout(id); win.clearInterval(id) })
    rafs.forEach((id) => win.cancelAnimationFrame(id))
    observers.forEach((o) => o.disconnect())
  }
}
