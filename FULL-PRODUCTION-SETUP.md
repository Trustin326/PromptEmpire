# PROMPT EMPIRE™ — FULL PRODUCTION V4

This package contains the complete storefront, 25 complete prompt packs with 2,500 prompts, four bundles, affiliate and customer dashboards, campaign analytics, owner tools, support tickets, reviews, payout records, backup/restore, and three backend modes.

## Backend switching
Edit `backend-config.js`:
- `local`: works immediately and stores data in the current browser.
- `sheets`: paste the deployed Apps Script Web App URL. The complete Apps Script backend is in `google-apps-script/`.
- `supabase`: run `backend/supabase-schema.sql`, then paste the project URL and anon key.

## Stripe
Paste Stripe Payment Links in `config.js`. For verified cloud fulfillment, map Stripe Price IDs and private delivery URLs in the selected backend. Never place a Stripe secret key in public GitHub Pages code.

## Product delivery
The completed packs are in `products/` and `product-library/`. Keep paid files out of a public repository when using protected delivery.

## Production truth
Local mode makes the entire interface and operational engines work immediately for testing and demonstrations. Real cross-device purchase records, secure Stripe verification, email delivery, and protected downloads require selecting the included Google Sheets or Supabase backend. Those services require their own deployment URL or project credentials; they cannot be supplied by a static ZIP.
