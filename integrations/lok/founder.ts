import { createClient, type Session, type SupabaseClient, type User } from '@supabase/supabase-js';

/**
 * Shared LokServices Supabase project (auth, alpha waitlist, feedback) --
 * the same backend 616 Survivor and other Lok products use. RLS on the
 * underlying tables is what actually gates access, so the anon key is
 * safe to expose client-side.
 */
const SOURCE = 'spend_it_all';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

/** Undefined when NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY aren't set -- callers must handle the missing-client case. */
export const lokAuthClient: SupabaseClient | undefined = url && anonKey ? createClient(url, anonKey) : undefined;
export const lokAccountsAvailable = Boolean(lokAuthClient);

export type NotificationPreference = 'email' | 'sms' | 'both' | 'none';
export type FeedbackCategory = 'bug' | 'idea' | 'balance' | 'other';

export async function signInWithEmail(email: string, password: string) {
  if (!lokAuthClient) return { error: 'Auth is not configured yet.' };
  const { error } = await lokAuthClient.auth.signInWithPassword({ email, password });
  return { error: error?.message ?? null };
}

export async function signUpWithEmail(email: string, password: string) {
  if (!lokAuthClient) return { error: 'Auth is not configured yet.' };
  const { error } = await lokAuthClient.auth.signUp({ email, password });
  return { error: error?.message ?? null };
}

export async function signInWithGoogle() {
  if (!lokAuthClient) return { error: 'Auth is not configured yet.' };
  const { error } = await lokAuthClient.auth.signInWithOAuth({ provider: 'google' });
  return { error: error?.message ?? null };
}

export async function signOut() {
  if (!lokAuthClient) return;
  await lokAuthClient.auth.signOut();
}

export async function getSession(): Promise<Session | null> {
  if (!lokAuthClient) return null;
  const { data } = await lokAuthClient.auth.getSession();
  return data.session;
}

export function onAuthStateChange(callback: (session: Session | null) => void): () => void {
  if (!lokAuthClient) return () => {};
  const { data } = lokAuthClient.auth.onAuthStateChange((_event, session) => callback(session));
  return () => data.subscription.unsubscribe();
}

export interface JoinWaitlistInput {
  email: string;
  phone?: string;
  notificationPref?: NotificationPreference;
  /** founder_signups.handle is required by the shared schema; derived from the email's local part when omitted. */
  handle?: string;
}

export async function joinWaitlist(input: JoinWaitlistInput) {
  if (!lokAuthClient) return { error: 'Waitlist is not configured yet.' };
  const handle = input.handle ?? input.email.split('@')[0] ?? input.email;
  const { error } = await lokAuthClient.from('founder_signups').insert({
    source: SOURCE,
    handle,
    email: input.email,
    phone: input.phone ?? null,
    notification_pref: input.notificationPref ?? null,
  });
  return { error: error?.message ?? null };
}

export interface SubmitFeedbackInput {
  message: string;
  category?: FeedbackCategory;
  /** 1-5 */
  rating?: number;
  contactEmail?: string;
}

export async function submitFeedback(input: SubmitFeedbackInput, userId?: string) {
  if (!lokAuthClient) return { error: 'Feedback is not configured yet.' };
  const { error } = await lokAuthClient.from('product_feedback').insert({
    source: SOURCE,
    message: input.message,
    category: input.category ?? null,
    rating: input.rating ?? null,
    contact_email: input.contactEmail ?? null,
    user_id: userId ?? null,
  });
  return { error: error?.message ?? null };
}

export type { Session, User };
