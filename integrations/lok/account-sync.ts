import type { LokIdentityProvider, LokWallet } from './wallet';

export type LokAccountIdentity = {
  provider: LokIdentityProvider;
  subject: string;
  displayName?: string;
};

export type LokCloudSnapshot = {
  wallet: LokWallet;
  revision: string;
  syncedAt: number;
};

export interface LokAccountSyncAdapter {
  signIn(provider: Exclude<LokIdentityProvider, 'local'>): Promise<LokAccountIdentity>;
  signOut(): Promise<void>;
  currentIdentity(): Promise<LokAccountIdentity | null>;
  pullWallet(identity: LokAccountIdentity): Promise<LokCloudSnapshot | null>;
  pushWallet(identity: LokAccountIdentity, wallet: LokWallet, expectedRevision?: string): Promise<LokCloudSnapshot>;
}

/**
 * Future server rules:
 * - Apple / Discord / GitHub are identity providers, not wallet authorities.
 * - G-Six servers own the authoritative wallet once an account is linked.
 * - Local wallets can be claimed/merged once, with conflict handling by revision.
 * - Purchases and LOK debits must be verified server-side after cloud sync exists.
 * - Spend It All remains playable without an account; sign-in is for portability.
 */
export const LOK_ACCOUNT_SYNC_NOT_CONFIGURED = true;
