
(function(){
  function qs(id){ return document.getElementById(id); }
  function isPro(){ return window.HVM && HVM.entitlements && HVM.entitlements.isPro(); }

  function updateProUI(){
    const badge = qs('proBadge');
    const upgradeBtn = document.getElementById('btnCheckout');
    const ad = document.getElementById('adBanner');
    if (isPro()){
      if (badge) badge.classList.remove('hidden');
      if (upgradeBtn){ upgradeBtn.textContent="You're Pro ✓"; upgradeBtn.disabled=true; upgradeBtn.classList.add('disabled'); }
      if (ad) ad.style.display='none';
    } else {
      if (badge) badge.classList.add('hidden');
      if (upgradeBtn){ upgradeBtn.textContent="Upgrade"; upgradeBtn.disabled=false; upgradeBtn.classList.remove('disabled'); }
    }
    markProLocks();
  }

  function markProLocks(){
    const sizeBtns = document.querySelectorAll('.size-btn');
    sizeBtns.forEach(btn=>{
      const w=parseInt(btn.dataset.w,10), h=parseInt(btn.dataset.h,10);
      const isHD = !(w===1080 && h===1080);
      if (isHD && !isPro()){
        btn.classList.add('locked');
        btn.setAttribute('title','Pro feature');
      } else {
        btn.classList.remove('locked');
        btn.removeAttribute('title');
      }
    });
  }

  function getUsage(){ return HVM.entitlements.getUsage(); }
  function updateUsageUI(){
    const pillR = qs('roastUsage');
    const pillM = qs('memeUsage');
    if (!pillR || !pillM) return;
    const u = getUsage(); const lim = HVM.entitlements.limits;
    pillR.textContent = `${Math.max(0, lim.roastsPerDay - u.roasts)}/${lim.roastsPerDay}`;
    pillM.textContent = `${Math.max(0, lim.memesPerDay - u.memes)}/${lim.memesPerDay}`;
    if (isPro()){
      pillR.textContent = '∞'; pillM.textContent = '∞';
      pillR.classList.add('pro'); pillM.classList.add('pro');
    } else {
      pillR.classList.remove('pro'); pillM.classList.remove('pro');
    }
    updateStickyBar();
  }

  window.showUpsell = function(feature){
    const modal = qs('upsellModal');
    if (!modal) return alert("Upgrade to Pro to use this feature.");
    const title = qs('upsellTitle');
    const desc = qs('upsellDesc');
    title.textContent = feature === 'roast' ? 'Unlock Unlimited Roasts' : 'Unlock HD Meme Exports';
    desc.textContent = feature === 'roast' ? 'Get unlimited AI auto-roasts with no daily caps.' : 'Export 9:16 and 16:9 templates in HD quality.';
    modal.classList.add('open');
    const stickyUp = document.getElementById('stickyUpgrade');
    if (stickyUp) { stickyUp.classList.add('pulse'); setTimeout(()=> stickyUp.classList.remove('pulse'), 6000); }
  };
  window.closeUpsell = function(){ const modal = qs('upsellModal'); if (modal) modal.classList.remove('open'); };

  function initModal(){
    const btn = document.getElementById('btnCheckout');
    const upgrade2 = qs('modalUpgradeBtn');
    const close = qs('upsellClose');
    if (upgrade2 && btn){ upgrade2.addEventListener('click', ()=> btn.click()); }
    if (close){ close.addEventListener('click', ()=> window.closeUpsell()); }
    const overlay = qs('upsellModal');
    if (overlay){ overlay.addEventListener('click', (e)=> { if (e.target === overlay) window.closeUpsell(); }); }
  }

  function isDismissedToday(){ try { return localStorage.getItem('hvm_sticky_dismiss_day') === new Date().toDateString(); } catch(e){ return false; } }
  function setDismissedToday(){ try { localStorage.setItem('hvm_sticky_dismiss_day', new Date().toDateString()); } catch(e){} }

  function updateStickyBar(){
    const bar = document.getElementById('stickyCta');
    const rEl = document.getElementById('stickyRoasts');
    const mEl = document.getElementById('stickyMemes');
    const up = document.getElementById('stickyUpgrade');
    if (!bar) return;
    if (isPro() || isDismissedToday()){ bar.classList.add('hidden'); document.body.classList.add('sticky-off'); return; } else { bar.classList.remove('hidden'); document.body.classList.remove('sticky-off'); }
    const lim = HVM.entitlements.limits;
    const u = HVM.entitlements.getUsage();
    if (rEl) rEl.textContent = Math.max(0, lim.roastsPerDay - (u.roasts||0));
    if (mEl) mEl.textContent = Math.max(0, lim.memesPerDay - (u.memes||0));
    if (up){
      up.onclick = () => {
        if (window.showUpsell) { showUpsell('roast'); return; }
        const btn = document.getElementById('btnCheckout'); if (btn) btn.click();
      };
    }
    const dis = document.getElementById('stickyDismiss');
    if (dis){ dis.onclick = ()=> { setDismissedToday(); const barEl = document.getElementById('stickyCta'); if (barEl) { barEl.classList.add('hidden'); } document.body.classList.add('sticky-off'); }; }
  }

  function init(){
    updateProUI(); updateUsageUI(); initModal();
    setInterval(updateUsageUI, 2000);
  }
  window.addEventListener('load', init);
})();
