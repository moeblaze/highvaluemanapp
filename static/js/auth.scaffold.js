
(function(){
  const authUI = document.getElementById('authBlock');
  const btnIn = document.getElementById('btnSignIn');
  const btnOut = document.getElementById('btnSignOut');
  if (!authUI || !btnIn || !btnOut) return;
  const f = (window.CONFIG && window.CONFIG.firebase) || null;
  const looksReady = f && f.apiKey && !/YOUR_/.test(f.apiKey);
  if (!looksReady) return;
  authUI.classList.remove('hidden');
  btnIn.addEventListener('click', () => alert('Connect Firebase SDK to enable Google Sign-In.'));
  btnOut.addEventListener('click', () => alert('Connect Firebase SDK to enable Sign-Out.'));
})();
