/* Nishat Tasnim Ema · portfolio interactions
   Content is rendered by Razor (Views/Home/Index.cshtml); this file adds behaviour:
   theme, filters, chart, the draggable companion and the chat (answers come from /api/assistant/ask). */
(() => {
"use strict";
const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];
const cfg = window.PORTFOLIO || { cvUrl: "/cv", askUrl: "/api/assistant/ask" };
const root = document.documentElement;
const store = { get(k){ try { return localStorage.getItem(k); } catch(e){ return null; } }, set(k,v){ try { localStorage.setItem(k,v); } catch(e){} } };

const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ---------- theme: soft crossfade ---------- */
const themeBtn = $("#theme");
function syncThemeLabel(){ themeBtn.setAttribute("aria-label", root.dataset.theme === "dark" ? "Switch to light mode" : "Switch to dark mode"); }
syncThemeLabel();
themeBtn.addEventListener("click", () => {
  const next = root.dataset.theme === "dark" ? "light" : "dark";
  const apply = () => { root.dataset.theme = next; store.set("nte-theme", next); syncThemeLabel(); };
  themeBtn.classList.remove("spin"); void themeBtn.offsetWidth; themeBtn.classList.add("spin");
  if (reduceMotion) { apply(); return; }
  if (document.startViewTransition) {
    document.startViewTransition(apply);
  } else {
    root.classList.add("theming"); apply();
    setTimeout(() => root.classList.remove("theming"), 550);
  }
});

/* ---------- navbar: soft shadow once scrolled ---------- */
const navEl = $("nav");
let navTick = false;
function onScroll(){ navTick = false; navEl.classList.toggle("scrolled", scrollY > 8); }
addEventListener("scroll", () => { if (!navTick) { navTick = true; requestAnimationFrame(onScroll); } }, { passive: true });
onScroll();

/* ---------- reveal on scroll (staggered) ---------- */
const revealIO = new IntersectionObserver(es => es.forEach(e => {
  if (!e.isIntersecting) return;
  const el = e.target; el.classList.add("in"); revealIO.unobserve(el);
  if (el.dataset.count !== undefined) countUp(el);
  const done = ev => { if (ev.target !== el || ev.propertyName !== "transform") return; el.classList.remove("reveal", "in", "from-right"); el.style.removeProperty("--d"); el.removeEventListener("transitionend", done); };
  el.addEventListener("transitionend", done);
}), { threshold: .12, rootMargin: "0px 0px -6% 0px" });
function reveal(sel, { step = 80, cls = "" } = {}){
  const groups = new Map();
  $$(sel).forEach(el => { const g = el.parentElement; if (!groups.has(g)) groups.set(g, []); groups.get(g).push(el); });
  groups.forEach(list => list.forEach((el, i) => {
    if (reduceMotion) return;
    el.classList.add("reveal"); if (cls) el.classList.add(cls);
    el.style.setProperty("--d", Math.min(i * step, 600) + "ms");
    revealIO.observe(el);
  }));
}
/* hero: staggered entrance on load */
reveal(".hero .eyebrow, .hero h1, .hero .lede, .hero .ctas, .hero .stats, .hero .tags", { step: 110 });
reveal(".hero .side > *", { step: 160, cls: "from-right" });
/* sections */
reveal(".band .num, .band h2, .band .lede, .shead .tabs, .interests, .note", { step: 70 });
reveal(".pub, .proj, .sk, .row, .tl li, .chart, .edu, .clist, .contact .ctas", { step: 90 });

/* ---------- count-up stats ---------- */
$$(".stat b").forEach(b => { b.dataset.count = b.textContent.trim(); });
function countUp(stat){
  const b = stat.querySelector ? (stat.matches(".stat b") ? stat : stat.querySelector("b")) : null;
  if (!b || b.dataset.done) return; b.dataset.done = 1;
  const raw = b.dataset.count, target = parseFloat(raw); if (isNaN(target)) return;
  const dec = (raw.split(".")[1] || "").length, t0 = performance.now(), dur = 1400;
  const step = now => { const p = Math.min(1, (now - t0) / dur), e = 1 - Math.pow(1 - p, 3); b.textContent = (target * e).toFixed(dec); if (p < 1) requestAnimationFrame(step); else b.textContent = raw; };
  requestAnimationFrame(step);
}
const statIO = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { countUp(e.target); statIO.unobserve(e.target); } }), { threshold: .5 });
$$(".stat").forEach(s => statIO.observe(s));

/* ---------- CV ---------- */
function downloadCV(){ window.location.href = cfg.cvUrl; }

/* ---------- focus picker ---------- */
$("#focusChips").addEventListener("click", e => {
  const b = e.target.closest("[data-focus]"); if (!b) return;
  if (b.classList.contains("on")) return;
  $$("#focusChips [data-focus]").forEach(x => x.classList.toggle("on", x === b));
  const cur = $("[data-focus-panel]:not([hidden])"), nxt = $(`[data-focus-panel="${b.dataset.focus}"]`);
  if (cur) { cur.classList.add("fx-out"); setTimeout(() => { cur.hidden = true; cur.classList.remove("fx-out"); }, 220); }
  setTimeout(() => { nxt.classList.add("fx-out"); nxt.hidden = false; requestAnimationFrame(() => requestAnimationFrame(() => nxt.classList.remove("fx-out"))); }, cur ? 220 : 0);
  const h = $(`[data-focus-panel="${b.dataset.focus}"] h3`); if (h) say(h.textContent + ".");
});

/* ---------- filters (fade out, reflow with FLIP, fade in) ---------- */
function flip(items, mutate){
  const first = new Map(items.filter(i => !i.hidden).map(i => [i, i.getBoundingClientRect()]));
  mutate();
  items.filter(i => !i.hidden && first.has(i)).forEach(i => {
    const a = first.get(i), b = i.getBoundingClientRect(), dx = a.left - b.left, dy = a.top - b.top;
    if (dx || dy) i.animate([{ transform: `translate(${dx}px,${dy}px)` }, { transform: "none" }], { duration: 500, easing: "cubic-bezier(.2,.8,.2,1)" });
  });
}
function filter(tabsSel, attr, itemsSel, itemAttr, all){
  const tabs = $(tabsSel); if (!tabs) return;
  let busy = null;
  tabs.addEventListener("click", e => {
    const b = e.target.closest(`[data-${attr}]`); if (!b || b.classList.contains("on")) return;
    const v = b.dataset[attr];
    tabs.querySelectorAll(`[data-${attr}]`).forEach(x => x.classList.toggle("on", x === b));
    const items = $$(itemsSel), want = it => v === all || it.dataset[itemAttr] === v;
    items.forEach(it => it.classList.remove("reveal", "in", "from-right"));
    const leaving = items.filter(it => !it.hidden && !want(it));
    const entering = items.filter(it => it.hidden && want(it));
    clearTimeout(busy);
    leaving.forEach(it => it.classList.add("fx-out"));
    busy = setTimeout(() => {
      flip(items, () => {
        leaving.forEach(it => { it.hidden = true; it.classList.remove("fx-out"); });
        entering.forEach(it => { it.classList.add("fx-out"); it.hidden = false; });
      });
      requestAnimationFrame(() => requestAnimationFrame(() => entering.forEach((it, i) => setTimeout(() => it.classList.remove("fx-out"), i * 60))));
    }, leaving.length ? 260 : 0);
  });
}
filter("#pubTabs", "pub", ".pub", "status", "all");
filter("#projTabs", "cat", ".proj", "category", "All");

/* ---------- results chart ---------- */
const plot = $("#plot"), baseline = parseFloat(plot.dataset.baseline);
function select(col){
  $$(".col").forEach(c => c.classList.toggle("sel", c === col));
  const name = col.dataset.name, acc = parseFloat(col.dataset.acc), d = acc - baseline;
  const det = $("#detail"); det.textContent = "";
  [[name.replace("Logistic Regression","Log. Regression"), "selected model"], [acc.toFixed(2) + "%", "accuracy"], [(d >= 0 ? "+" : "") + d.toFixed(2), "pts vs. logistic baseline"]]
    .forEach(([v, l]) => { const box = document.createElement("div"), b = document.createElement("b"), s = document.createElement("span"); b.textContent = v; s.textContent = l; box.append(b, s); det.append(box); });
}
select($(".col.sel") || $(".col"));
plot.addEventListener("click", e => { const c = e.target.closest(".col"); if (c) select(c); });
plot.addEventListener("keydown", e => { const c = e.target.closest(".col"); if (c && e.key === "Enter") select(c); });

const io = new IntersectionObserver(es => es.forEach(e => {
  if (!e.isIntersecting) return;
  if (e.target === plot) $$(".col i").forEach(i => i.style.height = i.dataset.h + "%");
  if (e.target.id === "progBar") e.target.style.width = e.target.dataset.w + "%";
  io.unobserve(e.target);
}), { threshold: .3 });
io.observe(plot); io.observe($("#progBar"));

/* ---------- companions ---------- */
const shared=(c,face,top)=>`<svg viewBox="0 -60 320 440" fill="none" xmlns="http://www.w3.org/2000/svg">
<defs><linearGradient id="g-shell" x1="160" y1="40" x2="160" y2="250" gradientUnits="userSpaceOnUse"><stop stop-color="${c.s1}"/><stop offset="1" stop-color="${c.s2}"/></linearGradient>
<linearGradient id="g-body" x1="160" y1="238" x2="160" y2="326" gradientUnits="userSpaceOnUse"><stop stop-color="${c.s1}"/><stop offset="1" stop-color="${c.s2}"/></linearGradient></defs>
<ellipse cx="160" cy="370" rx="58" ry="8" fill="#1C2738" fill-opacity=".1"/>
<ellipse cx="136" cy="330" rx="21" ry="12" fill="${c.limb}"/><ellipse cx="184" cy="330" rx="21" ry="12" fill="${c.limb}"/>
<g class="arm"><rect x="75" y="217" width="26" height="58" rx="13" transform="rotate(-35 88 246)" fill="${c.limb}"/><circle cx="68" cy="218" r="14" fill="${c.limb}"/>${c.hand||""}</g>
<rect x="213" y="254" width="26" height="56" rx="13" transform="rotate(-15 226 282)" fill="${c.limb}"/>
<rect x="110" y="238" width="100" height="88" rx="40" fill="url(#g-body)" stroke="${c.line}" stroke-width="2"/>
${c.belly?`<ellipse cx="160" cy="292" rx="34" ry="26" fill="${c.belly}"/>`:""}
<rect x="134" y="258" width="52" height="34" rx="10" fill="#1F2633"/>
<path d="M150 272c0-4 6-6 10 0 4-6 10-4 10 0 0 5-10 11-10 11s-10-6-10-11Z" fill="${c.screen}"/>
${top}
<ellipse cx="160" cy="142" rx="116" ry="100" fill="url(#g-shell)" stroke="${c.line}" stroke-width="2"/>
<path d="M76 92Q160 58 244 92" stroke="#fff" stroke-opacity=".75" stroke-width="4" stroke-linecap="round"/>
<circle cx="46" cy="156" r="9" fill="${c.bolt}" stroke="${c.line}" stroke-width="2"/><circle cx="274" cy="156" r="9" fill="${c.bolt}" stroke="${c.line}" stroke-width="2"/>
${face}
</svg>`;
const eyes=(xl,xr,y,r,col,hl=true)=>`<g id="eyes"><g class="blink"><circle cx="${xl}" cy="${y}" r="${r}" fill="${col}"/><circle cx="${xr}" cy="${y}" r="${r}" fill="${col}"/>${hl?`<circle cx="${xl+r*.32}" cy="${y-r*.34}" r="${r*.36}" fill="#fff"/><circle cx="${xr+r*.32}" cy="${y-r*.34}" r="${r*.36}" fill="#fff"/><circle cx="${xl-r*.35}" cy="${y+r*.4}" r="${r*.16}" fill="#fff"/><circle cx="${xr-r*.35}" cy="${y+r*.4}" r="${r*.16}" fill="#fff"/>`:""}</g></g>`;
const cheeks=(y)=>`<ellipse cx="86" cy="${y}" rx="16" ry="9" fill="#F2A3B3" fill-opacity=".55"/><ellipse cx="234" cy="${y}" rx="16" ry="9" fill="#F2A3B3" fill-opacity=".55"/>`;
const leaf=(col)=>`<rect x="157" y="10" width="6" height="40" rx="3" fill="#3A4150"/><g class="leaf"><path d="M160 -16C175 -10 179 5 160 16 141 5 145 -10 160 -16Z" fill="${col}"/><path d="M160 -11v24" stroke="#000" stroke-opacity=".15" stroke-width="1.5"/></g>`;
const C={
 panda:{name:"Bamboo",s1:"#FFFFFF",s2:"#E2E7EF",limb:"#2E3442",line:"#C5CCD8",bolt:"#E9EDF3",screen:"#E79A8E",
  top:leaf("#7DB89A")+`<circle cx="72" cy="60" r="38" fill="#2E3442"/><circle cx="72" cy="60" r="18" fill="#454C5C"/><circle cx="248" cy="60" r="38" fill="#2E3442"/><circle cx="248" cy="60" r="18" fill="#454C5C"/>`,
  face:()=>`<ellipse cx="116" cy="154" rx="36" ry="42" transform="rotate(-22 116 154)" fill="#2E3442"/><ellipse cx="204" cy="154" rx="36" ry="42" transform="rotate(22 204 154)" fill="#2E3442"/>
  <circle cx="120" cy="152" r="21" fill="#fff"/><circle cx="200" cy="152" r="21" fill="#fff"/>`+eyes(121,199,153,15,"#22293A")+cheeks(196)+
  `<path d="M150 188Q160 181 170 188 166 198 160 199 154 198 150 188Z" fill="#2E3442"/><path d="M149 207Q154.5 214 160 208 165.5 214 171 207" stroke="#2E3442" stroke-width="3.5" stroke-linecap="round"/>`},
 rabbit:{name:"Hops",s1:"#FFFFFF",s2:"#E9E3F1",limb:"#E3DCEC",line:"#CBC2D9",bolt:"#F4BACB",screen:"#9C8BD8",belly:"#FFFFFF",
  top:`<g class="ear"><rect x="88" y="-58" width="48" height="150" rx="24" transform="rotate(-10 112 80)" fill="url(#g-shell)" stroke="#CBC2D9" stroke-width="2"/><rect x="101" y="-40" width="22" height="108" rx="11" transform="rotate(-10 112 80)" fill="#F6C1CF"/></g>
  <rect x="184" y="-58" width="48" height="150" rx="24" transform="rotate(12 208 80)" fill="url(#g-shell)" stroke="#CBC2D9" stroke-width="2"/><rect x="197" y="-40" width="22" height="108" rx="11" transform="rotate(12 208 80)" fill="#F6C1CF"/>
  <circle cx="112" cy="58" r="8" fill="#9C8BD8"/><circle cx="208" cy="58" r="8" fill="#9C8BD8"/>`,
  face:()=>eyes(116,204,150,19,"#2B2940")+cheeks(190)+
  `<path d="M152 178Q160 172 168 178 165 186 160 187 155 186 152 178Z" fill="#E98AA0"/><path d="M160 187v6M148 196q6 6 12 -1q6 7 12 1" stroke="#6E6584" stroke-width="3" stroke-linecap="round"/>
  <rect x="153" y="198" width="14" height="12" rx="3.5" fill="#fff" stroke="#CBC2D9" stroke-width="1.5"/><path d="M160 198v12" stroke="#CBC2D9" stroke-width="1.5"/>
  <g stroke="#CBC2D9" stroke-width="2" stroke-linecap="round"><path d="M70 176h-24M72 188l-22 6M250 176h24M248 188l22 6"/></g>`}};
let kind=store.get("nte-companion")||"panda";if(!C[kind])kind="panda";
let eyeG=null;
function setCompanion(k){kind=k;store.set("nte-companion",k);const c=C[k];$("#art").innerHTML=shared(c,c.face(),c.top);eyeG=$("#art #eyes");
 $("#cname").textContent=c.name;$("#chname").textContent=c.name;document.querySelectorAll("#pick button").forEach(b=>{const on=b.dataset.k===k;b.classList.toggle("on",on);b.setAttribute("aria-checked",on);});}
setCompanion(kind);
$("#pick").addEventListener("click",e=>{const b=e.target.closest("[data-k]");if(b){setCompanion(b.dataset.k);say(`Hi, I'm ${C[b.dataset.k].name}! Drag me, or click me to ask about Ema's research.`);}});

/* ---------- movement ---------- */
const bot=$("#bot"),tip=$("#tip"),slot=$("#slot");
let pos={x:0,y:0},home=true,follow=false,drag=null,mouse={x:innerWidth/2,y:innerHeight/2},vx=0,tilt=0;
const W=()=>bot.offsetWidth,H=()=>bot.offsetHeight;
function homePos(){const r=slot.getBoundingClientRect();return{x:r.left+r.width/2-W()/2,y:r.top+r.height/2-H()/2};}
function clamp(){pos.x=Math.max(0,Math.min(innerWidth-W(),pos.x));pos.y=Math.max(68,Math.min(innerHeight-H(),pos.y));}
function leave(){if(home){home=false;slot.classList.add("empty");}}
function goHome(){home=true;follow=false;$("#follow").classList.remove("on");$("#follow").setAttribute("aria-pressed","false");slot.classList.remove("empty");}
bot.addEventListener("pointerdown",e=>{drag={dx:e.clientX-pos.x,dy:e.clientY-pos.y,sx:e.clientX,sy:e.clientY,m:false};bot.setPointerCapture(e.pointerId);bot.classList.add("drag");});
bot.addEventListener("pointermove",e=>{if(!drag)return;const nx=e.clientX-drag.dx;vx=nx-pos.x;if(Math.hypot(e.clientX-drag.sx,e.clientY-drag.sy)>5){drag.m=true;leave();}pos.x=nx;pos.y=e.clientY-drag.dy;clamp();});
bot.addEventListener("pointerup",()=>{const m=drag&&drag.m;drag=null;bot.classList.remove("drag");if(!m)toggleChat(true);else say("Nice spot. Click me any time to ask about Ema's work.");});
bot.addEventListener("keydown",e=>{if(e.key==="Enter"||e.key===" "){e.preventDefault();toggleChat(true);}});
addEventListener("pointermove",e=>{mouse.x=e.clientX;mouse.y=e.clientY;});
slot.addEventListener("click",goHome);
function tick(t){
 if(!drag){if(home){const h=homePos();pos.x+=(h.x-pos.x)*.2;pos.y+=(h.y-pos.y)*.2;}
  else if(follow){const tx=mouse.x+30,ty=mouse.y-H()-6;vx=(tx-pos.x)*.06;pos.x+=vx;pos.y+=(ty-pos.y)*.06;clamp();}
  else{pos.x+=Math.sin(t/1800)*.2;clamp();}}
 tilt+=(Math.max(-8,Math.min(8,vx*.6))-tilt)*.12;if(!drag&&!follow)vx*=.9;
 bot.style.transform=`translate(${pos.x}px,${pos.y}px) rotate(${tilt}deg)`;
 const r=bot.getBoundingClientRect(),cx=r.left+r.width/2,cy=r.top+r.height*.45,a=Math.atan2(mouse.y-cy,mouse.x-cx),d=Math.min(5,Math.hypot(mouse.x-cx,mouse.y-cy)/50);
 if(eyeG)eyeG.setAttribute("transform",`translate(${(Math.cos(a)*d).toFixed(1)} ${(Math.sin(a)*d).toFixed(1)})`);
 if(tip.classList.contains("show")){let tx=r.right-16,ty=r.top-tip.offsetHeight+16;if(tx+tip.offsetWidth>innerWidth-10)tx=r.left-tip.offsetWidth+16;tip.style.left=Math.max(10,tx)+"px";tip.style.top=Math.max(74,ty)+"px";}
 requestAnimationFrame(tick);}
pos=homePos();requestAnimationFrame(tick);
addEventListener("scroll",()=>{if(home){const h=homePos();if(h.y+H()<68||h.y>innerHeight){leave();pos.x=innerWidth-W()-20;pos.y=innerHeight-H()-20;say("I'll come along while you scroll.");}}},{passive:true});
let tt;function say(s,ms=4000){tip.textContent=s;tip.classList.add("show");clearTimeout(tt);tt=setTimeout(()=>tip.classList.remove("show"),ms);}
const lines={research:"Three studies: one accepted, one in revision, one ongoing.",results:"Click a bar to compare a model with the baseline.",projects:"Filter projects by ML, Web, Graphics or Desktop.",skills:"Python and R are Ema's everyday tools.",journey:"80% of the degree done, and a thesis is next.",contact:"Want to collaborate? Details are here."};
const seen=new Set();const sio=new IntersectionObserver(es=>es.forEach(e=>{const id=e.target.id;if(!e.isIntersecting)return;document.querySelectorAll(".links a").forEach(a=>a.classList.toggle("on",a.getAttribute("href")==="#"+id));if(!seen.has(id)){seen.add(id);say(lines[id]);}}),{threshold:.3});
Object.keys(lines).forEach(id=>sio.observe(document.getElementById(id)));


/* ---------- chat (server-side answers) ---------- */
const log = $("#log");
function add(t, w){ const d = document.createElement("div"); d.className = "msg " + w; d.textContent = t; log.appendChild(d); log.scrollTop = log.scrollHeight; return d; }
async function ask(q){
  if (!q || !q.trim()) return;
  toggleChat(true); add(q, "u");
  const d = add("", "b"); d.innerHTML = '<span class="typing"><i></i><i></i><i></i></span>';
  try {
    const res = await fetch(cfg.askUrl, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ question: q, companion: C[kind].name }) });
    if (!res.ok) throw new Error(res.status);
    const data = await res.json();
    d.textContent = data.answer;
    if (data.action === "download-cv") setTimeout(downloadCV, 400);
  } catch (err) {
    d.textContent = "Sorry, I couldn't reach my notes just now. Please try again in a moment.";
  }
  log.scrollTop = log.scrollHeight;
}
$("#sugs").addEventListener("click", e => { const b = e.target.closest(".chip"); if (b) ask(b.textContent); });
$("#ask").addEventListener("submit", e => { e.preventDefault(); ask($("#q").value); $("#q").value = ""; });
let greeted = false;
function toggleChat(o){
  $("#chat").classList.toggle("open", o);
  if (o && !greeted) { greeted = true; add(`Hi, I'm ${C[kind].name}. I know everything in Ema's CV. Pick a question or type your own.`, "b"); }
  if (o) setTimeout(() => $("#q").focus(), 50);
}
$("#askBtn").addEventListener("click", () => toggleChat(!$("#chat").classList.contains("open")));
$("#close").addEventListener("click", () => toggleChat(false));
$("#home").addEventListener("click", () => { goHome(); scrollTo({ top: 0 }); });
$("#follow").addEventListener("click", e => { follow = !follow; if (follow) { leave(); say("Following you. Press ⌖ again to stop."); } e.currentTarget.classList.toggle("on", follow); e.currentTarget.setAttribute("aria-pressed", follow); });
document.addEventListener("click", e => { const b = e.target.closest("[data-ask]"); if (b) ask(b.dataset.ask); });
addEventListener("keydown", e => { if (e.key === "Escape") toggleChat(false); });
setTimeout(() => say(`Hi, I'm ${C[kind].name}. Pick Panda or Rabbit above, drag me around, or click me to chat.`), 900);
})();
