/* ══════════════════════════════════════════════════════════════
   Jishan Ali Thobani — Singer & Music Director
   ══════════════════════════════════════════════════════════════ */

/* ── data ────────────────────────────────────────────────────── */

const CAMPAIGNS = [
  {
    brand: "Navi",
    logo: "navi.png",
    tag: "Ad films · Jingle",
    films: [
      { t: "Navi Loan", id: "pBGnn9Pt_5g" },
      { t: "Navi Loan II", id: "BmTD8T4Vfec" },
      { t: "Navi Health Insurance", id: "-kGt3IaW8ns" },
    ],
  },
  {
    brand: "Sweet Dreams",
    logo: "sweet-dreams.png",
    tag: "Ad film · ft. Bipasha Basu & Karan Grover",
    films: [{ t: "Sweet Dreams", id: "gS9CyERAyWc" }],
  },
  {
    brand: "Nilkamal",
    logo: "nilkamal.png",
    tag: "Ad films · Jingle",
    films: [
      { t: "Home by Nilkamal", id: "ShHZw7-aw6c" },
      { t: "Shoes", id: "sfXWdhUuWmU" },
    ],
  },
  {
    brand: "Stanley Tools",
    logo: "stanley.png",
    tag: "Commercial · Hindi",
    films: [{ t: "Stanley 5m Tape", id: "x9BB-CcWCc4" }],
  },
  {
    brand: "Oman Cricket",
    logo: "oman-cricket.png",
    tag: "Official anthem",
    films: [{ t: "#HayyaCricket Anthem", id: "U2iPX_cjw74" }],
  },
  {
    brand: "Metro Shoes",
    logo: "metro-shoes.png",
    tag: "Ad film",
    films: [{ t: "Metro", id: "_l7pLI8urP0" }],
  },
  {
    brand: "SFA Championship",
    logo: "sfa.png",
    tag: "Anthem · Sports for All",
    films: [{ t: "Sports for All", id: "5tl62BfUDS4" }],
  },
  {
    brand: "Priority",
    logo: "priority.png",
    tag: "Anthem",
    films: [{ t: "Priority Anthem", id: "kI1PgkOMCBI" }],
  },
];

const RELEASES = [
  {
    id: "FhfhFYd-08s",
    title: "99 Names of ALLAH",
    year: "2025",
    sub: "Asma Ul Husna · 2.6M+ views",
    note: "The Asma Ul Husna, sung name by name. His most-heard recording — and still climbing.",
    thumb: "https://i.ytimg.com/vi/FhfhFYd-08s/maxresdefault.jpg",
  },
  {
    id: "ZlKAAOCDEB8",
    title: "Navroz Mubarak",
    year: "2024",
    sub: "ft. Zaheed Damani · 100 artists · 14 countries",
    note: "One song, a hundred voices, fourteen countries — a Navroz greeting that went right around the globe.",
    thumb: "https://i.ytimg.com/vi/ZlKAAOCDEB8/maxresdefault.jpg",
  },
  {
    id: "AeqZuH_HOeY",
    title: "Allahumma Salli Ala",
    year: "2022",
    sub: "Salwaat · Durood · 1.6M+ views",
    note: "A salwaat in praise of the Prophet ﷺ — gentle, layered, sung in salutation.",
    thumb: "https://i.ytimg.com/vi/AeqZuH_HOeY/maxresdefault.jpg",
  },
  {
    id: "9W8GifKS438",
    title: "Mubarak Ho Salgirah",
    year: "2024",
    sub: "ft. United States Jamat · 1.4M+ views",
    note: "A Salgirah offering, recorded with the United States Jamat singing as one.",
    thumb: "https://i.ytimg.com/vi/9W8GifKS438/hqdefault.jpg",
  },
  {
    id: "CjRNp_gMOhg",
    title: "SubhanALLAH Wa Bihamdihi",
    year: "2023",
    sub: "ft. Canadian artists · 1.3M+ views",
    note: "A tasbih recorded across borders — one remembrance, many voices.",
    thumb: "https://i.ytimg.com/vi/CjRNp_gMOhg/hqdefault.jpg",
  },
  {
    id: "fTu-x3Of1m4",
    title: "HasbunALLAH",
    year: "2019",
    sub: "The breakout devotional",
    note: "“ALLAH is sufficient for us.” The recording that carried his voice out past the mehfil.",
    thumb: "https://i.ytimg.com/vi/fTu-x3Of1m4/maxresdefault.jpg",
  },
  {
    id: "r3sqyZ02NqU",
    title: "India Taiyar Hai",
    year: "2025",
    sub: "Team India anthem · Global Encounters Festival",
    note: "An anthem written for Team India at the Global Encounters Festival — drums up, flags out.",
    thumb: "https://i.ytimg.com/vi/r3sqyZ02NqU/hqdefault.jpg",
  },
];

const BRANDS = [
  ["Spotify", "spotify.png"],
  ["Disney+ Hotstar", "hotstar.png"],
  ["Nutella", "nutella.png"],
  ["Snickers", "snickers.png"],
  ["Crocs", "crocs.png"],
  ["Royal Challengers Bengaluru", "rcb.png"],
  ["Kolkata Knight Riders", "kkr.png"],
  ["Bajaj Finserv", "bajaj-finserv.png"],
  ["IDFC First Bank", "idfc.png"],
  /* the old site shipped a PediaSure file under the Petronas name — set as type */
  ["Petronas", null],
  ["Cleartrip", "cleartrip.png"],
  ["PediaSure", "pediasure.png"],
  ["Morphy Richards", "morphy-richards.png"],
  ["Radio Mirchi", "radio-mirchi.png"],
  ["Navi", "navi.png"],
  ["Nilkamal", "nilkamal.png"],
  ["Stanley Tools", "stanley.png"],
  ["Metro Shoes", "metro-shoes.png"],
  ["Behrouz Biryani", "behrouz.png"],
  ["Country Delight", "country-delight.png"],
  ["Faces Canada", "faces-canada.png"],
  ["Ferns N Petals", "fnp.png"],
  ["Snitch", "snitch.png"],
  ["Somany", "somany.png"],
  ["UPES", "upes.png"],
  ["Boomer", "boomer.png"],
  ["U&i", "u-and-i.png"],
  ["Niyo", "niyo.png"],
  ["EasyPay", "easypay.png"],
  ["Chola MS", "chola.png"],
  ["Danube Home", "danube.png"],
  ["WallMantra", "wallmantra.png"],
  ["pTron", "ptron.png"],
  ["Priority", "priority.png"],
  ["SFA Championship", "sfa.png"],
  ["Oman Cricket", "oman-cricket.png"],
  ["Sweet Dreams", "sweet-dreams.png"],
];

const RAIL_LOGOS = [
  "spotify.png", "hotstar.png", "nutella.png", "snickers.png", "crocs.png",
  "rcb.png", "bajaj-finserv.png", "idfc.png", "cleartrip.png",
  "pediasure.png", "kkr.png", "navi.png", "radio-mirchi.png", "morphy-richards.png",
];

/* ── dom ─────────────────────────────────────────────────────── */

const $ = (id) => document.getElementById(id);

const assembly   = $("assembly");
const disc       = $("disc");
const platter    = $("platter");
const discArt    = $("discArt");
const dpFill     = $("dpFill");
const rail       = $("rail");
const rwTrack    = $("rwTrack");
const rwFill     = $("rwFill");
const railWave   = document.querySelector(".rail-wave");
const railButtons = [...rail.querySelectorAll("button")];

const slotHero      = $("slotHero");
const slotCampaigns = $("slotCampaigns");
const slotRecords   = $("slotRecords");
const slotContact   = $("slotContact");

const actCampaigns = $("act-campaigns");
const actBrands    = $("act-brands");
const actRecords   = $("act-records");
const actContact   = $("act-contact");

const campCard  = $("campCard");
const campLogo  = $("campLogo");
const campBrand = $("campBrand");
const campTag   = $("campTag");
const campFilms = $("campFilms");
const campNum   = $("campNum");
const campTotal = $("campTotal");
const campScrub = $("campScrub");
const campPrev  = $("campPrev");
const campNext  = $("campNext");

const recIndex     = $("recIndex");
const recThumb     = $("recThumb");
const recTitle     = $("recTitle");
const recNote      = $("recNote");
const recPlayTitle = $("recPlayTitle");
const recMedia     = $("recMedia");
const recMount     = $("recMount");
const recPlay      = $("recPlay");

const actScreen   = $("act-screen");
const screenMedia = $("screenMedia");
const screenMount = $("screenMount");
const screenArt   = $("screenArt");

const POP_KAUN_TRAILER = "hIXyT2WuTCs";

const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
if (reducedMotion) document.body.classList.add("rm");

const NC = CAMPAIGNS.length;
const SCROLL_SPIN = 0.05;

let vw = innerWidth;
let vh = innerHeight;
let campTop = 0, campSpan = 1, campEnd = 1;
let discSize = 0;
let rotation = 0;
let spinOffset = 0;
let campIndex = -1;
let recIndexActive = -1;
let playSpinRAF = null;
let frameQueued = false;

/*
   Deferred images. Driven by geometry off the scroll event rather than
   IntersectionObserver, so a tile can never be left blank if the observer
   callback is throttled (background tabs, restored sessions).
*/
const deferred = new Set();

function defer(img, src) {
  img.dataset.src = src;
  deferred.add(img);
}

function sweepDeferred() {
  if (!deferred.size) return;
  const ahead = innerHeight + 700;
  for (const img of deferred) {
    const host = img.closest("li, .logo-rail") || img.parentElement;
    const r = host.getBoundingClientRect();
    if (r.top > ahead || r.bottom < -700) continue;
    img.src = img.dataset.src;
    delete img.dataset.src;
    deferred.delete(img);
    fitLogo(img);
  }
}

/* logos with a squarish or tall bounding box need more height to read */
function fitLogo(img) {
  const rate = () => {
    if (!img.naturalWidth || !img.naturalHeight) return;
    if (img.naturalWidth / img.naturalHeight < 2.1) img.classList.add("is-sq");
  };
  if (img.complete) rate();
  else img.addEventListener("load", rate, { once: true });
}

/* ── build: brand rail ───────────────────────────────────────── */

{
  const track = $("logoRail");
  [...RAIL_LOGOS, ...RAIL_LOGOS].forEach((file) => {
    const img = document.createElement("img");
    img.decoding = "async";
    img.alt = "";
    img.setAttribute("aria-hidden", "true");
    defer(img, `assets/brands/${file}`);
    track.appendChild(img);
  });
}

/* ── build: brand wall ───────────────────────────────────────── */

{
  const wall = $("wall");
  const frag = document.createDocumentFragment();
  BRANDS.forEach(([name, file], i) => {
    const li = document.createElement("li");
    li.dataset.n = String(i + 1).padStart(2, "0");
    if (file) {
      const img = document.createElement("img");
      img.decoding = "async";
      img.alt = name;
      defer(img, `assets/brands/${file}`);
      li.appendChild(img);
    } else {
      const type = document.createElement("span");
      type.className = "wall-type";
      type.textContent = name;
      li.appendChild(type);
    }
    frag.appendChild(li);
  });
  const more = document.createElement("li");
  more.className = "wall-more";
  more.innerHTML = `<span>&amp; sixty more<small>250+ projects</small></span>`;
  frag.appendChild(more);
  wall.appendChild(frag);
}

/* ── playback state (drives the equaliser ring) ──────────────── */

function refreshPlaying() {
  const live = document.querySelector(".film.is-live")
    || recMedia.classList.contains("is-live")
    || screenMedia.classList.contains("is-live");
  document.body.classList.toggle("is-playing", !!live);
  if (live) startPlaySpin();
  else stopPlaySpin();
}

/* ── build: campaign card ────────────────────────────────────── */

campTotal.textContent = String(NC).padStart(2, "0");

function renderCampaign(i) {
  if (i === campIndex) return;
  campIndex = i;
  const c = CAMPAIGNS[i];

  campLogo.src = `assets/brands/${c.logo}`;
  campLogo.alt = `${c.brand} logo`;
  campBrand.textContent = c.brand;
  campTag.textContent = c.tag;
  campNum.textContent = String(i + 1).padStart(2, "0");

  campFilms.className = `camp-films n${Math.min(c.films.length, 3)}`;
  campFilms.replaceChildren(...c.films.map((f) => filmFacade(f, c.brand)));
  refreshPlaying();

  campPrev.disabled = i === 0;
  campNext.disabled = i === NC - 1;

  if (reducedMotion) return;
  document.dispatchEvent(new CustomEvent("jat:campaign", { detail: i }));
  if (document.documentElement.classList.contains("motion-on")) return;
  campCard.classList.remove("is-swapping");
  void campCard.offsetWidth;
  campCard.classList.add("is-swapping");
}

function filmFacade(f, brand) {
  const btn = document.createElement("button");
  btn.type = "button";
  btn.className = "film";
  btn.innerHTML =
    `<span class="film-shot">` +
      `<img src="https://i.ytimg.com/vi/${f.id}/hqdefault.jpg" alt="" loading="lazy" decoding="async" width="480" height="360" />` +
      `<span class="film-veil"><span class="film-cue" aria-hidden="true">▶</span></span>` +
    `</span>` +
    `<span class="film-name"></span>`;
  btn.querySelector(".film-name").textContent = f.t;
  btn.setAttribute("aria-label", `Play ${brand} — ${f.t}`);
  btn.addEventListener("click", () => {
    if (btn.classList.contains("is-live")) return;
    const fr = document.createElement("iframe");
    fr.className = "film-frame";
    fr.src = `https://www.youtube-nocookie.com/embed/${f.id}?autoplay=1&rel=0&playsinline=1`;
    fr.title = `${brand} — ${f.t}`;
    fr.allow = "autoplay; encrypted-media; picture-in-picture; fullscreen";
    fr.allowFullscreen = true;
    btn.querySelector(".film-shot").appendChild(fr);
    btn.classList.add("is-live");
    refreshPlaying();
  });
  return btn;
}

/* ── build: records ──────────────────────────────────────────── */

{
  const frag = document.createDocumentFragment();
  RELEASES.forEach((r, i) => {
    const li = document.createElement("li");
    li.className = "rec-row";
    li.innerHTML =
      `<button type="button">` +
        `<span class="rec-n">${String(i + 1).padStart(2, "0")}</span>` +
        `<span class="rec-name"></span>` +
        `<span class="rec-eq" aria-hidden="true"><i></i><i></i><i></i></span>` +
        `<span class="rec-year">${r.year}</span>` +
      `</button>`;
    const name = li.querySelector(".rec-name");
    name.textContent = r.title;
    const sub = document.createElement("span");
    sub.className = "rec-sub";
    sub.textContent = r.sub;
    name.appendChild(sub);
    li.querySelector("button").addEventListener("click", () => selectRelease(i, true));
    frag.appendChild(li);
  });
  recIndex.appendChild(frag);
}

const recRows = [...recIndex.querySelectorAll(".rec-row")];

/* while a release is playing, scrolling must not yank it away */
let recLocked = false;

/* a hovered row previews its release and hands control back on leave */
let recHover = -1;

function selectRelease(i, fromClick) {
  if (i === recIndexActive) {
    if (fromClick) playRelease();
    return;
  }
  recIndexActive = i;
  const r = RELEASES[i];

  stopRelease();
  recThumb.src = r.thumb;
  recThumb.alt = `${r.title} — video still`;
  recTitle.textContent = r.title;
  recNote.textContent = r.note;
  recPlayTitle.textContent = r.title;

  recRows.forEach((row, k) => row.classList.toggle("is-on", k === i));

  if (artOn) {
    discArt.style.backgroundImage = `url("${r.thumb}")`;
    discArt.classList.add("is-art");
  }

  document.dispatchEvent(new CustomEvent("jat:release", { detail: i }));

  if (fromClick) playRelease();
}

function playRelease() {
  const r = RELEASES[recIndexActive];
  const fr = document.createElement("iframe");
  fr.src = `https://www.youtube-nocookie.com/embed/${r.id}?autoplay=1&rel=0&playsinline=1`;
  fr.title = `${r.title} — Jishan Ali Thobani`;
  fr.allow = "autoplay; encrypted-media; picture-in-picture; fullscreen";
  fr.allowFullscreen = true;
  recMount.replaceChildren(fr);
  recMedia.classList.add("is-live");
  recLocked = true;
  refreshPlaying();
}

function stopRelease() {
  recLocked = false;
  if (!recMedia.classList.contains("is-live")) return;
  recMount.replaceChildren();
  recMedia.classList.remove("is-live");
  refreshPlaying();
}

recPlay.addEventListener("click", playRelease);

/* ── the Pop Kaun? trailer ───────────────────────────────────── */

defer(screenArt, `https://i.ytimg.com/vi/${POP_KAUN_TRAILER}/maxresdefault.jpg`);

$("screenPlay").addEventListener("click", () => {
  const fr = document.createElement("iframe");
  fr.src = `https://www.youtube-nocookie.com/embed/${POP_KAUN_TRAILER}?autoplay=1&rel=0&playsinline=1`;
  fr.title = "Pop Kaun? — official trailer";
  fr.allow = "autoplay; encrypted-media; picture-in-picture; fullscreen";
  fr.allowFullscreen = true;
  screenMount.replaceChildren(fr);
  screenMedia.classList.add("is-live");
  refreshPlaying();
});

/* ── the equaliser ring ──────────────────────────────────────── */

{
  const eq = $("eq");
  const BARS = 30;
  for (let i = 0; i < BARS; i++) {
    const bar = document.createElement("div");
    bar.className = "eq-bar";
    bar.style.setProperty("--a", `${(360 / BARS) * i}deg`);
    const s = document.createElement("span");
    s.style.setProperty("--dur", `${(0.36 + Math.random() * 0.5).toFixed(2)}s`);
    s.style.setProperty("--del", `${(Math.random() * -0.9).toFixed(2)}s`);
    bar.appendChild(s);
    eq.appendChild(bar);
  }
}

/* ── the rail sound wave ─────────────────────────────────────── */

let railLen = 0;
let railH = 0;

/*
   The wave the rail is drawn from. `bumpAmp` swells the amplitude around
   `bumpY` — the motion layer uses it to make the wave respond to the
   pointer, like a finger laid on a string.
*/
function railWavePath(h, bumpY, bumpAmp) {
  const steps = Math.max(80, Math.round(h / 2));
  let d = "";
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const y = t * h;
    let amp = 3.4 + Math.sin(t * Math.PI * 3) * 1.6;
    if (bumpAmp) {
      /* additive, so the swell reads the same wherever the wave is
         hovered — multiplying would flatten it at the wave's nodes */
      const k = (y - bumpY) / 42;
      amp += bumpAmp * 3.4 * Math.exp(-k * k);
    }
    const x = 6 + Math.sin(t * Math.PI * 2 * 6.5) * amp;
    d += `${i ? "L" : "M"}${x.toFixed(2)} ${y.toFixed(2)} `;
  }
  return d;
}

function buildRailWave() {
  if (!railWave || getComputedStyle(railWave).display === "none") return;
  const h = Math.max(rail.offsetHeight + 20, 40);
  railH = h;
  railWave.setAttribute("viewBox", `0 0 12 ${h}`);
  const d = railWavePath(h, 0, 0);
  rwTrack.setAttribute("d", d);
  rwFill.setAttribute("d", d);
  railLen = rwFill.getTotalLength();
  rwFill.style.strokeDasharray = String(railLen);
  rwFill.style.strokeDashoffset = String(railLen);
}

/* ── measurement ─────────────────────────────────────────────── */

/* act offsets are cached so the scroll loop never touches layout for them */
const marks = { hero: 0, campaigns: 0, brands: 0, screen: 0, records: 0, contact: 0 };
let docSpan = 1;
let scrubEnabled = false;
let roomNow = null;

const RAIL_ORDER = ["contact", "records", "screen", "brands", "campaigns", "hero"];

function measure() {
  vw = innerWidth;
  vh = innerHeight;

  marks.hero      = $("act-hero").offsetTop;
  marks.campaigns = actCampaigns.offsetTop;
  marks.brands    = actBrands.offsetTop;
  marks.screen    = actScreen.offsetTop;
  marks.records   = actRecords.offsetTop;
  marks.contact   = actContact.offsetTop;

  campTop = marks.campaigns;
  campSpan = Math.max(actCampaigns.offsetHeight - vh, 1);
  campEnd = campTop + campSpan;

  docSpan = Math.max(document.documentElement.scrollHeight - vh, 1);
}

/* the campaigns act needs enough runway to scrub one screen per campaign */
function sizeCampaignsAct() {
  scrubEnabled = !reducedMotion && innerWidth > 860;
  actCampaigns.style.height = scrubEnabled
    ? `${innerHeight * (1 + (NC - 1) * 0.62)}px`
    : "";
}

/* ── disc choreography ───────────────────────────────────────── */

const clamp01 = (x) => (x < 0 ? 0 : x > 1 ? 1 : x);
const smooth = (x) => { const t = clamp01(x); return t * t * (3 - 2 * t); };
const mixPose = (a, b, u) => ({
  cx: a.cx + (b.cx - a.cx) * u,
  cy: a.cy + (b.cy - a.cy) * u,
  s: a.s + (b.s - a.s) * u,
});

let lastPose = { cx: 0, cy: 0, s: 1 };

/* a slot hidden by a media query reports zero width — treat it as "no anchor" */
function slotPose(el) {
  const r = el.getBoundingClientRect();
  if (r.width < 1) return null;
  return { cx: r.left + r.width / 2, cy: r.top + r.height / 2, s: r.width };
}

/* reduced motion: the record is parked behind the portrait and never travels */
function parkDisc() {
  const r = slotHero.getBoundingClientRect();
  if (r.width < 1) return;
  assembly.style.position = "absolute";
  assembly.style.width = `${r.width}px`;
  assembly.style.height = `${r.width}px`;
  assembly.style.transform = `translate3d(${r.left + scrollX}px, ${r.top + scrollY}px, 0)`;
}

/*
   zones, by scroll position:
     hero        → behind the portrait
     campaigns   → beside the title, progress ring live
     brands      → fades out
     records     → peeks from behind the feature card, label = active release
     contact     → slides in behind the contact card
*/
function stageAt(y) {
  /* long blend so the record is pulled toward the next slot before it leaves */
  const B = vh * 0.95;
  const hero = slotPose(slotHero);
  const camp = slotPose(slotCampaigns);

  if (y < campTop - B) return { pose: hero, a: 1, scrub: false, art: false };

  if (y < campTop) {
    const u = smooth((y - (campTop - B)) / B);
    if (!hero || !camp) return { pose: hero || camp, a: hero || camp ? 1 - u : 0, scrub: false, art: false };
    return { pose: mixPose(hero, camp, u), a: 1, scrub: false, art: false };
  }

  if (y <= campEnd) return { pose: camp, a: 1, scrub: scrubEnabled, art: false };

  if (y < campEnd + B) {
    const u = smooth((y - campEnd) / B);
    return { pose: camp, a: 1 - u, scrub: scrubEnabled, art: false };
  }

  const rec = slotPose(slotRecords);
  const con = slotPose(slotContact);
  const recIn = marks.records - vh * 0.35;
  const conIn = marks.contact - vh * 0.5;

  if (y < recIn) return { pose: rec, a: 0, scrub: false, art: true };

  if (y < conIn) {
    const u = smooth((y - recIn) / (vh * 0.35));
    return { pose: rec, a: u, scrub: false, art: true };
  }

  const u = smooth((y - conIn) / (vh * 0.5));
  if (!rec || !con) return { pose: con || rec, a: con || rec ? 1 : 0, scrub: false, art: true };
  return { pose: mixPose(rec, con, u), a: 1, scrub: false, art: true };
}

function paint() {
  platter.style.transform = `rotate(${rotation + spinOffset}deg)`;
}

let artOn = null;

function setDiscArt(on) {
  if (on === artOn) return;
  artOn = on;
  if (on && recIndexActive >= 0) {
    discArt.style.backgroundImage = `url("${RELEASES[recIndexActive].thumb}")`;
    discArt.classList.add("is-art");
  } else {
    discArt.style.backgroundImage = "";
    discArt.classList.remove("is-art");
  }
}

function frame() {
  frameQueued = false;
  const y = scrollY;

  /* ── read phase — every layout query happens here ── */
  const st = stageAt(y);

  let nearestRow = -1;
  if (!recLocked && recHover < 0 && y > marks.brands && y < marks.contact + vh) {
    const mid = vh * 0.45;
    let bestD = Infinity;
    for (let i = 0; i < recRows.length; i++) {
      const r = recRows[i].getBoundingClientRect();
      if (r.bottom < 0 || r.top > vh) continue;
      const d = Math.abs(r.top + r.height / 2 - mid);
      if (d < bestD) { bestD = d; nearestRow = i; }
    }
  }

  /* ── write phase ── */
  if (!reducedMotion) {
    const pose = st.pose || lastPose;
    lastPose = pose;

    if (Math.abs(pose.s - discSize) > 0.5) {
      discSize = pose.s;
      assembly.style.width = `${discSize}px`;
      assembly.style.height = `${discSize}px`;
    }
    assembly.style.transform =
      `translate3d(${Math.round(pose.cx - pose.s / 2)}px, ${Math.round(pose.cy - pose.s / 2)}px, 0)`;

    const alpha = st.pose ? st.a : 0;
    assembly.style.opacity = alpha.toFixed(3);
    assembly.style.visibility = alpha < 0.02 ? "hidden" : "visible";
    assembly.classList.toggle("is-scrubbing", st.scrub);

    rotation = y * SCROLL_SPIN;
    paint();
    setDiscArt(st.art);
  }

  if (scrubEnabled && y >= campTop - vh * 0.35 && y <= campEnd + vh * 0.35) {
    const p = clamp01((y - campTop) / campSpan);
    renderCampaign(Math.round(p * (NC - 1)));
    campScrub.style.width = `${(p * 100).toFixed(1)}%`;
    dpFill.style.strokeDashoffset = String(304.2 * (1 - p));
  }

  if (nearestRow >= 0) selectRelease(nearestRow, false);

  let here = "hero";
  for (const key of RAIL_ORDER) {
    if (y >= marks[key] - vh * 0.45) { here = key; break; }
  }
  for (const b of railButtons) b.classList.toggle("is-here", b.dataset.act === `act-${here}`);

  /* the floating CTA retires once the real one is on screen */
  document.body.classList.toggle("at-contact", y >= marks.contact - vh * 0.4);

  /* the rail floats over whichever room is at the middle of the screen */
  const mid = y + vh / 2;
  const room = mid < marks.campaigns || mid >= marks.screen ? "night" : "day";
  if (room !== roomNow) {
    roomNow = room;
    document.body.classList.toggle("on-day", room === "day");
    document.body.classList.toggle("on-night", room === "night");
  }

  if (railLen) rwFill.style.strokeDashoffset = String(railLen * (1 - clamp01(y / docSpan)));
}

function queueFrame() {
  if (!frameQueued) {
    frameQueued = true;
    requestAnimationFrame(frame);
  }
}

let lastSweep = 0;
addEventListener("scroll", () => {
  queueFrame();
  const now = performance.now();
  if (now - lastSweep > 120) { lastSweep = now; sweepDeferred(); }
}, { passive: true });

let resizeTimer = null;
let lastW = innerWidth;
addEventListener("resize", () => {
  /* mobile browsers fire resize on every URL-bar nudge — only react to real changes */
  if (innerWidth === lastW && Math.abs(innerHeight - vh) < 120) return;
  lastW = innerWidth;
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => {
    sizeCampaignsAct();
    measure();
    buildRailWave();
    if (reducedMotion) parkDisc();
    queueFrame();
    sweepDeferred();
  }, 140);
});

/* ── platter spin while something is playing ─────────────────── */

function startPlaySpin() {
  if (reducedMotion || playSpinRAF) return;
  let last = performance.now();
  const tick = (now) => {
    spinOffset += (now - last) * 0.055;
    last = now;
    paint();
    playSpinRAF = requestAnimationFrame(tick);
  };
  playSpinRAF = requestAnimationFrame(tick);
}

function stopPlaySpin() {
  if (!playSpinRAF) return;
  cancelAnimationFrame(playSpinRAF);
  playSpinRAF = null;
  spinOffset = 0;
  paint();
}

/* ── transport + drag ────────────────────────────────────────── */

function goToCampaign(i) {
  const idx = Math.min(Math.max(i, 0), NC - 1);
  if (!scrubEnabled) {
    renderCampaign(idx);
    return;
  }
  scrollTo({ top: campTop + (idx / (NC - 1)) * campSpan, behavior: "smooth" });
}

campPrev.addEventListener("click", () => goToCampaign(campIndex - 1));
campNext.addEventListener("click", () => goToCampaign(campIndex + 1));

/* dragging the record scrubs the campaign reel */
{
  let dragging = false;
  let lastAngle = 0;

  const angleAt = (e) => {
    const r = disc.getBoundingClientRect();
    return Math.atan2(e.clientY - (r.top + r.height / 2), e.clientX - (r.left + r.width / 2)) * 180 / Math.PI;
  };

  disc.addEventListener("pointerdown", (e) => {
    if (reducedMotion) return;
    dragging = true;
    lastAngle = angleAt(e);
    disc.setPointerCapture(e.pointerId);
    document.documentElement.style.scrollBehavior = "auto";
  });

  disc.addEventListener("pointermove", (e) => {
    if (!dragging) return;
    const a = angleAt(e);
    let d = a - lastAngle;
    if (d > 180) d -= 360;
    if (d < -180) d += 360;
    lastAngle = a;
    scrollBy(0, Math.max(-160, Math.min(160, d / SCROLL_SPIN)));
  });

  const end = (e) => {
    if (!dragging) return;
    dragging = false;
    if (e.pointerId != null && disc.hasPointerCapture(e.pointerId)) disc.releasePointerCapture(e.pointerId);
    document.documentElement.style.scrollBehavior = "";
  };

  disc.addEventListener("pointerup", end);
  disc.addEventListener("pointercancel", end);
}

/* ── rail navigation ─────────────────────────────────────────── */

for (const b of railButtons) {
  b.addEventListener("click", () => {
    const el = $(b.dataset.act);
    scrollTo({ top: el.offsetTop, behavior: reducedMotion ? "auto" : "smooth" });
  });
}

/* ── reveals + counters ──────────────────────────────────────── */

document.querySelectorAll(
  ".act-eyebrow, .act-title, .act-lede, .wall, .contact-body, .hero-shot, .hero-figures," +
  ".screen-title, .screen-media, .screen-credits, .screen-note"
).forEach((el) => el.classList.add("rv"));

const io = new IntersectionObserver((entries) => {
  for (const en of entries) {
    if (!en.isIntersecting) continue;
    en.target.classList.add("in");
    io.unobserve(en.target);
  }
}, { threshold: 0.12, rootMargin: "0px 0px -6% 0px" });

document.querySelectorAll(".rv").forEach((el) => io.observe(el));

/* the hero is above the fold — never let it wait on an observer */
requestAnimationFrame(() =>
  document.querySelectorAll(".act-hero .rv").forEach((el) => el.classList.add("in"))
);
setTimeout(() =>
  document.querySelectorAll(".act-hero .rv").forEach((el) => el.classList.add("in")), 400);

const countIO = new IntersectionObserver((entries) => {
  for (const en of entries) {
    if (!en.isIntersecting) continue;
    countIO.unobserve(en.target);
    const el = en.target;
    const target = parseFloat(el.dataset.count);
    const decimals = el.dataset.count.includes(".") ? 1 : 0;
    const suffix = el.dataset.suffix || "";
    const fmt = (v) => (decimals ? v.toFixed(decimals) : String(Math.round(v))) + suffix;
    if (reducedMotion) { el.textContent = fmt(target); continue; }
    const t0 = performance.now();
    const ease = (x) => 1 - Math.pow(1 - x, 3);
    const tick = (now) => {
      const p = Math.min((now - t0) / 1300, 1);
      el.textContent = fmt(target * ease(p));
      if (p < 1) requestAnimationFrame(tick);
      else el.textContent = fmt(target);
    };
    requestAnimationFrame(tick);
  }
}, { threshold: 0.6 });

document.querySelectorAll(".hero-figures b").forEach((el) => countIO.observe(el));

/* ── hero name entrance ──────────────────────────────────────── */

/* the rise itself is a CSS animation, so it never depends on rAF firing */
document.querySelectorAll(".hn-line").forEach((line, i) => {
  const inner = document.createElement("span");
  inner.className = "hn-in";
  inner.style.setProperty("--i", i);
  inner.textContent = line.textContent;
  line.replaceChildren(inner);
});

/* ── loader ──────────────────────────────────────────────────── */

const loader = $("loader");
requestAnimationFrame(() => loader.classList.add("is-filling"));

function dismissLoader() {
  loader.classList.add("is-done");
  setTimeout(() => loader.remove(), 600);
}

addEventListener("load", () => {
  sizeCampaignsAct();
  measure();
  buildRailWave();
  if (reducedMotion) parkDisc();
  queueFrame();
  sweepDeferred();
  setTimeout(dismissLoader, reducedMotion ? 0 : 380);
});

/* never let a slow asset trap the visitor behind the loader */
setTimeout(dismissLoader, 3500);

/* ── surface for the motion layer ────────────────────────────── */

window.JAT = {
  railWavePath,
  get railH() { return railH; },
  previewRelease(i) {
    if (recLocked) return;
    recHover = i;
    selectRelease(i, false);
  },
  endPreview() {
    if (recHover < 0) return;
    recHover = -1;
    queueFrame();
  },
};

/* ── init ────────────────────────────────────────────────────── */

$("year").textContent = new Date().getFullYear();

sizeCampaignsAct();
measure();
buildRailWave();
renderCampaign(0);
selectRelease(0, false);
if (reducedMotion) parkDisc();
frame();
sweepDeferred();
