# Spend It All — Risk, Earnings & Leaderboard System

## Goal
Money should feel alive. The visible balance continuously rolls upward when income is positive and downward when expenses or losses exceed earnings. Relaxed play remains available, while optional Risk Mode introduces debt, overspending, risky investments, bankruptcy pressure, a true loss state, and saved run history.

## Live money counter
- Presentation-only interpolation between authoritative GameState updates.
- Positive net cash flow counts up; negative cash flow counts down.
- Healthy, warning, debt, critical and bankrupt visual states.
- Main display always shows current net $/sec.
- Exact simulation values stay in GameState so animation can never corrupt saves.

## Earnings ladder
Active earning actions range from odd jobs and freelance work to city, sovereign and planetary contracts. Passive income streams range from vending routes and laundromats through data centers, investment funds, shipping empires, sovereign infrastructure funds and orbital trade networks.

## Optional Risk Mode
Risk Mode is opt-in. Existing/normal saves default to off.

When enabled:
- Marketplace purchases can use a bounded credit buffer and push cash below zero.
- Negative cash accrues debt interest every simulation tick.
- Crossing the distress threshold starts a bankruptcy countdown.
- Recovering above the safe line cancels the countdown.
- Reaching the deadline ends the run as bankrupt.
- Scenario bankruptcy never removes LOK Tokens, badges, titles, collectibles or legacy progression.

## Investments
Fictional game instruments only. Safe Reserve, Growth Fund, Venture Basket and Moonshot Fund have increasingly wide bounded outcome ranges. They are game mechanics, not real investment recommendations. Market events and Living Economy modifiers can influence these later.

## Bankruptcy flow
1. Liquidity becomes critically negative.
2. Main counter flips to a red debt/countdown state.
3. Player can earn, sell or receive gains to recover.
4. If the countdown reaches zero, the run freezes as lost.
5. A Run Result is generated and saved to run history/leaderboard.

## Run Result
Store scenario, mode, Risk Mode, result, reason, ending cash, peak cash, peak net worth, total earned, total spent, city level, region level, businesses founded, duration and score.

## Leaderboard/history
Separate local persistence from the active run save. Rank by score, peak net worth, lifetime earnings, spending and duration. A normal run reset must not delete history. Future authenticated/cloud leaderboards can consume the same Run Result shape with server validation and season IDs.

## Scoring
Centralize scoring in one module so balancing does not require save migrations. Initial score rewards logarithmic peak net worth, scenario completion and city/region scale, with a Risk Mode multiplier and bankruptcy penalty.

## Modules
- `game/systems/earnings.ts`
- `game/earning-actions.ts`
- `game/systems/risk.ts`
- `game/systems/investments.ts`
- `game/investment-actions.ts`
- `game/run-types.ts`
- `game/systems/leaderboard.ts`
- `app/components/MoneyCounter.tsx`
- `app/components/EarningsView.tsx`
- `app/components/GameOverView.tsx`
- `app/components/LeaderboardView.tsx`

## Future expansion
Credit scores, loans, refinancing, margin calls, corporate defaults, insurance, bailouts, NPC bankruptcies, crashes, historical recession scenarios, seasonal leaderboards, friends/global rankings, daily economy challenges and collectible trophies for famous recoveries or spectacular failures.
