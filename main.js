/* ============================================================
   VIBIN WITH J — main.js
   Scroll reveals · FAQ · Booking form · Waveform player · Note glitter
   ============================================================ */

(function () {
  'use strict';

  /* ── Smooth in-page scroll ──────────────────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
      const id = link.getAttribute('href');
      if (id === '#') return;
      const target = document.querySelector(id);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        closeMobileMenu();
      }
    });
  });

  /* ── Header scroll shadow ───────────────────────────────── */
  const header = document.querySelector('.site-header');
  if (header) {
    window.addEventListener('scroll', () => {
      header.classList.toggle('scrolled', window.scrollY > 30);
    }, { passive: true });
  }

  /* ── Mobile menu ────────────────────────────────────────── */
  const menuToggle = document.getElementById('menuToggle');
  const mobileMenu = document.getElementById('mobileMenu');
  let menuOpen = false;

  function closeMobileMenu() {
    if (!menuOpen) return;
    menuOpen = false;
    mobileMenu.classList.remove('open');
    menuToggle.setAttribute('aria-expanded', 'false');
    animateHamburger(false);
  }

  function animateHamburger(open) {
    const spans = menuToggle ? menuToggle.querySelectorAll('span') : [];
    if (open) {
      spans[0].style.transform = 'translateY(7px) rotate(45deg)';
      spans[1].style.opacity  = '0';
      spans[2].style.transform = 'translateY(-7px) rotate(-45deg)';
    } else {
      spans[0].style.transform = '';
      spans[1].style.opacity  = '';
      spans[2].style.transform = '';
    }
  }

  if (menuToggle && mobileMenu) {
    menuToggle.addEventListener('click', () => {
      menuOpen = !menuOpen;
      mobileMenu.classList.toggle('open', menuOpen);
      menuToggle.setAttribute('aria-expanded', String(menuOpen));
      animateHamburger(menuOpen);
    });
  }

  /* ── Intersection Observer: scroll reveal ───────────────── */
  const revealEls = document.querySelectorAll(
    '.reveal-up, .reveal-fade, .reveal-left, .reveal-right'
  );

  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });
    revealEls.forEach(el => io.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('visible'));
  }

  /* ── FAQ accordion ──────────────────────────────────────── */
  document.querySelectorAll('.faq-item').forEach(item => {
    const btn = item.querySelector('.faq-q');
    if (!btn) return;
    btn.addEventListener('click', () => {
      const isActive = item.classList.contains('active');
      document.querySelectorAll('.faq-item').forEach(i => {
        i.classList.remove('active');
        i.querySelector('.faq-q').setAttribute('aria-expanded', 'false');
      });
      if (!isActive) {
        item.classList.add('active');
        btn.setAttribute('aria-expanded', 'true');
      }
    });
  });

  /* ── Package pre-fill ───────────────────────────────────── */
  const packageSelect = document.getElementById('packageSelect');
  document.querySelectorAll('[data-package]').forEach(btn => {
    btn.addEventListener('click', () => {
      if (!packageSelect) return;
      const pkg = btn.getAttribute('data-package');
      const opt = Array.from(packageSelect.options).find(o => o.value === pkg);
      if (opt) {
        packageSelect.value = pkg;
        packageSelect.style.borderColor  = 'var(--teal)';
        packageSelect.style.boxShadow    = '0 0 0 3px rgba(29,209,161,0.18)';
        setTimeout(() => {
          packageSelect.style.borderColor = '';
          packageSelect.style.boxShadow   = '';
        }, 1600);
      }
    });
  });

  /* ── Booking form ───────────────────────────────────────── */
  const bookingForm = document.getElementById('bookingForm');
  const formSuccess = document.getElementById('formSuccess');

  if (bookingForm) bookingForm.addEventListener('submit', handleFormSubmit);

  function handleFormSubmit(e) {
    e.preventDefault();
    if (!validateForm()) return;

    const submitBtn  = bookingForm.querySelector('[type="submit"]');
    const btnText    = submitBtn.querySelector('.btn-text');
    const btnLoading = submitBtn.querySelector('.btn-loading');
    const btnArrow   = submitBtn.querySelector('.btn-arrow');

    submitBtn.disabled = true;
    if (btnText)    btnText.hidden    = true;
    if (btnLoading) btnLoading.hidden = false;
    if (btnArrow)   btnArrow.hidden   = true;

    const data    = Object.fromEntries(new FormData(bookingForm).entries());
    const subject = encodeURIComponent(`Booking Request: ${data.package} — ${data.name}`);
    const body    = encodeURIComponent(buildEmailBody(data));
    window.location.href = `mailto:VibinWithJ@hotmail.com?subject=${subject}&body=${body}`;

    setTimeout(() => {
      submitBtn.disabled  = false;
      if (btnText)    btnText.hidden    = false;
      if (btnLoading) btnLoading.hidden = true;
      if (btnArrow)   btnArrow.hidden   = false;
      showSuccess(data);
    }, 800);
  }

  function buildEmailBody(d) {
    return [
      `Hi Jahtaim,`,
      ``,
      `I'd like to book you for an event. Here are my details:`,
      ``,
      `Name:       ${d.name}`,
      `Contact:    ${d.contact}`,
      `Event date: ${d.date || 'TBD'}`,
      `City:       ${d.city}`,
      `Package:    ${d.package}`,
      ``,
      `Notes / Song requests:`,
      d.notes || '(none)',
      ``,
      `Please confirm my booking within 24 hours.`,
      ``,
      `Thanks,`,
      d.name,
    ].join('\n');
  }

  function showSuccess(data) {
    if (!bookingForm || !formSuccess) return;
    bookingForm.hidden = true;
    formSuccess.hidden = false;
    formSuccess.scrollIntoView({ behavior: 'smooth', block: 'center' });
    const h4 = formSuccess.querySelector('h4');
    if (h4 && data.name) h4.textContent = `Request sent, ${data.name.split(' ')[0]}!`;
  }

  function validateForm() {
    let valid = true;
    bookingForm.querySelectorAll('[required]').forEach(input => {
      const field = input.closest('.form-field');
      const empty = !input.value.trim();
      if (field) field.classList.toggle('show-error', empty);
      input.classList.toggle('error', empty);
      if (empty) valid = false;
    });
    if (!valid) {
      const first = bookingForm.querySelector('.error');
      if (first) first.focus();
    }
    return valid;
  }

  if (bookingForm) {
    bookingForm.querySelectorAll('input, select, textarea').forEach(input => {
      input.addEventListener('input', () => {
        input.classList.remove('error');
        const field = input.closest('.form-field');
        if (field) field.classList.remove('show-error');
      });
    });
  }

  /* ── Stagger transition delays on grids ─────────────────── */
  document.querySelectorAll('.packages-grid, .testimonials-grid, .gallery-grid').forEach(group => {
    Array.from(group.children).forEach((child, i) => {
      if (!child.style.transitionDelay) {
        child.style.transitionDelay = `${i * 0.07}s`;
      }
    });
  });

  /* ────────────────────────────────────────────────────────
     CUSTOM WAVEFORM AUDIO PLAYER
  ──────────────────────────────────────────────────────── */
  (function initPlayer() {
    const audio    = document.getElementById('audioEl');
    const playBtn  = document.getElementById('playBtn');
    const waveform = document.getElementById('waveform');
    const timeEl   = document.getElementById('audioTime');

    if (!audio || !playBtn || !waveform) return;

    const BARS       = 48;
    const iconPlay   = playBtn.querySelector('.icon-play');
    const iconPause  = playBtn.querySelector('.icon-pause');

    /* Generate pseudo-random waveform bars */
    const heights = Array.from({ length: BARS }, (_, i) => {
      // Shape: louder in middle, quieter at edges, with variation
      const pos  = i / BARS;
      const bell = Math.sin(pos * Math.PI);
      const rand = 0.35 + Math.random() * 0.65;
      return Math.max(0.1, bell * rand);
    });

    waveform.innerHTML = '';
    heights.forEach((h, i) => {
      const bar  = document.createElement('div');
      bar.className    = 'waveform-bar';
      bar.style.height = `${Math.round(h * 32) + 4}px`;
      bar.dataset.idx  = i;
      waveform.appendChild(bar);
    });

    function updateBars(progress) {
      const playedCount = Math.round(progress * BARS);
      waveform.querySelectorAll('.waveform-bar').forEach((bar, i) => {
        bar.classList.toggle('played', i < playedCount);
      });
    }

    function formatTime(s) {
      const m = Math.floor(s / 60);
      const sec = Math.floor(s % 60);
      return `${m}:${sec.toString().padStart(2, '0')}`;
    }

    /* Play / pause */
    playBtn.addEventListener('click', () => {
      if (audio.paused) {
        audio.play().catch(() => {});
      } else {
        audio.pause();
      }
    });

    audio.addEventListener('play', () => {
      iconPlay.hidden  = true;
      iconPause.hidden = false;
    });
    audio.addEventListener('pause', () => {
      iconPlay.hidden  = false;
      iconPause.hidden = true;
    });

    /* Progress */
    audio.addEventListener('timeupdate', () => {
      if (!audio.duration) return;
      const progress = audio.currentTime / audio.duration;
      updateBars(progress);
      if (timeEl) timeEl.textContent = formatTime(audio.currentTime);
    });

    audio.addEventListener('ended', () => {
      iconPlay.hidden  = false;
      iconPause.hidden = true;
      updateBars(0);
      if (timeEl) timeEl.textContent = '0:00';
    });

    /* Click waveform to seek */
    waveform.addEventListener('click', e => {
      if (!audio.duration) return;
      const rect     = waveform.getBoundingClientRect();
      const progress = (e.clientX - rect.left) / rect.width;
      audio.currentTime = progress * audio.duration;
    });

    /* Show duration once loaded */
    audio.addEventListener('loadedmetadata', () => {
      if (timeEl) timeEl.textContent = formatTime(audio.duration);
    });
  })();

  /* ────────────────────────────────────────────────────────
     MUSICAL NOTE GLITTER — Canvas
  ──────────────────────────────────────────────────────── */
  (function initGlitter() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const canvas = document.getElementById('noteCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const NOTES   = ['♩', '♪', '♫', '♬', '𝄞', '♭', '♮'];
    const TEAL    = [29, 209, 161];
    const GOLD    = [245, 200, 66];
    let   W, H, particles = [];

    function resize() {
      W = canvas.width  = window.innerWidth;
      H = canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize, { passive: true });

    function randomBetween(a, b) { return a + Math.random() * (b - a); }

    function spawnParticle() {
      const useGold = Math.random() > 0.55;
      const [r, g, b] = useGold ? GOLD : TEAL;
      return {
        x:       randomBetween(0.05, 0.95) * W,
        y:       randomBetween(0.2,  0.95) * H,
        note:    NOTES[Math.floor(Math.random() * NOTES.length)],
        size:    randomBetween(10, 20),
        alpha:   0,
        maxAlpha: randomBetween(0.18, 0.55),
        vx:      randomBetween(-0.25, 0.25),
        vy:      randomBetween(-0.55, -0.15),
        rot:     randomBetween(-0.3, 0.3),
        rotV:    randomBetween(-0.01, 0.01),
        phase:   'in',   /* in | hold | out */
        age:     0,
        holdFor: randomBetween(60, 140),
        r, g, b,
        // Twinkle: oscillation on alpha
        twinkleSpeed: randomBetween(0.02, 0.06),
        twinkleOffset: Math.random() * Math.PI * 2,
      };
    }

    // Spawn initial batch
    for (let i = 0; i < 18; i++) {
      const p = spawnParticle();
      p.alpha = Math.random() * p.maxAlpha; // start already visible
      p.phase = 'hold';
      particles.push(p);
    }

    let lastSpawn = 0;

    function tick(now) {
      ctx.clearRect(0, 0, W, H);

      // Spawn a new particle roughly every 800 ms
      if (now - lastSpawn > 800) {
        if (particles.length < 35) particles.push(spawnParticle());
        lastSpawn = now;
      }

      particles = particles.filter(p => p.alpha > -0.1);

      particles.forEach(p => {
        p.age++;
        p.x   += p.vx;
        p.y   += p.vy;
        p.rot += p.rotV;

        if (p.phase === 'in') {
          p.alpha += 0.012;
          if (p.alpha >= p.maxAlpha) { p.alpha = p.maxAlpha; p.phase = 'hold'; }
        } else if (p.phase === 'hold') {
          // Twinkle
          p.alpha = p.maxAlpha * (0.7 + 0.3 * Math.sin(p.age * p.twinkleSpeed + p.twinkleOffset));
          if (p.age > p.holdFor + 60) p.phase = 'out';
        } else {
          p.alpha -= 0.008;
        }

        if (p.alpha <= 0) return;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.globalAlpha = Math.max(0, p.alpha);
        ctx.font        = `${p.size}px serif`;
        ctx.fillStyle   = `rgb(${p.r},${p.g},${p.b})`;

        // Soft glow
        ctx.shadowColor  = `rgba(${p.r},${p.g},${p.b},0.6)`;
        ctx.shadowBlur   = 10;

        ctx.fillText(p.note, 0, 0);
        ctx.restore();
      });

      requestAnimationFrame(tick);
    }

    requestAnimationFrame(tick);
  })();

})();