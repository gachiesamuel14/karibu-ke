const COUNTIES = [
  "Nairobi", "Mombasa", "Kisumu", "Kiambu", "Nakuru", "Uasin Gishu",
  "Machakos", "Kajiado", "Nyeri", "Kakamega", "Kilifi", "Meru"
];

const PEOPLE = [
  { id: 1, name: "Amina", age: 26, county: "Mombasa", town: "Nyali", km: 4.2, tribe: "Swahili", religion: "Muslim", mode: "Professional", interests: ["Beach walks", "Afrobeats", "Food"], bio: "Coast girl who will debate pilau recipes and still make it to sunset.", photo: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=800&q=80" },
  { id: 2, name: "Brian", age: 29, county: "Nairobi", town: "Westlands", km: 2.1, tribe: "Kikuyu", religion: "Christian", mode: "Professional", interests: ["Gym", "Jazz", "Startups"], bio: "Product guy by day, nyama choma strategist on Sundays.", photo: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=800&q=80" },
  { id: 3, name: "Wanjiku", age: 24, county: "Kiambu", town: "Ruiru", km: 11, tribe: "Kikuyu", religion: "Christian", mode: "Student", interests: ["Poetry", "Hikes", "Church"], bio: "Looking for someone who can keep up on a Ngong hike and a deep conversation.", photo: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=800&q=80" },
  { id: 4, name: "Otieno", age: 31, county: "Kisumu", town: "Milimani", km: 7.8, tribe: "Luo", religion: "Christian", mode: "Professional", interests: ["Football", "Cooking", "Lake"], bio: "Lakeside evenings, Gor Mahia Saturdays, good soup any day.", photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=800&q=80" },
  { id: 5, name: "Faith", age: 27, county: "Nakuru", town: "Milimani", km: 18, tribe: "Kalenjin", religion: "Christian", mode: "Church", interests: ["Running", "Worship", "Tea"], bio: "Early mornings, long runs, and someone who texts back.", photo: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=800&q=80" },
  { id: 6, name: "Hassan", age: 28, county: "Nairobi", town: "Eastleigh", km: 5.4, tribe: "Somali", religion: "Muslim", mode: "Professional", interests: ["Cars", "Fashion", "Business"], bio: "Building something quiet. Want a partner who gets hustle and home.", photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80" },
  { id: 7, name: "Chebet", age: 23, county: "Uasin Gishu", town: "Eldoret", km: 22, tribe: "Kalenjin", religion: "Christian", mode: "Student", interests: ["Athletics", "Campus", "Netflix"], bio: "Eldoret energy. Slow chats, fast miles.", photo: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=800&q=80" },
  { id: 8, name: "Mwende", age: 30, county: "Machakos", town: "Syokimau", km: 14, tribe: "Kamba", religion: "Christian", mode: "Professional", interests: ["Travel", "Design", "Markets"], bio: "Designer who still believes the best dates start at a local market.", photo: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=800&q=80" }
];

const store = {
  get(key, fallback) {
    try { return JSON.parse(localStorage.getItem(key)) ?? fallback; }
    catch { return fallback; }
  },
  set(key, value) { localStorage.setItem(key, JSON.stringify(value)); }
};

function toast(msg) {
  const el = document.createElement("div");
  el.className = "toast";
  el.textContent = msg;
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 2400);
}

function haversine(a, b) {
  const R = 6371;
  const dLat = (b.lat - a.lat) * Math.PI / 180;
  const dLon = (b.lng - a.lng) * Math.PI / 180;
  const s = Math.sin(dLat/2) ** 2 + Math.cos(a.lat*Math.PI/180) * Math.cos(b.lat*Math.PI/180) * Math.sin(dLon/2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(s), Math.sqrt(1-s));
}

function currentUser() { return store.get("karibu_user", null); }
function likes() { return store.get("karibu_likes", []); }
function passes() { return store.get("karibu_passes", []); }
function matches() { return store.get("karibu_matches", []); }
function chats() { return store.get("karibu_chats", {}); }
function setUser(u) { store.set("karibu_user", u); }
function addLike(id) {
  const l = likes();
  if (!l.includes(id)) l.push(id);
  store.set("karibu_likes", l);
  if (!matches().includes(id) && Math.random() > 0.35) {
    const m = matches(); m.push(id); store.set("karibu_matches", m);
    return true;
  }
  return false;
}
function addPass(id) {
  const p = passes();
  if (!p.includes(id)) p.push(id);
  store.set("karibu_passes", p);
}

const routes = {
  "/": landing,
  "/login": auth.bind(null, "login"),
  "/register": auth.bind(null, "register"),
  "/app": appShell.bind(null, "discover"),
  "/app/swipe": appShell.bind(null, "swipe"),
  "/app/matches": appShell.bind(null, "matches"),
  "/app/chat": appShell.bind(null, "chat"),
  "/app/profile": appShell.bind(null, "profile"),
  "/app/safety": appShell.bind(null, "safety"),
  "/app/premium": appShell.bind(null, "premium"),
};

function path() {
  const h = location.hash.replace("#", "") || "/";
  return h.split("?")[0];
}
function query() {
  const q = location.hash.split("?")[1] || "";
  return Object.fromEntries(new URLSearchParams(q));
}

function landing() {
  return `
  <div class="wrap">
    <header class="topbar">
      <div class="brand">Karibu<span>.</span></div>
      <nav class="nav">
        <a class="btn ghost" href="#/login">Log in</a>
        <a class="btn primary" href="#/register">Create profile</a>
      </nav>
    </header>
    <section class="hero">
      <div>
        <div class="kicker">Location-based matchmaking · Kenya</div>
        <h1>Meet someone in your county, not just on your phone.</h1>
        <p>Karibu helps Kenyans find people nearby — Nairobi to Mombasa, campus to church, professional to chill. Filter by distance, county, vibe, and actually talk.</p>
        <a class="btn primary" href="#/register">Start matching</a>
        <a class="btn" href="#/app" style="margin-left:8px">Peek the demo</a>
      </div>
      <article class="preview">
        <img src="${PEOPLE[0].photo}" alt="Featured profile" />
        <div class="meta">
          <h3>Amina, 26 · Nyali</h3>
          <p>4.2 km away · Mombasa · Beach walks, Afrobeats</p>
        </div>
      </article>
    </section>
    <section class="grid-3">
      <article class="card"><h3>Nearby first</h3><p>We rank people by GPS distance and county so a match in Ruiru beats a stranger in another country.</p></article>
      <article class="card"><h3>Kenyan filters</h3><p>County, town, tribe, religion, student / professional / church modes — plus Sheng-friendly bios.</p></article>
      <article class="card"><h3>Safer chats</h3><p>Report and block are one tap away. Premium (M-Pesa) is optional, never required to start.</p></article>
    </section>
  </div>`;
}

function auth(mode) {
  const title = mode === "login" ? "Welcome back" : "Create your Karibu";
  return `
  <div class="wrap auth card">
    <div class="brand">Karibu<span>.</span></div>
    <h2 style="margin:12px 0">${title}</h2>
    <form class="form" id="auth-form">
      ${mode === "register" ? `<input name="name" placeholder="First name" required />` : ""}
      <input name="email" type="email" placeholder="Email" required />
      <input name="password" type="password" placeholder="Password" required />
      ${mode === "register" ? `
        <select name="county">${COUNTIES.map(c => `<option>${c}</option>`).join("")}</select>
        <select name="mode">
          <option>Professional</option><option>Student</option><option>Church</option>
        </select>` : ""}
      <button class="btn primary" type="submit">${mode === "login" ? "Log in" : "Create account"}</button>
    </form>
    <p class="notice">Demo auth only — saved in this browser. Production should use real identity (Netlify Identity, Clerk, or Supabase).</p>
    <p class="notice"><a href="#/${mode === "login" ? "register" : "login"}" style="color:var(--gold)">${mode === "login" ? "Need an account?" : "Already have one?"}</a></p>
  </div>`;
}

function side(view) {
  const items = [
    ["discover", "/app", "Discover"],
    ["swipe", "/app/swipe", "Swipe"],
    ["matches", "/app/matches", "Matches"],
    ["profile", "/app/profile", "Profile"],
    ["safety", "/app/safety", "Safety"],
    ["premium", "/app/premium", "Premium"],
  ];
  return `
    <aside class="side">
      <a class="brand" href="#/">Karibu<span>.</span></a>
      ${items.map(([id, href, label]) => `<a class="${view===id?"active":""}" href="#${href}">${label}</a>`).join("")}
      <button class="link" id="logout">Log out</button>
    </aside>`;
}

function personCard(p) {
  return `
    <article class="card person" data-id="${p.id}">
      <img src="${p.photo}" alt="${p.name}" />
      <div class="body">
        <div class="row">
          <h3>${p.name}, ${p.age}</h3>
          <span class="chip">${p.km} km</span>
        </div>
        <p>${p.town}, ${p.county} · ${p.mode}</p>
        <p style="margin-top:8px">${p.bio}</p>
        <p class="notice">${p.interests.join(" · ")} · ${p.religion}</p>
        <div class="actions">
          <button class="btn" data-act="pass" data-id="${p.id}">Pass</button>
          <button class="btn primary" data-act="like" data-id="${p.id}">Like</button>
        </div>
      </div>
    </article>`;
}

function discoverView() {
  const hidden = new Set([...likes(), ...passes()]);
  const county = store.get("karibu_filter_county", "All");
  const maxKm = Number(store.get("karibu_filter_km", 50));
  const list = PEOPLE.filter(p => !hidden.has(p.id))
    .filter(p => county === "All" || p.county === county)
    .filter(p => p.km <= maxKm);
  return `
    <div class="filters">
      <select id="f-county">
        <option>All</option>
        ${COUNTIES.map(c => `<option ${c===county?"selected":""}>${c}</option>`).join("")}
      </select>
      <select id="f-km">
        ${[5,10,25,50,100].map(n => `<option value="${n}" ${n===maxKm?"selected":""}>Within ${n} km</option>`).join("")}
      </select>
      <button class="btn" id="geo">Use my location</button>
    </div>
    <div class="feed">${list.length ? list.map(p => personCard(p)).join("") : `<p class="notice">No one left in this filter. Reset likes from Profile or widen distance.</p>`}</div>`;
}

function swipeView() {
  const hidden = new Set([...likes(), ...passes()]);
  const next = PEOPLE.find(p => !hidden.has(p.id));
  if (!next) return `<p class="notice">Deck is empty. Check Matches or reset from Profile.</p>`;
  return `<div class="swipe">${personCard(next)}</div>`;
}

function matchesView() {
  const ids = matches();
  const list = PEOPLE.filter(p => ids.includes(p.id));
  if (!list.length) return `<p class="notice">No matches yet. Like a few profiles — some will match back.</p>`;
  return `<div class="matches">${list.map(p => `
    <div class="match">
      <img src="${p.photo}" alt="" />
      <div><strong>${p.name}</strong><div class="notice">${p.town} · ${p.km} km</div></div>
      <a class="btn primary" href="#/app/chat?with=${p.id}">Chat</a>
    </div>`).join("")}</div>`;
}

function chatView() {
  const id = Number(query().with || matches()[0]);
  const person = PEOPLE.find(p => p.id === id);
  if (!person) return `<p class="notice">Pick a match first.</p>`;
  const thread = chats()[id] || [{ who: "them", text: `Sasa. You nearby ${person.town}?` }];
  return `
    <div class="chat">
      <header><strong>${person.name}</strong> · ${person.km} km · <button class="btn danger" data-act="report" data-id="${person.id}">Report</button></header>
      <div class="msgs">${thread.map(m => `<div class="bubble ${m.who}">${m.text}</div>`).join("")}</div>
      <form class="composer" id="chat-form">
        <input name="text" placeholder="Write a message…" autocomplete="off" />
        <button class="btn primary">Send</button>
      </form>
    </div>`;
}

function profileView() {
  const u = currentUser() || { name: "You", email: "", county: "Nairobi", mode: "Professional", bio: "" };
  return `
    <form class="form card" id="profile-form">
      <h2>Your profile</h2>
      <input name="name" value="${u.name || ""}" placeholder="Name" />
      <input name="email" value="${u.email || ""}" placeholder="Email" />
      <select name="county">${COUNTIES.map(c => `<option ${c===u.county?"selected":""}>${c}</option>`).join("")}</select>
      <select name="mode">
        ${["Professional","Student","Church"].map(m => `<option ${m===u.mode?"selected":""}>${m}</option>`).join("")}
      </select>
      <textarea name="bio" rows="4" placeholder="Bio">${u.bio || ""}</textarea>
      <p class="notice">Photo uploads belong in production (Cloudinary / Netlify Blobs). Demo uses stock photos.</p>
      <button class="btn primary">Save profile</button>
      <button type="button" class="btn" id="reset-deck">Reset likes & passes</button>
    </form>`;
}

function safetyView() {
  return `
    <div class="card form">
      <h2>Stay safe</h2>
      <p>Meet in public first. Never send M-Pesa to a stranger to “verify” anything.</p>
      <label>Report a user</label>
      <select id="report-user">${PEOPLE.map(p => `<option value="${p.id}">${p.name} · ${p.county}</option>`).join("")}</select>
      <textarea id="report-why" rows="3" placeholder="What happened?"></textarea>
      <button class="btn danger" id="send-report">Submit report</button>
      <p class="notice">Reports are stored locally in this demo. Production should notify moderators and hide the reported profile.</p>
    </div>`;
}

function premiumView() {
  return `
    <div class="card form">
      <h2>Karibu Plus</h2>
      <p>See who liked you, rewind a pass, and boost in your county. Pay with M-Pesa STK Push when Daraja keys are connected.</p>
      <input id="mpesa-phone" placeholder="2547XXXXXXXX" />
      <button class="btn gold" id="stk">Send STK prompt · KES 499 / month</button>
      <p class="notice">This button only simulates the prompt. Wire Safaricom Daraja from a Netlify Function for live payments.</p>
    </div>`;
}

function appShell(view) {
  const body = {
    discover: discoverView,
    swipe: swipeView,
    matches: matchesView,
    chat: chatView,
    profile: profileView,
    safety: safetyView,
    premium: premiumView
  }[view]();
  return `<div class="app-shell">${side(view)}<main class="main">${body}</main></div>`;
}

function render() {
  const p = path();
  const view = (routes[p] || landing)();
  document.getElementById("app").innerHTML = view;
  bind();
}

function bind() {
  const authForm = document.getElementById("auth-form");
  if (authForm) authForm.onsubmit = (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(authForm));
    setUser({ ...currentUser(), ...data });
    toast("Karibu. You’re in.");
    location.hash = "/app";
  };
  document.getElementById("logout")?.addEventListener("click", () => { location.hash = "/"; });
  document.getElementById("f-county")?.addEventListener("change", (e) => {
    store.set("karibu_filter_county", e.target.value); render();
  });
  document.getElementById("f-km")?.addEventListener("change", (e) => {
    store.set("karibu_filter_km", Number(e.target.value)); render();
  });
  document.getElementById("geo")?.addEventListener("click", () => {
    if (!navigator.geolocation) return toast("Location not available in this browser.");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const here = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        const nairobi = { lat: -1.2921, lng: 36.8219 };
        toast(`Location on · ~${haversine(here, nairobi).toFixed(1)} km from Nairobi CBD`);
      },
      () => toast("Location permission denied. You can still filter by county.")
    );
  });
  document.querySelectorAll("[data-act=like]").forEach(btn => btn.onclick = () => {
    const matched = addLike(Number(btn.dataset.id));
    toast(matched ? "It's a match!" : "Liked");
    render();
  });
  document.querySelectorAll("[data-act=pass]").forEach(btn => btn.onclick = () => {
    addPass(Number(btn.dataset.id));
    toast("Passed");
    render();
  });
  document.querySelectorAll("[data-act=report]").forEach(btn => btn.onclick = () => {
    toast("Report sent. Chat hidden in a full build.");
  });
  const chatForm = document.getElementById("chat-form");
  if (chatForm) chatForm.onsubmit = (e) => {
    e.preventDefault();
    const text = new FormData(chatForm).get("text").trim();
    if (!text) return;
    const id = Number(query().with || matches()[0]);
    const all = chats();
    all[id] = all[id] || [];
    all[id].push({ who: "me", text });
    store.set("karibu_chats", all);
    render();
  };
  document.getElementById("profile-form")?.addEventListener("submit", (e) => {
    e.preventDefault();
    setUser({ ...currentUser(), ...Object.fromEntries(new FormData(e.target)) });
    toast("Profile saved");
  });
  document.getElementById("reset-deck")?.addEventListener("click", () => {
    store.set("karibu_likes", []); store.set("karibu_passes", []);
    toast("Deck reset"); render();
  });
  document.getElementById("send-report")?.addEventListener("click", () => {
    const reports = store.get("karibu_reports", []);
    reports.push({ id: document.getElementById("report-user").value, why: document.getElementById("report-why").value, at: Date.now() });
    store.set("karibu_reports", reports);
    toast("Report submitted");
  });
  document.getElementById("stk")?.addEventListener("click", () => {
    const phone = document.getElementById("mpesa-phone").value || "2547…";
    toast(`STK would pop on ${phone}. Connect Daraja to go live.`);
  });
}

window.addEventListener("hashchange", render);
render();
