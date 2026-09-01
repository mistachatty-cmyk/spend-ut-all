# Spend It All — Financial Core 2

## Implemented in this pass

### Autopay

Every explicit obligation now has an autopay mode:

- Off
- Minimum due
- Full balance when due

Autopay uses available cash only. It never silently creates a new overdraft. If enough cash is unavailable, the scheduled payment can still be missed and the normal delinquency/default path continues.

Autopay runs from the same in-game calendar that drives payment due dates and interest.

### Refinancing

Eligible current or late obligations can receive a refinance quote when credit is healthy enough.

Current model:

- credit score must be at least 600;
- defaulted/judgment debt is ineligible;
- active court cases block refinancing of that debt;
- better credit produces a larger possible rate improvement;
- refinance carries a 2% fee capitalized into the balance;
- payment status is reset to current;
- refinance history is retained.

This is a game balancing model, not a real lending quote.

### Debt consolidation

Two or more eligible unsecured debts can be combined into one obligation.

Current model:

- score 600+;
- only current/late unsecured debt;
- 2.5% consolidation fee;
- weighted old APR is compared with the new rate;
- replacement note starts with minimum autopay on;
- no new spendable cash is created, so consolidation does not fake new wealth.

### Home financing

The first mortgage path is connected to existing house progression.

Players can finance the next home tier if:

- debt system is enabled;
- credit is at least 580;
- there is no existing active home lien;
- they can afford the required down payment.

Down payment and APR improve with credit quality.

The financed home becomes collateral. Repeated missed payments can eventually default and foreclose the mortgaged home tier.

This is intentionally the first bridge toward a deeper property market. Future property should become individual assets with market prices rather than only progression tiers.

### Foreclosure

Home-secured debt now follows the secured-credit path instead of civil unsecured collection:

payment misses → default → grace period → foreclosure/seizure.

The debt runtime can distinguish marketplace-item collateral from home collateral and apply the correct loss.

### Accounting integrity

Explicit liabilities continue to reduce leveraged net worth.

Borrowed cash therefore cannot directly satisfy debt-aware wealth goals or newly trigger wealth/speed achievements as if the borrowed funds were earnings.

## Next financial upgrades

1. Mortgage amortization schedules and remaining equity.
2. Fixed versus variable mortgage rates.
3. Home-equity loans and cash-out refinancing.
4. Debt-to-income / debt-service-coverage underwriting.
5. True revolving credit lines and utilization.
6. Secured deficiency balances after repossession/foreclosure.
7. Collections and negotiated payment plans.
8. Lawyers, continuances, defenses, appeals, and judgment enforcement.
9. Liens and garnishment.
10. Personal versus company balance sheets.
11. Corporate credit ratings, covenants, bonds, and maturities.
12. Formal restructuring / bankruptcy choices instead of bankruptcy only being a run-ending condition.
13. Dynamic interest rates driven by the Living Economy.
14. A deeper property market so mortgages attach to individual real-estate assets.

## UI principle

Debt remains optional and off by default.

A simple player should be able to ignore the entire system. A simulation player can open Debt & Court and see individual creditors, due dates, autopay, collateral, refinancing, consolidation, court status, and credit history.
