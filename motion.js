/* ══════════════════════════════════════════════════════════════
   motion.js — the interaction layer.

   Everything here is additive. If GSAP never loads, the visitor asks
   for reduced motion, or the device has no fine pointer, the page
   underneath is exactly what app.js built and every control still
   works. Nothing in this file is load-bearing.

   Built on GSAP 3.13 (core + SplitText), vendored in assets/vendor/.
   Deliberately NOT ScrollTrigger: app.js owns a single rAF scroll
   engine that drives the travelling record, and two engines competing
   over the same sticky choreography is how the whole thing starts to
   stutter. Scroll stays app.js's job; this file handles the pointer,
   the type reveals and the things that react rather than scrub.
   ══════════════════════════════════════════════════════════════ */

(() => {
  "use strict";

  const gsap = window.gsap;
  const SplitText = window.SplitText;
  if (!gsap) return;
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  /* hover effects are pointless — and janky — on a touch screen */
  const fine = matchMedia("(hover: hover) and (pointer: fine)").matches;

  document.documentElement.classList.add("motion-on");
  gsap.defaults({ ease: "power3.out" });

  const $ = (id) => document.getElementById(id);
  const q = (sel, root = document) => [...root.querySelectorAll(sel)];
  const clamp = (v, lo, hi) => (v < lo ? lo : v > hi ? hi : v);
  const clamp01 = (v) => clamp(v, 0, 1);

  /* ── magnetic controls ─────────────────────────────────────────
     The button leans toward the cursor and springs back. Replaces the
     translateY(-2px) hover kit that every template ships with.       */

  function magnetic(el, { pull = 0.3, max = 12, lift = 0 } = {}) {
    if (!fine || !el) return;
    const xTo = gsap.quickTo(el, "x", { duration: 0.55, ease: "power3" });
    const yTo = gsap.quickTo(el, "y", { duration: 0.55, ease: "power3" });
    let box = null;

    el.addEventListener("pointerenter", () => { box = el.getBoundingClientRect(); });
    el.addEventListener("pointermove", (e) => {
      if (el.disabled) return;
      if (!box) box = el.getBoundingClientRect();
      xTo(clamp((e.clientX - (box.left + box.width / 2)) * pull, -max, max));
      yTo(clamp((e.clientY - (box.top + box.height / 2)) * pull, -max, max) - lift);
    });
    el.addEventListener("pointerleave", () => { box = null; xTo(0); yTo(0); });
  }

  magnetic(document.querySelector(".hire"), { pull: 0.34, max: 16, lift: 3 });
  magnetic(document.querySelector(".btn-primary"), { pull: 0.26, max: 12, lift: 3 });
  magnetic(document.querySelector(".btn-ghost"), { pull: 0.26, max: 12, lift: 3 });
  magnetic(document.querySelector(".wordmark-jat"), { pull: 0.4, max: 7 });
  q(".tp-btn").forEach((b) => magnetic(b, { pull: 0.32, max: 9 }));

  /* ── the play cue follows the cursor ───────────────────────────
     On anything that plays, the ▶ ring tracks the pointer across the
     still. It turns a poster into something that wants to be pressed. */

  function cursorCue(host, cue, { damp = 0.4, grow = 1.14 } = {}) {
    if (!fine || !host || !cue) return;
    const xTo = gsap.quickTo(cue, "x", { duration: 0.5, ease: "power3" });
    const yTo = gsap.quickTo(cue, "y", { duration: 0.5, ease: "power3" });
    /* quickTo cannot drive the `scale` shorthand — it needs the two axes */
    const sxTo = gsap.quickTo(cue, "scaleX", { duration: 0.35, ease: "power3" });
    const syTo = gsap.quickTo(cue, "scaleY", { duration: 0.35, ease: "power3" });
    const sTo = (v) => { sxTo(v); syTo(v); };
    let box = null;

    host.addEventListener("pointerenter", () => {
      box = host.getBoundingClientRect();
      sTo(grow);
    });
    host.addEventListener("pointermove", (e) => {
      if (!box) box = host.getBoundingClientRect();
      xTo((e.clientX - (box.left + box.width / 2)) * damp);
      yTo((e.clientY - (box.top + box.height / 2)) * damp);
    });
    host.addEventListener("pointerleave", () => {
      box = null;
      xTo(0); yTo(0); sTo(1);
    });
  }

  cursorCue($("recMedia"), document.querySelector(".rec-play-ring"), { damp: 0.34, grow: 1.12 });
  cursorCue($("screenMedia"), document.querySelector(".screen-play-ring"), { damp: 0.34, grow: 1.12 });

  /* film tiles are rebuilt on every campaign change, so re-bind each time */
  function bindFilmCues() {
    if (!fine) return;
    q("#campFilms .film").forEach((film) => {
      if (film.dataset.cued) return;
      film.dataset.cued = "1";
      cursorCue(film, film.querySelector(".film-cue"), { damp: 0.3, grow: 1.18 });
    });
  }
  bindFilmCues();

  /* ── the brand wall reads like a stage light ───────────────────
     Thirty-seven logos is a lot of grey. A pool of warmth follows the
     pointer across the grid: nearby marks lift, regain their colour and
     show their number, and fade back out behind you.                  */

  {
    const wall = $("wall");
    const tiles = wall ? [...wall.children] : [];

    if (fine && tiles.length) {
      const lit = new Float32Array(tiles.length);
      let rects = [];
      let px = 0, py = 0;
      let inside = false;
      let lastScroll = -1;
      let running = false;

      const measure = () => {
        rects = tiles.map((t) => t.getBoundingClientRect());
        lastScroll = scrollY;
      };

      /* runs on GSAP's ticker rather than a second rAF loop of its own */
      const tick = () => {
        let awake = false;
        if (inside && scrollY !== lastScroll) measure();

        for (let i = 0; i < tiles.length; i++) {
          const r = rects[i];
          let want = 0;

          if (inside && r) {
            /* the pool is measured in tiles, not pixels, so it stays the
               same shape whatever the grid reflows to */
            const dx = (px - (r.left + r.width / 2)) / (r.width * 2.5);
            const dy = (py - (r.top + r.height / 2)) / (r.height * 2.5);
            const d = Math.sqrt(dx * dx + dy * dy);
            if (d < 1) want = (1 - d) * (1 - d);
          }

          const was = lit[i];
          const now = was + (want - was) * 0.17;
          lit[i] = now;

          if (!inside && now < 0.02) {
            /* close enough to dark — snap, so no tile is left faintly on */
            if (was !== 0) tiles[i].style.setProperty("--lit", "0");
            lit[i] = 0;
          } else if (Math.abs(now - was) > 0.003) {
            tiles[i].style.setProperty("--lit", now.toFixed(3));
            awake = true;
          }
        }

        if (!awake && !inside) {
          running = false;
          gsap.ticker.remove(tick);
        }
      };

      const wake = () => {
        if (running) return;
        running = true;
        gsap.ticker.add(tick);
      };

      wall.addEventListener("pointerenter", (e) => {
        measure();
        px = e.clientX; py = e.clientY;
        inside = true;
        wake();
      });
      wall.addEventListener("pointermove", (e) => { px = e.clientX; py = e.clientY; });
      wall.addEventListener("pointerleave", () => { inside = false; wake(); });
    }
  }

  /* ── plucking the rail ─────────────────────────────────────────
     The nav is already a waveform. Hovering a section swells the wave
     around it, the way a string answers a finger laid on it.          */

  {
    const rail = $("rail");
    const wave = document.querySelector(".rail-wave");
    const rwTrack = $("rwTrack");
    const rwFill = $("rwFill");
    const API = window.JAT;

    if (fine && rail && wave && API && API.railWavePath) {
      const pluck = { y: 0, amp: 0 };

      const draw = () => {
        const h = API.railH;
        if (!h) return;
        const d = API.railWavePath(h, pluck.y, pluck.amp);
        rwTrack.setAttribute("d", d);
        rwFill.setAttribute("d", d);

        /* the bend changes the path length, so the progress fill has to
           be re-derived from scroll rather than trusting app.js's cache */
        const len = rwFill.getTotalLength();
        const p = clamp01(scrollY / Math.max(document.documentElement.scrollHeight - innerHeight, 1));
        rwFill.style.strokeDasharray = String(len);
        rwFill.style.strokeDashoffset = String(len * (1 - p));
      };

      const localY = (btn) => {
        const wr = wave.getBoundingClientRect();
        if (wr.height < 1) return null;
        const br = btn.getBoundingClientRect();
        return ((br.top + br.height / 2) - wr.top) / wr.height * API.railH;
      };

      q("button", rail).forEach((btn) => {
        btn.addEventListener("pointerenter", () => {
          const y = localY(btn);
          if (y == null) return;
          gsap.killTweensOf(pluck);
          gsap.to(pluck, {
            y,
            amp: 1,
            duration: pluck.amp ? 0.4 : 0.55,
            ease: "power3.out",
            onUpdate: draw,
          });
        });
      });

      rail.addEventListener("pointerleave", () => {
        gsap.killTweensOf(pluck);
        gsap.to(pluck, { amp: 0, duration: 0.7, ease: "power2.out", onUpdate: draw, onComplete: draw });
      });
    }
  }

  /* ── the logo reel answers the scroll ──────────────────────────
     Handing the marquee to GSAP buys what a CSS keyframe cannot: it
     speeds up when you scroll hard, and it runs backwards when you do. */

  const reel = (() => {
    const track = $("logoRail");
    if (!track) return null;

    const loop = gsap.to(track, { xPercent: -50, duration: 62, ease: "none", repeat: -1 });
    loop.progress(0.001);

    /* the ticker below reads this flag and eases the reel to a stop */
    const band = track.closest(".logo-rail");
    if (band && fine) {
      band.addEventListener("pointerenter", () => { band.dataset.hover = "1"; });
      band.addEventListener("pointerleave", () => { band.dataset.hover = ""; });
    }
    return { track, loop, band };
  })();

  /* ── pointer + scroll driven drift ─────────────────────────────
     One ticker for everything that reads the scroll position, so the
     page never has more than app.js's loop plus this one.             */

  {
    const heroImg = document.querySelector(".hero-shot img");
    const heroGlow = document.querySelector(".hero-glow");
    const deva = document.querySelector(".contact-deva");
    const actContact = $("act-contact");

    if (heroImg) gsap.set(heroImg, { scale: 1.07, transformOrigin: "50% 30%" });

    const setHeroY = heroImg ? gsap.quickSetter(heroImg, "y", "px") : null;
    const setDevaX = deva ? gsap.quickSetter(deva, "x", "px") : null;

    let contactTop = 0;
    let remeasureTimer = null;
    const remeasure = () => { contactTop = actContact ? actContact.offsetTop : 0; };
    remeasure();
    addEventListener("resize", () => {
      clearTimeout(remeasureTimer);
      remeasureTimer = setTimeout(remeasure, 180);
    });
    addEventListener("load", remeasure);

    let lastY = scrollY;
    let vel = 0;
    let dir = 1;
    let lastSkew = 0;

    gsap.ticker.add(() => {
      const y = scrollY;
      const dy = y - lastY;
      lastY = y;
      vel += (dy - vel) * 0.12;

      /* the reel */
      if (reel) {
        if (Math.abs(dy) > 0.6) dir = dy > 0 ? 1 : -1;
        const hovering = reel.band && reel.band.dataset.hover === "1";
        const speed = hovering ? 0 : dir * (1 + Math.min(Math.abs(vel) * 0.055, 2.6));
        reel.loop.timeScale(gsap.utils.interpolate(reel.loop.timeScale(), speed, 0.12));

        /* skip the write once the reel has settled — this ticker never stops */
        const skew = clamp(-vel * 0.06, -3.5, 3.5);
        if (Math.abs(skew - lastSkew) > 0.04) {
          lastSkew = skew;
          gsap.set(reel.track, { skewX: skew });
        }
      }

      /* the portrait drifts inside its frame */
      if (setHeroY && y < innerHeight * 1.4) setHeroY(clamp(y * 0.075, 0, 70));

      /* "mehfil" slides the other way as the contact room arrives */
      if (setDevaX && y > contactTop - innerHeight * 1.6) {
        const p = clamp((y + innerHeight - contactTop) / innerHeight, 0, 1.6);
        setDevaX(-p * 26);
      }
    });

    /* the ember behind the hero leans toward the cursor */
    if (fine && heroGlow) {
      const gx = gsap.quickTo(heroGlow, "x", { duration: 1.1, ease: "power2" });
      const gy = gsap.quickTo(heroGlow, "y", { duration: 1.1, ease: "power2" });
      const hero = $("act-hero");
      hero.addEventListener("pointermove", (e) => {
        gx((e.clientX / innerWidth - 0.5) * 60);
        gy((e.clientY / innerHeight - 0.5) * 40);
      });
      hero.addEventListener("pointerleave", () => { gx(0); gy(0); });
    }
  }

  /* ── the campaign card changes like a cut, not a fade ──────────── */

  {
    const logo = $("campLogo");
    const brand = $("campBrand");
    const tag = $("campTag");
    const films = $("campFilms");

    document.addEventListener("jat:campaign", () => {
      const tiles = q(".film", films);
      gsap.killTweensOf([logo, brand, tag, ...tiles]);

      gsap.timeline()
        .fromTo(logo, { autoAlpha: 0, x: -14 }, { autoAlpha: 1, x: 0, duration: 0.5 }, 0)
        .fromTo([brand, tag], { autoAlpha: 0, y: 12 },
          { autoAlpha: 1, y: 0, duration: 0.5, stagger: 0.05 }, 0.03)
        .fromTo(tiles, { autoAlpha: 0, y: 20 },
          { autoAlpha: 1, y: 0, duration: 0.55, stagger: 0.055 }, 0.06);

      bindFilmCues();
    });
  }

  /* ── hovering the index cues the record up ─────────────────────
     Scroll normally decides which release is on the turntable. Point at
     a row and it takes over — label art, still and all — then hands
     control back when you leave the list.                             */

  if (fine && window.JAT) {
    const list = $("recIndex");
    q(".rec-row", list).forEach((row, i) => {
      row.addEventListener("pointerenter", () => window.JAT.previewRelease(i));
    });
    list.addEventListener("pointerleave", () => window.JAT.endPreview());
  }

  /* ── type that arrives a line at a time ────────────────────────── */

  if (SplitText) {
    const splits = new Map();

    /*
       Geometry off the scroll event, not IntersectionObserver — same
       reason app.js defers images that way. A throttled observer
       callback would leave a headline parked out of frame, and a
       headline that never arrives is far worse than one that
       does not animate.
    */
    const pending = new Set();

    function sweepTitles() {
      if (!pending.size) return;
      for (const el of pending) {
        const r = el.getBoundingClientRect();
        if (r.top > innerHeight * 0.92 || r.bottom < 0) continue;
        pending.delete(el);
        splits.get(el).play();
      }
    }

    /* throttled, but with a trailing call — a flick that ends inside the
       window must still sweep its final position, or a headline that only
       just came into frame would stay parked until the next scroll */
    let sweepAt = 0;
    let sweepQueued = null;
    addEventListener("scroll", () => {
      const left = 90 - (performance.now() - sweepAt);
      if (left <= 0) {
        sweepAt = performance.now();
        sweepTitles();
        return;
      }
      if (sweepQueued) return;
      sweepQueued = setTimeout(() => {
        sweepQueued = null;
        sweepAt = performance.now();
        sweepTitles();
      }, left);
    }, { passive: true });

    addEventListener("resize", sweepTitles, { passive: true });
    addEventListener("load", sweepTitles);

    /* a restored scroll position may put a headline on screen without the
       visitor ever scrolling — sweep once more after the page settles */
    setTimeout(sweepTitles, 1200);

    function setupTitle(el) {
      /* app.js's blanket fade is superseded by the per-line rise */
      if (typeof io !== "undefined" && io) io.unobserve(el);
      el.classList.remove("rv");
      el.classList.add("split-title");

      const rec = { split: null, played: false };

      rec.build = () => {
        if (rec.split) rec.split.revert();
        rec.split = new SplitText(el, { type: "lines", linesClass: "sp-line", mask: "lines" });
        gsap.set(rec.split.lines, { yPercent: rec.played ? 0 : 112 });
      };

      rec.play = () => {
        if (rec.played) return;
        rec.played = true;
        gsap.to(rec.split.lines, {
          yPercent: 0,
          duration: 0.95,
          stagger: 0.08,
          ease: "power4.out",
        });
      };

      rec.build();
      splits.set(el, rec);
      pending.add(el);
    }

    document.fonts.ready.then(() => {
      q(".act-title, .screen-title, .contact-title").forEach(setupTitle);
      sweepTitles();

      /* line breaks are width-dependent — re-split, but never re-animate */
      let w = innerWidth;
      let t = null;
      addEventListener("resize", () => {
        if (innerWidth === w) return;
        w = innerWidth;
        clearTimeout(t);
        t = setTimeout(() => splits.forEach((rec) => rec.build()), 220);
      });
    });
  }
})();
