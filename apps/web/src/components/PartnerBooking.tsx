"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";

/** Change these to match real availability. All times are Eastern Time. */
const CONTACT_EMAIL = "hello@protscope.ai";
const SLOT_FIRST_HOUR = 10;
const SLOT_LAST_HOUR = 16; // last slot starts at 15:30
const SKIP_HOURS = [12]; // lunch
const SLOT_MINUTES = 30;
const WEEKS_SHOWN = 3;

/** Optional: a Calendly / Cal.com link for instant confirmed booking. */
const BOOKING_URL = process.env.NEXT_PUBLIC_BOOKING_URL;

const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri"];

function startOfDay(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

function mondayOf(d: Date) {
  const s = startOfDay(d);
  const dow = (s.getDay() + 6) % 7; // Monday = 0
  s.setDate(s.getDate() - dow);
  return s;
}

function dayKey(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function formatDay(d: Date) {
  return d.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });
}

function formatTime(hour: number, minute: number) {
  const h12 = hour % 12 === 0 ? 12 : hour % 12;
  return `${h12}:${String(minute).padStart(2, "0")} ${hour < 12 ? "AM" : "PM"}`;
}

function buildSlots() {
  const slots: Array<{ id: string; label: string }> = [];
  for (let h = SLOT_FIRST_HOUR; h < SLOT_LAST_HOUR; h += 1) {
    if (SKIP_HOURS.includes(h)) continue;
    for (let m = 0; m < 60; m += SLOT_MINUTES) {
      slots.push({ id: `${h}:${m}`, label: formatTime(h, m) });
    }
  }
  return slots;
}

/**
 * Day and time picker for a partner call. It sends a request by email; it does not check a live
 * calendar, so the confirmation always comes from a person.
 */
export function PartnerBooking() {
  const [today, setToday] = useState<Date | null>(null);
  const [day, setDay] = useState<Date | null>(null);
  const [slot, setSlot] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [org, setOrg] = useState("");
  const [topic, setTopic] = useState("");
  const [sent, setSent] = useState(false);

  useEffect(() => {
    setToday(startOfDay(new Date()));
  }, []);

  const slots = useMemo(buildSlots, []);

  const weeks = useMemo(() => {
    if (!today) return [];
    const first = mondayOf(today);
    return Array.from({ length: WEEKS_SHOWN }, (_, w) =>
      WEEKDAYS.map((_, d) => {
        const date = new Date(first);
        date.setDate(first.getDate() + w * 7 + d);
        return date;
      }),
    );
  }, [today]);

  const monthLabel = useMemo(() => {
    if (!weeks.length) return "";
    const a = weeks[0][0];
    const b = weeks[weeks.length - 1][4];
    const fmt = (d: Date, withYear: boolean) =>
      d.toLocaleDateString("en-US", withYear ? { month: "long", year: "numeric" } : { month: "long" });
    return a.getMonth() === b.getMonth() ? fmt(a, true) : `${fmt(a, false)} – ${fmt(b, true)}`;
  }, [weeks]);

  const slotLabel = slots.find((s) => s.id === slot)?.label;
  const canSubmit = Boolean(day && slot && name.trim() && email.includes("@"));

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!canSubmit || !day || !slotLabel) return;
    let zone = "unknown";
    try {
      zone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    } catch {
      /* ignore */
    }
    const when = `${formatDay(day)}, ${slotLabel} Eastern Time`;
    const subject = encodeURIComponent(`ProtScope partner call request: ${when}`);
    const lines: string[] = [
      "I would like to book a 30-minute call about a research partnership.",
      "",
      `Requested time: ${when}`,
      `Name: ${name.trim()}`,
      `Email: ${email.trim()}`,
    ];
    if (org.trim()) lines.push(`Organization: ${org.trim()}`);
    lines.push(`My time zone: ${zone}`);
    if (topic.trim()) lines.push("", "What I would like to discuss:", topic.trim());
    const body = encodeURIComponent(lines.join("\n"));
    setSent(true);
    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`;
  }

  if (sent && day && slotLabel) {
    return (
      <div className="book-card book-done" id="book" aria-live="polite">
        <h3>Press send to finish</h3>
        <p>
          <strong>
            {formatDay(day)}, {slotLabel} ET
          </strong>
          . This is a request. We will reply to confirm.
        </p>
        <p className="hint">
          No email draft? Write to <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
        </p>
        <button type="button" className="btn btn-ghost" onClick={() => setSent(false)}>
          Change time
        </button>
      </div>
    );
  }

  return (
    <form className="book-card" id="book" onSubmit={onSubmit}>
      <p className="book-meta">30 minutes · Eastern Time · we confirm by email</p>

      {BOOKING_URL && (
        <p>
          <a className="btn btn-ghost" href={BOOKING_URL} target="_blank" rel="noreferrer">
            Book instantly
          </a>
        </p>
      )}

      <div className="book-cal" role="group" aria-label="Choose a day">
        <p className="book-cal-month">{monthLabel || "\u00a0"}</p>
        <div className="book-cal-head" aria-hidden="true">
          {WEEKDAYS.map((w) => (
            <span key={w}>{w}</span>
          ))}
        </div>
        {weeks.length === 0 ? (
          <p className="hint">Loading calendar…</p>
        ) : (
          weeks.map((week, wi) => (
            <div className="book-cal-week" key={wi}>
              {week.map((date) => {
                const past = !today || date <= today;
                const selected = day ? dayKey(day) === dayKey(date) : false;
                return (
                  <button
                    key={dayKey(date)}
                    type="button"
                    className={`book-cal-day${selected ? " is-selected" : ""}`}
                    disabled={past}
                    aria-pressed={selected}
                    aria-label={formatDay(date)}
                    onClick={() => {
                      setDay(date);
                      setSlot(null);
                    }}
                  >
                    {date.getDate()}
                  </button>
                );
              })}
            </div>
          ))
        )}
      </div>

      {day && (
        <div className="book-slots" role="group" aria-label={`Times on ${formatDay(day)}`}>
          <p className="explorer-chip-label">{formatDay(day)}</p>
          <div className="chip-row">
            {slots.map((s) => (
              <button
                key={s.id}
                type="button"
                className={`chip ${slot === s.id ? "chip-active" : ""}`}
                aria-pressed={slot === s.id}
                onClick={() => setSlot(s.id)}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="book-fields">
        <label htmlFor="book-name">Name</label>
        <input
          id="book-name"
          className="ask-input explorer-input"
          autoComplete="name"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <label htmlFor="book-email">Email</label>
        <input
          id="book-email"
          className="ask-input explorer-input"
          type="email"
          autoComplete="email"
          required
          placeholder="you@company.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <label htmlFor="book-org">Organization (optional)</label>
        <input
          id="book-org"
          className="ask-input explorer-input"
          autoComplete="organization"
          value={org}
          onChange={(e) => setOrg(e.target.value)}
        />
        <label htmlFor="book-topic">Topic (optional)</label>
        <textarea
          id="book-topic"
          className="ask-input"
          rows={2}
          placeholder="e.g. the pathway you study"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
        />
      </div>

      <div className="ask-actions">
        <button type="submit" className="btn btn-primary" disabled={!canSubmit}>
          Request this time
        </button>
        <span className="hint">
          {!day ? "Choose a day." : !slot ? "Choose a time." : "Opens an email draft."}
        </span>
      </div>
    </form>
  );
}
