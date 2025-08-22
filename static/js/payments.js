
(function(){
  const btn = document.getElementById('btnCheckout');
  const manageBtn = document.getElementById('btnManage');
  const bmac = document.getElementById('bmacLink');
  const ad = document.getElementById('adBanner');
  const cfg = window.CONFIG || {};

  if (bmac && cfg.bmacUrl) { bmac.href = cfg.bmacUrl; } else if (bmac) { bmac.href = "#"; }

  if (btn && cfg.stripe && cfg.stripe.publishableKey && cfg.stripe.priceId) {
    const loadStripeScript = () => new Promise((resolve, reject) => {
      const s = document.createElement('script');
      s.src = "https://js.stripe.com/v3/";
      s.onload = resolve; s.onerror = reject;
      document.head.appendChild(s);
    });
    btn.addEventListener('click', async () => {
      try {
        await loadStripeScript();
        const stripe = window.Stripe(cfg.stripe.publishableKey);
        await stripe.redirectToCheckout({
          lineItems: [{ price: cfg.stripe.priceId, quantity: 1 }],
          mode: 'subscription',
          successUrl: (cfg.stripe.successUrl || window.location.href),
          cancelUrl: (cfg.stripe.cancelUrl || window.location.href)
        });
      } catch(e) { alert("Stripe not configured."); }
    });
  } else if (btn) { btn.addEventListener('click', () => alert("Add Stripe keys in config.json to enable checkout.")); }

  if (manageBtn) {
    manageBtn.addEventListener('click', async () => {
      if (cfg.stripe && cfg.stripe.portalUrl) { window.location.href = cfg.stripe.portalUrl; return; }
      if (cfg.stripe && cfg.stripe.portalCreateUrl) {
        try {
          const res = await fetch(cfg.stripe.portalCreateUrl, { method: 'POST' });
          const data = await res.json();
          if (data && data.url) { window.location.href = data.url; return; }
        } catch(e) {}
      }
      alert("Portal not configured. Add 'stripe.portalUrl' or 'stripe.portalCreateUrl' to config.json.");
    });
  }

  if (ad && cfg.adsense && cfg.adsense.clientId) {
    const s = document.createElement('script');
    s.async = true; s.crossOrigin = "anonymous";
    s.src = "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=" + encodeURIComponent(cfg.adsense.clientId);
    document.head.appendChild(s);
    ad.textContent = "";
    const ins = document.createElement('ins');
    ins.className = "adsbygoogle";
    ins.style.display = "block";
    ins.setAttribute("data-ad-client", cfg.adsense.clientId);
    ins.setAttribute("data-ad-slot", cfg.adsense.slotId || "0000000000");
    ins.setAttribute("data-ad-format", "auto");
    ins.setAttribute("data-full-width-responsive", "true");
    ad.appendChild(ins);
    (window.adsbygoogle = window.adsbygoogle || []).push({});
  }

  if (ad && window.HVM && HVM.entitlements && HVM.entitlements.isPro()) { ad.style.display = 'none'; }
})();
