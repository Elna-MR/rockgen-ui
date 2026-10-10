"use client";

import { FormEvent, useEffect, useState } from "react";

const STORAGE_KEY = "protoscope_waitlisted";

/** Soft waitlist capture for Protoscope™ Pro (no payments in Phase A). */
export function BetaWaitlistForm() {
  const [email, setEmail] = useState("");
  const [joined, setJoined] = useState(false);

  useEffect(() => {
    try {
      if (window.localStorage.getItem(STORAGE_KEY) === "1") setJoined(true);
    } catch {
      /* ignore */
    }
  }, []);

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    const trimmed = email.trim();
    if (!trimmed || !trimmed.includes("@")) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, "1");
      window.localStorage.setItem(`${STORAGE_KEY}_email`, trimmed);
    } catch {
      /* ignore */
    }
    setJoined(true);
    const subject = encodeURIComponent("Protoscope™ Beta waitlist");
    const body = encodeURIComponent(
      `Please add me to the Protoscope™ Pro / Agentics waitlist.\n\nEmail: ${trimmed}\n`,
    );
    window.location.href = `mailto:hello@protscope.ai?subject=${subject}&body=${body}`;
  };

  if (joined) {
    return (
      <div className="beta-waitlist-done" id="waitlist">
        <p className="eyebrow">Waitlist</p>
        <h3>You’re on the list</h3>
        <p>
          Thanks for your interest in Protoscope™ Pro Agentics. Complete the email draft if your
          mail client opened, or write us at hello@protscope.ai.
        </p>
      </div>
    );
  }

  return (
    <form className="beta-waitlist-form" id="waitlist" onSubmit={onSubmit}>
      <p className="eyebrow">Protoscope™ Pro</p>
      <h3>Join the waitlist</h3>
      <p>
        No charge yet. We will notify you when advanced Agentics capabilities open for beta
        subscribers.
      </p>
      <div className="beta-waitlist-row">
        <label className="sr-only" htmlFor="beta-waitlist-email">
          Email
        </label>
        <input
          id="beta-waitlist-email"
          className="ask-input explorer-input"
          type="email"
          name="email"
          required
          autoComplete="email"
          placeholder="you@institution.edu"
          value={email}
          onChange={(ev) => setEmail(ev.target.value)}
        />
        <button type="submit" className="btn btn-primary">
          Join waitlist
        </button>
      </div>
    </form>
  );
}
