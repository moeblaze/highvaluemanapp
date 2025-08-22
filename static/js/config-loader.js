
window.CONFIG = window.CONFIG || {};
(async () => {
  try {
    const res = await fetch('/config.json', { cache: 'no-store' });
    if (res.ok) {
      const cfg = await res.json();
      window.CONFIG = Object.assign({}, window.CONFIG, cfg);
    }
  } catch (e) {}
})();
