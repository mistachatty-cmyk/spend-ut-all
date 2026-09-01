'use client';

import { useMemo, useState } from 'react';
import { debtProducts } from '@/data/debt-products';
import { items } from '@/data/content';
import { money } from '@/game/format';
import { borrowFromProduct, canBorrowProduct, collateralCandidates, consolidateDebts, consolidationQuote, estimatedBorrowAmount, financeNextHome, mortgageQuote, refinanceDebt, refinanceQuote, repayDebt, repayMinimum, setDebtAutopay, setDebtSystemEnabled } from '@/game/debt-actions';
import { acceptCourtPaymentPlan, counselQuote, courtPaymentPlanQuote, courtSettlementQuote, hireCourtCounsel, continuanceQuote, requestCourtContinuance, settleCourtCaseNegotiated } from '@/game/court-actions';
import { leveragedNetWorth } from '@/game/debt-runtime';
import { debtMinimumPayment, debtSummary, normalizeDebtState } from '@/game/systems/debt';
import type { AutopayMode } from '@/game/debt-types';
import type { GameState } from '@/game/types';

function gameDateLabel(gameMinute: number) {
  const minute = Math.max(0, Math.floor(gameMinute));
  const day = Math.floor(minute / 1440) + 1;
  const inDay = minute % 1440;
  const hour = Math.floor(inDay / 60);
  const mins = inDay % 60;
  return `Day ${day} · ${String(hour).padStart(2, '0')}:${String(mins).padStart(2, '0')}`;
}

export function DebtView({ state, setState }: { state: GameState; setState: React.Dispatch<React.SetStateAction<GameState | null>> }) {
  const debt = normalizeDebtState(state.debt);
  const summary = debtSummary(debt);
  const collateral = useMemo(() => collateralCandidates(state), [state.owned, state.rules.economy.purchasePriceMultiplier, debt.obligations]);
  const [selectedCollateral, setSelectedCollateral] = useState(collateral[0]?.id ?? '');
  const activeDebts = debt.obligations.filter((entry) => entry.balance > 0 && !['paid', 'seized'].includes(entry.status));
  const cases = debt.courtCases.filter((entry) => !['dismissed'].includes(entry.stage));
  const mortgage = mortgageQuote(state);
  const consolidation = consolidationQuote(state);
  const actualWorth = leveragedNetWorth(state);

  if (!debt.enabled) return <section className="debt-shell"><section className="panel debt-intro"><div><span className="eyebrow">OPTIONAL LEVERAGE SYSTEM</span><h2>Debt, collateral & court</h2><p>Turn this on to borrow from multiple creditors, finance a home, pledge assets, watch balances grow with interest, automate payments, refinance, consolidate, lose collateral, or end up in civil court. It is optional and can stay completely out of a relaxed run.</p></div><button className="primary" onClick={() => setState((current) => current ? setDebtSystemEnabled(current, true) : current)}>Enable Debt System</button></section></section>;

  return <section className="debt-shell">
    <section className="panel debt-hero">
      <div><span className="eyebrow">LEVERAGE & LIABILITY</span><h2>{money(summary.totalDebt)} owed</h2><p>Borrowing raises cash and liabilities together. Wealth goals use debt-adjusted net worth, so leverage can accelerate purchases without pretending borrowed money is profit.</p></div>
      <div className="debt-summary-grid"><span><small>Actual net worth</small><b>{money(actualWorth)}</b></span><span><small>Credit score</small><b>{debt.creditScore}</b></span><span><small>Active debts</small><b>{summary.activeObligations}</b></span><span><small>Autopay</small><b>{summary.autopayEnabled}</b></span><span><small>In default</small><b>{money(summary.defaultedDebt)}</b></span><span><small>Interest / month*</small><b>{money(summary.monthlyEquivalentInterest)}</b></span><span><small>Pledged / mortgaged</small><b>{summary.pledgedAssets}</b></span><span><small>Court cases</small><b>{summary.activeCourtCases}</b></span></div>
    </section>

    <section className="debt-tool-grid">
      <article className="panel finance-tool"><span className="eyebrow">HOME FINANCE</span><h2>Buy with a down payment</h2>{mortgage ? <><p>Finance the next home tier instead of paying the entire price in cash. The home becomes collateral and can be foreclosed after repeated missed payments.</p><div className="finance-tool-stats"><span>Next home <b>{mortgage.nextHome.name}</b></span><span>Price <b>{money(mortgage.purchasePrice)}</b></span><span>Down payment <b>{money(mortgage.downPayment)} · {Math.round(mortgage.downRate * 100)}%</b></span><span>Mortgage <b>{money(mortgage.financed)}</b></span><span>APR <b>{(mortgage.apr * 100).toFixed(2)}%</b></span></div><button className="primary" disabled={!mortgage.affordable} onClick={() => setState((current) => current ? financeNextHome(current) : current)}>{mortgage.affordable ? `Finance ${mortgage.nextHome.name}` : `Need ${money(mortgage.downPayment)} cash`}</button></> : <p className="muted">Home financing is unavailable while another home lien is active, at the maximum home tier, or when credit is below 580.</p>}</article>

      <article className="panel finance-tool"><span className="eyebrow">CONSOLIDATION</span><h2>Turn several debts into one</h2>{consolidation ? <><p>Eligible current/late unsecured debts can be rolled into one payment. A 2.5% fee is capitalized into the new balance.</p><div className="finance-tool-stats"><span>Debts combined <b>{consolidation.debtIds.length}</b></span><span>Old balance <b>{money(consolidation.balance)}</b></span><span>Old weighted APR <b>{(consolidation.weightedApr * 100).toFixed(2)}%</b></span><span>New APR <b>{(consolidation.apr * 100).toFixed(2)}%</b></span><span>New balance <b>{money(consolidation.newBalance)}</b></span></div><button className="primary" onClick={() => setState((current) => current ? consolidateDebts(current) : current)}>Consolidate eligible debts</button></> : <p className="muted">Requires at least two eligible unsecured debts and a credit score of 600 or better.</p>}</article>
    </section>

    <div className="debt-columns">
      <section className="panel"><span className="eyebrow">LENDERS</span><h2>Borrow through different channels</h2><div className="lender-list">{debtProducts.map((product) => {
        const secured = product.security === 'item';
        const collateralId = secured ? selectedCollateral : undefined;
        const amount = estimatedBorrowAmount(state, product, collateralId);
        const allowed = canBorrowProduct(state, product, collateralId);
        return <article className="lender-card" key={product.id}><div className="lender-icon">{product.emoji}</div><div><div className="lender-title"><b>{product.name}</b><span>{product.creditorName}</span></div><p>{product.description}</p><div className="lender-meta"><span>{Math.round(product.apr * 1000) / 10}% APR</span><span>{secured ? `${Math.round((product.collateralLtv ?? .5) * 100)}% LTV` : 'Unsecured'}</span><span>{product.defaultAfterMisses} missed payments → default</span></div>{secured ? <label className="collateral-picker">Pledge asset<select value={selectedCollateral} onChange={(e) => setSelectedCollateral(e.target.value)}><option value="">Choose collateral</option>{collateral.map((item) => <option value={item.id} key={item.id}>{item.emoji} {item.name} · {money(item.pledgedValue)}</option>)}</select></label> : null}</div><button disabled={!allowed || amount <= 0} onClick={() => setState((current) => current ? borrowFromProduct(current, product.id, collateralId) : current)}>Borrow {amount > 0 ? money(amount) : ''}</button></article>;
      })}</div><small className="debt-footnote">*Monthly equivalent is a readable estimate. Actual balances accrue using the in-game calendar.</small></section>

      <section className="panel"><span className="eyebrow">YOUR OBLIGATIONS</span><h2>Balances can grow or be paid down</h2>{activeDebts.length ? <div className="obligation-list">{activeDebts.map((entry) => {
        const collateralItem = entry.collateral?.kind === 'item' ? items.find((item) => item.id === entry.collateral!.itemId) : null;
        const minimum = debtMinimumPayment(entry);
        const refi = refinanceQuote(state, entry.id);
        return <article className={`obligation-card debt-${entry.status}`} key={entry.id}><div className="obligation-head"><div><b>{entry.creditorName}</b><small>{entry.security === 'item' ? 'Secured asset loan' : entry.security === 'home' ? 'Mortgage / home lien' : 'Unsecured debt'} · {entry.status.toUpperCase()}</small></div><strong>{money(entry.balance)}</strong></div><div className="obligation-stats"><span>APR <b>{(entry.apr * 100).toFixed(1)}%</b></span><span>Minimum <b>{money(minimum)}</b></span><span>Missed <b>{entry.missedPayments}/{entry.defaultAfterMisses}</b></span><span>Next due <b>{gameDateLabel(entry.nextPaymentGameMinute)}</b></span></div>{collateralItem ? <div className="pledge-warning">🔒 {collateralItem.emoji} {collateralItem.name} is pledged and cannot be sold. Default can seize one.</div> : null}{entry.collateral?.kind === 'home' ? <div className="pledge-warning">🏠 {entry.collateral.houseLevel === state.houseLevel ? 'Your current home' : `Home tier ${entry.collateral.houseLevel}`} secures this mortgage. Repeated default can trigger foreclosure.</div> : null}<label className="autopay-row"><span>Autopay</span><select value={entry.autopayMode} onChange={(e) => setState((current) => current ? setDebtAutopay(current, entry.id, e.target.value as AutopayMode) : current)} disabled={['default','judgment'].includes(entry.status)}><option value="off">Off</option><option value="minimum">Minimum due</option><option value="full">Pay in full when due</option></select></label>{refi ? <div className="refi-quote"><span>Refinance available</span><b>{(refi.oldApr * 100).toFixed(2)}% → {(refi.apr * 100).toFixed(2)}%</b><small>{money(refi.fee)} fee added to balance</small></div> : null}<div className="debt-actions"><button disabled={state.cash <= 0} onClick={() => setState((current) => current ? repayMinimum(current, entry.id) : current)}>Pay minimum</button><button disabled={state.cash <= 0} onClick={() => setState((current) => current ? repayDebt(current, entry.id, entry.balance) : current)}>Pay off</button>{refi ? <button onClick={() => setState((current) => current ? refinanceDebt(current, entry.id) : current)}>Refinance</button> : null}</div></article>;
      })}</div> : <div className="empty-debt">No active obligations. Borrowing is available, but never required.</div>}</section>
    </div>

    <section className="panel court-panel"><div className="section-heading"><div><span className="eyebrow">CIVIL COURT</span><h2>Choose how to respond</h2></div><span>Fictional game simulation: settle, retain counsel, buy time, or convert eligible cases into a payment plan.</span></div>{cases.length ? <div className="court-list">{cases.map((court) => {
      const settlement = courtSettlementQuote(state, court.id);
      const plan = courtPaymentPlanQuote(state, court.id);
      const continuance = continuanceQuote(state, court.id);
      const localCounsel = counselQuote(state, court.id, 'local-counsel');
      const eliteCounsel = counselQuote(state, court.id, 'elite-firm');
      const representation = court.representation ?? 'self';
      return <article className={`court-card stage-${court.stage}`} key={court.id}><span className="court-icon">⚖️</span><div className="court-case-copy"><div className="court-case-title"><b>{court.plaintiff} v. Player</b><small>{court.stage.toUpperCase()} · claim {money(court.amountClaimed)}</small></div><div className="court-chips"><span>{representation === 'self' ? 'Self-represented' : representation === 'local-counsel' ? 'Local counsel' : 'Elite firm'}</span><span>{court.continuances ?? 0}/2 continuances</span>{(court.settlementDiscount ?? 0) > 0 ? <span>{Math.round((court.settlementDiscount ?? 0) * 100)}% settlement leverage</span> : null}</div><p>{court.stage === 'filed' ? `A collection case has been filed. Hearing scheduled ${gameDateLabel(court.nextEventGameMinute)}.` : court.stage === 'hearing' ? `The case is at hearing. Unresolved claims can become judgments around ${gameDateLabel(court.nextEventGameMinute)}.` : court.stage === 'judgment' ? `Judgment entered for ${money(court.judgmentAmount ?? court.amountClaimed)}. Later systems can add liens, garnishment, appeals, and restructuring.` : court.paymentPlan ? 'The lawsuit is resolved into a structured payment plan.' : 'This case has been resolved.'}</p>{court.lastAction ? <small className="court-last-action">Last action: {court.lastAction}</small> : null}<div className="court-strategy-actions">{representation === 'self' && localCounsel ? <button disabled={state.cash < localCounsel.fee} onClick={() => setState((current) => current ? hireCourtCounsel(current, court.id, 'local-counsel') : current)}>Local counsel · {money(localCounsel.fee)}</button> : null}{representation !== 'elite-firm' && eliteCounsel ? <button disabled={state.cash < eliteCounsel.fee} onClick={() => setState((current) => current ? hireCourtCounsel(current, court.id, 'elite-firm') : current)}>Elite firm · {money(eliteCounsel.fee)}</button> : null}{continuance ? <button disabled={state.cash < continuance.fee} onClick={() => setState((current) => current ? requestCourtContinuance(current, court.id) : current)}>Continuance +{continuance.days}d · {money(continuance.fee)}</button> : null}{plan ? <button onClick={() => setState((current) => current ? acceptCourtPaymentPlan(current, court.id) : current)}>Payment plan · ~{money(plan.minimum)}/mo</button> : null}{settlement ? <button disabled={!settlement.affordable} onClick={() => setState((current) => current ? settleCourtCaseNegotiated(current, court.id) : current)}>Settle · {money(settlement.amount)}</button> : null}</div></div></article>;
    })}</div> : <div className="empty-debt">No court cases. If an unsecured loan defaults, the creditor can file here after its collection delay.</div>}</section>

    <section className="panel debt-lifetime"><span className="eyebrow">CREDIT HISTORY</span><div><span>Borrowed <b>{money(debt.lifetimeBorrowed)}</b></span><span>Repaid <b>{money(debt.lifetimeRepaid)}</b></span><span>Autopay paid <b>{money(debt.lifetimeAutopayPaid)}</b></span><span>Refinanced <b>{money(debt.lifetimeRefinanced)}</b></span><span>Consolidated <b>{money(debt.lifetimeConsolidated)}</b></span><span>Interest accrued <b>{money(debt.lifetimeInterest)}</b></span><span>Legal costs <b>{money(debt.lifetimeLegalCosts)}</b></span><span>Defaults <b>{debt.lifetimeDefaults}</b></span><span>Seizures <b>{debt.lifetimeSeizures}</b></span><span>Foreclosures <b>{debt.lifetimeForeclosures}</b></span></div><button className="secondary" disabled={summary.totalDebt > 0 || summary.activeCourtCases > 0} onClick={() => setState((current) => current ? setDebtSystemEnabled(current, false) : current)}>Disable Debt System</button></section>
  </section>;
}
