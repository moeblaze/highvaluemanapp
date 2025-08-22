
(function(){
  const f = (window.CONFIG && window.CONFIG.firebase) || null;
  const looksReady = f && f.apiKey && !/YOUR_/.test(f.apiKey);
  if (!looksReady) return;
  // TODO: implement Firestore sync for readiness & streak
})();
