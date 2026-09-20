export function money(value: number) {
  const abs = Math.abs(value);
  const units = [
    { value: 1e15, suffix: 'Q' },
    { value: 1e12, suffix: 'T' },
    { value: 1e9, suffix: 'B' },
    { value: 1e6, suffix: 'M' },
    { value: 1e3, suffix: 'K' },
  ];
  const unit = units.find((entry) => abs >= entry.value);
  if (unit) return `${value < 0 ? '-' : ''}$${(abs / unit.value).toFixed(abs / unit.value >= 100 ? 0 : 2)}${unit.suffix}`;
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: abs < 100 ? 2 : 0 }).format(value);
}

export function moneyExact(value: number, showCents: boolean = true): string {
  const sign = value < 0 ? '-' : '';
  const abs = Math.abs(value);
  if (!Number.isFinite(abs)) return `${sign}$0.00`;

  if (showCents) {
    const fixed = abs.toFixed(2);
    const [intPart, decPart] = fixed.split('.');
    const withCommas = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return `${sign}$${withCommas}.${decPart}`;
  } else {
    const roundInt = Math.round(abs).toString();
    const withCommas = roundInt.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return `${sign}$${withCommas}`;
  }
}

export function formatMoneyWithPref(value: number, fullDigits: boolean, showCents: boolean = true): string {
  return fullDigits ? moneyExact(value, showCents) : money(value);
}

