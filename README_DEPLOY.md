
# High Value Man App — Deployment

## 1) Create GitHub repo
```bash
git init
git add .
git commit -m "Initial commit — HVM App"
git branch -M main
# If you have GitHub CLI:
gh repo create highvaluemanapp --public --source . --remote origin --push
# Or create repo on GitHub named highvaluemanapp, then:
git remote add origin https://github.com/<your-username>/highvaluemanapp.git
git push -u origin main
```

## 2) Azure Static Web Apps
- In Azure Portal: **Create resource** → **Static Web App** → Name: `highvaluemanapp`
- Deployment source: **GitHub** → select your repo & `main` branch.
- Build details: **Custom**
  - App location: `/`
  - API location: *(leave empty)*
  - Output location: `/`
- Azure creates `AZURE_STATIC_WEB_APPS_API_TOKEN` secret automatically after linking.
- If needed, set it manually in GitHub → **Settings → Secrets and variables → Actions**.

## 3) Configure the app
Copy `config.sample.json` → `config.json`, fill:
- **Stripe**: `publishableKey`, `priceId`, `successUrl`, `cancelUrl`, and either `portalUrl` or `portalCreateUrl`.
- **Google Sheets**: `webAppUrl` and `truthsWebAppUrl` (Apps Script endpoints).
- **AdSense**: `clientId` (and `slotId`).
- **Analytics**: `gtagId` (optional).
- **Firebase** (optional): project keys if you want sign-in & sync.

## 4) Verify after deploy
- Backgrounds rotate every 60s; fades are smooth (no white flash).
- Form submit → score + harsh line + readiness + pipeline.
- Truths → submit, auto-roast (limited on free), meme export (HD locks).
- Sticky upgrade bar (dismissible per day), inline upsell on “🚫 Unrealistic” with gold pulse.
- Stripe checkout flows; success sets local Pro flag; ads hide for Pro.
- Leaderboard refreshes if **truthsWebAppUrl** is set.

## 5) Custom domain (optional)
Static Web App → **Custom domains** → CNAME `www.yourdomain.com` to Azure endpoint.

## Troubleshooting
- If config isn’t loading, ensure `/config.json` exists at repo root (same shape as `config.sample.json`).
- Stripe errors: confirm publishable key + price ID; portal URL must be allowed by Stripe.
- Apps Script CORS: allow your SWA domain and `Content-Type: application/json`.
