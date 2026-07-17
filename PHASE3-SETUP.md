# PROMPT EMPIRE™ — PHASE 3 GROWTH ENGINE

This build extends Phase 2 with a real sales-growth operating layer while keeping the public storefront on GitHub Pages.

## Added in Phase 3
- Campaign attribution (`?campaign=...` and `utm_campaign`)
- Coupon-code attribution tracking
- Product/page event tracking
- Product-level sales analytics
- Campaign-level clicks, sales, revenue, conversion inputs
- Customer purchase-history page
- Customer segmentation: new, repeat, VIP
- Affiliate leaderboard and conversion-rate reporting
- 30-day attribution storage
- Email lead capture API
- Follow-up queue
- 3-day customer usage check-in scheduling
- 10-day relevant upsell scheduling
- Owner-triggered due follow-up email sending
- 30-day launch calendar
- Affiliate recruitment kit
- Offer/conversion optimization playbook

## Upgrade steps
1. Replace your Apps Script `Code.gs` with the Phase 3 version.
2. Run `setupPromptEmpireBackend()` again. It creates only missing sheets and keeps existing data.
3. Add any missing product fields in `Products` using `Products-Seed.csv` as the schema reference.
4. Redeploy the Apps Script web app as a new version.
5. Update `config.js` with the deployed web-app URL.
6. Keep the owner API key private.
7. Configure each Stripe Payment Link and matching Stripe Price ID.
8. Configure private delivery URLs.
9. Test:
   affiliate link → product view → Stripe test checkout → success redirect → purchase record → commission → delivery → customer history.

## Campaign link examples
Affiliate + campaign:
`https://YOUR-SITE/index.html?ref=AFF-12345678&campaign=launch30`

Campaign only:
`https://YOUR-SITE/index.html?campaign=launch30`

Coupon attribution:
`https://YOUR-SITE/index.html?campaign=bundlepush&coupon=BUNDLE10`

The frontend records attribution. Actual discount enforcement still belongs in Stripe. Create the matching Stripe promotion code there.

## Follow-up automation
`sendDueFollowUps` is implemented as an owner-protected backend action.

For automatic sending:
1. In Apps Script, open Triggers.
2. Add a time-driven trigger for a wrapper function you control, or run the owner dashboard action manually.
3. A secure scheduled wrapper should call the internal due-follow-up logic without exposing the owner key.

For a simple manual workflow, use the **SEND DUE FOLLOW-UPS** button in the owner dashboard.

## Important production truth
GitHub Pages can host the public interface, but it cannot securely hold Stripe secret keys or create trusted purchase records by itself. Those operations remain in Apps Script.

At higher sales volume, move the operational backend to a dedicated serverless database/API while preserving the same frontend attribution model.
