
const truths = [
  "🚩 He makes $40K and ghosted you. It's not because he's busy — it's because he's bored.",
  "💄 Filters won’t hide entitlement. A peace provider wins over a problem starter every time.",
  "📉 Dating is a marketplace. If your demand is higher than your value, you're a meme — not a match.",
  "🍼 3 kids, 3 baby daddies, and you want a man with no kids and 6 figures? Sis, this ain't Build-A-Bear.",
  "🧠 High Value Men aren’t looking for 'a vibe' — they’re building empires, not podcasts.",
  "💬 If your personality is brunch and red flags — congratulations, you're dating yourself.",
  "📲 Texting 'hey stranger' to a man who blocked you is not manifestation. It's harassment.",
  "🏆 A man making $250K doesn’t care about your astrology sign — he wants peace, not Pluto."
];
let currentTruth = 0;
const truthBox = document.createElement('div');
truthBox.className = 'truth-pop animated fade-in';
truthBox.innerText = truths[currentTruth];
document.body.appendChild(truthBox);
function rotateTruths(){
  currentTruth = (currentTruth + 1) % truths.length;
  truthBox.classList.remove('fade-in'); truthBox.classList.add('fade-out');
  setTimeout(()=>{ truthBox.innerText = truths[currentTruth]; truthBox.classList.remove('fade-out'); truthBox.classList.add('fade-in'); }, 1000);
}
setInterval(rotateTruths, 30000);

const userTruthsDiv = document.getElementById("userTruths");
const truthForm = document.getElementById("truthForm");
const truthInput = document.getElementById("truthInput");
let userTruths = [];
truthForm.addEventListener("submit", function(e){
  e.preventDefault();
  const value = truthInput.value.trim();
  if (!value) return;
  const newTruth = { text:value, votes:0 };
  userTruths.push(newTruth);
  renderUserTruths();
  setTimeout(() => submitToGlobal(value), 0);
  truthInput.value='';
});
function renderUserTruths(){
  userTruthsDiv.innerHTML = "";
  userTruths.forEach((truth, index)=>{
    const card = document.createElement("div");
    card.className = "truth-card";
    const tags = generateHashtags(truth.text);
    card.innerHTML = `
      <p>${truth.text}</p>
      <div class="truth-actions">
        <button onclick="upvote(${index})">⬆️ ${truth.votes}</button>
        <button onclick="downloadTruth('${truth.text.replace(/'/g, "\\'")}')">📥 Share</button>
        <button id="roast-${index}">🔥 Auto-Roast</button>
        <button onclick="copyHashtags('${truth.text.replace(/'/g, "\\'")}')"># Copy Tags</button>
      </div>
      <div class="roast-line" id="roast-line-${index}"></div>
      <div class="hashtags-line">Suggested: ${tags}</div>`;
    userTruthsDiv.appendChild(card);
    const roastBtn = card.querySelector(`#roast-${index}`);
    roastBtn.addEventListener('click', async ()=>{
      roastBtn.disabled = true; roastBtn.textContent = "🔥 Roasting...";
      const roast = await aiRoast(truth.text);
      card.querySelector(`#roast-line-${index}`).textContent = roast ? `AI Roast: ${roast}` : "No roast available.";
      roastBtn.textContent = "🔥 Auto-Roast"; roastBtn.disabled = false;
    });
  });
}
function upvote(i){ userTruths[i].votes += 1; renderUserTruths(); }

function generateHashtags(text){
  const base = ["#HighValueMan","#DatingTruths","#MoeCommunityCloud","#HVMApp"];
  const t = text.toLowerCase();
  if (t.includes("ghost")) base.push("#Ghosting");
  if (t.includes("six") || t.includes("6")) base.push("#SixFigures");
  if (t.includes("kids") || t.includes("baby")) base.push("#Parenting");
  if (t.includes("money") || t.includes("salary")) base.push("#MoneyTalks");
  if (t.includes("brunch") || t.includes("vibe")) base.push("#ModernDating");
  return base.slice(0,10).join(" ");
}
function copyHashtags(text){ const tags = generateHashtags(text); navigator.clipboard.writeText(tags).then(()=>alert("Hashtags copied!")); }

let currentMemeW=1080, currentMemeH=1080;
document.querySelectorAll('.size-btn').forEach(btn=>{
  btn.addEventListener('click', ()=>{
    currentMemeW=parseInt(btn.dataset.w,10); currentMemeH=parseInt(btn.dataset.h,10);
    document.querySelectorAll('.size-btn').forEach(b=>b.classList.remove('active')); btn.classList.add('active');
  });
});
function drawPlaid(ctx,w,h){
  ctx.fillStyle="#0b0b0b"; ctx.fillRect(0,0,w,h);
  for (let x=0; x<w; x+=Math.max(60, Math.floor(w*0.06))){ ctx.fillStyle="rgba(139,0,0,0.25)"; ctx.fillRect(x,0,Math.max(30,Math.floor(w*0.03)),h); }
  for (let y=0; y<h; y+=Math.max(60, Math.floor(h*0.06))){ ctx.fillStyle="rgba(139,0,0,0.25)"; ctx.fillRect(0,y,w,Math.max(30,Math.floor(h*0.03))); }
  ctx.strokeStyle="rgba(255,215,0,0.25)"; ctx.lineWidth=1;
  for (let x=15; x<w; x+=Math.max(60, Math.floor(w*0.06))){ ctx.beginPath(); ctx.moveTo(x,0); ctx.lineTo(x,h); ctx.stroke(); }
  for (let y=15; y<h; y+=Math.max(60, Math.floor(h*0.06))){ ctx.beginPath(); ctx.moveTo(0,y); ctx.lineTo(w,y); ctx.stroke(); }
}
function wrapText(ctx, text, x, y, maxWidth, lineHeight){
  const words = text.split(' '); let line='';
  for (let n=0;n<words.length;n++){ let testLine=line+words[n]+' '; let metrics=ctx.measureText(testLine); if (metrics.width>maxWidth && n>0){ ctx.fillText(line,x,y); line=words[n]+' '; y+=lineHeight; } else { line=testLine; } }
  ctx.fillText(line, x, y);
}
function downloadTruth(text){
  const canvas=document.createElement("canvas");
  canvas.width=currentMemeW; canvas.height=currentMemeH;
  const ctx=canvas.getContext("2d");
  drawPlaid(ctx, canvas.width, canvas.height);
  ctx.strokeStyle="rgba(255,215,0,0.65)"; ctx.lineWidth=Math.max(8, canvas.width*0.0075); ctx.strokeRect(12,12,canvas.width-24,canvas.height-24);
  ctx.font=`bold ${Math.max(36, canvas.width*0.045)}px Arial`; ctx.fillStyle="gold"; ctx.shadowColor="rgba(0,0,0,0.6)"; ctx.shadowBlur=10; ctx.fillText("Dating Truth", 40, 90);
  ctx.font=`bold ${Math.max(26, canvas.width*0.03)}px Arial`; ctx.fillStyle="#f8f8f8"; wrapText(ctx, text, 40, 150, canvas.width-80, Math.max(40, canvas.height*0.04));
  const brand="Moe Community Cloud • High Value Man App"; ctx.font=`bold ${Math.max(18, canvas.width*0.022)}px Arial`; ctx.fillStyle="rgba(255,215,0,0.9)";
  const m=ctx.measureText(brand); ctx.fillText(brand, canvas.width - m.width - 40, canvas.height - 36);
  const link=document.createElement("a"); link.download="truth-card.png"; link.href=canvas.toDataURL("image/png"); link.click();
}

const autoRoastToggle = document.getElementById('autorostToggle');
async function aiRoast(text){
  if (!autoRoastToggle || !autoRoastToggle.checked) return "";
  try{
    const res = await fetch('/api/auto-roast', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ truth: text }) });
    const data = await res.json(); return data.roast || "";
  }catch(e){ return ""; }
}

async function submitToGlobal(text){
  try{
    const toggle = document.getElementById('submitGlobalToggle');
    if (!toggle || !toggle.checked) return;
    const url = (window.CONFIG && window.CONFIG.sheets && window.CONFIG.sheets.truthsWebAppUrl) || "";
    if (!url) return;
    await fetch(url, { method:"POST", headers:{ "Content-Type":"application/json" }, body: JSON.stringify({ action:"add", text }) });
  }catch(e){}
}

// ---- Paywall checks ----
function requireProOrLimit(feature, onAllowed) {
  if (HVM.entitlements.isPro()) return onAllowed();
  if (!HVM.entitlements.canUse(feature)) {
    if (window.showUpsell) showUpsell(feature); else alert("Upgrade to Pro for unlimited access.");
    return;
  }
  HVM.entitlements.record(feature);
  onAllowed();
}

const _orig_aiRoast = aiRoast;
aiRoast = async function(text){
  if (!autoRoastToggle || !autoRoastToggle.checked) return "";
  return new Promise((resolve) => {
    requireProOrLimit('roast', async () => {
      const out = await _orig_aiRoast(text);
      resolve(out);
    });
  });
}

document.querySelectorAll('.size-btn').forEach(btn => {
  btn.addEventListener('click', (e) => {
    const w = parseInt(btn.dataset.w, 10), h = parseInt(btn.dataset.h, 10);
    const isHD = !(w === 1080 && h === 1080);
    if (isHD && !HVM.entitlements.isPro()) {
      if (window.showUpsell) showUpsell("meme"); else alert("HD meme sizes are Pro only.");
      e.stopImmediatePropagation(); e.preventDefault(); return;
    }
  }, true);
});

const _orig_downloadTruth = downloadTruth;
downloadTruth = function(text){
  requireProOrLimit('meme', () => _orig_downloadTruth(text));
}
