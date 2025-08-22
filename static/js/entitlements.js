
window.HVM = window.HVM || {};
HVM.entitlements = {
  isPro() { try { return localStorage.getItem('hvm_pro') === 'true'; } catch (e) { return false; } },
  setPro(v) { try { localStorage.setItem('hvm_pro', v ? 'true' : 'false'); } catch (e) {} },
  limits: { roastsPerDay: 3, memesPerDay: 5 },
  getUsage() {
    const key = 'hvm_usage'; const today = new Date().toDateString();
    try { const raw = JSON.parse(localStorage.getItem(key) || '{}'); if (raw.day !== today) return { day: today, roasts: 0, memes: 0 }; return raw; }
    catch (e) { return { day: today, roasts: 0, memes: 0 }; }
  },
  setUsage(u) { try { localStorage.setItem('hvm_usage', JSON.stringify(u)); } catch (e) {} },
  canUse(feature) {
    if (this.isPro()) return true;
    const u = this.getUsage();
    if (feature === 'roast') return u.roasts < this.limits.roastsPerDay;
    if (feature === 'meme') return u.memes < this.limits.memesPerDay;
    return true;
  },
  record(feature) {
    if (this.isPro()) return;
    const u = this.getUsage(); const today = new Date().toDateString();
    if (u.day !== today) { u.day = today; u.roasts = 0; u.memes = 0; }
    if (feature === 'roast') u.roasts += 1; if (feature === 'meme') u.memes += 1;
    this.setUsage(u);
  }
};
