# Spend It All — Debt, Collateral, Credit & Court Roadmap

## Product goal

Debt should be a completely optional simulation layer. Players who want a relaxed incremental game can leave it off. Players who enable it can use leverage to move faster, but debt creates liabilities, deadlines, creditor relationships, collateral risk, credit history, lawsuits, judgments, and possible loss of assets.

The design goal is not to make debt automatically bad. Good leverage can accelerate an empire. Bad leverage can unwind one.

Explicit loans are separate from the existing Risk Mode cash overdraft. A player can use either, both, or neither depending on the run rules.

---

## 1. Core debt loop

Borrow → receive cash → liability appears → interest grows → payment dates arrive → repay/refinance or miss → delinquency → default → collateral seizure or civil collection → court/judgment → settlement, repayment, restructuring, or bankruptcy.

Debt must reduce economic net worth. Receiving $100,000 cash from a $100,000 loan does not make the player $100,000 richer.

---

## 2. Debt counter

Debt is its own optional HUD counter.

It should be able to display:
- Total outstanding debt
- Number of creditors
- Monthly-equivalent interest
- Credit score/rating
- Delinquent/default balance
- Active court cases
- Secured/pledged assets
- Next payment countdown

The counter should visibly rise as interest accrues and fall when payments are made.

Possible visual states:
- No debt
- Healthy leverage
- Payment approaching
- Late
- Default
- Court filed
- Judgment
- Restructuring
- Paid off

Future counter skins can integrate with the cosmetic system, but visual skins must never alter debt math.

---

## 3. Creditor families

Current foundation:
- Banks
- Credit unions
- Private lenders
- Asset-backed lenders
- Business lenders

Future creditors:
- Mortgage companies
- Auto/aircraft/yacht finance companies
- Venture debt funds
- Equipment finance companies
- Bondholders
- Municipal lenders
- Sovereign lenders
- Friends/family/private individuals
- Vendors offering trade credit
- Tax authorities
- Courts/judgment creditors
- Player-owned banks in future advanced empire gameplay

Each creditor can eventually have its own underwriting rules, patience, collection behavior, reputation, rates, collateral requirements, and negotiation style.

---

## 4. Secured debt and collateral

Current MVP supports pledging marketplace items.

Rules:
- A pledged item remains economically owned while the loan is current.
- The pledged unit cannot be sold while the lien is active.
- Default begins a grace/collection period.
- If unresolved, the secured creditor can seize the pledged unit.
- Seizure closes or reduces the secured obligation according to future deficiency rules.

Future collateral classes:
- Houses and estates
- Apartment portfolios
- Hotels
- Factories
- Businesses/company shares
- Private jets
- Yachts
- Art and collectibles
- Stocks/securities
- Intellectual property
- City infrastructure concessions
- Space assets

Future loan-to-value behavior should use dynamic asset valuation rather than only base catalog value.

---

## 5. Mortgages and property liens

Property financing should become its own major branch after the real-estate system deepens.

Potential mechanics:
- Down payments
- Fixed vs variable rates
- Mortgage term length
- Property taxes
- Escrow
- Refinancing
- Home equity loans
- Commercial mortgages
- Construction loans
- Foreclosure
- Short sale
- Deficiency judgment
- Property liens
- Rental income used for debt-service coverage

Housing-market conditions should influence appraisal values and refinancing access.

---

## 6. Business leverage

Businesses should eventually have their own balance sheets rather than all debt sitting personally on the player.

Company debt types:
- Working-capital line
- Equipment loan
- Acquisition financing
- Real-estate facility
- Revenue-based financing
- Venture debt
- Revolver
- Term loan
- Syndicated loan
- Corporate bonds

Company metrics:
- Debt/EBITDA
- Interest coverage
- Debt-service coverage
- Credit rating
- Covenant headroom
- Maturity schedule
- Secured vs unsecured debt

Defaults could cause asset sales, dilution, restructuring, creditor control, or company bankruptcy without necessarily ending the player's entire run.

---

## 7. Credit score and ratings

Current MVP starts with a personal-style score and changes it around repayment/default behavior.

Future model:
- Payment history
- Utilization
- Debt load
- Age of credit
- Number of recent applications
- Defaults/judgments
- Settled accounts
- Secured lending history
- Business performance

At larger scale, personal credit should transition into corporate ratings such as fictional AAA/AA/A/BBB/etc. rather than stretching a consumer score forever.

Good credit can unlock lower rates and larger facilities. Bad credit can push players toward expensive private lenders or collateral-heavy borrowing.

---

## 8. Civil court

Current foundation:
Unsecured default → creditor filing → hearing → judgment or settlement.

Future court case types:
- Debt collection
- Breach of contract
- Vendor disputes
- Employment claims
- Shareholder lawsuits
- Tenant/landlord disputes
- Business litigation
- Antitrust cases
- Regulatory cases
- Tax disputes
- Intellectual-property claims
- Injury/property liability claims

Court is a game simulation, not legal advice.

---

## 9. Court decisions and player choices

A deeper case should have decisions rather than only timers.

Possible actions:
- Pay immediately
- Negotiate settlement
- Hire inexpensive lawyer
- Hire elite law firm
- Represent yourself
- Ask for continuance
- Counterclaim when applicable
- Offer payment plan
- Appeal a judgment
- File bankruptcy protection when eligible

Possible outcomes:
- Dismissal
- Settlement
- Plaintiff judgment
- Player judgment on counterclaim
- Legal fees
- Asset lien
- Wage/income garnishment
- Bank-account levy
- Forced sale
- Injunction affecting a business

Lawyer quality can modify legal-event odds, not guarantee wins.

---

## 10. Judgments and collections

A court judgment should create a special enforceable debt state.

Future enforcement options:
- Garnish a percentage of active income
- Levy cash above a protected reserve
- Place liens on property
- Seize non-exempt assets
- Attach business distributions
- Accrue post-judgment interest
- Renew judgment after long periods

Different fictional jurisdictions/scenario rules can change what creditors are allowed to take.

---

## 11. Bankruptcy and restructuring

Risk Mode currently has a run-ending liquidity bankruptcy countdown. Explicit debt creates room for a deeper legal bankruptcy system later.

Potential personal routes:
- Liquidation: sell/seize non-exempt assets and discharge eligible debts
- Reorganization/payment plan: keep more assets but make scheduled payments

Potential corporate routes:
- Reorganization
- Debt-for-equity swap
- Debtor-in-possession financing
- Asset sale
- Creditor takeover
- Liquidation

A legal bankruptcy does not always need to end the run. It can become a major comeback path with permanent achievements and scars on credit history.

---

## 12. Taxes and government debt

Later economic simulation can introduce:
- Income tax
- Property tax
- Payroll tax
- Corporate tax
- Sales/VAT-style tax in scenarios
- Tax payment plans
- Penalties/interest
- Tax liens
- Tax court/disputes

This should remain optional through the rules engine.

---

## 13. Insurance and legal protection

Insurance can reduce catastrophic volatility without guaranteeing outcomes.

Examples:
- Property insurance
- Business liability
- Directors/officers coverage
- Travel insurance
- Credit insurance
- Legal expense plan

Insurance itself creates premiums and exclusions, adding another tradeoff.

---

## 14. Random legal and credit events

Examples:
- Rate increase on variable loan
- Bank offers refinance
- Creditor sells debt to collections company
- Lender waives late fee
- Private lender demands earlier payoff
- Appraisal rises/falls
- Covenant warning
- Court date postponed
- Settlement offer appears
- Attorney offers contingency arrangement
- Asset repossession notice
- Tax audit
- Fraudulent vendor dispute
- Class action involving a company

These should use the general event/modifier architecture rather than bespoke timers scattered around UI code.

---

## 15. Achievements and challenges

Ideas:
- First Loan — take first explicit loan
- Leverage — hold $1M debt while solvent
- Clean Payoff — repay first loan without missing a payment
- Debt Free — repay every creditor
- Perfect Borrower — complete a large leveraged run without delinquency
- Repo Man Came — lose first pledged asset
- See You in Court — receive first court filing
- Settled Out of Court — settle before judgment
- Judgment Day — receive a civil judgment
- Phoenix Credit — recover credit after a major default
- Leveraged Buyout — acquire a business using mostly borrowed capital
- House of Cards — exceed a very high debt-to-asset ratio
- Untouchable — survive multiple creditor cases and remain solvent
- Chapter Comeback — rebuild after future legal bankruptcy

Challenge presets:
- Debt Survivor
- Leveraged Millionaire
- No Cash, All Credit
- Mortgage Mogul
- Corporate Raider
- Courtroom Chaos
- Perfect Credit Run
- One Asset, Maximum Leverage

Competitive leaderboards should clearly distinguish assisted/custom rules and debt-enabled runs.

---

## 16. NPC creditors and negotiation personalities

Later creditors can become NPC entities with traits:
- Patient
- Aggressive
- Relationship-focused
- Predatory
- Conservative
- Flexible
- Litigation-heavy

A player's history with a bank can affect future offers. A creditor may refinance a strong borrower while suing a repeat defaulter quickly.

---

## 17. Server and multiplayer future

For the current local single-player game, debt simulation stays fully client-side.

If cloud saves/leaderboards arrive, server validation can record challenge settings and final run results. Multiplayer lending between real players should not be added to this version; it creates moderation, fraud, real-value, and regulatory complexity. If ever explored, it should be a separate multiplayer product design.

---

## 18. Technical architecture

Current modules:
- `game/debt-types.ts`
- `data/debt-products.ts`
- `game/systems/debt.ts`
- `game/debt-actions.ts`
- `game/debt-runtime.ts`
- `app/components/DebtView.tsx`
- `app/debt.css`

Keep lender products data-driven. Keep court timelines data-driven. Keep collateral references generic enough to expand beyond catalog items. Keep the HUD reading a summary rather than individual lender internals.

The next technical additions should be:
1. Debt achievements and history metrics.
2. Debt-enabled custom-scenario switches/rule codes.
3. Automatic payment/autopay options.
4. Refinancing/consolidation.
5. Dynamic property collateral and mortgages.
6. Company-level balance sheets.
7. Judgment enforcement and liens.
8. Bankruptcy/restructuring choices.
9. NPC creditor personalities and negotiation.
10. Integration with future Living Economy interest-rate modifiers.
