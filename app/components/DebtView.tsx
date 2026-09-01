'use client';

import { useMemo, useState } from 'react';
import { debtProducts } from '@/data/debt-products';
import { items } from '@/data/content';
import { money } from '@/game/format';
import { borrowFromProduct, canBorrowProduct, collateralCandidates, estimatedBorrowAmount, repayDebt, repayMinimum, setDebtSystemEnabled, settleCourtCase } from '@/game/debt-actions';
import { debtMinimumPayment, debtSummary, normalizeDebtState } from '@/game/systems/debt';
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

  if (!debt.enabled) return <section className="debt-shell"><section className="panel debt-intro"><div><span className="eyebrow">OPTIONAL LEVERAGE SYSTEM</span><h2>Debt, collateral & court</h2><p>Turn this on to borrow from multiple creditors, pledge assets, watch balances grow with interest, miss payments, lose collateral, or end up in civil court. It is optional and can stay completely out of a relaxed run.</p></div><button className="primary" onClick={() => setState((current) => current ? setDebtSystemEnabled(current, true) : current)}>Enable Debt System</button></section></section>;

  return <section className="debt-shell">
    <section className="panel debt-hero">
      <div><span className="eyebrow">LEVERAGE & LIABILITY</span><h2>{money(summary.totalDebt)} owed</h2><p>Explicit debt is separate from Risk Mode overdraft cash. Borrowing raises cash and liabilities together, so leveraged net worth does not magically increase.</p></div>
      <div className="debt-summary-grid"><span><small>Credit score</small><b>{debt.creditScore}</b></span><span><small>Active debts</small><b>{summary.activeObligations}</b></span><span><small>In default</small><b>{money(summary.defaultedDebt)}</b></span><span><small>Interest / month*</small><b>{money(summary.monthlyEquivalentInterest)}</b></span><span><small>Pledged assets</small><b>{summary.pledgedAssets}</b></span><span><small>Court cases</small><b>{summary.activeCourtCases}</b></span></div>
    </section>

    <div className="debt-columns">
      <section className="panel"><span className="eyebrow">LENDERS</span><h2>Borrow through different channels</h2><div className="lender-list">{debtProducts.map((product) => {
        const secured = product.security === 'item';
        const collateralId = secured ? selectedCollateral : undefined;
        const amount = estimatedBorrowAmount(state, product, collateralId);
        const allowed = canBorrowProduct(state, product, collateralId);
        return <article className="lender-card" key={product.id}><div className="lender-icon">{product.emoji}</div><div><div className="lender-title"><b>{product.name}</b><span>{product.creditorName}</span></div><p>{product.description}</p><div className="lender-meta"><span>{Math.round(product.apr * 1000) / 10}% APR</span><span>{secured ? `${Math.round((product.collateralLtv ?? .5) * 100)}% LTV` : 'Unsecured'}</span><span>{product.defaultAfterMisses} missed payments → default</span></div>{secured ? <label className="collateral-picker">Pledge asset<select value={selectedCollateral} onChange={(e) => setSelectedCollateral(e.target.value)}><option value="">Choose collateral</option>{collateral.map((item) => <option value={item.id} key={item.id}>{item.emoji} {item.name} · {money(item.pledgedValue)}</option>)}</select></label> : null}</div><button disabled={!allowed || amount <= 0} onClick={() => setState((current) => current ? borrowFromProduct(current, product.id, collateralId) : current)}>Borrow {amount > 0 ? money(amount) : ''}</button></article>;
      })}</div><small className="debt-footnote">*Monthly equivalent is a readable estimate. The actual debt balance accrues using the in-game calendar.</small></section>

      <section className="panel"><span className="eyebrow">YOUR OBLIGATIONS</span><h2>Balances can grow or be paid down</h2>{activeDebts.length ? <div className="obligation-list">{activeDebts.map((entry) => {
        const collateralItem = entry.collateral ? items.find((item) => item.id === entry.collateral!.itemId) : null;
        const minimum = debtMinimumPayment(entry);
        return <article className={`obligation-card debt-${entry.status}`} key={entry.id}><div className="obligation-head"><div><b>{entry.creditorName}</b><small>{entry.security === 'item' ? 'Secured debt' : 'Unsecured debt'} · {entry.status.toUpperCase()}</small></div><strong>{money(entry.balance)}</strong></div><div className="obligation-stats"><span>APR <b>{(entry.apr * 100).toFixed(1)}%</b></span><span>Minimum <b>{money(minimum)}</b></span><span>Missed <b>{entry.missedPayments}/{entry.defaultAfterMisses}</b></span><span>Next due <b>{gameDateLabel(entry.nextPaymentGameMinute)}</b></span></div>{collateralItem ? <div className="pledge-warning">🔒 {collateralItem.emoji} {collateralItem.name} is pledged and cannot be sold. Default can seize one.</div> : null}<div className="debt-actions"><button disabled={state.cash <= 0} onClick={() => setState((current) => current ? repayMinimum(current, entry.id) : current)}>Pay minimum</button><button disabled={state.cash <= 0} onClick={() => setState((current) => current ? repayDebt(current, entry.id, entry.balance) : current)}>Pay off</button></div></article>;
      })}</div> : <div className="empty-debt">No active obligations. Borrowing is available, but never required.</div>}</section>
    </div>

    <section className="panel court-panel"><div className="section-heading"><div><span className="eyebrow">CIVIL COURT</span><h2>Defaults can become legal cases</h2></div><span>Unsecured creditors sue. Secured lenders usually seize pledged collateral first.</span></div>{cases.length ? <div className="court-list">{cases.map((court) => {
      const related = debt.obligations.find((entry) => entry.id === court.debtId);
      const settlement = Math.min(related?.balance ?? court.amountClaimed, court.amountClaimed * .75);
      return <article className={`court-card stage-${court.stage}`} key={court.id}><span className="court-icon">⚖️</span><div><b>{court.plaintiff} v. Player</b><small>{court.stage.toUpperCase()} · claim {money(court.amountClaimed)}</small><p>{court.stage === 'filed' ? `A civil collection case has been filed. Hearing scheduled ${gameDateLabel(court.nextEventGameMinute)}.` : court.stage === 'hearing' ? `The case is at hearing. A judgment can add penalties and legal fees around ${gameDateLabel(court.nextEventGameMinute)}.` : court.stage === 'judgment' ? `Judgment entered for ${money(court.judgmentAmount ?? court.amountClaimed)}. Future systems can attach garnishment, liens, appeals, and restructuring.` : 'This case has been settled.'}</p></div><button disabled={court.stage === 'settled' || state.cash < settlement} onClick={() => setState((current) => current ? settleCourtCase(current, court.id) : current)}>{court.stage === 'settled' ? 'Settled' : `Settle · ${money(settlement)}`}</button></article>;
    })}</div> : <div className="empty-debt">No court cases. If an unsecured loan defaults, the creditor can file here after its collection delay.</div>}</section>

    <section className="panel debt-lifetime"><span className="eyebrow">CREDIT HISTORY</span><div><span>Borrowed <b>{money(debt.lifetimeBorrowed)}</b></span><span>Repaid <b>{money(debt.lifetimeRepaid)}</b></span><span>Interest accrued <b>{money(debt.lifetimeInterest)}</b></span><span>Legal costs <b>{money(debt.lifetimeLegalCosts)}</b></span><span>Defaults <b>{debt.lifetimeDefaults}</b></span><span>Seizures <b>{debt.lifetimeSeizures}</b></span></div><button className="secondary" disabled={summary.totalDebt > 0 || summary.activeCourtCases > 0} onClick={() => setState((current) => current ? setDebtSystemEnabled(current, false) : current)}>Disable Debt System</button></section>
  </section>;
}
