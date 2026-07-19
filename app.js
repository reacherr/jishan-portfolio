const TRACKS = [
  {
    id: "ZlKAAOCDEB8",
    title: "Navroz Mubarak",
    rim: "Navroz Mubarak",
    year: "2024",
    meta: "ft. Zaheed Damani · 100 artists · 14 countries",
    note: "One song, a hundred Ismaili voices, fourteen countries. A Navroz greeting that circled the globe.",
    thumb: "https://i.ytimg.com/vi/ZlKAAOCDEB8/maxresdefault.jpg",
  },
  {
    id: "FhfhFYd-08s",
    title: "99 Names of ALLAH",
    rim: "99 Names of Allah",
    year: "2025",
    meta: "Asma Ul Husna · 2.6M+ views",
    note: "The Asma Ul Husna, sung name by name. His most-heard recording — and still climbing.",
    thumb: "https://i.ytimg.com/vi/FhfhFYd-08s/maxresdefault.jpg",
  },
  {
    id: "fTu-x3Of1m4",
    title: "HasbunALLAH",
    rim: "HasbunAllah",
    year: "2019",
    meta: "Salgirah 2019 · the breakout",
    note: "“ALLAH is sufficient for us.” The devotional that carried his voice to playlists worldwide.",
    thumb: "https://i.ytimg.com/vi/fTu-x3Of1m4/maxresdefault.jpg",
  },
  {
    id: "AeqZuH_HOeY",
    title: "Allahumma Salli Ala",
    rim: "Allahumma Salli Ala",
    year: "2022",
    meta: "Salwaat · Durood · 1.6M+ views",
    note: "A salwaat in praise of the Prophet ﷺ — gentle, layered, sung in salutation.",
    thumb: "https://i.ytimg.com/vi/AeqZuH_HOeY/maxresdefault.jpg",
  },
  {
    id: "9W8GifKS438",
    title: "Mubarak Ho Salgirah",
    rim: "Mubarak Ho Salgirah",
    year: "2024",
    meta: "ft. United States Jamat · 1.4M+ views",
    note: "A Salgirah offering, sung with the United States Jamat in one voice.",
    thumb: "https://i.ytimg.com/vi/9W8GifKS438/hqdefault.jpg",
  },
  {
    id: "CjRNp_gMOhg",
    title: "SubhanALLAH Wa Bihamdihi",
    rim: "SubhanAllah Wa Bihamdihi",
    year: "2023",
    meta: "ft. Canadian artists · 1.3M+ views",
    note: "A tasbih recorded across borders with Canadian artists — one remembrance, many voices.",
    thumb: "https://i.ytimg.com/vi/CjRNp_gMOhg/hqdefault.jpg",
  },
  {
    id: "r3sqyZ02NqU",
    title: "India Taiyar Hai",
    rim: "India Taiyar Hai",
    year: "2025",
    meta: "Team India anthem · Global Encounters Festival",
    note: "An anthem for Team India at the Global Encounters Festival — drums up, flags out.",
    thumb: "https://i.ytimg.com/vi/r3sqyZ02NqU/hqdefault.jpg",
  },
];

const DEVANAGARI_NUM = ["०१", "०२", "०३", "०४", "०५", "०६", "०७"];
const N = TRACKS.length;
const STEP = 360 / N;
const NEEDLE = 36;
const SCROLL_SPIN = 0.06; // deg of platter per px of scroll outside the songs act

const assembly = document.getElementById("assembly");
const record = document.getElementById("record");
const platter = document.getElementById("platter");
const rimLabels = document.getElementById("rimLabels");
const centerLabel = document.getElementById("centerLabel");
const centerYear = document.getElementById("centerYear");
const poster = document.getElementById("poster");
const posterIndex = document.getElementById("posterIndex");
const posterTitle = document.getElementById("posterTitle");
const posterMeta = document.getElementById("posterMeta");
const posterNote = document.getElementById("posterNote");
const playBtn = document.getElementById("playBtn");
const posterMedia = document.getElementById("posterMedia");
const posterThumb = document.getElementById("posterThumb");
const playerMount = document.getElementById("playerMount");
const liftBtn = document.getElementById("liftBtn");
const stepperCount = document.getElementById("stepperCount");
const slotHero = document.getElementById("slotHero");
const slotSongs = document.getElementById("slotSongs");
const sleeveCard = document.getElementById("sleeveCard");
const actSongs = document.getElementById("act-songs");
const actSleeve = document.getElementById("act-sleeve");
const collage = document.getElementById("collage");
const grooveNav = document.getElementById("grooveNav");

const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
if (reducedMotion) document.body.classList.add("rm");

let vw = innerWidth, vh = innerHeight;
let songsTop = 0, songsSpan = 1, songsEnd = 1, sleeveTop = 0, sleeveSpan = 1;
let rotation = NEEDLE;
let spinOffset = 0;
let curSize = 0;
let activeIndex = 0;
let displayedIndex = -1;
let playingIndex = -1;
let inSongs = false;
let settleTimer = null;
let playRAF = null;

/* ---------- rim labels ---------- */

const labelEls = TRACKS.map((t, i) => {
  const el = document.createElement("span");
  el.className = "rim-label";
  el.textContent = t.rim;
  el.id = `track-option-${i}`;
  el.setAttribute("role", "option");
  el.setAttribute("aria-selected", "false");
  rimLabels.appendChild(el);
  return el;
});

function paintLabels() {
  const platterAngle = rotation + spinOffset;
  const radius = curSize * 0.42;
  labelEls.forEach((el, i) => {
    const eff = (((i * STEP + platterAngle) % 360) + 360) % 360;
    const flipped = eff > 100 && eff < 260;
    el.style.transform =
      `rotate(${i * STEP - 90}deg) translate(${radius}px) rotate(${flipped ? 270 : 90}deg) translate(-50%, -50%)`;
  });
}

function applyTransforms() {
  platter.style.transform = `rotate(${rotation + spinOffset}deg)`;
  centerLabel.style.transform = `rotate(${-rotation}deg)`;
  paintLabels();
}

/* ---------- measurements ---------- */

function measure() {
  vw = innerWidth;
  vh = innerHeight;
  songsTop = actSongs.offsetTop;
  songsSpan = Math.max(actSongs.offsetHeight - vh, 1);
  songsEnd = songsTop + songsSpan;
  sleeveTop = actSleeve.offsetTop;
  sleeveSpan = Math.max(actSleeve.offsetHeight - vh, 1);
}

/* ---------- scroll choreography ---------- */

const smooth = (x) => { const t = Math.min(Math.max(x, 0), 1); return t * t * (3 - 2 * t); };
const mix = (a, b, u) => ({ cx: a.cx + (b.cx - a.cx) * u, cy: a.cy + (b.cy - a.cy) * u, s: a.s + (b.s - a.s) * u });
const rectPose = (el) => {
  const r = el.getBoundingClientRect();
  return { cx: r.left + r.width / 2, cy: r.top + r.height / 2, s: r.width };
};

function dockPose() {
  const s = Math.min(vw, vh) * (vw < 860 ? 0.42 : 0.52);
  return { cx: vw < 860 ? -s * 0.34 : -s * 0.18, cy: vh * 0.82, s };
}

function poseAt(y) {
  const B = vh * 0.65;
  if (y < songsTop - B) return rectPose(slotHero);
  if (y < songsTop) return mix(rectPose(slotHero), rectPose(slotSongs), smooth((y - (songsTop - B)) / B));
  if (y <= songsEnd) return rectPose(slotSongs);
  if (y <= songsEnd + B) return mix(rectPose(slotSongs), dockPose(), smooth((y - songsEnd) / B));
  const sp = (y - sleeveTop) / sleeveSpan;
  if (sp <= 0) return dockPose();
  const card = sleeveCard.getBoundingClientRect();
  const mouth = { cx: card.left + card.width / 2, cy: card.top - card.width * 0.30, s: card.width * 0.94 };
  if (sp < 0.5) return mix(dockPose(), mouth, smooth(sp / 0.5));
  const inside = { cx: mouth.cx, cy: card.top + card.height * 0.42, s: mouth.s };
  return mix(mouth, inside, smooth((sp - 0.5) / 0.5));
}

function rotAt(y) {
  if (y < songsTop) return NEEDLE + (songsTop - y) * SCROLL_SPIN;
  if (y <= songsEnd) return NEEDLE - ((y - songsTop) / songsSpan) * (N - 1) * STEP;
  return NEEDLE - (N - 1) * STEP - (y - songsEnd) * SCROLL_SPIN;
}

function trackAt(y) {
  const t = Math.min(Math.max((y - songsTop) / songsSpan, 0), 1) * (N - 1);
  return Math.round(t);
}

function setActive(idx) {
  if (idx === activeIndex) return;
  activeIndex = idx;
  labelEls.forEach((el, i) => {
    el.classList.toggle("is-active", i === activeIndex);
    el.setAttribute("aria-selected", String(i === activeIndex));
  });
  record.setAttribute("aria-activedescendant", `track-option-${activeIndex}`);
  renderTrack();
}

let frameQueued = false;

function frame() {
  frameQueued = false;
  const y = scrollY;

  const pose = poseAt(y);
  if (Math.abs(pose.s - curSize) > 0.5) {
    curSize = pose.s;
    assembly.style.width = `${curSize}px`;
    assembly.style.height = `${curSize}px`;
    rimLabels.style.fontSize = `${Math.max(curSize * 0.017, 7)}px`;
    centerYear.style.fontSize = `${Math.max(curSize * 0.042, 9)}px`;
  }
  assembly.style.transform = `translate3d(${pose.cx - pose.s / 2}px, ${pose.cy - pose.s / 2}px, 0)`;

  rotation = rotAt(y);
  applyTransforms();

  const B = vh * 0.65;
  inSongs = y >= songsTop - B && y <= songsEnd + B;
  assembly.classList.toggle("in-songs", inSongs);
  if (!inSongs && playingIndex !== -1) stopVideo();

  if (inSongs) {
    setActive(trackAt(y));
    clearTimeout(settleTimer);
    settleTimer = setTimeout(onSettle, 140);
  }

  const acts = ["act-sleeve", "act-gallery", "act-brands", "act-songs", "act-overture"];
  let here = "act-overture";
  for (const id of acts) {
    if (y >= document.getElementById(id).offsetTop - vh * 0.5) { here = id; break; }
  }
  grooveNav.querySelectorAll("button").forEach((b) =>
    b.classList.toggle("is-here", b.dataset.act === here)
  );

  /* hero parallax departure */
  if (y < vh * 1.2) {
    const heroCopy = document.querySelector(".hero-copy");
    heroCopy.style.transform = `translateY(${-y * 0.28}px)`;
    heroCopy.style.opacity = Math.max(1 - y / (vh * 0.7), 0);
    const cue = document.querySelector(".scroll-cue");
    cue.style.opacity = Math.max(0.9 - y / (vh * 0.3), 0);
  }

  /* collage drift — photos ride at different speeds */
  collageImgs.forEach((img, i) => {
    const r = img.getBoundingClientRect();
    if (r.bottom < 0 || r.top > vh) return;
    const p = (r.top + r.height / 2 - vh / 2) / vh;
    img.style.transform = `translateY(${p * (i % 2 ? 30 : -34)}px) scale(1.12)`;
  });
}

function queueFrame() {
  if (!frameQueued && !reducedMotion) {
    frameQueued = true;
    requestAnimationFrame(frame);
  }
}

function onSettle() {
  renderTrack();
  if (playingIndex !== -1 && playingIndex !== activeIndex) playActive();
  else if (playingIndex === -1) ensurePlayer(TRACKS[activeIndex].id); // pre-warm for instant, Safari-safe playback
}

addEventListener("scroll", queueFrame, { passive: true });
addEventListener("resize", () => { measure(); queueFrame(); });

/* ---------- track rendering ---------- */

function renderTrack() {
  if (displayedIndex === activeIndex) return;
  displayedIndex = activeIndex;
  const t = TRACKS[activeIndex];
  posterIndex.textContent = DEVANAGARI_NUM[activeIndex];
  posterTitle.textContent = t.title;
  posterMeta.textContent = `${t.year} · ${t.meta}`;
  posterNote.textContent = t.note;
  posterThumb.src = t.thumb;
  posterThumb.alt = `${t.title} — video thumbnail`;
  centerYear.textContent = t.year;
  stepperCount.textContent = `0${activeIndex + 1} / 0${N}`;
  if (reducedMotion) return;
  poster.classList.remove("is-swapping");
  void poster.offsetWidth;
  poster.classList.add("is-swapping");
}

/* ---------- playback ---------- */

function startPlaySpin() {
  if (reducedMotion) return;
  cancelAnimationFrame(playRAF);
  let last = performance.now();
  const tick = (now) => {
    spinOffset += (now - last) * 0.072;
    last = now;
    applyTransforms();
    playRAF = requestAnimationFrame(tick);
  };
  playRAF = requestAnimationFrame(tick);
}

function stopPlaySpin() {
  cancelAnimationFrame(playRAF);
  const rem = spinOffset % 360;
  if (rem < 1 || reducedMotion) { spinOffset = 0; applyTransforms(); return; }
  const t0 = performance.now();
  const dur = 600;
  const ease = (x) => 1 - Math.pow(1 - x, 3);
  const settle = (now) => {
    const p = Math.min((now - t0) / dur, 1);
    spinOffset = rem + (360 - rem) * ease(p);
    applyTransforms();
    if (p < 1) playRAF = requestAnimationFrame(settle);
    else { spinOffset = 0; applyTransforms(); }
  };
  playRAF = requestAnimationFrame(settle);
}

let mountedId = null;

function commandPlayer(func, args = []) {
  const fr = playerMount.firstElementChild;
  if (!fr) return;
  try {
    fr.contentWindow.postMessage(JSON.stringify({ event: "command", func, args }), "*");
  } catch { /* iframe not ready */ }
}

function ensurePlayer(id) {
  if (mountedId === id) return;
  mountedId = id;
  playerMount.innerHTML =
    `<iframe src="https://www.youtube-nocookie.com/embed/${id}?enablejsapi=1&playsinline=1&rel=0" ` +
    `title="Jishan Ali Thobani — player" allow="autoplay; encrypted-media; picture-in-picture" allowfullscreen></iframe>`;
}

function burstPlay() {
  let tries = 0;
  const attempt = () => {
    commandPlayer("playVideo");
    if (++tries < 9) setTimeout(attempt, 160);
  };
  attempt();
}

function playActive() {
  const t = TRACKS[activeIndex];
  const wasPlaying = playingIndex !== -1;
  playingIndex = activeIndex;
  if (mountedId === t.id) {
    burstPlay();
  } else if (wasPlaying) {
    mountedId = t.id;
    commandPlayer("loadVideoById", [t.id]);
  } else {
    ensurePlayer(t.id);
    burstPlay();
  }
  posterMedia.classList.add("is-live");
  liftBtn.hidden = false;
  document.body.classList.add("is-playing");
  startPlaySpin();
}

function stopVideo() {
  if (playingIndex === -1) return;
  playingIndex = -1;
  commandPlayer("pauseVideo");
  posterMedia.classList.remove("is-live");
  liftBtn.hidden = true;
  document.body.classList.remove("is-playing");
  stopPlaySpin();
}

playBtn.addEventListener("click", playActive);
liftBtn.addEventListener("click", stopVideo);

/* ---------- steppers, keyboard, drag ---------- */

function scrollToTrack(i) {
  const idx = Math.min(Math.max(i, 0), N - 1);
  if (reducedMotion) {
    setActive(idx);
    renderTrack();
    return;
  }
  scrollTo({ top: songsTop + (idx / (N - 1)) * songsSpan, behavior: "smooth" });
}

document.getElementById("prevTrack").addEventListener("click", () => scrollToTrack(activeIndex - 1));
document.getElementById("nextTrack").addEventListener("click", () => scrollToTrack(activeIndex + 1));

record.addEventListener("keydown", (e) => {
  if (e.key === "ArrowRight" || e.key === "ArrowDown") { e.preventDefault(); scrollToTrack(activeIndex + 1); }
  if (e.key === "ArrowLeft" || e.key === "ArrowUp") { e.preventDefault(); scrollToTrack(activeIndex - 1); }
  if (e.key === "Enter" || e.key === " ") {
    e.preventDefault();
    if (inSongs || reducedMotion) playActive();
    else scrollToTrack(activeIndex);
  }
});

/* dragging the record scrolls the page (which spins the record) */
let dragging = false;
let lastAngle = 0;

function pointerAngle(e) {
  const r = record.getBoundingClientRect();
  return Math.atan2(e.clientY - (r.top + r.height / 2), e.clientX - (r.left + r.width / 2)) * 180 / Math.PI;
}

function pointerDist(e) {
  const r = record.getBoundingClientRect();
  return Math.hypot(e.clientX - (r.left + r.width / 2), e.clientY - (r.top + r.height / 2));
}

record.addEventListener("pointerdown", (e) => {
  if (reducedMotion) return;
  dragging = true;
  lastAngle = pointerAngle(e);
  record.setPointerCapture(e.pointerId);
  document.documentElement.style.scrollBehavior = "auto";
});

record.addEventListener("pointermove", (e) => {
  if (!dragging) return;
  if (pointerDist(e) < record.offsetWidth * 0.16) { lastAngle = pointerAngle(e); return; } // dead zone near the spindle
  const a = pointerAngle(e);
  let d = a - lastAngle;
  if (d > 180) d -= 360;
  if (d < -180) d += 360;
  lastAngle = a;
  const y = scrollY;
  const deriv = (rotAt(y + 2) - rotAt(y)) / 2; // deg per px, negative
  if (deriv < -0.0001) {
    const dy = Math.min(Math.max(d / deriv, -140), 140);
    scrollBy(0, dy);
  }
});

["pointerup", "pointercancel"].forEach((ev) =>
  record.addEventListener(ev, () => {
    dragging = false;
    document.documentElement.style.scrollBehavior = "";
  })
);

/* ---------- groove nav ---------- */

grooveNav.querySelectorAll("button").forEach((b) =>
  b.addEventListener("click", () => {
    const el = document.getElementById(b.dataset.act);
    scrollTo({ top: el.offsetTop, behavior: reducedMotion ? "auto" : "smooth" });
  })
);

/* ---------- gallery collage ---------- */

TRACKS.forEach((t) => {
  const fig = document.createElement("figure");
  fig.className = "reveal";
  fig.innerHTML =
    `<div class="ph"><img src="${t.thumb}" alt="Jishan Ali Thobani — still from ${t.title}" loading="lazy" /></div>` +
    `<figcaption><b>${t.title}</b><span>${t.year}</span></figcaption>`;
  collage.appendChild(fig);
});

const collageImgs = [...collage.querySelectorAll("img")];

/* ---------- wow layer ---------- */

const finePointer = matchMedia("(pointer: fine)").matches;

/* equalizer ring around the vinyl while playing */
const eq = document.createElement("div");
eq.className = "eq";
eq.setAttribute("aria-hidden", "true");
const EQ_BARS = 28;
for (let i = 0; i < EQ_BARS; i++) {
  const bar = document.createElement("div");
  bar.className = "eq-bar";
  bar.style.setProperty("--a", `${(360 / EQ_BARS) * i}deg`);
  const s = document.createElement("span");
  s.style.setProperty("--dur", `${(0.38 + Math.random() * 0.5).toFixed(2)}s`);
  s.style.setProperty("--del", `${(Math.random() * -0.9).toFixed(2)}s`);
  bar.appendChild(s);
  eq.appendChild(bar);
}
assembly.appendChild(eq);

/* hero name — letters rise in like notes settling on a staff */
let letterCount = 0;
document.querySelectorAll(".hero-name > span").forEach((word) => {
  const text = word.textContent;
  word.textContent = "";
  [...text].forEach((ch) => {
    const l = document.createElement("span");
    l.className = "ltr";
    l.textContent = ch;
    l.style.setProperty("--i", letterCount++);
    word.appendChild(l);
  });
});

/* 3D tilt on the paper cards */
function attachTilt(el, max = 3.2) {
  if (!finePointer || reducedMotion) return;
  el.addEventListener("pointermove", (e) => {
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    el.style.setProperty("--ry", `${(px * max * 2).toFixed(2)}deg`);
    el.style.setProperty("--rx", `${(-py * max * 2).toFixed(2)}deg`);
  });
  el.addEventListener("pointerleave", () => {
    el.style.setProperty("--rx", "0deg");
    el.style.setProperty("--ry", "0deg");
  });
}

[poster, document.querySelector(".bill"), sleeveCard].forEach((el) => attachTilt(el));

/* magnetic pull on key buttons */
function attachMagnet(el, strength = 0.3, radius = 70) {
  if (!finePointer || reducedMotion) return;
  el.addEventListener("pointermove", (e) => {
    const r = el.getBoundingClientRect();
    const dx = e.clientX - (r.left + r.width / 2);
    const dy = e.clientY - (r.top + r.height / 2);
    el.style.setProperty("--mx", `${Math.max(-radius, Math.min(radius, dx)) * strength}px`);
    el.style.setProperty("--my", `${Math.max(-radius, Math.min(radius, dy)) * strength}px`);
  });
  el.addEventListener("pointerleave", () => {
    el.style.setProperty("--mx", "0px");
    el.style.setProperty("--my", "0px");
  });
}

[liftBtn, document.querySelector(".book-cta"), ...grooveNav.querySelectorAll("button")]
  .forEach((el) => attachMagnet(el));

/* mini-vinyl cursor trail that spins with your scroll */
if (finePointer && !reducedMotion) {
  const cur = document.createElement("div");
  cur.id = "vinylCursor";
  cur.setAttribute("aria-hidden", "true");
  document.body.appendChild(cur);
  let mx = -100, my = -100, cx = -100, cy = -100, spin = 0, lastYc = scrollY;
  addEventListener("mousemove", (e) => {
    mx = e.clientX;
    my = e.clientY;
    document.body.classList.add("cursor-live");
  });
  document.documentElement.addEventListener("mouseleave", () =>
    document.body.classList.remove("cursor-live")
  );
  const curTick = () => {
    cx += (mx - cx) * 0.22;
    cy += (my - cy) * 0.22;
    const vel = scrollY - lastYc;
    lastYc = scrollY;
    spin += 2.4 + Math.min(Math.abs(vel) * 0.6, 22);
    cur.style.transform = `translate(${cx + 16}px, ${cy + 18}px) rotate(${spin}deg)`;
    requestAnimationFrame(curTick);
  };
  requestAnimationFrame(curTick);
}

/* double-click the record — one exuberant extra spin */
let burstRAF = null;
record.addEventListener("dblclick", () => {
  if (reducedMotion) return;
  if (playingIndex === -1) {
    cancelAnimationFrame(burstRAF);
    const from = spinOffset;
    const t0 = performance.now();
    const dur = 900;
    const ease = (x) => 1 - Math.pow(1 - x, 3);
    const tick = (now) => {
      const p = Math.min((now - t0) / dur, 1);
      spinOffset = from + 360 * ease(p);
      applyTransforms();
      if (p < 1) burstRAF = requestAnimationFrame(tick);
      else { spinOffset = from; applyTransforms(); }
    };
    burstRAF = requestAnimationFrame(tick);
  }
  const wah = document.createElement("p");
  wah.className = "wah";
  wah.textContent = ["kya baat hai!", "wah wah!", "irshad!"][Math.floor(Math.random() * 3)];
  assembly.appendChild(wah);
  setTimeout(() => wah.remove(), 1400);
});

/* ---------- reveal / stamp observers ---------- */

const io = new IntersectionObserver((entries) => {
  entries.forEach((en) => {
    if (en.isIntersecting) {
      en.target.classList.add("in");
      io.unobserve(en.target);
    }
  });
}, { threshold: 0.18 });

document.querySelectorAll(".reveal, .stamp").forEach((el) => io.observe(el));

document.querySelectorAll(".bill .stamp").forEach((el, i) => {
  el.style.setProperty("--d", `${i * 0.07}s`);
});

/* count-up stats */
const statIO = new IntersectionObserver((entries) => {
  entries.forEach((en) => {
    if (!en.isIntersecting) return;
    statIO.unobserve(en.target);
    const el = en.target;
    const target = parseFloat(el.dataset.count);
    const decimals = el.dataset.count.includes(".") ? 1 : 0;
    const suffix = el.dataset.suffix || "";
    const pad = el.dataset.pad === "1";
    const fmt = (v) => {
      const num = decimals ? v.toFixed(decimals) : String(Math.round(v));
      return (pad ? num.padStart(2, "0") : num) + suffix;
    };
    if (reducedMotion) { el.textContent = fmt(target); return; }
    const t0 = performance.now();
    const dur = 1400;
    const ease = (x) => 1 - Math.pow(1 - x, 3);
    const tick = (now) => {
      const p = Math.min((now - t0) / dur, 1);
      el.textContent = fmt(target * ease(p));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  });
}, { threshold: 0.7 });

document.querySelectorAll(".brand-stats b").forEach((el) => statIO.observe(el));

/* ---------- loader ---------- */

function finishLoader() {
  const loader = document.getElementById("loader");
  const wheel = document.getElementById("loaderWheel");
  if (reducedMotion) { loader.classList.add("is-done"); return; }
  const r = slotHero.getBoundingClientRect();
  const w = wheel.getBoundingClientRect();
  const dx = r.left + r.width / 2 - (w.left + w.width / 2);
  const dy = r.top + r.height / 2 - (w.top + w.height / 2);
  wheel.classList.add("is-flying");
  loader.classList.add("is-fading");
  requestAnimationFrame(() => {
    wheel.style.transform = `translate(${dx}px, ${dy}px) scale(${r.width / w.width})`;
  });
  setTimeout(() => loader.classList.add("is-done"), 800);
}

addEventListener("load", () => {
  measure();
  queueFrame();
  setTimeout(finishLoader, reducedMotion ? 0 : 1100);
});

/* ---------- init ---------- */

measure();
labelEls[0].classList.add("is-active");
labelEls[0].setAttribute("aria-selected", "true");
record.setAttribute("aria-activedescendant", "track-option-0");
renderTrack();

if (reducedMotion) {
  const r = slotHero.getBoundingClientRect();
  curSize = r.width;
  assembly.style.width = `${curSize}px`;
  assembly.style.height = `${curSize}px`;
  assembly.style.position = "absolute";
  assembly.style.transform = `translate3d(${r.left + scrollY * 0}px, ${r.top + scrollY}px, 0)`;
  rimLabels.style.fontSize = `${curSize * 0.017}px`;
  centerYear.style.fontSize = `${curSize * 0.042}px`;
  applyTransforms();
} else {
  frame();
}
