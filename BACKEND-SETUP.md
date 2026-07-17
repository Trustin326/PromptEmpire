# Prompt Empire™ Phase 2 Setup

This version keeps the storefront on GitHub Pages and adds a Google Sheets + Apps Script backend.

## Included
- Affiliate signup with unique IDs and private dashboard tokens
- 30-day referral attribution
- Affiliate click logging
- Stripe Checkout Session verification using your secret key in Apps Script
- Purchase logging only after Stripe reports payment_status=paid
- Customer records and lifetime value
- Commission calculation
- Owner dashboard
- Delivery records and automatic delivery emails

## Setup
1. Create a Google Sheet called `Prompt Empire Operations`.
2. Open Extensions → Apps Script. Copy `google-apps-script/Code.gs` and `appsscript.json`.
3. Run `setupPromptEmpireBackend()` and authorize it.
4. In the Settings sheet, replace `STRIPE_SECRET_KEY`, `STORE_ORIGIN`, and `SUPPORT_EMAIL`. Keep `OWNER_API_KEY` private.
5. Import `google-apps-script/Products-Seed.csv` into the Products sheet. Add each Stripe `price_...` ID and its private `delivery_url`.
6. Deploy Apps Script as a Web App: Execute as Me; access Anyone. Copy the Web App URL into `config.js` as `backendUrl`.
7. Add each Stripe Payment Link to `config.js`.
8. In each Stripe Payment Link, set the after-payment redirect to `https://YOUR-SITE/success.html?session_id={CHECKOUT_SESSION_ID}`.
9. Open `owner-dashboard.html`, paste the generated `OWNER_API_KEY`, and load live data.

## Important
Do not put the Stripe secret key or paid files in the public GitHub repository. Paid files should live in private or controlled storage; the backend emails the configured delivery URL only after Stripe verifies a paid Checkout Session.

This build uses server-side Checkout Session verification after Stripe redirect. This is deliberate: Apps Script web apps do not expose a dependable Stripe-Signature header workflow in the simple doPost event interface.

Before launch, complete a Stripe test-mode purchase from affiliate click → checkout → success redirect → verification → purchase log → commission → delivery email.
