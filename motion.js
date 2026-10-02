/* ══════════════════════════════════════════════════════════════
   motion.js - the interaction layer.

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

  /* hover effects are pointless - and janky - on a touch screen */
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
    /* quickTo cannot drive the `scale` shorthand - it needs the two axes */
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

  /* The same still on a screen with no hover: the bar of light passes
     once as the tile arrives, staggered down the row, and again when a
     new campaign lands. One class per tile, then the observer forgets
     it - nothing runs between arrivals. */
  const sweepFilms = (() => {
    if (fine) return () => {};

    const io = new IntersectionObserver((ents) => {
      for (const en of ents) {
        if (!en.isIntersecting) continue;
        const el = en.target;
        io.unobserve(el);
        gsap.delayedCall(0.12 + (+el.dataset.sw || 0) * 0.14, () => el.classList.add("is-swept"));
      }
    }, { threshold: 0.3 });

    return () => q("#campFilms .film").forEach((el, i) => {
      el.dataset.sw = i;
      el.classList.remove("is-swept");
      io.observe(el);
    });
  })();
  sweepFilms();

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
            /* close enough to dark - snap, so no tile is left faintly on */
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
    } else if (tiles.length) {
      /* No cursor to follow on a phone, so the light rides the scroll
         instead: a band sitting just above the middle of the screen,
         lighting each row as it passes through and letting it go again
         behind. Same `--lit` the pointer writes, so every rule the
         desktop pool drives is reused untouched.

         Quantised to tenths on purpose. `--lit` drives a grayscale
         filter, and a filter handed a new value every frame re-rasterises
         every mark on screen - on a phone that is the whole cost of the
         section. Ten steps is invisible in motion and turns a raster pass
         per frame into one every few frames.                            */
      const lit = new Float32Array(tiles.length);
      const shown = new Float32Array(tiles.length).fill(-1);
      let mid = [];
      let first = 0, last = 0;
      let reach = 200;
      let awake = false;

      const measure = () => {
        const base = scrollY;
        let h = 0;
        mid = tiles.map((t) => {
          const r = t.getBoundingClientRect();
          h = r.height;
          return base + r.top + r.height / 2;
        });
        first = mid[0];
        last = mid[mid.length - 1];
        /* measured in rows, not in viewports, so the band keeps its shape
           whatever the grid reflows to - same reasoning as the pool above */
        reach = Math.max(h * 3, 120);
      };

      measure();
      addEventListener("load", measure);
      setTimeout(measure, 1200);   /* the wall's deferred images settle late */
      let mt = null;
      const remeasure = (wait) => { clearTimeout(mt); mt = setTimeout(measure, wait); };
      addEventListener("resize", () => remeasure(180));
      /* tapping through campaigns changes that card's height - one film or
         three - which moves the whole wall under the cached positions */
      document.addEventListener("jat:campaign", () => remeasure(420));

      gsap.ticker.add(() => {
        const band = scrollY + innerHeight * 0.46;
        const near = band > first - innerHeight && band < last + innerHeight;
        /* nothing on screen and nothing still lit - do not even loop */
        if (!near && !awake) return;

        awake = false;

        for (let i = 0; i < tiles.length; i++) {
          let want = 0;
          if (near) {
            const d = Math.abs(band - mid[i]) / reach;
            if (d < 1) want = (1 - d) * (1 - d);
          }

          /* eased, so the light lags the scroll a little rather than
             tracking it exactly - a lamp, not a readout */
          const now = lit[i] + (want - lit[i]) * 0.16;
          lit[i] = now;
          if (now > 0.004) awake = true;

          const step = Math.round(now * 10) / 10;
          if (step !== shown[i]) {
            shown[i] = step;
            tiles[i].style.setProperty("--lit", step.toFixed(1));
          }
        }
      });
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
     speeds up when you scroll hard. It always runs the same way. */

  const reel = (() => {
    const track = $("logoRail");
    if (!track) return null;

    const loop = gsap.to(track, { xPercent: -50, duration: 48, ease: "none", repeat: -1 });
    loop.progress(0.001);

    /* the ticker below reads this flag and eases the reel to a stop.
       Set on a real pointer move, not on enter: scrolling slides the band
       under a resting cursor, and that should not stop it. The ticker
       clears it on scroll, since the browser does not always send a
       pointerleave when the page moves instead of the mouse. */
    const band = track.closest(".logo-rail");
    if (band && fine) {
      band.addEventListener("pointermove", () => { band.dataset.hover = "1"; });
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

    /* A phone has no pointer to push the hero light around with, so the
       glint rides the scroll instead: the warm patch crosses his face as
       the portrait leaves the screen. Same element the hover path builds,
       held lit by a class rather than by :hover. */
    let glint = null;
    if (!fine) {
      const shotFrame = document.querySelector(".hero-shot-frame");
      if (shotFrame) {
        glint = document.createElement("div");
        glint.className = "hero-glint";
        glint.setAttribute("aria-hidden", "true");
        shotFrame.appendChild(glint);
        shotFrame.classList.add("glint-lit");
      }

      /* and the ember behind him breathes, so the one screen everybody
         sees is never completely still - transform and opacity only, so
         it costs a composite and nothing else */
      if (heroGlow) {
        gsap.to(heroGlow, {
          scale: 1.1,
          opacity: 0.74,
          duration: 6.5,
          ease: "sine.inOut",
          yoyo: true,
          repeat: -1,
        });
      }
    }

    const setHeroY = heroImg ? gsap.quickSetter(heroImg, "y", "px") : null;
    const setDevaX = deva ? gsap.quickSetter(deva, "x", "px") : null;

    let contactTop = 0;
    let remeasureTimer = null;
    const remeasure = () => { contactTop = actContact ? actContact.offsetTop : 0; };
    remeasure();
    /* a resize moves scrollY without anyone scrolling - the ticker must
       not read that jump as a flick */
    let resizing = false;
    addEventListener("resize", () => {
      resizing = true;
      if (reel && reel.band) reel.band.dataset.hover = "";
      clearTimeout(remeasureTimer);
      remeasureTimer = setTimeout(() => { resizing = false; remeasure(); }, 180);
    });
    addEventListener("load", remeasure);

    let lastY = scrollY;
    let glintAt = -1;
    let vel = 0;
    let lastSkew = 0;

    gsap.ticker.add(() => {
      const y = scrollY;
      const dy = resizing ? 0 : y - lastY;
      lastY = y;
      vel += (dy - vel) * 0.12;

      /* the hero light, on the devices that cannot push it themselves */
      if (glint && y < innerHeight * 1.2) {
        const p = clamp01(y / (innerHeight * 0.85));
        if (Math.abs(p - glintAt) > 0.004) {
          glintAt = p;
          glint.style.setProperty("--gx", (20 + p * 62).toFixed(1) + "%");
          glint.style.setProperty("--gy", (24 + p * 42).toFixed(1) + "%");
        }
      }

      /* the reel */
      if (reel) {
        if (Math.abs(dy) > 0.6 && reel.band) reel.band.dataset.hover = "";
        const hovering = reel.band && reel.band.dataset.hover === "1";
        const speed = hovering ? 0 : 1 + Math.min(Math.abs(vel) * 0.055, 2.6);
        reel.loop.timeScale(gsap.utils.interpolate(reel.loop.timeScale(), speed, 0.12));

        /* skip the write once the reel has settled - this ticker never stops */
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

  /* ── the hero answers you ──────────────────────────────────────
     The first screen was the one place nothing reacted to the pointer,
     which is exactly the screen everybody sees. Three responses, all
     built from things the rest of the site already says: light, the
     record, and the variable face his name is set in.               */

  if (fine) {
    const hero = $("act-hero");
    const nameEl = document.querySelector(".hero-name");
    const frame = document.querySelector(".hero-shot-frame");
    const shot = document.querySelector(".hero-shot");

    /* 1 · a warm light you move across his face */
    let glint = null;
    if (frame) {
      glint = document.createElement("div");
      glint.className = "hero-glint";
      glint.setAttribute("aria-hidden", "true");
      frame.appendChild(glint);

      frame.addEventListener("pointermove", (e) => {
        const r = frame.getBoundingClientRect();
        glint.style.setProperty("--gx", ((e.clientX - r.left) / r.width * 100).toFixed(1) + "%");
        glint.style.setProperty("--gy", ((e.clientY - r.top) / r.height * 100).toFixed(1) + "%");
      });
    }

    /* 2 · the record behind him spins up while you are on the portrait */
    let spinWant = 0;
    let spinVel = 0;
    if (shot && window.JAT && window.JAT.addSpin) {
      shot.addEventListener("pointerenter", () => { spinWant = 2.4; });
      shot.addEventListener("pointerleave", () => { spinWant = 0; });
      gsap.ticker.add(() => {
        if (spinVel < 0.004 && spinWant === 0) return;
        spinVel += (spinWant - spinVel) * 0.045;
        window.JAT.addSpin(spinVel);
      });
    }

    /* 3 · his name is set in a variable face - let the cursor widen it.
       Splitting to characters costs the kerning pairs, so the split is
       kept and measured; see the note in PROJECT.md. */
    const chars = [];
    if (nameEl) {
      nameEl.querySelectorAll(".hn-in").forEach((inner) => {
        const text = inner.textContent;
        inner.textContent = "";
        for (const ch of text) {
          const span = document.createElement("span");
          span.className = "hn-ch";
          span.textContent = ch;
          inner.appendChild(span);
          chars.push(span);
        }
      });
      /* the rise animation clips to the line box; once it has played the
         clip has to go, or a letter can never lift out of the mask */
      setTimeout(() => nameEl.classList.add("is-live"), 1500);
    }

    if (chars.length) {
      const WDTH_REST = 88, WDTH_NEAR = 100, R = 235;
      const state = new Float32Array(chars.length);
      let rects = [];
      let px = -1e5, py = -1e5;
      let inside = false;
      let lastY = -1;
      let running = false;

      const measure = () => {
        rects = chars.map((c) => c.getBoundingClientRect());
        lastY = scrollY;
      };

      const tick = () => {
        let awake = false;
        if (inside && scrollY !== lastY) measure();

        for (let i = 0; i < chars.length; i++) {
          const r = rects[i];
          let want = 0;
          if (inside && r && r.width) {
            const dx = px - (r.left + r.width / 2);
            const dy = py - (r.top + r.height / 2);
            const d = Math.sqrt(dx * dx + dy * dy) / R;
            if (d < 1) want = (1 - d) * (1 - d);
          }
          const was = state[i];
          const now = was + (want - was) * 0.14;
          state[i] = now;

          /* JS owns the width axis (calc() in font-variation-settings is not
             safe to rely on); CSS reads --hl for the lift, the warmth and
             the glow, so there is one style write per char per frame */
          if (!inside && now < 0.01) {
            if (was !== 0) { chars[i].style.fontVariationSettings = ""; chars[i].style.removeProperty("--hl"); }
            state[i] = 0;
          } else if (Math.abs(now - was) > 0.004) {
            chars[i].style.fontVariationSettings =
              `"wdth" ${(WDTH_REST + (WDTH_NEAR - WDTH_REST) * now).toFixed(1)}, "opsz" 96`;
            chars[i].style.setProperty("--hl", now.toFixed(3));
            awake = true;
          }
        }

        if (!awake && !inside) { running = false; gsap.ticker.remove(tick); }
      };

      const wake = () => { if (running) return; running = true; gsap.ticker.add(tick); };

      hero.addEventListener("pointerenter", (e) => { measure(); px = e.clientX; py = e.clientY; inside = true; wake(); });
      hero.addEventListener("pointermove", (e) => { px = e.clientX; py = e.clientY; if (!inside) { inside = true; measure(); wake(); } });
      hero.addEventListener("pointerleave", () => { inside = false; wake(); });
      addEventListener("resize", () => { if (inside) measure(); });
    }
  }

  /* ── the campaign card changes like a cut, not a fade ──────────── */

  {
    const logo = $("campLogo");
    const brand = $("campBrand");
    const tag = $("campTag");
    const films = $("campFilms");

    /* the brand name rolls in a letter at a time, like a counter
       turning over - app.js has already swapped the text by now */
    let brandSplit = null;

    document.addEventListener("jat:campaign", () => {
      const tiles = q(".film", films);
      if (brandSplit) { gsap.killTweensOf(brandSplit.chars); brandSplit = null; }
      gsap.killTweensOf([logo, brand, tag, ...tiles]);

      const tl = gsap.timeline()
        .fromTo(logo, { autoAlpha: 0, x: -14 }, { autoAlpha: 1, x: 0, duration: 0.5 }, 0)
        .fromTo(tag, { autoAlpha: 0, y: 10 }, { autoAlpha: 1, y: 0, duration: 0.5 }, 0.12)
        .fromTo(tiles, { autoAlpha: 0, y: 20 },
          { autoAlpha: 1, y: 0, duration: 0.55, stagger: 0.055 }, 0.06);

      gsap.set(brand, { autoAlpha: 1, y: 0 });
      if (SplitText) {
        brandSplit = new SplitText(brand, { type: "words,chars", mask: "chars" });
        const split = brandSplit;
        tl.fromTo(split.chars, { yPercent: 110 }, {
          yPercent: 0,
          duration: 0.6,
          stagger: 0.016,
          ease: "power4.out",
          /* leave plain text behind so the next swap starts clean */
          onComplete: () => { if (brandSplit === split) { split.revert(); brandSplit = null; } },
        }, 0.02);
      } else {
        tl.fromTo(brand, { autoAlpha: 0, y: 12 }, { autoAlpha: 1, y: 0, duration: 0.5 }, 0.03);
      }

      bindFilmCues();
      sweepFilms();
    });
  }

  /* ── hovering the index cues the record up ─────────────────────
     Scroll normally decides which release is on the turntable. Point at
     a row and it takes over - label art, still and all - then hands
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
       Geometry off the scroll event, not IntersectionObserver - same
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

    /* throttled, but with a trailing call - a flick that ends inside the
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
       visitor ever scrolling - sweep once more after the page settles */
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

      /* line breaks are width-dependent - re-split, but never re-animate */
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

  /* ── notes shaken off the pointer ──────────────────────────────
     He is a singer: moving across his page should sound like
     something. Notes fall out of the cursor as it travels and fade
     on the way up; hold still and the page goes quiet again.

     Emission is gated on distance travelled, not on time, so the
     rate follows the hand - a slow drift leaves the odd note, a
     flick across the screen leaves a run of them. A minimum
     interval caps the run so a fast sweep cannot flood the layer.

     Touch screens have no cursor, so the same emitter rides the
     finger instead: a tap knocks two loose, and because touchmove
     keeps firing through a scroll, a flick trails them up the page.

     Pooled elements, one layer, nothing to garbage collect.        */

  {
    const GLYPHS = [
      /* eighth note */
      '<svg viewBox="0 0 24 24"><path d="M9.9 2.6c3.9 1.1 6.6 3.3 6.9 6.4.2 2-.6 3.7-2.2 5 .5-2.6-.9-4.6-4.7-6.2v9.5a3 3 0 0 1-.1.8c-.4 1.7-2.3 3.2-4.3 3.4-1.9.2-3.2-.9-2.9-2.5.3-1.7 2.2-3.2 4.2-3.4.5-.1 1-.1 1.2.2V2.6z"/></svg>',
      /* beamed pair */
      '<svg viewBox="0 0 24 24"><path d="M6.8 4.4 20.6 1.6v3.2L6.8 7.6z"/><path d="M6.8 6.4h1.8v11.2H6.8zM18.8 3.6h1.8v11.2h-1.8z"/><ellipse cx="4.7" cy="17.9" rx="3.7" ry="2.8" transform="rotate(-20 4.7 17.9)"/><ellipse cx="16.7" cy="15.1" rx="3.7" ry="2.8" transform="rotate(-20 16.7 15.1)"/></svg>',
    ];

    const POOL = fine ? 30 : 18;
    const GAP = fine ? 44 : 58;    /* px of travel between notes */
    const MIN_MS = fine ? 38 : 48; /* ceiling on the emission rate */

    const layer = document.createElement("div");
    layer.className = "note-fx-layer";
    layer.setAttribute("aria-hidden", "true");
    document.body.appendChild(layer);

    const pool = [];
    for (let i = 0; i < POOL; i++) {
      const el = document.createElement("span");
      el.className = "note-fx";
      el.innerHTML = GLYPHS[i % GLYPHS.length];
      gsap.set(el, { xPercent: -50, yPercent: -50, opacity: 0 });
      layer.appendChild(el);
      pool.push(el);
    }

    let next = 0;
    let px = null, py = null, acc = 0, lastT = 0;

    const rand = (lo, hi) => lo + Math.random() * (hi - lo);

    function drop(x, y) {
      const el = pool[next];
      next = (next + 1) % POOL;
      gsap.killTweensOf(el);

      const s = rand(0.6, 1.1);
      const dir = Math.random() < 0.5 ? -1 : 1;
      const rise = rand(34, 62);
      const dur = rand(0.55, 0.85);

      gsap.set(el, {
        /* just off the tip, never dead centre under it */
        x: x + rand(2, 11),
        y: y + rand(-8, 2),
        scale: s * 0.55,
        rotation: dir * rand(4, 12),
        opacity: 0,
      });

      gsap.timeline()
        .to(el, { opacity: 0.92, scale: s, duration: 0.13, ease: "power2.out" }, 0)
        .to(el, {
          x: "+=" + dir * rand(10, 34),
          y: "-=" + rise,
          rotation: dir * rand(16, 34),
          duration: dur,
          ease: "power1.out",
        }, 0)
        .to(el, { opacity: 0, scale: s * 0.8, duration: dur * 0.68, ease: "power2.in" }, dur * 0.32);
    }

    function travel(x, y) {
      if (px === null) { px = x; py = y; return; }
      acc += Math.hypot(x - px, y - py);
      px = x; py = y;
      if (acc < GAP) return;

      const now = performance.now();
      if (now - lastT < MIN_MS) {
        /* throttled, but keep the debt bounded or the next allowed
           frame after a flick fires with a full tank every time */
        acc = Math.min(acc, GAP * 1.4);
        return;
      }
      acc = 0;
      lastT = now;
      drop(x, y);
    }

    const reset = (x = null, y = null) => { px = x; py = y; acc = 0; };

    if (fine) {
      addEventListener("pointermove", (e) => {
        if (e.pointerType === "touch") return;
        travel(e.clientX, e.clientY);
      }, { passive: true });

      /* leaving the window and coming back elsewhere is not travel */
      document.addEventListener("pointerleave", () => reset());
    } else {
      addEventListener("touchstart", (e) => {
        const t = e.touches[0];
        if (!t) return;
        reset(t.clientX, t.clientY);
        lastT = performance.now();
        drop(t.clientX, t.clientY);
        gsap.delayedCall(0.11, () => drop(t.clientX + rand(-14, 14), t.clientY + rand(-10, 6)));
      }, { passive: true });

      addEventListener("touchmove", (e) => {
        const t = e.touches[0];
        if (t) travel(t.clientX, t.clientY);
      }, { passive: true });

      addEventListener("touchend", () => reset(), { passive: true });
    }

    /* ── and the ones that come off the portrait ─────────────────
       Phone only: that is the breakpoint where the hero photograph
       runs edge to edge and dissolves into the night on all four
       sides. These come out of the dissolve.

       Built here purely to reuse GLYPHS above - the motion itself is
       a CSS keyframe (.hn-note), because nothing about it reacts to
       anything and it should not cost a frame on the ticker. All this
       does is place six spans and hand each one its numbers.

       Delays are negative so the animation opens mid-cycle: the first
       screen a visitor sees already has notes in the air rather than
       eight seconds of nothing. Durations are all different so the six
       never settle into a visible pulse.                              */

    if (matchMedia("(max-width: 860px)").matches) {
      const shot = document.querySelector(".hero-shot");
      if (shot) {
        /* x/y are per cent of the frame; dx is a drift in px and dy a
           fraction of the frame's own height (see .hn-note).

           x stays inside the fade band (13% in from either edge) so a
           note is always born out of the dissolve, and x + dx keeps it
           inside the screen for as long as it is still lit - .act-hero
           clips, and half a note sliced off the edge reads as a bug.

           The three on the right stay in the upper half: the record
           docks into the lower right corner at this breakpoint. */
        const SEEDS = [
          { x: 9,  y: 57, dx: -20, dy: -0.35, rot: -16, w: 17, o: 0.50, t: 9.4,  d: -1.2 },
          { x: 12, y: 33, dx: -14, dy: -0.29, rot: 12,  w: 13, o: 0.36, t: 11.2, d: -5.6 },
          { x: 8,  y: 76, dx: -19, dy: -0.39, rot: -22, w: 15, o: 0.44, t: 8.1,  d: -3.4 },
          { x: 90, y: 30, dx: 19,  dy: -0.32, rot: 18,  w: 16, o: 0.46, t: 10.1, d: -0.4 },
          { x: 88, y: 46, dx: 15,  dy: -0.27, rot: -14, w: 12, o: 0.32, t: 12.3, d: -7.1 },
          { x: 92, y: 20, dx: 21,  dy: -0.23, rot: 20,  w: 14, o: 0.40, t: 8.8,  d: -4.9 },
        ];

        const notes = document.createElement("div");
        notes.className = "hero-notes";
        notes.setAttribute("aria-hidden", "true");

        SEEDS.forEach((s, i) => {
          const el = document.createElement("span");
          el.className = "hn-note";
          el.innerHTML = GLYPHS[i % GLYPHS.length];
          el.style.cssText =
            `--x:${s.x}%;--y:${s.y}%;--dx:${s.dx}px;--dyf:${s.dy};` +
            `--rot:${s.rot}deg;--w:${s.w}px;--o:${s.o};--t:${s.t}s;--d:${s.d}s`;
          notes.appendChild(el);
        });

        shot.appendChild(notes);
      }
    }
  }

})();
