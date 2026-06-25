/* ═══════════════════════════════════════════════
   INSTASTORE — script.js  (GSAP powered)
   Requires: gsap.min.js + ScrollTrigger.min.js + ScrollToPlugin.min.js
═══════════════════════════════════════════════ */

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

/* ── 1. HERO ENTRANCE TIMELINE ─────────────── */
function initHeroEntrance() {
  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
  gsap.set(['#heroEyebrow','#heroTitle','#heroSub','#heroActions','#heroBadges'], { opacity: 0, y: 40 });
  gsap.set('#heroImg', { opacity: 0, x: 60, scale: 0.94 });
  tl
    .to('#heroEyebrow', { opacity: 1, y: 0, duration: 0.6 }, 0.2)
    .to('#heroTitle',   { opacity: 1, y: 0, duration: 0.7 }, 0.45)
    .to('#heroSub',     { opacity: 1, y: 0, duration: 0.6 }, 0.7)
    .to('#heroActions', { opacity: 1, y: 0, duration: 0.6 }, 0.9)
    .to('#heroBadges',  { opacity: 1, y: 0, duration: 0.5, stagger: 0.08 }, 1.05)
    .to('#heroImg',     { opacity: 1, x: 0, scale: 1, duration: 0.9, ease: 'power2.out' }, 0.5);
}

/* ── 2. HERO PARALLAX ───────────────────────── */
function initHeroParallax() {
  gsap.to('#heroImg', {
    yPercent: 18, ease: 'none',
    scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true }
  });
}

/* ── 3. GSAP TICKER ─────────────────────────── */
function initTicker() {
  const track = document.getElementById('tickerTrack');
  if (!track) return;
  const totalWidth = track.scrollWidth / 2;
  let tickerAnim = gsap.to(track, {
    x: -totalWidth, duration: 28, ease: 'none', repeat: -1,
    modifiers: { x: gsap.utils.unitize(x => parseFloat(x) % totalWidth) }
  });
  const wrap = document.getElementById('tickerWrap');
  wrap.addEventListener('mouseenter', () => tickerAnim.pause());
  wrap.addEventListener('mouseleave', () => tickerAnim.resume());
}

/* ── 4. PRODUCT CARDS STAGGER ───────────────── */
function initProductCards() {
  gsap.set('.product-card', { opacity: 0, y: 50 });
  ScrollTrigger.create({
    trigger: '#products', start: 'top 75%',
    onEnter: () => {
      gsap.to('.product-card', { opacity: 1, y: 0, duration: 0.55, stagger: 0.08, ease: 'power2.out' });
    },
    once: true
  });
}

/* ── 5. STATS COUNTER ───────────────────────── */
function initStatsCounter() {
  const statEls = document.querySelectorAll('.stat-num[data-target]');
  ScrollTrigger.create({
    trigger: '.about-stats', start: 'top 80%',
    onEnter: () => {
      statEls.forEach(el => {
        const target = parseInt(el.dataset.target, 10);
        const suffix = el.dataset.suffix || '';
        gsap.fromTo(el,
          { innerText: 0 },
          {
            innerText: target, duration: 1.8, ease: 'power1.out', snap: { innerText: 1 },
            onUpdate() { el.textContent = Math.round(parseFloat(el.innerText)) + suffix; }
          }
        );
      });
    },
    once: true
  });
}

/* ── 6. SCROLL REVEAL ───────────────────────── */
function initScrollReveal() {
  const revealTargets = [
    { selector: '#productsHeader', y: 30 },
    { selector: '#aboutImg',       x: -50 },
    { selector: '#aboutText',      x:  50 },
    { selector: '#offersText',     x: -40 },
    { selector: '#offersIcons .offer-pill', y: 30, stagger: 0.1 },
    { selector: '#reviewsHeader',  y: 30 },
    { selector: '.reviews-summary', y: 20 },
    { selector: '#contactHeader',  y: 30 },
    { selector: '#contactDetails .contact-item', x: -30, stagger: 0.1 },
    { selector: '.map-wrap',       x: 40 },
  ];
  revealTargets.forEach(({ selector, x = 0, y = 0, stagger = 0 }) => {
    const els = document.querySelectorAll(selector);
    if (!els.length) return;
    gsap.set(els, { opacity: 0, x, y });
    ScrollTrigger.create({
      trigger: els[0], start: 'top 82%',
      onEnter: () => {
        gsap.to(els, { opacity: 1, x: 0, y: 0, duration: 0.65, stagger, ease: 'power2.out' });
      },
      once: true
    });
  });
}

/* ── 6b. REVIEWS MARQUEE ────────────────────── */
function initReviewsMarquee() {
  const track = document.querySelector('#marqueeRow1 .marquee-track');
  if (!track) return;

  // Wait for layout then animate
  ScrollTrigger.create({
    trigger: '#reviews',
    start: 'top 80%',
    onEnter: () => {
      const totalWidth = track.scrollWidth / 2;
      gsap.to(track, {
        x: -totalWidth,
        duration: 35,
        ease: 'none',
        repeat: -1,
        modifiers: {
          x: gsap.utils.unitize(x => parseFloat(x) % totalWidth)
        }
      });
    },
    once: true
  });

  // Pause on hover
  const row = document.getElementById('marqueeRow1');
  row.addEventListener('mouseenter', () => gsap.globalTimeline.pause());
  row.addEventListener('mouseleave', () => gsap.globalTimeline.resume());
}

/* ── 7. BACK TO TOP ─────────────────────────── */
function initBackToTop() {
  const btn = document.getElementById('backToTop');
  if (!btn) return;
  gsap.set(btn, { y: 60, opacity: 0 });
  ScrollTrigger.create({
    start: 'top -80%',
    onEnter: () => {
      btn.classList.add('visible');
      gsap.to(btn, { y: 0, opacity: 1, duration: 0.5, ease: 'back.out(1.6)' });
    },
    onLeaveBack: () => {
      btn.classList.remove('visible');
      gsap.to(btn, { y: 60, opacity: 0, duration: 0.35, ease: 'power2.in' });
    }
  });
  btn.addEventListener('click', () => {
    gsap.to(window, { scrollTo: 0, duration: 1.1, ease: 'power3.inOut' });
    gsap.to(btn, { y: -8, duration: 0.18, ease: 'power2.out', yoyo: true, repeat: 1 });
  });
}

/* ── 8. BOLT GOLD CURTAIN ───────────────────── */
function initBoltCurtain() {
  const curtain  = document.getElementById('boltCurtain');
  const panelL   = curtain.querySelector('.curtain-panel.left');
  const panelR   = curtain.querySelector('.curtain-panel.right');
  const logo     = curtain.querySelector('.curtain-logo');
  const triggers = document.querySelectorAll('.bolt-trigger');

  triggers.forEach(trigger => {
    trigger.addEventListener('click', e => {
      e.preventDefault();
      const url = trigger.dataset.url || trigger.href;
      playBoltCurtain(url);
    });
  });

  function playBoltCurtain(url) {
    curtain.style.pointerEvents = 'all';
    const tl = gsap.timeline({
      onComplete: () => {
        window.open(url, '_blank');
        gsap.timeline()
          .to(logo, { opacity: 0, duration: 0.2 })
          .to([panelL, panelR], {
            scaleX: 0, duration: 0.6, ease: 'power3.in',
            onComplete: () => { curtain.style.pointerEvents = 'none'; }
          });
      }
    });
    tl
      .set([panelL, panelR], { scaleX: 0 })
      .set(logo, { opacity: 0, scale: 0.85 })
      .to(panelL, { scaleX: 1, duration: 0.45, ease: 'power3.inOut' }, 0)
      .to(panelR, { scaleX: 1, duration: 0.45, ease: 'power3.inOut' }, 0)
      .to(logo, { opacity: 1, scale: 1, duration: 0.35, ease: 'back.out(1.4)' }, 0.35)
      .to({}, { duration: 0.6 });
  }
}

/* ── 9. LOGO PIN MICRO-BOUNCE ───────────────── */
function initNavLogoBounce() {
  const pin = document.querySelector('.logo-i-svg');
  if (!pin) return;
  document.querySelector('.nav-logo').addEventListener('mouseenter', () => {
    gsap.to(pin, { y: -4, duration: 0.2, ease: 'power2.out', yoyo: true, repeat: 1 });
  });
}

/* ── 10. NAVBAR ─────────────────────────────── */
function initNavbar() {
  const navbar   = document.getElementById('navbar');
  const navLinks = document.querySelectorAll('.nav-links a:not(.nav-order-btn)');
  const sections = document.querySelectorAll('section[id]');

  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
    let current = '';
    sections.forEach(sec => {
      if (window.scrollY >= sec.offsetTop - 100) current = sec.id;
    });
    navLinks.forEach(a => {
      a.classList.toggle('active', a.getAttribute('href') === `#${current}`);
    });
  }, { passive: true });

  const toggle  = document.getElementById('navToggle');
  const linksEl = document.getElementById('navLinks');

  toggle.addEventListener('click', () => {
    const open = linksEl.classList.toggle('open');
    const spans = toggle.querySelectorAll('span');
    gsap.to(spans[0], { rotation: open ?  45 : 0, y: open ?  7 : 0, duration: 0.25 });
    gsap.to(spans[1], { opacity:  open ?   0 : 1, duration: 0.2 });
    gsap.to(spans[2], { rotation: open ? -45 : 0, y: open ? -7 : 0, duration: 0.25 });
  });

  linksEl.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      linksEl.classList.remove('open');
      const spans = toggle.querySelectorAll('span');
      gsap.to(spans[0], { rotation: 0, y: 0, duration: 0.25 });
      gsap.to(spans[1], { opacity: 1, duration: 0.2 });
      gsap.to(spans[2], { rotation: 0, y: 0, duration: 0.25 });
    });
  });
}

/* ── 11. PRODUCT CAROUSEL ───────────────────── */
function initCarousel() {
  const track    = document.getElementById('carouselTrack');
  const viewport = document.getElementById('carouselViewport');
  const prevBtn  = document.getElementById('prevBtn');
  const nextBtn  = document.getElementById('nextBtn');
  const dotsWrap = document.getElementById('carouselDots');
  const allCards = Array.from(document.querySelectorAll('.product-card'));
  const catTabs  = document.querySelectorAll('.cat-tab');

  let currentIndex = 0;
  let visibleCards = [...allCards];

  function cpv() {
    const w = window.innerWidth;
    if (w <= 480) return 1;
    if (w <= 768) return 2;
    if (w <= 1024) return 3;
    return 4;
  }

  function cardW() {
    return (viewport.offsetWidth - 20 * (cpv() - 1)) / cpv();
  }

  function setWidths() {
    const w = cardW();
    allCards.forEach(c => { c.style.flex = `0 0 ${w}px`; });
  }

  function buildDots() {
    dotsWrap.innerHTML = '';
    const total = Math.ceil(visibleCards.length / cpv()) || 1;
    for (let i = 0; i < total; i++) {
      const d = document.createElement('button');
      d.className = 'carousel-dot' + (i === 0 ? ' active' : '');
      d.addEventListener('click', () => goTo(i));
      dotsWrap.appendChild(d);
    }
  }

  function goTo(page) {
    const max = Math.ceil(visibleCards.length / cpv()) - 1;
    currentIndex = Math.max(0, Math.min(page, max));
    updateCarousel();
  }

  function updateCarousel() {
    const w = cardW(), gap = 20;
    let offset = 0, count = 0;
    for (let i = 0; i < allCards.length && count < currentIndex * cpv(); i++) {
      if (allCards[i].style.display !== 'none') { offset += w + gap; count++; }
    }
    gsap.to(track, { x: -offset, duration: 0.55, ease: 'power2.inOut' });
    dotsWrap.querySelectorAll('.carousel-dot').forEach((d, i) => {
      d.classList.toggle('active', i === currentIndex);
    });
    prevBtn.disabled = currentIndex === 0;
    nextBtn.disabled = currentIndex >= Math.ceil(visibleCards.length / cpv()) - 1;
  }

  function filterCards(cat) {
    allCards.forEach(c => {
      c.style.display = (cat === 'all' || c.dataset.cat === cat) ? 'block' : 'none';
    });
    visibleCards = allCards.filter(c => c.style.display !== 'none');
    currentIndex = 0;
    setWidths();
    buildDots();
    updateCarousel();
    gsap.fromTo(visibleCards,
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.45, stagger: 0.07, ease: 'power2.out' }
    );
  }

  catTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      catTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      filterCards(tab.dataset.cat);
    });
  });

  prevBtn.addEventListener('click', () => goTo(currentIndex - 1));
  nextBtn.addEventListener('click', () => goTo(currentIndex + 1));
  window.addEventListener('resize', () => { setWidths(); updateCarousel(); }, { passive: true });

  let tx = 0;
  viewport.addEventListener('touchstart', e => { tx = e.touches[0].clientX; }, { passive: true });
  viewport.addEventListener('touchend', e => {
    const d = tx - e.changedTouches[0].clientX;
    if (Math.abs(d) > 50) d > 0 ? goTo(currentIndex + 1) : goTo(currentIndex - 1);
  }, { passive: true });

  filterCards('all');
}

/* ── 12. DIRECTIONS ─────────────────────────── */
function initDirections() {
  const STORE_LAT = 35.9280016;
  const STORE_LNG = 14.4874913;
  const STORE_MAPS_URL = `https://www.google.com/maps/place/InstaStore/@${STORE_LAT},${STORE_LNG},17z`;
  const DIRECTIONS_BASE = 'https://www.google.com/maps/dir/';

  function openDirections(e) {
    e.preventDefault();
    const el = e.currentTarget;
    const originalHTML = el.innerHTML;
    el.innerHTML = el.innerHTML.replace(/Get directions.*/, 'Getting your location...');

    if (!navigator.geolocation) {
      window.open(STORE_MAPS_URL, '_blank');
      el.innerHTML = originalHTML;
      return;
    }

    navigator.geolocation.getCurrentPosition(
      pos => {
        const { latitude, longitude } = pos.coords;
        window.open(`${DIRECTIONS_BASE}${latitude},${longitude}/${STORE_LAT},${STORE_LNG}`, '_blank');
        el.innerHTML = originalHTML;
      },
      () => {
        window.open(STORE_MAPS_URL, '_blank');
        el.innerHTML = originalHTML;
      },
      { timeout: 8000, enableHighAccuracy: true }
    );
  }

  const ids = ['directionsLink', 'directionsBtn', 'mapDirectionsOverlay'];
  ids.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.addEventListener('click', openDirections);
  });
}

/* ── VIDEO CONTROLS ─────────────────────────── */
function initVideoControls() {
  const video     = document.getElementById('heroVideo');
  const muteBtn   = document.getElementById('muteBtn');
  const pauseBtn  = document.getElementById('pauseBtn');
  if (!video || !muteBtn || !pauseBtn) return;

  // Mute toggle
  muteBtn.addEventListener('click', () => {
    video.muted = !video.muted;
    document.getElementById('iconMuted').style.display   = video.muted ? 'block' : 'none';
    document.getElementById('iconUnmuted').style.display = video.muted ? 'none'  : 'block';
    // GSAP bounce on click
    gsap.to(muteBtn, { scale: 1.25, duration: 0.15, yoyo: true, repeat: 1, ease: 'power2.out' });
  });

  // Pause/play toggle
  pauseBtn.addEventListener('click', () => {
    if (video.paused) {
      video.play();
      document.getElementById('iconPause').style.display = 'block';
      document.getElementById('iconPlay').style.display  = 'none';
    } else {
      video.pause();
      document.getElementById('iconPause').style.display = 'none';
      document.getElementById('iconPlay').style.display  = 'block';
    }
    gsap.to(pauseBtn, { scale: 1.25, duration: 0.15, yoyo: true, repeat: 1, ease: 'power2.out' });
  });
}

/* ── BOOT ───────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initHeroEntrance();
  initHeroParallax();
  initTicker();
  initProductCards();
  initStatsCounter();
  initScrollReveal();
  initReviewsMarquee();
  initBackToTop();
  initBoltCurtain();
  initNavLogoBounce();
  initCarousel();
  initDirections();
  initVideoControls();
});