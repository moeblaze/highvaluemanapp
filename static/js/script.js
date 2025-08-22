
const stateAdjustments = {
  "New York": 1.5, "California": 1.45, "Texas": 1.0, "Florida": 1.0,
  "South Carolina": 0.75, "Georgia": 0.85, "Illinois": 1.1, "Nevada": 1.05,
  "North Carolina": 0.9, "Tennessee": 0.8, "Mississippi": 0.7, "Alabama": 0.72,
  "Wyoming": 0.88, "Montana": 0.85, "Colorado": 1.2
};
function adjustForState(amount, state) { const factor = stateAdjustments[state] || 1.0; return amount / factor; }

document.getElementById("assessmentForm").addEventListener("submit", async function(e) {
  e.preventDefault();
  const form = e.target;
  const ambition = parseInt(form.ambition.value);
  const discipline = parseInt(form.discipline.value);
  const purpose = parseInt(form.purpose.value);
  const finance = parseFloat(form.finance.value);
  const state = form.state.value;
  const health = parseInt(form.health.value);
  const looks = parseInt(form.looks.value);
  const charisma = parseInt(form.charisma.value);
  const leadership = parseInt(form.leadership.value);
  const children = parseInt(form.children.value);
  const babyDaddies = parseInt(form.babyDaddies.value);
  const desiredSalary = parseFloat(form.desiredSalary.value);

  const adjustedFinance = adjustForState(finance, state);
  const mindsetScore = (ambition + discipline + purpose) / 3;
  const imageScore = (health + looks + charisma + leadership) / 4;
  let hvScore = (mindsetScore * 0.6 + imageScore * 0.4);
  let penalty = (children * 0.25) + (babyDaddies * 0.5);
  hvScore = Math.max(0, (hvScore - penalty));
  const hvDisp = hvScore.toFixed(1);

  let result = `🧠 Mindset Score: ${mindsetScore.toFixed(1)}\n💪 Image & Influence Score: ${imageScore.toFixed(1)}\n`;

  if (hvScore >= 8.5) { result += "✅ Elite Tier High Value Man — you command the room and the market.\n"; }
  else if (hvScore >= 7) { result += "🟡 Solid High Value Prospect — refine your health, leadership or purpose.\n"; }
  else { result += "🔴 Below HVM status — strong potential if you're willing to level up on all fronts.\n"; }

  const realismRatio = hvScore / (desiredSalary / 100000);
  if (realismRatio >= 1.0) {
    result += `🎯 Realistic Expectation: You could qualify for a man earning around $${desiredSalary.toFixed(0)} or more.\n`;
  } else if (realismRatio >= 0.75) {
    result += `⚠️ Borderline: A man earning $${desiredSalary.toFixed(0)} may consider you, but competition is fierce.\n`;
  } else {
    const realisticRange = (hvScore * 12500) + 30000;
    result += `🚫 Unrealistic: You're aiming high, but realistically could attract someone around $${realisticRange.toFixed(0)}.\n`;
  }

  const resBox = document.getElementById("result");
  resBox.innerText = result;

  const harsh = harshLineForScore(hvScore);
  const harshEl = document.createElement('div');
  harshEl.className = 'harsh-line';
  harshEl.textContent = harsh;
  resBox.appendChild(harshEl);

  const cards = buildPipeline({mindsetScore, imageScore, ambition, discipline, purpose, health, looks, charisma, leadership});
  renderPipeline(cards);

  showReadiness(hvScore);
  initStreakWidget();
  initWeeklyPlan();

  // INLINE_UPSELL_START
  if (result.includes("🚫 Unrealistic")) {
    const ups = document.createElement('div');
    ups.className = 'inline-upsell';
    ups.innerHTML = `
      <div class="inline-upsell-head">Boost your score faster</div>
      <div class="inline-upsell-body">Go <strong>Pro</strong> for unlimited AI roasts and HD meme exports. Share truth cards, learn faster, level up.</div>
      <div class="inline-upsell-cta">
        <button class="submit-button" id="inlineUpsellBtn">Upgrade to Pro</button>
      </div>
    `;
    resBox.appendChild(ups);
    const btn = ups.querySelector("#inlineUpsellBtn");
    if (btn) btn.addEventListener("click", ()=>{
      if (window.showUpsell) showUpsell("roast"); else {
        const b = document.getElementById("btnCheckout"); if (b) b.click();
      }
    });
    // PULSE_ON_UNREALISTIC: nudge sticky Upgrade CTA
    (function(){
      const up = document.getElementById('stickyUpgrade');
      if (up) { up.classList.add('pulse'); setTimeout(()=> up.classList.remove('pulse'), 6000); }
    })();
    // brief attention pulse on inline upsell button
    if (btn) {
      btn.classList.add('pulse');
      setTimeout(()=> btn.classList.remove('pulse'), 6000);
      let clicked=false; btn.addEventListener("click", ()=> { clicked=true; }, { once:true });
      setTimeout(()=>{ if(!clicked && document.body.contains(ups)) { btn.classList.add("pulse"); setTimeout(()=> btn.classList.remove("pulse"), 6000); } }, 12000);
    }
  }
  // INLINE_UPSELL_END
});

function harshLineForScore(hvScore) {
  const harshSetHigh = [
    "You’re close — stop playing small and finish the job.",
    "Almost there. Tighten discipline and lead like you mean it."
  ];
  const harshSetMid = [
    "Hell no you don’t qualify… yet. Fix your daily habits and stop lying to yourself.",
    "Are you out of your bucking mind? You want premium but put in budget effort."
  ];
  const harshSetLow = [
    "Absolutely not. You’re trying to withdraw from a bank you never deposit into.",
    "This isn’t Build‑A‑Man. Become peace, purpose, and presence first."
  ];
  if (hvScore >= 8.5) return harshSetHigh[Math.floor(Math.random()*harshSetHigh.length)];
  if (hvScore >= 6.5) return harshSetMid[Math.floor(Math.random()*harshSetMid.length)];
  return harshSetLow[Math.floor(Math.random()*harshSetLow.length)];
}

function buildPipeline({mindsetScore, imageScore, ambition, discipline, purpose, health, looks, charisma, leadership}) {
  const cards = [];
  if (mindsetScore < 7) {
    cards.push({ title:"Mindset & Discipline", badge:"Core Fix", tips:[
      "Do a 21‑day discipline streak: wake time, workout, work block — no excuses.",
      "Define purpose in one sentence; review it every morning.",
      "Cut dopamine traps (doomscrolling, late nights) for 14 days."
    ]});
  }
  if (health < 7 || looks < 7) {
    cards.push({ title:"Health & Looks Upgrade", badge:"High Impact", tips:[
      "Lift 3x/week + 8k steps/day — track it.",
      "Grooming kit: haircut schedule, skincare, nails — weekly.",
      "Fit wardrobe: 3 go‑to outfits that actually fit."
    ]});
  }
  if (charisma < 7 || leadership < 7) {
    cards.push({ title:"Charisma & Leadership", badge:"Influence", tips:[
      "Speak with pauses. Eye contact. No fillers for a week.",
      "Lead small: plan a group event; own logistics and decisions.",
      "Stop oversharing online; build mystery, not noise."
    ]});
  }
  if (discipline < 7) {
    cards.push({ title:"Daily Systems", badge:"Non‑Negotiables", tips:[
      "Block your day: Deep work 90m, break 15m — repeat.",
      "Sunday reset: plan workouts, meals, and top 3 goals.",
      "Track habits (don’t trust memory)."
    ]});
  }
  if (purpose < 7) {
    cards.push({ title:"Purpose Alignment", badge:"North Star", tips:[
      "Write your ‘Why’ then match actions to it daily.",
      "Remove one time‑waster that doesn’t serve your mission.",
      "Find a mentor or community that holds you accountable."
    ]});
  }
  if (!cards.length) {
    cards.push({ title:"Refinement Mode", badge:"Polish", tips:[
      "Level up storytelling — be concise, vivid, real.",
      "Add one elite habit (reading, language, instrument).",
      "Teach something weekly. Leaders teach."
    ]});
  }
  return cards;
}

function renderPipeline(cards) {
  const section = document.getElementById('pipelineSection');
  const grid = document.getElementById('pipelineCards');
  grid.innerHTML = '';
  cards.forEach(c => {
    const el = document.createElement('div');
    el.className = 'pipeline-card fade-in-up';
    el.innerHTML = `<span class="badge">${c.badge}</span><h3>${c.title}</h3><ul>${c.tips.map(t=>`<li>${t}</li>`).join('')}</ul>`;
    grid.appendChild(el);
  });
  section.classList.remove('hidden');
}

function showReadiness(hvScore) {
  const pct = Math.max(0, Math.min(100, parseFloat(hvScore) * 10));
  const bar = document.getElementById('readinessBar');
  const wrap = document.getElementById('readinessSection');
  const label = document.getElementById('readinessPercent');
  const ring = document.getElementById('readinessRing');
  if (bar && label && wrap) {
    bar.style.width = pct + '%';
    label.textContent = Math.round(pct) + '%';
    wrap.classList.remove('hidden');
    if (ring) {
      const circumference = 2 * Math.PI * 35;
      const offset = circumference - (circumference * pct / 100);
      ring.style.strokeDasharray = circumference;
      ring.style.strokeDashoffset = offset;
    }
  }
}

function loadStreak() {
  const data = JSON.parse(localStorage.getItem('hvm_streak') || '{}');
  const today = new Date().toDateString();
  if (!data.current) data.current = 0; if (!data.best) data.best = 0; if (!data.last) data.last = "";
  return { ...data, today };
}
function saveStreak(data){ localStorage.setItem('hvm_streak', JSON.stringify(data)); }
function initStreakWidget(){
  const widget = document.getElementById('streakWidget'); if (!widget) return;
  const s = loadStreak();
  document.getElementById('streakCurrent').textContent = s.current;
  document.getElementById('streakBest').textContent = s.best;
  widget.classList.remove('hidden');
  const btn = document.getElementById('streakCheckin');
  btn.addEventListener('click', () => {
    const s2 = loadStreak();
    if (s2.last !== s2.today) {
      s2.current += 1; s2.best = Math.max(s2.best, s2.current); s2.last = s2.today;
      saveStreak(s2);
      document.getElementById('streakCurrent').textContent = s2.current;
      document.getElementById('streakBest').textContent = s2.best;
    } else { alert("Already checked in today. Come back tomorrow."); }
  });
}

function initWeeklyPlan(){
  const form = document.getElementById('weeklyForm');
  const msg = document.getElementById('weeklyMsg');
  const section = document.getElementById('weeklyPlan');
  if (!form || !msg || !section) return;
  section.classList.remove('hidden');
  form.addEventListener('submit', async (e)=>{
    e.preventDefault();
    const email = (document.getElementById('weeklyEmail').value || '').trim();
    msg.textContent = "Submitting...";
    try{
      let ok = false;
      const url = (window.CONFIG && window.CONFIG.sheets && window.CONFIG.sheets.webAppUrl) || '';
      if (url){
        const r = await fetch(url, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ email }) });
        ok = r.ok;
      }
      msg.textContent = ok ? 'Subscribed! Weekly plan will hit your inbox every Monday.' : 'Saved locally. Connect Sheets to enable email.';
    }catch(err){ msg.textContent = "Subscription failed. Try again later."; }
  });
}
