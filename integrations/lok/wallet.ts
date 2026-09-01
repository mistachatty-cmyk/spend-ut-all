export const LOK_WALLET_KEY = 'gsix-lok-wallet-v1';
export const LOK_WALLET_VERSION = 1;

export type LokIdentityProvider = 'local' | 'apple' | 'discord' | 'github' | 'gsix';

export type LokWallet = {
  version: number;
  balance: number;
  progressMs: number;
  lifetimeEarned: number;
  updatedAt: number;
  owner: {
    provider: LokIdentityProvider;
    subject: string | null;
  };
};

export type LokWalletAdapter = {
  load(): LokWallet;
  save(wallet: LokWallet): LokWallet;
};

export function createLokWallet(): LokWallet {
  return {
    version: LOK_WALLET_VERSION,
    balance: 0,
    progressMs: 0,
    lifetimeEarned: 0,
    updatedAt: Date.now(),
    owner: { provider: 'local', subject: null },
  };
}

export function normalizeLokWallet(value: Partial<LokWallet> | null | undefined): LokWallet {
  const base = createLokWallet();
  return {
    ...base,
    ...value,
    version: LOK_WALLET_VERSION,
    balance: Math.max(0, Math.floor(Number.isFinite(value?.balance) ? Number(value?.balance) : 0)),
    progressMs: Math.max(0, Number.isFinite(value?.progressMs) ? Number(value?.progressMs) : 0),
    lifetimeEarned: Math.max(0, Math.floor(Number.isFinite(value?.lifetimeEarned) ? Number(value?.lifetimeEarned) : Number(value?.balance ?? 0))),
    owner: {
      provider: value?.owner?.provider ?? 'local',
      subject: value?.owner?.subject ?? null,
    },
    updatedAt: Number.isFinite(value?.updatedAt) ? Number(value?.updatedAt) : Date.now(),
  };
}

function canUseStorage() {
  return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
}

export const localLokWalletAdapter: LokWalletAdapter = {
  load() {
    if (!canUseStorage()) return createLokWallet();
    const raw = window.localStorage.getItem(LOK_WALLET_KEY);
    if (!raw) return createLokWallet();
    try { return normalizeLokWallet(JSON.parse(raw)); }
    catch {
      window.localStorage.removeItem(LOK_WALLET_KEY);
      return createLokWallet();
    }
  },
  save(wallet) {
    const normalized = normalizeLokWallet({ ...wallet, updatedAt: Date.now() });
    if (canUseStorage()) window.localStorage.setItem(LOK_WALLET_KEY, JSON.stringify(normalized));
    return normalized;
  },
};

/**
 * The game talks to a wallet adapter rather than directly to authentication.
 * A future G-Six server adapter can replace local storage and bind the same
 * wallet to Apple, Discord, GitHub, or a first-party G-Six identity.
 */
export function mergeRunIntoWallet(wallet: LokWallet, runBalance: number, runProgressMs: number): LokWallet {
  const balance = Math.max(wallet.balance, Math.max(0, Math.floor(runBalance || 0)));
  const progressMs = balance === wallet.balance ? wallet.progressMs : Math.max(wallet.progressMs, Math.max(0, runProgressMs || 0));
  return normalizeLokWallet({
    ...wallet,
    balance,
    progressMs,
    lifetimeEarned: Math.max(wallet.lifetimeEarned, balance),
  });
}
