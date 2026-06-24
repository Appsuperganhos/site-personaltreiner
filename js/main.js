/* main.js — GSAP + ScrollTrigger + lógica de scroll geral */

(function() {

  gsap.registerPlugin(ScrollTrigger);

  // ── CURSOR ──────────────────────────────────────────────────────
  const cur  = document.getElementById('cursor');
  const ring = document.getElementById('cursor-ring');
  let mx = 0, my = 0, rx = 0, ry = 0;

  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    cur.style.left = mx + 'px';
    cur.style.top  = my + 'px';
  });

  (function loopCursor() {
    rx += (mx - rx) * 0.1;
    ry += (my - ry) * 0.1;
    ring.style.left = rx + 'px';
    ring.style.top  = ry + 'px';
    requestAnimationFrame(loopCursor);
  })();

  document.querySelectorAll('a, button, .service-card, .hscroll-card').forEach(el => {
    el.addEventListener('mouseenter', () => {
      cur.style.width  = '18px'; cur.style.height = '18px';
      ring.style.width = '56px'; ring.style.height = '56px';
    });
    el.addEventListener('mouseleave', () => {
      cur.style.width  = '10px'; cur.style.height = '10px';
      ring.style.width = '38px'; ring.style.height = '38px';
    });
  });

  // ── PROGRESS BAR ────────────────────────────────────────────────
  const pb = document.getElementById('progress-bar');
  window.addEventListener('scroll', () => {
    pb.style.width = (window.scrollY / (document.body.scrollHeight - innerHeight) * 100) + '%';
  });

  // ── NAV SCROLL ──────────────────────────────────────────────────
  const nav = document.getElementById('main-nav');
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 80);
  });

  // ── HERO INTRO (on load) ────────────────────────────────────────
  gsap.timeline({ delay: 0.4 })
    .to('.hero-word',      { y: 0, duration: 1.3, stagger: 0.1,  ease: 'power4.out' })
    .to('.hero-label',     { opacity: 1, duration: 0.8, ease: 'power3.out' }, '-=0.8')
    .to('.hero-sub-main',  { opacity: 1, duration: 0.8, ease: 'power3.out' }, '-=0.4')
    .to('#scroll-hint',    { opacity: 1, duration: 0.6 }, '-=0.2');

  // ── HERO SCROLL JOURNEY ─────────────────────────────────────────
  // Usa window.camState exposta pelo hero3d.js
  const phase1   = document.getElementById('hero-phase-1');
  const phase2   = document.getElementById('hero-phase-2');
  const phase3   = document.getElementById('hero-phase-3');
  const scanLine = document.getElementById('scan-line');
  const scrollHint = document.getElementById('scroll-hint');
  const p2nums   = document.querySelectorAll('.phase2-num');
  const p2tags   = document.querySelectorAll('.phase2-tag');

  const heroTl = gsap.timeline({
    scrollTrigger: {
      trigger:       '#hero-wrapper',
      start:         'top top',
      end:           'bottom bottom',
      scrub:         1.6,
      pin:           '#hero-sticky',
      anticipatePin: 1,
    }
  });

  heroTl
    // 0–15%: câmera avança para a figura
    .to(window.camState, { posZ: 14, duration: 1.5, ease: 'power2.inOut' }, 0)

    // 15–35%: órbita para a direita, fase 1 sai
    .to(window.camState, { posX: 4, rotY: -0.4, posZ: 12, duration: 2, ease: 'power1.inOut' }, 1.5)
    .to(phase1,          { opacity: 0, y: -40, duration: 0.8, ease: 'power2.in' }, 1.8)
    .to(scrollHint,      { opacity: 0, duration: 0.4 }, 1.8)

    // 35–60%: fase 2 entra (stats), câmera orbita esquerda
    .to(phase2,   { opacity: 1, duration: 0.8, ease: 'power2.out' }, 3.0)
    .to(p2nums,   { x: 0, opacity: 1, stagger: 0.2, duration: 0.6 }, 3.2)
    .to(p2tags,   { x: 0, opacity: 1, stagger: 0.12, duration: 0.5 }, 3.4)
    .to(window.camState, { posX: -5, rotY: 0.5, posZ: 15, lookY: 2, duration: 3, ease: 'power1.inOut' }, 2.5)
    // Scan line varre a tela
    .to(scanLine, { opacity: 0.6, duration: 0.2 }, 3.0)
    .to(scanLine, { top: '100%', duration: 1.2, ease: 'none' }, 3.0)
    .to(scanLine, { opacity: 0, duration: 0.2 }, 4.0)

    // 60–80%: fase 2 sai, câmera volta ao centro
    .to(phase2,          { opacity: 0, duration: 0.6, ease: 'power2.in' }, 5.2)
    .to(window.camState, { posX: 0, rotY: 0, posZ: 18, lookY: 0, duration: 2.5, ease: 'power2.inOut' }, 5.0)

    // 80–100%: fase 3 CTA
    .to(phase3,        { opacity: 1, duration: 1.0, ease: 'power2.out' }, 6.5)
    .to('#phase3-line',{ width: 160, duration: 0.8, ease: 'power2.out' }, 7.0);

  // ── DIVIDERS ────────────────────────────────────────────────────
  document.querySelectorAll('[data-divider]').forEach(el => {
    gsap.to(el, {
      width: '100%', duration: 1.8, ease: 'power2.inOut',
      scrollTrigger: { trigger: el, start: 'top 92%' }
    });
  });

  // ── STATS COUNTER ───────────────────────────────────────────────
  document.querySelectorAll('.stat-item').forEach((s, i) => {
    const el  = s.querySelector('.count');
    const tgt = parseInt(el.dataset.target);
    ScrollTrigger.create({
      trigger: s, start: 'top 82%',
      onEnter: () => {
        s.classList.add('is-active');
        gsap.to({ v: 0 }, {
          v: tgt, duration: 2.2, delay: i * 0.12, ease: 'power2.out',
          onUpdate: function() { el.textContent = Math.round(this.targets()[0].v); }
        });
      }
    });
  });

  // ── SECTION EYEBROWS ────────────────────────────────────────────
  gsap.utils.toArray('.section-eyebrow').forEach(el => {
    gsap.to(el, {
      opacity: 1, x: 0, duration: 0.8, ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 88%' }
    });
  });

  // ── STAGGER WORDS ───────────────────────────────────────────────
  gsap.utils.toArray('.s-word').forEach(w => {
    gsap.to(w, {
      y: 0, opacity: 1, duration: 1.0, ease: 'power4.out',
      scrollTrigger: { trigger: w.closest('.section-title') || w, start: 'top 88%' }
    });
  });

  // ── SERVICE CARDS ───────────────────────────────────────────────
  document.querySelectorAll('.service-card').forEach((c, i) => {
    ScrollTrigger.create({
      trigger: c, start: 'top 88%',
      onEnter: () => {
        setTimeout(() => {
          const bar  = c.querySelector('.service-bar');
          const name = c.querySelector('.service-name');
          const desc = c.querySelector('.service-desc');
          const link = c.querySelector('.service-link');
          if (bar)  bar.style.cssText  = 'transform:scaleX(1);transition:transform 0.8s ease';
          if (name) name.style.cssText = 'transform:translateY(0);opacity:1;transition:all 0.6s ease 0.15s';
          if (desc) desc.style.cssText = 'transform:translateY(0);opacity:1;transition:all 0.6s ease 0.25s';
          if (link) link.style.cssText = 'transform:translateY(0);opacity:1;transition:all 0.6s ease 0.35s';
        }, i * 70);
      }
    });
  });

  // ── HORIZONTAL SCROLL (programs) ────────────────────────────────
  const ht = document.getElementById('hscroll-track');
  if (ht) {
    gsap.to(ht, {
      x: () => -(ht.scrollWidth - innerWidth + 128),
      ease: 'none',
      scrollTrigger: {
        trigger:       '.hscroll-section',
        start:         'top top',
        end:           'bottom bottom',
        scrub:         1.2,
        pin:           '.hscroll-sticky',
        anticipatePin: 1,
      }
    });
  }

  // ── TRANSFORM SECTION ───────────────────────────────────────────
  const tc = document.getElementById('transform-canvas-2');
  if (tc) {
    const tScene = new THREE.Scene();
    const tCam   = new THREE.PerspectiveCamera(60, 1, 0.1, 100);
    const tRend  = new THREE.WebGLRenderer({ canvas: tc, antialias: true, alpha: true });
    tRend.setClearColor(0x141418, 1);
    tCam.position.z = 8;
    tScene.add(new THREE.AmbientLight(0xffffff, 0.5));
    const tLight = new THREE.PointLight(0xE8213A, 3, 20);
    tLight.position.set(3, 3, 5);
    tScene.add(tLight);

    // DNA Helix
    const hGroup  = new THREE.Group();
    const sBallG  = new THREE.SphereGeometry(0.12, 8, 8);
    const matRed  = new THREE.MeshBasicMaterial({ color: 0xE8213A });
    const matDark = new THREE.MeshBasicMaterial({ color: 0x2a2a35 });
    for (let i = 0; i < 60; i++) {
      const ang = (i / 60) * Math.PI * 4;
      const y   = (i / 60) * 10 - 5;
      const s1  = new THREE.Mesh(sBallG, matRed);
      s1.position.set(Math.cos(ang) * 1.6, y, Math.sin(ang) * 1.6);
      hGroup.add(s1);
      const s2 = new THREE.Mesh(sBallG, matDark);
      s2.position.set(Math.cos(ang + Math.PI) * 1.6, y, Math.sin(ang + Math.PI) * 1.6);
      hGroup.add(s2);
      if (i % 5 === 0) {
        const bGeo = new THREE.CylinderGeometry(0.015, 0.015, 3.2, 4);
        const bar  = new THREE.Mesh(bGeo, new THREE.MeshBasicMaterial({ color: 0x332225, transparent: true, opacity: 0.5 }));
        bar.position.y = y;
        bar.rotation.z = Math.PI / 2;
        bar.rotation.x = ang;
        hGroup.add(bar);
      }
    }
    tScene.add(hGroup);

    function resizeT() {
      const p = tc.parentElement;
      if (!p) return;
      tRend.setSize(p.clientWidth, p.clientHeight);
      tCam.aspect = p.clientWidth / p.clientHeight;
      tCam.updateProjectionMatrix();
    }

    const tClock = new THREE.Clock();
    let tRunning = false;
    function renderT() {
      if (!tRunning) return;
      requestAnimationFrame(renderT);
      hGroup.rotation.y = tClock.getElapsedTime() * 0.45;
      tRend.render(tScene, tCam);
    }

    ScrollTrigger.create({
      trigger: '.transform-visual', start: 'top 72%',
      onEnter: () => {
        document.querySelector('.transform-frame-outer').classList.add('is-visible');
        document.querySelector('.transform-badge').classList.add('is-visible');
        resizeT();
        tRunning = true;
        renderT();
      }
    });

    window.addEventListener('resize', resizeT);
    setTimeout(resizeT, 100);
  }

  // ── TRANSFORM TEXT ──────────────────────────────────────────────
  document.querySelectorAll('.transform-body, .feature-row').forEach((el, i) => {
    ScrollTrigger.create({
      trigger: el, start: 'top 88%',
      onEnter: () => { setTimeout(() => el.classList.add('is-visible'), i * 90); }
    });
  });

  // ── PROCESS LINE ────────────────────────────────────────────────
  const pFill = document.getElementById('process-fill');
  if (pFill) {
    gsap.to(pFill, {
      width: '100%', ease: 'none',
      scrollTrigger: { trigger: '.process-section', start: 'top 65%', end: 'bottom 65%', scrub: 1 }
    });
  }
  document.querySelectorAll('.process-step').forEach((s, i) => {
    ScrollTrigger.create({
      trigger: s, start: 'top 82%',
      onEnter: () => { setTimeout(() => s.classList.add('is-visible'), i * 160); }
    });
  });

  // ── TESTIMONIALS SCROLL ─────────────────────────────────────────
  const ttrack = document.getElementById('testimonials-track');
  if (ttrack) {
    gsap.to(ttrack, {
      x: () => -(ttrack.scrollWidth - innerWidth + 128),
      ease: 'none',
      scrollTrigger: {
        trigger: '.testimonials-section',
        start:   'top 80%',
        end:     () => '+=' + (ttrack.scrollWidth * 0.9),
        scrub:   1.4,
      }
    });
  }

  // ── CTA REVEAL ──────────────────────────────────────────────────
  gsap.from('.cta-title', {
    y: 60, opacity: 0, duration: 1.2, ease: 'power4.out',
    scrollTrigger: { trigger: '.cta-title', start: 'top 82%' }
  });

  // ── SMOOTH ANCHOR SCROLL ────────────────────────────────────────
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (target) { e.preventDefault(); target.scrollIntoView({ behavior: 'smooth' }); }
    });
  });

  // ── REFRESH ON RESIZE ───────────────────────────────────────────
  window.addEventListener('resize', () => {
    ScrollTrigger.refresh();
  });

})();
