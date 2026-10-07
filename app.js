const COUNTIES = [
  { name: "Nairobi", lat: -1.2864, lng: 36.8172 },
  { name: "Mombasa", lat: -4.0435, lng: 39.6682 },
  { name: "Kisumu", lat: -0.0917, lng: 34.768 },
  { name: "Nakuru", lat: -0.3031, lng: 36.08 },
  { name: "Kiambu", lat: -1.1714, lng: 36.8356 },
  { name: "Uasin Gishu", lat: 0.5143, lng: 35.2698 },
  { name: "Nyeri", lat: -0.4371, lng: 36.958 },
  { name: "Machakos", lat: -1.5177, lng: 37.2634 },
  { name: "Kakamega", lat: 0.2827, lng: 34.7519 },
  { name: "Kilifi", lat: -3.5107, lng: 39.9093 },
  { name: "Kajiado", lat: -1.8524, lng: 36.7768 },
  { name: "Meru", lat: 0.0463, lng: 37.6559 }
];
const INTERESTS = ["Coffee", "Hiking", "Gospel", "Afrobeats", "Football", "Startups", "Cooking", "Travel", "Photography", "Church", "Gym", "Movies"];
const TRIBES = ["Kikuyu", "Luo", "Luhya", "Kalenjin", "Kamba", "Kisii", "Meru", "Mijikenda", "Somali", "Prefer not to say"];
const RELIGIONS = ["Christian", "Muslim", "Traditional", "Spiritual", "Prefer not to say"];
const MODES = ["Open", "Student", "Professional", "Church"];
const KEY = "karibu-ke-v1";

const seed = [
  { id: "a1", name: "Amina", age: 26, county: "Mombasa", tribe: "Mijikenda", religion: "Muslim", mode: "Professional", bio: "Nyali sunsets, pilau, and long walks on the sea wall.", interests: ["Travel", "Cooking", "Photography"], gender: "Woman", looking: "Men", lat: -4.04, lng: 39.7, hue: 18 },
  { id: "a2", name: "Brian", age: 29, county: "Nairobi", tribe: "Kikuyu", religion: "Christian", mode: "Professional", bio: "Westlands product designer. Saturdays are for Karura.", interests: ["Hiking", "Startups", "Coffee"], gender: "Man", looking: "Women", lat: -1.27, lng: 36.8, hue: 150 },
  { id: "a3", name: "Chebet", age: 24, county: "Uasin Gishu", tribe: "Kalenjin", religion: "Christian", mode: "Student", bio: "Eldoret campus. Track in the morning, chai in the evening.", interests: ["Gym", "Gospel", "Movies"], gender: "Woman", looking: "Everyone", lat: 0.52, lng: 35.27, hue: 32 },
  { id: "a4", name: "David", age: 31, county: "Kisumu", tribe: "Luo", religion: "Christian", mode: "Open", bio: "Lake views, ohangla, and a small grill in Milimani.", interests: ["Cooking", "Afrobeats", "Football"], gender: "Man", looking: "Women", lat: -0.09, lng: 34.76, hue: 200 },
  { id: "a5", name: "Faith", age: 27, county: "Kiambu", tribe: "Kikuyu", religion: "Christian", mode: "Church", bio: "Sunday service, then coffee in Ruaka. Looking for something serious.", interests: ["Church", "Coffee", "Travel"], gender: "Woman", looking: "Men", lat: -1.16, lng: 36.84, hue: 280 },
  { id: "a6", name: "Hassan", age: 33, county: "Nairobi", tribe: "Somali", religion: "Muslim", mode: "Professional", bio: "Eastleigh to Upper Hill. Quiet dinners over loud clubs.", interests: ["Travel", "Coffee", "Movies"], gender: "Man", looking: "Women", lat: -1.29, lng: 36.85, hue: 130 },
  { id: "a7", name: "Wanjiku", age: 23, county: "Nyeri", tribe: "Kikuyu", religion: "Christian", mode: "Student", bio: "Agribusiness student. Farms, books, and Aberdare hikes.", interests: ["Hiking", "Cooking", "Photography"], gender: "Woman", looking: "Men", lat: -0.44, lng: 36.96, hue: 340 },
  { id: "a8", name: "Otieno", age: 28, county: "Nakuru", tribe: "Luo", religion: "Prefer not to say", mode: "Professional", bio: "Lake Nakuru weekends. I will split a nyama choma bill fairly.", interests: ["Football", "Travel", "Afrobeats"], gender: "Man", looking: "Everyone", lat: -0.3, lng: 36.08, hue: 90 }
];

const state = load();
let screen = state.user ? "discover" : "home";
let chatWith = null;
let filters = { county: "Any", distance: 80, minAge: 18, maxAge: 40, tribe: "Any", religion: "Any", mode: "Any", interest: "Any" };

function load() {
  const raw = localStorage.getItem(KEY);
  if (raw) return JSON.parse(raw);
  return {
    user: null,
    accounts: [{ email: "demo@karibu.ke", password: "karibu123", profile: { name: "Demo", age: 25, county: "Nairobi", tribe: "Prefer not to say", religion: "Christian", mode: "Open", bio: "Trying Karibu around Nairobi.", interests: ["Coffee", "Travel"], gender: "Woman", looking: "Everyone", lat: -1.29, lng: 36.82, photos: [] } }],
    likes: {}, passes: {}, matches: [], messages: {}, blocks: [], reports: [], notes: []
  };
}
function save() { localStorage.setItem(KEY, JSON.stringify(state)); }
function km(a, b) {
  const R = 6371, dLat = (b.lat - a.lat) * Math.PI / 180, dLng = (b.lng - a.lng) * Math.PI / 180;
  const x = Math.sin(dLat / 2) ** 2 + Math.cos(a.lat * Math.PI / 180) * Math.cos(b.lat * Math.PI / 180) * Math.sin(dLng / 2) ** 2;
  return Math.round(R * 2 * Math.atan2(Math.sqrt(x), Math.sqrt(1 - x)));
}
function me() { return state.user && state.user.profile; }
function photoStyle(p) {
  if (p.photos && p.photos[0]) return `url('${p.photos[0]}') center/cover`;
  return `linear-gradient(145deg, hsl(${p.hue || 150} 55% 42%), hsl(${(p.hue || 150) + 40} 60% 28%))`;
}
function candidates() {
  const profile = me();
  if (!profile) return [];
  return seed.filter(p => {
    if (state.blocks.includes(p.id) || (state.passes[state.user.email] || []).includes(p.id)) return false;
    if ((state.likes[state.user.email] || []).includes(p.id)) return false;
    if (filters.county !== "Any" && p.county !== filters.county) return false;
    if (p.age < filters.minAge || p.age > filters.maxAge) return false;
    if (filters.tribe !== "Any" && p.tribe !== filters.tribe) return false;
    if (filters.religion !== "Any" && p.religion !== filters.religion) return false;
    if (filters.mode !== "Any" && p.mode !== filters.mode) return false;
    if (filters.interest !== "Any" && !p.interests.includes(filters.interest)) return false;
    if (profile.looking === "Men" && p.gender !== "Man") return false;
    if (profile.looking === "Women" && p.gender !== "Woman") return false;
    return km(profile, p) <= Number(filters.distance);
  }).map(p => ({ ...p, distance: km(profile, p) })).sort((a, b) => a.distance - b.distance);
}
function notify(text) { state.notes.unshift({ id: Date.now(), text, at: new Date().toLocaleTimeString() }); save(); }

function render() {
  const app = document.getElementById("app");
  app.innerHTML = state.user ? appShell() : publicShell();
  bind();
}
function publicShell() {
  if (screen === "auth") return authView();
  return `<div class="shell">
    <div class="top"><div class="brand"><div class="mark">K</div> Karibu</div><button class="solid" id="go-auth">Join free</button></div>
    <section class="hero">
      <div>
        <div class="kicker">Location matchmaking · Kenya · 18+</div>
        <h1>Meet someone near you, not across the internet.</h1>
        <p class="lede">Karibu ranks people by GPS or county — Nairobi, Mombasa, Kisumu, Eldoret, and the rest. Filter by distance, age, tribe, religion, or student, professional, and church mode.</p>
        <div class="row"><button class="solid" id="go-auth-2">Create a profile</button><button class="ghost" id="demo">Try the Nairobi demo</button></div>
        <div class="pills"><span class="pill">County matching</span><span class="pill">Sheng-friendly bios</span><span class="pill">M-Pesa Plus</span><span class="pill">Report & block</span></div>
      </div>
      <div class="preview"><div class="card-face" style="--photo:${photoStyle(seed[1])}"><span>2.4 km · Westlands</span><strong>Brian, 29</strong><span>Karura hikes · coffee · startups</span></div></div>
    </section>
    <p class="footer-note">Demo data stays in your browser. Meet in public places. Never send money to someone you have not met.</p>
  </div>`;
}
function authView() {
  return `<div class="shell"><div class="top"><div class="brand"><div class="mark">K</div> Karibu</div><button class="ghost" id="home">Back</button></div>
    <div class="auth" style="max-width:480px;margin:28px auto">
      <h2>Sasa. Create your account.</h2>
      <p class="lede">You must be 18 or older. This demo stores the account on this device only.</p>
      <form id="auth-form">
        <label>Email</label><input name="email" type="email" required placeholder="you@email.com" />
        <label>Password</label><input name="password" type="password" required minlength="6" />
        <label>I confirm I am 18 or older</label><input name="adult" type="checkbox" required style="width:auto" />
        <div class="row"><button class="solid" name="mode" value="register">Register</button><button class="ghost" name="mode" value="login">Log in</button></div>
      </form>
      <p class="footer-note">Demo login: demo@karibu.ke / karibu123</p>
    </div></div>`;
}
function appShell() {
  const tabs = [["discover", "Nearby"], ["matches", "Matches"], ["chat", "Chat"], ["notes", "Alerts"], ["profile", "Profile"], ["plus", "Plus"], ["safety", "Safety"]];
  return `<div class="shell">
    <div class="top"><div class="brand"><div class="mark">K</div> Karibu</div>
      <div class="nav">${tabs.map(([id, label]) => `<button data-screen="${id}" class="${screen === id ? "active" : ""}">${label}</button>`).join("")}<button id="logout">Log out</button></div>
    </div>
    <div style="height:16px"></div>
    ${screen === "discover" ? discoverView() : screen === "matches" ? matchesView() : screen === "chat" ? chatView() : screen === "notes" ? notesView() : screen === "profile" ? profileView() : screen === "plus" ? plusView() : safetyView()}
  </div>`;
}
function discoverView() {
  const people = candidates();
  const p = people[0];
  const opts = (arr) => ["Any", ...arr].map(v => `<option ${filters.county === v || filters.tribe === v || filters.religion === v || filters.mode === v || filters.interest === v ? "" : ""}>${v}</option>`).join("");
  return `<div class="grid-2">
    <aside class="panel filters">
      <h3>Filters</h3>
      <label>County</label><select id="f-county">${COUNTIES.map(c => c.name).concat(["Any"]).map(n => `<option ${filters.county === n ? "selected" : ""}>${n}</option>`).join("")}</select>
      <label>Max distance (km)</label><input id="f-distance" type="number" value="${filters.distance}" min="1" max="800" />
      <label>Age</label><div class="row"><input id="f-min" type="number" value="${filters.minAge}" min="18" /><input id="f-max" type="number" value="${filters.maxAge}" /></div>
      <label>Tribe</label><select id="f-tribe">${["Any", ...TRIBES].map(n => `<option ${filters.tribe === n ? "selected" : ""}>${n}</option>`).join("")}</select>
      <label>Religion</label><select id="f-religion">${["Any", ...RELIGIONS].map(n => `<option ${filters.religion === n ? "selected" : ""}>${n}</option>`).join("")}</select>
      <label>Mode</label><select id="f-mode">${["Any", ...MODES].map(n => `<option ${filters.mode === n ? "selected" : ""}>${n}</option>`).join("")}</select>
      <label>Interest</label><select id="f-interest">${["Any", ...INTERESTS].map(n => `<option ${filters.interest === n ? "selected" : ""}>${n}</option>`).join("")}</select>
      <button class="solid" id="locate">Use my GPS</button>
      <p class="footer-note">Showing people within ${filters.distance} km of ${me().county}. Distance uses your coordinates.</p>
    </aside>
    <div class="deck-wrap">${p ? personCard(p) : `<div class="notice">No one left in this radius. Widen distance or switch county.</div>`}</div>
  </div>`;
}
function personCard(p) {
  return `<article class="person">
    <div class="photo" style="--photo:${photoStyle(p)}"><div><div>${p.distance} km · ${p.county}</div><h2>${p.name}, ${p.age}</h2></div></div>
    <div class="meta"><p>${p.bio}</p><div class="chips">${p.interests.map(i => `<span class="chip">${i}</span>`).join("")}<span class="chip">${p.mode} mode</span><span class="chip">${p.tribe}</span></div>
      <div class="actions"><button class="pass" data-pass="${p.id}">✕</button><button class="like" data-like="${p.id}">♥</button><button class="danger" data-report="${p.id}">Report</button></div>
    </div></article>`;
}
function matchesView() {
  const mine = state.matches.filter(m => m.email === state.user.email);
  if (!mine.length) return `<div class="panel"><h2>No matches yet</h2><p>Like someone nearby. In this demo, Amina, Brian, Faith, and David like you back.</p></div>`;
  return `<div class="list panel"><h2>Matches</h2>${mine.map(m => `<div class="match-row"><div class="avatar" style="background:${photoStyle(m)}">${m.name[0]}</div><div><strong>${m.name}</strong><div>${m.county} · ${m.distance} km</div></div><button class="solid" data-open="${m.id}">Chat</button></div>`).join("")}</div>`;
}
function chatView() {
  const mine = state.matches.filter(m => m.email === state.user.email);
  const thread = (state.messages[chatWith] || []);
  const person = seed.find(p => p.id === chatWith);
  return `<div class="grid-2"><aside class="panel">${mine.map(m => `<button class="ghost" data-open="${m.id}" style="width:100%;margin-bottom:8px">${m.name}</button>`).join("") || "Match first."}</aside>
    <div class="chat panel">${person ? `<h2>${person.name}</h2><div class="chat-log">${thread.map(t => `<div class="bubble ${t.from === "me" ? "me" : ""}">${t.text}</div>`).join("")}</div><form id="send"><div class="row"><input name="text" placeholder="Andika ujumbe..." required /><button class="solid">Send</button></div></form>` : "<p>Pick a match.</p>"}</div></div>`;
}
function notesView() {
  return `<div class="panel"><h2>Notifications</h2>${state.notes.length ? state.notes.map(n => `<div class="note"><div><strong>${n.text}</strong><div>${n.at}</div></div></div>`).join("") : "<p>Likes, matches, and reports show up here.</p>"}</div>`;
}
function profileView() {
  const p = me();
  return `<form class="form" id="profile">
    <h2>Your profile</h2>
    <div class="row"><div style="flex:1"><label>Name</label><input name="name" value="${p.name}" required /></div><div style="width:100px"><label>Age</label><input name="age" type="number" min="18" value="${p.age}" required /></div></div>
    <label>Bio</label><textarea name="bio" rows="3">${p.bio || ""}</textarea>
    <label>County</label><select name="county">${COUNTIES.map(c => `<option ${p.county === c.name ? "selected" : ""}>${c.name}</option>`).join("")}</select>
    <div class="row"><div style="flex:1"><label>I am</label><select name="gender">${["Woman", "Man", "Non-binary"].map(g => `<option ${p.gender === g ? "selected" : ""}>${g}</option>`).join("")}</select></div>
    <div style="flex:1"><label>Looking for</label><select name="looking">${["Women", "Men", "Everyone"].map(g => `<option ${p.looking === g ? "selected" : ""}>${g}</option>`).join("")}</select></div></div>
    <div class="row"><div style="flex:1"><label>Tribe</label><select name="tribe">${TRIBES.map(t => `<option ${p.tribe === t ? "selected" : ""}>${t}</option>`).join("")}</select></div>
    <div style="flex:1"><label>Religion</label><select name="religion">${RELIGIONS.map(t => `<option ${p.religion === t ? "selected" : ""}>${t}</option>`).join("")}</select></div>
    <div style="flex:1"><label>Mode</label><select name="mode">${MODES.map(t => `<option ${p.mode === t ? "selected" : ""}>${t}</option>`).join("")}</select></div></div>
    <label>Interests</label><input name="interests" value="${(p.interests || []).join(", ")}" />
    <label>Photo upload</label><input name="photo" type="file" accept="image/*" />
    ${p.photos && p.photos[0] ? `<img alt="Your upload" src="${p.photos[0]}" style="width:120px;height:120px;object-fit:cover;border-radius:16px;margin-top:8px" />` : ""}
    <div class="row"><button class="solid">Save profile</button></div>
  </form>`;
}
function plusView() {
  return `<div class="panel"><h2>Karibu Plus</h2><p>See who liked you, unlimited swipes, and a county boost. KES 499 / month.</p>
    <div class="warn">M-Pesa STK Push is a preview only. No payment is sent.</div>
    <form id="mpesa"><label>Safaricom number</label><input name="phone" placeholder="07XXXXXXXX" required /><button class="solid">Request STK push</button></form>
    <p id="stk"></p></div>`;
}
function safetyView() {
  return `<div class="panel"><h2>Safety</h2>
    <ul><li>Meet in a public place the first time — a mall, Java, or a busy hotel lobby.</li><li>Do not share your PIN, ID photos, or send money.</li><li>Block and report anyone who pressures you.</li></ul>
    <h3>Your reports</h3>
    ${state.reports.filter(r => r.by === state.user.email).map(r => `<div class="note">${r.reason} · ${r.target}</div>`).join("") || "<p>None yet.</p>"}
  </div>`;
}
function bind() {
  document.querySelectorAll("[data-screen]").forEach(b => b.onclick = () => { screen = b.dataset.screen; render(); });
  const home = document.getElementById("home"); if (home) home.onclick = () => { screen = "home"; render(); };
  const go = document.getElementById("go-auth") || document.getElementById("go-auth-2");
  document.querySelectorAll("#go-auth, #go-auth-2").forEach(b => b.onclick = () => { screen = "auth"; render(); });
  const demo = document.getElementById("demo");
  if (demo) demo.onclick = () => login("demo@karibu.ke", "karibu123");
  const form = document.getElementById("auth-form");
  if (form) form.onsubmit = (e) => {
    e.preventDefault();
    const data = new FormData(form);
    const email = String(data.get("email")).toLowerCase();
    const password = String(data.get("password"));
    if (e.submitter && e.submitter.value === "login") return login(email, password);
    if (state.accounts.some(a => a.email === email)) return alert("Account exists. Log in.");
    const county = COUNTIES[0];
    state.accounts.push({ email, password, profile: { name: email.split("@")[0], age: 21, county: county.name, tribe: "Prefer not to say", religion: "Prefer not to say", mode: "Open", bio: "", interests: ["Coffee"], gender: "Woman", looking: "Everyone", lat: county.lat, lng: county.lng, photos: [], hue: 160 } });
    state.user = state.accounts.at(-1);
    save(); screen = "profile"; render();
  };
  const out = document.getElementById("logout");
  if (out) out.onclick = () => { state.user = null; screen = "home"; save(); render(); };
  document.querySelectorAll("[data-like]").forEach(b => b.onclick = () => like(b.dataset.like));
  document.querySelectorAll("[data-pass]").forEach(b => b.onclick = () => pass(b.dataset.pass));
  document.querySelectorAll("[data-report]").forEach(b => b.onclick = () => report(b.dataset.report));
  document.querySelectorAll("[data-open]").forEach(b => b.onclick = () => { chatWith = b.dataset.open; screen = "chat"; render(); });
  const locate = document.getElementById("locate");
  if (locate) locate.onclick = () => {
    if (!navigator.geolocation) return alert("GPS is not available in this browser.");
    navigator.geolocation.getCurrentPosition(pos => {
      me().lat = pos.coords.latitude; me().lng = pos.coords.longitude;
      notify("Location updated from GPS.");
      save(); render();
    }, () => alert("Location permission denied. County centroid is still used."));
  };
  ["county", "tribe", "religion", "mode", "interest"].forEach(key => {
    const el = document.getElementById("f-" + key);
    if (el) el.onchange = () => { filters[key] = el.value; render(); };
  });
  const dist = document.getElementById("f-distance");
  if (dist) dist.onchange = () => { filters.distance = Number(dist.value); render(); };
  const min = document.getElementById("f-min"), max = document.getElementById("f-max");
  if (min) min.onchange = () => { filters.minAge = Number(min.value); render(); };
  if (max) max.onchange = () => { filters.maxAge = Number(max.value); render(); };
  const profile = document.getElementById("profile");
  if (profile) profile.onsubmit = async (e) => {
    e.preventDefault();
    const data = new FormData(profile);
    const file = data.get("photo");
    const next = { ...me(), name: data.get("name"), age: Number(data.get("age")), bio: data.get("bio"), county: data.get("county"), gender: data.get("gender"), looking: data.get("looking"), tribe: data.get("tribe"), religion: data.get("religion"), mode: data.get("mode"), interests: String(data.get("interests")).split(",").map(s => s.trim()).filter(Boolean) };
    const c = COUNTIES.find(x => x.name === next.county);
    if (c && !next.photos.length) { next.lat = c.lat; next.lng = c.lng; }
    if (file && file.size) next.photos = [await fileToData(file)];
    state.user.profile = next;
    state.accounts = state.accounts.map(a => a.email === state.user.email ? state.user : a);
    notify("Profile saved.");
    save(); alert("Profile saved on this device.");
  };
  const send = document.getElementById("send");
  if (send) send.onsubmit = (e) => {
    e.preventDefault();
    const text = new FormData(send).get("text");
    state.messages[chatWith] = state.messages[chatWith] || [];
    state.messages[chatWith].push({ from: "me", text });
    state.messages[chatWith].push({ from: "them", text: "Poa. I am around this evening if you are free for coffee." });
    notify("New reply in chat.");
    save(); render();
  };
  const mpesa = document.getElementById("mpesa");
  if (mpesa) mpesa.onsubmit = (e) => {
    e.preventDefault();
    document.getElementById("stk").textContent = "STK prompt preview sent to " + new FormData(mpesa).get("phone") + ". In production this calls Safaricom Daraja.";
  };
}
function login(email, password) {
  const account = state.accounts.find(a => a.email === email && a.password === password);
  if (!account) return alert("No match for that email and password.");
  state.user = account; screen = "discover"; save(); render();
}
function like(id) {
  const email = state.user.email;
  state.likes[email] = state.likes[email] || [];
  state.likes[email].push(id);
  const person = seed.find(p => p.id === id);
  if (["a1", "a2", "a4", "a5"].includes(id)) {
    state.matches.push({ email, ...person, distance: km(me(), person) });
    notify(`You matched with ${person.name}.`);
  } else notify(`You liked ${person.name}.`);
  save(); render();
}
function pass(id) {
  const email = state.user.email;
  state.passes[email] = state.passes[email] || [];
  state.passes[email].push(id);
  save(); render();
}
function report(id) {
  const reason = prompt("Why are you reporting this profile?", "Fake profile");
  if (!reason) return;
  state.reports.push({ by: state.user.email, target: id, reason });
  state.blocks.push(id);
  notify("Report received. Profile blocked on this device.");
  save(); render();
}
function fileToData(file) {
  return new Promise(resolve => { const r = new FileReader(); r.onload = () => resolve(r.result); r.readAsDataURL(file); });
}
render();
