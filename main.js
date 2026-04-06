/* ============================================================
   VIBIN WITH J — main.js
   Scroll reveals · FAQ · Booking form · Waveform player · Note glitter
   ============================================================ */

(function () {
  "use strict";

  /* ── Smooth in-page scroll ──────────────────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (e) => {
      const id = link.getAttribute("href");
      if (id === "#") return;
      const target = document.querySelector(id);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: "smooth", block: "start" });
        closeMobileMenu();
      }
    });
  });

  /* ── Header scroll shadow ───────────────────────────────── */
  const header = document.querySelector(".site-header");
  if (header) {
    window.addEventListener(
      "scroll",
      () => {
        header.classList.toggle("scrolled", window.scrollY > 30);
      },
      { passive: true },
    );
  }

  /* ── Mobile menu ────────────────────────────────────────── */
  const menuToggle = document.getElementById("menuToggle");
  const mobileMenu = document.getElementById("mobileMenu");
  let menuOpen = false;

  function closeMobileMenu() {
    if (!menuOpen) return;
    menuOpen = false;
    mobileMenu.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
    animateHamburger(false);
  }

  function animateHamburger(open) {
    const spans = menuToggle ? menuToggle.querySelectorAll("span") : [];
    if (open) {
      spans[0].style.transform = "translateY(7px) rotate(45deg)";
      spans[1].style.opacity = "0";
      spans[2].style.transform = "translateY(-7px) rotate(-45deg)";
    } else {
      spans[0].style.transform = "";
      spans[1].style.opacity = "";
      spans[2].style.transform = "";
    }
  }

  if (menuToggle && mobileMenu) {
    menuToggle.addEventListener("click", () => {
      menuOpen = !menuOpen;
      mobileMenu.classList.toggle("open", menuOpen);
      menuToggle.setAttribute("aria-expanded", String(menuOpen));
      animateHamburger(menuOpen);
    });
  }

  /* ── Intersection Observer: scroll reveal ───────────────── */
  const revealEls = document.querySelectorAll(
    ".reveal-up, .reveal-fade, .reveal-left, .reveal-right",
  );

  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.01, rootMargin: "0px 0px -20px 0px" },
    );
    revealEls.forEach((el) => io.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add("visible"));
  }

  /* Immediately reveal any elements already in the viewport on load */
  requestAnimationFrame(() => {
    revealEls.forEach((el) => {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        el.classList.add("visible");
      }
    });
  });

  /* ── FAQ accordion ──────────────────────────────────────── */
  document.querySelectorAll(".faq-item").forEach((item) => {
    const btn = item.querySelector(".faq-q");
    if (!btn) return;
    btn.addEventListener("click", () => {
      const isActive = item.classList.contains("active");
      document.querySelectorAll(".faq-item").forEach((i) => {
        i.classList.remove("active");
        i.querySelector(".faq-q").setAttribute("aria-expanded", "false");
      });
      if (!isActive) {
        item.classList.add("active");
        btn.setAttribute("aria-expanded", "true");
      }
    });
  });

  /* ── Package pre-fill ───────────────────────────────────── */
  const packageSelect = document.getElementById("packageSelect");
  document.querySelectorAll("[data-package]").forEach((btn) => {
    btn.addEventListener("click", () => {
      if (!packageSelect) return;
      const pkg = btn.getAttribute("data-package");
      const opt = Array.from(packageSelect.options).find(
        (o) => o.value === pkg,
      );
      if (opt) {
        packageSelect.value = pkg;
        packageSelect.style.borderColor = "var(--teal)";
        packageSelect.style.boxShadow = "0 0 0 3px rgba(29,209,161,0.18)";
        setTimeout(() => {
          packageSelect.style.borderColor = "";
          packageSelect.style.boxShadow = "";
        }, 1600);
      }
    });
  });

  /* ── Booking form ───────────────────────────────────────── */
  const bookingForm = document.getElementById("bookingForm");
  const formSuccess = document.getElementById("formSuccess");

  if (bookingForm) bookingForm.addEventListener("submit", handleFormSubmit);

  function handleFormSubmit(e) {
    e.preventDefault();
    if (!validateForm()) return;

    const submitBtn = bookingForm.querySelector('[type="submit"]');
    const btnText = submitBtn.querySelector(".btn-text");
    const btnLoading = submitBtn.querySelector(".btn-loading");
    const btnArrow = submitBtn.querySelector(".btn-arrow");

    submitBtn.disabled = true;
    if (btnText) btnText.hidden = true;
    if (btnLoading) btnLoading.hidden = false;
    if (btnArrow) btnArrow.hidden = true;

    const data = Object.fromEntries(new FormData(bookingForm).entries());
    const subject = encodeURIComponent(
      `Booking Request: ${data.package} — ${data.name}`,
    );
    const body = encodeURIComponent(buildEmailBody(data));
    window.location.href = `mailto:VibinWithJ@hotmail.com?subject=${subject}&body=${body}`;

    setTimeout(() => {
      submitBtn.disabled = false;
      if (btnText) btnText.hidden = false;
      if (btnLoading) btnLoading.hidden = true;
      if (btnArrow) btnArrow.hidden = false;
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
      `Event date: ${d.date || "TBD"}`,
      `City:       ${d.city}`,
      `Package:    ${d.package}`,
      ``,
      `Notes / Song requests:`,
      d.notes || "(none)",
      ``,
      `Please confirm my booking within 24 hours.`,
      ``,
      `Thanks,`,
      d.name,
    ].join("\n");
  }

  function showSuccess(data) {
    if (!bookingForm || !formSuccess) return;
    bookingForm.hidden = true;
    formSuccess.hidden = false;
    formSuccess.scrollIntoView({ behavior: "smooth", block: "center" });
    const h4 = formSuccess.querySelector("h4");
    if (h4 && data.name)
      h4.textContent = `Request sent, ${data.name.split(" ")[0]}!`;
  }

  function validateForm() {
    let valid = true;
    bookingForm.querySelectorAll("[required]").forEach((input) => {
      const field = input.closest(".form-field");
      const empty = !input.value.trim();
      if (field) field.classList.toggle("show-error", empty);
      input.classList.toggle("error", empty);
      if (empty) valid = false;
    });
    if (!valid) {
      const first = bookingForm.querySelector(".error");
      if (first) first.focus();
    }
    return valid;
  }

  if (bookingForm) {
    bookingForm.querySelectorAll("input, select, textarea").forEach((input) => {
      input.addEventListener("input", () => {
        input.classList.remove("error");
        const field = input.closest(".form-field");
        if (field) field.classList.remove("show-error");
      });
    });
  }

  /* ── Testimonials ───────────────────────────────────────── */
  /*
   * TO ADD A TESTIMONIAL: append an object to this array.
   * Fields: text (string), name (string), initials (string, 1–2 chars)
   */
  const TESTIMONIALS = [
    {
      text: "A brilliant musician who brings every moment to life through his talent. His sound is pure vibes music that truly reaches the soul.",
      name: "Abigail Ward",
      initials: "AW",
    },
    {
      text: "An out-of-this-world talent who paints a beautiful picture with his melodious tunes.",
      name: "Abishua Johnson",
      initials: "AJ",
    },
    {
      text: "Great tone, easy communication, and the rate was perfect for our small launch party. Would absolutely book again.",
      name: "Aiden, startup founder",
      initials: "A",
    },
    {
      text: "A versatile and talented performer across multiple genres, delivering an excellent solo performance at the graduation ceremony that exceeded expectations.",
      name: "Myra Codling",
      initials: "MC",
    },
  ];

  (function renderTestimonials() {
    const grid = document.getElementById("testimonialsGrid");
    if (!grid) return;
    grid.innerHTML = TESTIMONIALS.map(
      (t, i) => `
      <article class="testimonial-card reveal-up" style="animation-delay:${(i + 1) * 0.1}s">
        <div class="quote-mark">"</div>
        <p class="quote-text">${t.text}</p>
        <div class="quote-sig">
          <div class="sig-avatar">${t.initials}</div>
          <span>${t.name}</span>
        </div>
      </article>`,
    ).join("");

    // Observe newly rendered cards for scroll reveal
    if ("IntersectionObserver" in window) {
      const revealIO = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("visible");
              revealIO.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.08, rootMargin: "0px 0px -40px 0px" },
      );
      grid.querySelectorAll(".reveal-up").forEach((el) => revealIO.observe(el));
    } else {
      grid
        .querySelectorAll(".reveal-up")
        .forEach((el) => el.classList.add("visible"));
    }
  })();

  /* ── Stagger transition delays on grids ─────────────────── */
  document
    .querySelectorAll(".packages-grid, .gallery-grid")
    .forEach((group) => {
      Array.from(group.children).forEach((child, i) => {
        if (!child.style.transitionDelay) {
          child.style.transitionDelay = `${i * 0.07}s`;
        }
      });
    });

  /* ────────────────────────────────────────────────────────
     DISC AUDIO PLAYER + FLOATING NOTES
  ──────────────────────────────────────────────────────── */
  (function initPlayer() {
    const audio = document.getElementById("audioEl");
    const playBtn = document.getElementById("playBtn");
    const progressBar = document.getElementById("progressBar");
    const progressFill = document.getElementById("progressFill");
    const timeEl = document.getElementById("audioTime");
    const disc = document.getElementById("audioDisc");
    const noteStage = document.getElementById("noteStage");

    if (!audio || !playBtn) return;

    const iconPlay = playBtn.querySelector(".icon-play");
    const iconPause = playBtn.querySelector(".icon-pause");
    const NOTES = ["♩", "♪", "♫", "♬"];
    let noteTimer = null;

    function formatTime(s) {
      const m = Math.floor(s / 60);
      const sec = Math.floor(s % 60);
      return `${m}:${sec.toString().padStart(2, "0")}`;
    }

    /* Spawn a floating note over the audio card */
    function spawnNote() {
      if (!noteStage) return;
      const el = document.createElement("span");
      el.className = "float-note" + (Math.random() > 0.5 ? " gold" : "");
      el.textContent = NOTES[Math.floor(Math.random() * NOTES.length)];
      el.style.left = 10 + Math.random() * 80 + "%";
      el.style.bottom = 5 + Math.random() * 30 + "%";
      el.style.fontSize = 12 + Math.random() * 10 + "px";
      noteStage.appendChild(el);
      el.addEventListener("animationend", () => el.remove());
    }

    function startNotes() {
      spawnNote();
      noteTimer = setInterval(spawnNote, 600);
    }
    function stopNotes() {
      clearInterval(noteTimer);
      noteTimer = null;
    }

    /* Play / pause */
    playBtn.addEventListener("click", () => {
      if (audio.paused) {
        audio.play().catch(() => {});
      } else {
        audio.pause();
      }
    });

    audio.addEventListener("play", () => {
      iconPlay.hidden = true;
      iconPause.hidden = false;
      if (disc) disc.classList.add("spinning");
      startNotes();
    });
    audio.addEventListener("pause", () => {
      iconPlay.hidden = false;
      iconPause.hidden = true;
      if (disc) disc.classList.remove("spinning");
      stopNotes();
    });

    /* Progress bar */
    audio.addEventListener("timeupdate", () => {
      if (!audio.duration) return;
      const pct = (audio.currentTime / audio.duration) * 100;
      if (progressFill) progressFill.style.width = pct + "%";
      if (timeEl) timeEl.textContent = formatTime(audio.currentTime);
    });

    audio.addEventListener("ended", () => {
      iconPlay.hidden = false;
      iconPause.hidden = true;
      if (disc) disc.classList.remove("spinning");
      stopNotes();
      if (progressFill) progressFill.style.width = "0%";
      if (timeEl) timeEl.textContent = "0:00";
    });

    /* Click progress bar to seek */
    if (progressBar) {
      progressBar.addEventListener("click", (e) => {
        if (!audio.duration) return;
        const rect = progressBar.getBoundingClientRect();
        audio.currentTime =
          ((e.clientX - rect.left) / rect.width) * audio.duration;
      });
    }

    /* Show duration once loaded */
    audio.addEventListener("loadedmetadata", () => {
      if (timeEl) timeEl.textContent = formatTime(audio.duration);
    });
  })();

  /* ────────────────────────────────────────────────────────
     MUSICAL NOTE GLITTER — Canvas
  ──────────────────────────────────────────────────────── */
  (function initGlitter() {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const canvas = document.getElementById("noteCanvas");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    const NOTES = ["♩", "♪", "♫", "♬", "𝄞", "♭", "♮"];
    const TEAL = [29, 209, 161];
    const GOLD = [245, 200, 66];
    let W,
      H,
      particles = [];

    function resize() {
      W = canvas.width = window.innerWidth;
      H = canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener("resize", resize, { passive: true });

    function randomBetween(a, b) {
      return a + Math.random() * (b - a);
    }

    function spawnParticle() {
      const useGold = Math.random() > 0.55;
      const [r, g, b] = useGold ? GOLD : TEAL;
      return {
        x: randomBetween(0.05, 0.95) * W,
        y: randomBetween(0.2, 0.95) * H,
        note: NOTES[Math.floor(Math.random() * NOTES.length)],
        size: randomBetween(10, 20),
        alpha: 0,
        maxAlpha: randomBetween(0.18, 0.55),
        vx: randomBetween(-0.25, 0.25),
        vy: randomBetween(-0.55, -0.15),
        rot: randomBetween(-0.3, 0.3),
        rotV: randomBetween(-0.01, 0.01),
        phase: "in" /* in | hold | out */,
        age: 0,
        holdFor: randomBetween(60, 140),
        r,
        g,
        b,
        // Twinkle: oscillation on alpha
        twinkleSpeed: randomBetween(0.02, 0.06),
        twinkleOffset: Math.random() * Math.PI * 2,
      };
    }

    // Spawn initial batch
    for (let i = 0; i < 18; i++) {
      const p = spawnParticle();
      p.alpha = Math.random() * p.maxAlpha; // start already visible
      p.phase = "hold";
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

      particles = particles.filter((p) => p.alpha > -0.1);

      particles.forEach((p) => {
        p.age++;
        p.x += p.vx;
        p.y += p.vy;
        p.rot += p.rotV;

        if (p.phase === "in") {
          p.alpha += 0.012;
          if (p.alpha >= p.maxAlpha) {
            p.alpha = p.maxAlpha;
            p.phase = "hold";
          }
        } else if (p.phase === "hold") {
          // Twinkle
          p.alpha =
            p.maxAlpha *
            (0.7 + 0.3 * Math.sin(p.age * p.twinkleSpeed + p.twinkleOffset));
          if (p.age > p.holdFor + 60) p.phase = "out";
        } else {
          p.alpha -= 0.008;
        }

        if (p.alpha <= 0) return;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.globalAlpha = Math.max(0, p.alpha);
        ctx.font = `${p.size}px serif`;
        ctx.fillStyle = `rgb(${p.r},${p.g},${p.b})`;

        // Soft glow
        ctx.shadowColor = `rgba(${p.r},${p.g},${p.b},0.6)`;
        ctx.shadowBlur = 10;

        ctx.fillText(p.note, 0, 0);
        ctx.restore();
      });

      requestAnimationFrame(tick);
    }

    requestAnimationFrame(tick);
  })();

  /* ────────────────────────────────────────────────────────
     VIDEO CAROUSEL
  ──────────────────────────────────────────────────────── */
  (function initCarousel() {
    const carousel = document.querySelector('.video-carousel');
    if (!carousel) return;

    const track   = carousel.querySelector('.carousel-track');
    const slides  = Array.from(track.querySelectorAll('.carousel-slide'));
    const dots    = Array.from(carousel.querySelectorAll('.carousel-dot'));
    const counter = carousel.querySelector('.carousel-counter');
    const total   = slides.length;
    let   current = 0;

    function goTo(idx) {
      /* Pause & reset every video except the target */
      slides.forEach((slide, i) => {
        const vid = slide.querySelector('video');
        if (vid && i !== idx) { vid.pause(); vid.currentTime = 0; }
      });

      current = ((idx % total) + total) % total;
      track.style.transform = `translateX(-${current * 100}%)`;
      dots.forEach((d, i) => d.classList.toggle('active', i === current));
      if (counter) counter.textContent = `${current + 1} / ${total}`;
    }

    carousel.querySelector('.carousel-prev')
      .addEventListener('click', () => goTo(current - 1));
    carousel.querySelector('.carousel-next')
      .addEventListener('click', () => goTo(current + 1));
    dots.forEach((dot, i) => dot.addEventListener('click', () => goTo(i)));

    /* Pause off-screen videos whenever any video plays */
    slides.forEach((slide, idx) => {
      const vid = slide.querySelector('video');
      if (!vid) return;
      vid.addEventListener('play', () => {
        goTo(idx); /* snap to this slide */
        slides.forEach((s, i) => {
          if (i !== idx) { const v = s.querySelector('video'); if (v) { v.pause(); v.currentTime = 0; } }
        });
      });
    });

    goTo(0);
  })();

  /* ── Video thumbnails (auto-capture first frame) ─────────── */
  (function generateThumbnails() {
    document.querySelectorAll('.carousel-slide video').forEach((vid) => {
      const capture = () => {
        if (!vid.videoWidth) return;
        const canvas = document.createElement('canvas');
        canvas.width  = vid.videoWidth;
        canvas.height = vid.videoHeight;
        canvas.getContext('2d').drawImage(vid, 0, 0);
        try { vid.poster = canvas.toDataURL('image/jpeg', 0.8); } catch (_) {}
      };
      vid.addEventListener('seeked',        capture, { once: true });
      vid.addEventListener('loadedmetadata', () => { vid.currentTime = 1.5; }, { once: true });
    });
  })();

})();
