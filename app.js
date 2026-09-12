const COUNTIES = ["Nairobi","Mombasa","Kisumu","Kiambu","Nakuru","Uasin Gishu","Kisii","Machakos","Kajiado","Nyeri","Meru","Kakamega","Kilifi","Garissa","Eldoret","Thika"];
const SEED = [
  { id: "p1", name: "Amina", age: 26, county: "Nairobi", tribe: "Swahili", religion: "Muslim", mode: "Professional", bio: "Product designer in Westlands. Sundays at Uhuru Park, strong chai, no games.", interests: ["Design","Hiking","Afrobeats"], dist: 4, photo: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&w=800&q=80" },
  { id: "p2", name: "Brian", age: 29, county: "Kiambu", tribe: "Kikuyu", religion: "Christian", mode: "Church", bio: "Software engineer who still goes home for tea. Looking for someone kind and curious.", interests: ["Tech","Football","Church"], dist: 12, photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80" },
  { id: "p3", name: "Wanjiku", age: 24, county: "Nairobi", tribe: "Kikuyu", religion: "Christian", mode: "Student", bio: "UoN student. Poetry nights in Kilimani and roadside mutura runs.", interests: ["Poetry","Campus","Food"], dist: 3, photo: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=800&q=80" },
  { id: "p4", name: "Otieno", age: 31, county: "Kisumu", tribe: "Luo", religion: "Christian", mode: "Professional", bio: "Lakeside soul. Fish, sunsets, and a good debate.", interests: ["Travel","Music","Lake"], dist: 280, photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=800&q=80" },
  { id: "p5", name: "Faith", age: 27, county: "Nakuru", tribe: "Kalenjin", religion: "Christian", mode: "Church", bio: "Nurse who runs at dawn. Looking for someone who laughs easily.", interests: ["Running","Faith","Nature"], dist: 155, photo: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=800&q=80" },
  { id: "p6", name: "Hassan", age: 28, county: "Mombasa", tribe: "Swahili", religion: "Muslim", mode: "Professional", bio: "Old Town evenings and dhow rides. I cook pilau better than your auntie.", interests: ["Coast","Cooking","Swahili"], dist: 440, photo: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=800&q=80" }
];
const store = {
  get(k, d) { try { return JSON.parse(localStorage.getItem(k)) ?? d; } catch { return d; } },
  set(k, v) { localStorage.setItem(k, JSON.stringify(v)); }
};
const state = {
  view: "home",
  user: store.get("karibu_user", null),
  likes: store.get("karibu_likes", []),
  passes: store.get("karibu_passes", []),
  matches: store.get("karibu_matches", []),
  chats: store.get("karibu_chats", {}),
  reports: store.get("karibu_reports", []),
  filter: { county: "All", mode: "All", maxDist: 500, q: "" },
  activeChat: null,
  toast: null,
  loc: store.get("karibu_loc", null)
};
function save() {
  store.set("karibu_user", state.user);
  store.set("karibu_likes", state.likes);
  store.set("karibu_passes", state.passes);
  store.set("karibu_matches", state.matches);
  store.set("karibu_chats", state.chats);
  store.set("karibu_reports", state.reports);
  store.set("karibu_loc", state.loc);
}
function toast(msg) {
  state.toast = msg; render();
  setTimeout(() => { state.toast = null; render(); }, 2200);
}
function filteredPeople() {
  return SEED.filter(p => {
    if (state.passes.includes(p.id)) return false;
    if (state.filter.county !== "All" && p.county !== state.filter.county) return false;
    if (state.filter.mode !== "All" && p.mode !== state.filter.mode) return false;
    if (p.dist > Number(state.filter.maxDist)) return false;
    if (state.filter.q) {
      const hay = (p.name + " " + p.bio + " " + p.interests.join(" ") + " " + p.tribe).toLowerCase();
      if (!hay.includes(state.filter.q.toLowerCase())) return false;
    }
    return true;
  });
}
function like(id) {
  if (!state.likes.includes(id)) state.likes.push(id);
  if (!state.matches.includes(id)) state.matches.push(id);
  if (!state.chats[id]) state.chats[id] = [{ from: "them", text: "Karibu! Nice to match with you." }];
  save(); toast("It's a match — you can chat now.");
  state.view = "chat"; state.activeChat = id; render();
}
function pass(id) {
  if (!state.passes.includes(id)) state.passes.push(id);
  save(); render();
}
function report(id) {
  const reason = prompt("Why are you reporting this profile?");
  if (!reason) return;
  state.reports.push({ id, reason, at: new Date().toISOString() });
  pass(id);
  toast("Report saved. Thanks for keeping Karibu safer.");
}
function requestLocation() {
  if (!navigator.geolocation) { toast("Geolocation not supported. Pick a county instead."); return; }
  navigator.geolocation.getCurrentPosition(
    pos => { state.loc = { lat: pos.coords.latitude, lng: pos.coords.longitude, at: Date.now() }; save(); toast("Location saved."); },
    () => toast("Location permission denied. County filter still works.")
  );
}
function signup(e) {
  e.preventDefault();
  const f = new FormData(e.target);
  state.user = {
    name: f.get("name"), age: Number(f.get("age")), county: f.get("county"),
    tribe: f.get("tribe"), religion: f.get("religion"), mode: f.get("mode"),
    bio: f.get("bio"),
    interests: String(f.get("interests") || "").split(",").map(s => s.trim()).filter(Boolean)
  };
  save(); state.view = "discover"; toast("Profile ready. Karibu!"); render();
}
function sendChat(e) {
  e.preventDefault();
  const id = state.activeChat;
  const text = e.target.msg.value.trim();
  if (!id || !text) return;
  state.chats[id] = state.chats[id] || [];
  state.chats[id].push({ from: "me", text });
  e.target.reset(); save(); render();
}
function personCard(p) {
  return '<article class="person"><img src="'+p.photo+'" alt="'+p.name+'" /><div class="body"><strong>'+p.name+', '+p.age+'</strong><div><span class="badge">'+p.county+'</span> <span class="badge">'+p.mode+'</span> · '+p.dist+' km</div><p>'+p.bio+'</p><small>'+p.interests.join(' · ')+' · '+p.tribe+' · '+p.religion+'</small><div class="actions"><button onclick="pass(\''+p.id+'\')">Pass</button><button class="like" onclick="like(\''+p.id+'\')">Like</button><button onclick="report(\''+p.id+'\')">Report</button></div></div></article>';
}
function viewHome() {
  const featured = SEED[0];
  return '<section class="hero"><div><div class="kicker">Location-based matchmaking · Kenya</div><h1>Meet someone near you — Nairobi to Mombasa, campus to church.</h1><p>Karibu KE helps Kenyans connect by county, distance, interests, tribe, faith, and lifestyle mode. This demo runs in your browser.</p><div class="cta-row"><button class="primary" onclick="state.view=\'signup\';render()">Create profile</button><button class="ghost" onclick="state.view=\'discover\';render()">Browse nearby</button><button class="ghost" onclick="requestLocation()">Enable location</button></div></div><div class="phone"><div class="card-stack"><div class="swipe-card"><img src="'+featured.photo+'" alt="" /><div class="swipe-meta"><span class="pill">'+featured.county+'</span><span class="pill">'+featured.dist+' km</span><h3>'+featured.name+', '+featured.age+'</h3><p>'+featured.bio+'</p></div></div></div></div></section><div class="grid-3"><div class="feature"><h3>County + GPS</h3><p>Filter Nairobi, Kisumu, Kiambu or use device location.</p></div><div class="feature"><h3>Modes</h3><p>Student, professional, or church mode.</p></div><div class="feature"><h3>Safety first</h3><p>Report profiles and meet in public places.</p></div></div>';
}
function viewSignup() {
  const u = state.user || {};
  const opts = COUNTIES.map(c => '<option'+(u.county===c?' selected':'')+'>'+c+'</option>').join('');
  const modes = ['Student','Professional','Church'].map(m => '<option'+(u.mode===m?' selected':'')+'>'+m+'</option>').join('');
  return '<section class="panel"><h2>Your profile</h2><p style="color:var(--muted);margin-bottom:14px">Demo accounts live only on this device.</p><form class="form" onsubmit="signup(event)"><div class="two"><div><label>Name</label><input name="name" required value="'+(u.name||'')+'" /></div><div><label>Age</label><input name="age" type="number" min="18" required value="'+(u.age||'')+'" /></div></div><div class="two"><div><label>County</label><select name="county">'+opts+'</select></div><div><label>Mode</label><select name="mode">'+modes+'</select></div></div><div class="two"><div><label>Tribe / community</label><input name="tribe" value="'+(u.tribe||'')+'" /></div><div><label>Religion</label><input name="religion" value="'+(u.religion||'')+'" /></div></div><div><label>Bio</label><textarea name="bio" rows="3" required>'+(u.bio||'')+'</textarea></div><div><label>Interests (comma separated)</label><input name="interests" value="'+((u.interests||[]).join(', '))+'" /></div><button class="primary" type="submit">Save and start matching</button></form></section>';
}
function viewDiscover() {
  const people = filteredPeople();
  const loc = state.loc ? ('GPS saved ('+state.loc.lat.toFixed(3)+', '+state.loc.lng.toFixed(3)+'). ') : 'Enable location for GPS. ';
  const counties = COUNTIES.map(c => '<option'+(state.filter.county===c?' selected':'')+'>'+c+'</option>').join('');
  const modes = ['All','Student','Professional','Church'].map(m => '<option'+(state.filter.mode===m?' selected':'')+'>'+m+'</option>').join('');
  return '<h2>People nearby</h2><p style="color:var(--muted)">'+loc+'Like someone to open chat.</p><div class="filters"><select onchange="state.filter.county=this.value;render()"><option>All</option>'+counties+'</select><select onchange="state.filter.mode=this.value;render()">'+modes+'</select><input type="number" value="'+state.filter.maxDist+'" onchange="state.filter.maxDist=this.value;render()" /><input placeholder="Search interests" value="'+state.filter.q+'" oninput="state.filter.q=this.value;render()" /></div><div class="profiles">'+(people.map(personCard).join('') || '<p>No one in these filters.</p>')+'</div>';
}
function viewMatches() {
  const list = SEED.filter(p => state.matches.includes(p.id));
  return '<h2>Matches</h2><div class="profiles">'+(list.map(personCard).join('') || '<p>No matches yet.</p>')+'</div>';
}
function viewChat() {
  const list = SEED.filter(p => state.matches.includes(p.id));
  const active = SEED.find(p => p.id === state.activeChat) || list[0];
  if (active && state.activeChat !== active.id) state.activeChat = active.id;
  const msgs = (active && state.chats[active.id]) || [];
  const threads = list.map(p => '<div class="thread '+(p.id===state.activeChat?'on':'')+'" onclick="state.activeChat=\''+p.id+'\';render()"><strong>'+p.name+'</strong><div style="color:var(--muted);font-size:.85rem">'+p.county+'</div></div>').join('') || '<p>Match someone first.</p>';
  const bubbles = msgs.map(m => '<div class="bubble '+(m.from==='me'?'me':'')+'">'+m.text+'</div>').join('');
  const pane = active ? ('<strong>'+active.name+'</strong><div class="messages">'+bubbles+'</div><form class="form" onsubmit="sendChat(event)" style="grid-template-columns:1fr auto;display:grid;gap:8px"><input name="msg" required placeholder="Andika ujumbe" /><button class="primary" type="submit">Send</button></form>') : '<p>No conversation selected.</p>';
  return '<h2>Chat</h2><div class="chat-wrap"><div>'+threads+'</div><div class="panel">'+pane+'</div></div>';
}
function viewSafety() {
  return '<section class="panel"><h2>Safety and reports</h2><ul><li>Meet in public first.</li><li>Never send M-Pesa to someone you have not met for verification.</li><li>Report harassment, fake photos, or underage profiles immediately.</li></ul><p style="margin-top:12px">Reports on this device: '+state.reports.length+'</p><p style="color:var(--muted);margin-top:18px">Premium roadmap: boosts, see who liked you, M-Pesa. Not charged in this demo.</p></section>';
}
function render() {
  const authed = !!state.user;
  document.getElementById('app').innerHTML = '<div class="app-shell"><header class="topbar"><div class="brand">Karibu <span>KE</span></div><nav class="nav"><button class="'+(state.view==='home'?'active':'')+'" onclick="state.view=\'home\';render()">Home</button><button class="'+(state.view==='discover'?'active':'')+'" onclick="state.view=\'discover\';render()">Discover</button><button class="'+(state.view==='signup'?'active':'')+'" onclick="state.view=\'signup\';render()">'+(authed?'Profile':'Join')+'</button><button class="'+(state.view==='matches'?'active':'')+'" onclick="state.view=\'matches\';render()">Matches</button><button class="'+(state.view==='chat'?'active':'')+'" onclick="state.view=\'chat\';render()">Chat</button><button class="'+(state.view==='safety'?'active':'')+'" onclick="state.view=\'safety\';render()">Safety</button></nav></header>'+(state.view==='home'?viewHome():'')+(state.view==='signup'?viewSignup():'')+(state.view==='discover'?viewDiscover():'')+(state.view==='matches'?viewMatches():'')+(state.view==='chat'?viewChat():'')+(state.view==='safety'?viewSafety():'')+'</div>'+(state.toast?'<div class="toast">'+state.toast+'</div>':'');
}
render();
