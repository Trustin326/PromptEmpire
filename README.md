# Prompt Empire™ — Production Storefront

A complete static storefront designed for GitHub Pages. The only required sales configuration is adding Stripe Payment Links in `config.js`.

## Included
- Luxury white, beige, and silver-chrome storefront
- 25 complete prompt packs, each containing 100 ready-to-use prompts
- 3 curated mega bundles + 1 ultimate vault offer
- Product search and category filters
- Product detail modal
- Browser-persistent shopping bag
- Stripe Payment Link routing for single-product checkout
- Affiliate partner page and marketing kit
- Terms and privacy pages
- Mobile responsive design
- Original uploaded luxury visual used as design inspiration; the generated storefront hero visual is included in `assets/hero-luxury.png`

## Stripe setup
Open `config.js` and paste the corresponding Stripe Payment Link next to each product slug.

Example:
`"small-business": "https://buy.stripe.com/..."`

For bundles, create a Stripe product/payment link and add it to the matching bundle slug.

## Important checkout limitation
GitHub Pages is static. A browser-only cart cannot securely create a dynamic multi-item Stripe Checkout Session without a backend. This build therefore routes a one-item bag directly to the matching Stripe Payment Link. For multi-item purchases, use the included bundle products or add a serverless checkout endpoint later.

## Secure digital delivery
Do not place paid downloads in a public GitHub Pages repository if you need them protected. The `products/` folder is included as your source catalog so you have the complete products. For live sales, upload each product file to a private fulfillment service or use Stripe-compatible fulfillment and send the correct download after confirmed payment.

## Deploy
1. Upload all files to the root of a GitHub repository.
2. Add Stripe links in `config.js`.
3. Replace `support@example.com` in `config.js` and `index.html`.
4. Publish with GitHub Pages.

## Product count
25 complete packs × 100 prompts = 2,500 prompts, plus four higher-value bundle/vault offers.


## Phase 2 backend
See `BACKEND-SETUP.md`.


## Phase 3 Growth Engine
See `PHASE3-SETUP.md` and the `marketing-kit/` folder. This phase adds campaign attribution, conversion events, customer history, segmentation, follow-up records, product/campaign analytics, affiliate leaderboard reporting, and the 30-day growth kit.


## V4
See FULL-PRODUCTION-SETUP.md for switchable local, Google Sheets, and Supabase operation.
