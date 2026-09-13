'use client';

import { useState, type FormEvent } from 'react';
import { useLokAccount } from '@/app/hooks/useLokAccount';
import { joinWaitlist, signInWithEmail, signInWithGoogle, signOut, signUpWithEmail, submitFeedback, type FeedbackCategory } from '@/integrations/lok/founder';

export function AccountPanel() {
  const { session, user, available } = useLokAccount();
  const [mode, setMode] = useState<'sign-in' | 'sign-up'>('sign-in');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const [waitlistEmail, setWaitlistEmail] = useState('');
  const [waitlistStatus, setWaitlistStatus] = useState<string | null>(null);

  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [feedbackCategory, setFeedbackCategory] = useState<FeedbackCategory>('idea');
  const [feedbackRating, setFeedbackRating] = useState(0);
  const [feedbackStatus, setFeedbackStatus] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setSubmitting(true);
    const { error } = mode === 'sign-in' ? await signInWithEmail(email, password) : await signUpWithEmail(email, password);
    setSubmitting(false);
    setStatus(error ?? (mode === 'sign-in' ? 'Welcome back.' : 'Check your email to confirm your account.'));
  };

  const handleGoogle = async () => {
    const { error } = await signInWithGoogle();
    if (error) setStatus(error);
  };

  const handleWaitlist = async (event: FormEvent) => {
    event.preventDefault();
    const { error } = await joinWaitlist({ email: waitlistEmail });
    setWaitlistStatus(error ?? "You're on the list.");
    if (!error) setWaitlistEmail('');
  };

  const handleFeedback = async (event: FormEvent) => {
    event.preventDefault();
    const { error } = await submitFeedback({ message: feedbackMessage, category: feedbackCategory, rating: feedbackRating || undefined }, user?.id);
    setFeedbackStatus(error ?? 'Thanks -- got it.');
    if (!error) { setFeedbackMessage(''); setFeedbackRating(0); }
  };

  if (session && user) {
    return <div className="lok-account signed-in">
      <p><b>Signed in</b> as {user.email}</p>
      <button type="button" onClick={() => void signOut()}>Sign out</button>
    </div>;
  }

  return <div className="lok-account">
    <form className="lok-account-form" onSubmit={handleSubmit}>
      <div className="lok-account-tabs">
        <button type="button" className={mode === 'sign-in' ? 'active' : ''} onClick={() => setMode('sign-in')}>Sign in</button>
        <button type="button" className={mode === 'sign-up' ? 'active' : ''} onClick={() => setMode('sign-up')}>Create account</button>
      </div>
      <label>Email<input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} /></label>
      <label>Password<input type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} /></label>
      <button type="submit" className="lok-account-primary" disabled={!available || submitting}>{submitting ? 'Please wait...' : mode === 'sign-in' ? 'Sign in' : 'Create account'}</button>
      <div className="lok-account-oauth">
        <button type="button" onClick={() => void handleGoogle()} disabled={!available}>Continue with Google</button>
        <button type="button" disabled title="Apple sign-in is coming soon">Continue with Apple &middot; Coming Soon</button>
      </div>
      {status ? <p className="muted">{status}</p> : null}
      {!available ? <p className="muted">Sign-in isn&apos;t configured in this environment yet.</p> : null}
    </form>

    <form className="lok-waitlist-form" onSubmit={handleWaitlist}>
      <h3>Join the waitlist</h3>
      <div className="lok-inline-form">
        <input type="email" required placeholder="you@example.com" value={waitlistEmail} onChange={(e) => setWaitlistEmail(e.target.value)} />
        <button type="submit" disabled={!available}>Join</button>
      </div>
      {waitlistStatus ? <p className="muted">{waitlistStatus}</p> : null}
    </form>

    <form className="lok-feedback-form" onSubmit={handleFeedback}>
      <h3>Feedback</h3>
      <select value={feedbackCategory} onChange={(e) => setFeedbackCategory(e.target.value as FeedbackCategory)}>
        <option value="idea">Idea / suggestion</option>
        <option value="bug">Bug</option>
        <option value="balance">Balance</option>
        <option value="other">Other</option>
      </select>
      <textarea required placeholder="A feature idea, a bug you hit, a system you'd love tuned..." value={feedbackMessage} onChange={(e) => setFeedbackMessage(e.target.value)} />
      <div className="lok-feedback-rating" role="radiogroup" aria-label="Rating (optional)">
        {[1, 2, 3, 4, 5].map((value) => <button type="button" key={value} className={feedbackRating >= value ? 'active' : ''} aria-pressed={feedbackRating === value} onClick={() => setFeedbackRating(feedbackRating === value ? 0 : value)}>★</button>)}
      </div>
      <button type="submit" disabled={!available}>Send feedback</button>
      {feedbackStatus ? <p className="muted">{feedbackStatus}</p> : null}
    </form>
  </div>;
}
