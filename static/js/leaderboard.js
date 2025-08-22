
(function(){
  const list = document.getElementById('leaderboardList');
  const refreshBtn = document.getElementById('btnRefreshLeaderboard');
  const section = document.getElementById('globalLeaderboard');
  if (!list || !refreshBtn || !section) return;

  async function fetchTopTruths() {
    const url = (window.CONFIG && window.CONFIG.sheets && window.CONFIG.sheets.truthsWebAppUrl) || "";
    if (!url) { section.classList.add('hidden'); return; }
    section.classList.remove('hidden');
    try {
      const res = await fetch(url + "?action=top");
      const data = await res.json();
      render(data.truths || []);
    } catch (e) {
      list.innerHTML = "<p>Failed to load leaderboard.</p>";
    }
  }

  function render(items) {
    list.innerHTML = "";
    items.forEach(t => {
      const card = document.createElement('div');
      card.className = "lb-card";
      card.innerHTML = `
        <div class="lb-text">${t.text}</div>
        <div class="lb-meta">
          <span>⬆️ ${t.votes || 0}</span>
          <div class="lb-actions">
            <button data-id="${t.id || ''}" class="lb-vote">Upvote</button>
            <button class="lb-share">Share</button>
          </div>
        </div>`;
      card.querySelector('.lb-share').addEventListener('click', () => {
        if (navigator.share) navigator.share({ text: t.text }); else alert("Share not supported here.");
      });
      card.querySelector('.lb-vote').addEventListener('click', async (ev) => {
        const id = ev.target.getAttribute('data-id');
        if (!id) return;
        const url = (window.CONFIG && window.CONFIG.sheets && window.CONFIG.sheets.truthsWebAppUrl) || "";
        try {
          await fetch(url, { method:"POST", headers:{ "Content-Type":"application/json" }, body: JSON.stringify({ action:"vote", id }) });
          fetchTopTruths();
        } catch (e) {}
      });
      list.appendChild(card);
    });
  }

  refreshBtn.addEventListener('click', fetchTopTruths);
  fetchTopTruths();
})();
