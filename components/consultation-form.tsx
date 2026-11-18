"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import type { FormEvent, InputHTMLAttributes } from "react";
import { flushSync } from "react-dom";
import { submitConsultation } from "@/app/actions";
import {
  CONTACTS,
  DAYS,
  EMAIL_PATTERN,
  NEEDS,
  SCOPES,
  STARTS,
  TIMES,
  summarize,
  type ConsultationRequest,
} from "@/lib/consultation";
import { BOOKING_URL, STUDIO_EMAIL } from "@/lib/site";
import { CopyButton } from "./copy-button";

const DRAFT_KEY = "nudo-concierge";
const STEP_NAMES = ["Your brand", "Your moment", "Your details"];
// Hidden from people; bots that fill every field reveal themselves here.
const HONEYPOT = "company";

type Field = "need" | "brand" | "name" | "email" | "consent";
type Errors = Partial<Record<Field, string>>;
// Order in which an invalid field receives focus after a failed step.
const FIELD_ORDER: Field[] = ["need", "brand", "name", "email", "consent"];

function validate(step: number, data: FormData): Errors {
  const text = (key: string) => String(data.get(key) ?? "").trim();
  const errors: Errors = {};
  if (step === 1) {
    if (!data.getAll("need").length) errors.need = 'Choose at least one option, or "Not sure yet".';
    if (!text("brand")) errors.brand = "Please add your brand name.";
  }
  if (step === 3) {
    if (!text("name")) errors.name = "Please add your name.";
    if (!EMAIL_PATTERN.test(text("email")))
      errors.email = "Please add a valid email address so we can reply.";
    if (!data.get("consent")) errors.consent = "Please confirm we may use your details to reply.";
  }
  return errors;
}

function toRequest(data: FormData, timezone: string): ConsultationRequest {
  const text = (key: string) => String(data.get(key) ?? "").trim();
  const list = (key: string) => data.getAll(key).map(String);
  return {
    need: list("need"),
    brand: text("brand"),
    link: text("link"),
    scope: text("scope"),
    start: text("start"),
    name: text("name"),
    email: text("email"),
    phone: text("phone"),
    contact: text("contact"),
    days: list("days"),
    time: list("time"),
    timezone,
    message: text("message"),
  };
}

function saveDraft(form: HTMLFormElement) {
  const draft: Record<string, string[]> = {};
  for (const [key, value] of new FormData(form)) {
    if (key !== "consent" && key !== HONEYPOT) (draft[key] ??= []).push(String(value));
  }
  try {
    localStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
  } catch {
    // Storage unavailable: the draft is only a convenience.
  }
}

function restoreDraft(form: HTMLFormElement) {
  let draft: Record<string, string | string[]> | null = null;
  try {
    draft = JSON.parse(localStorage.getItem(DRAFT_KEY) ?? "null");
  } catch {
    return;
  }
  if (!draft) return;
  for (const el of form.querySelectorAll<HTMLInputElement | HTMLTextAreaElement>("[name]")) {
    const saved = draft[el.name];
    if (saved === undefined || el.name === "consent") continue;
    const values = ([] as string[]).concat(saved);
    if (el instanceof HTMLInputElement && (el.type === "checkbox" || el.type === "radio")) {
      el.checked = values.includes(el.value);
    } else {
      el.value = values[0] ?? "";
    }
  }
}

function clearDraft() {
  try {
    localStorage.removeItem(DRAFT_KEY);
  } catch {
    // Nothing to clear.
  }
}

const noSubscribe = () => () => {};
function readTimeZone() {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone ?? "";
  } catch {
    return "";
  }
}

const errorId = (name: string) => `${name}-error`;

function FieldError({ name, message }: { name: string; message?: string }) {
  if (!message) return null;
  return (
    <p className="field-error" id={errorId(name)}>
      {message}
    </p>
  );
}

function ChipGroup({
  label,
  name,
  type,
  options,
  defaultValue,
  error,
}: {
  label: string;
  name: string;
  type: "checkbox" | "radio";
  options: string[];
  defaultValue?: string;
  error?: string;
}) {
  const labelId = `${name}-label`;
  return (
    <div className="field-group">
      <span className="mono" id={labelId}>
        {label}
      </span>
      <div
        className="chips"
        role={type === "radio" ? "radiogroup" : "group"}
        aria-labelledby={labelId}
      >
        {options.map((option) => (
          <label className="chip" key={option}>
            <input
              type={type}
              name={name}
              value={option}
              defaultChecked={option === defaultValue}
              aria-invalid={error ? true : undefined}
              aria-describedby={error ? errorId(name) : undefined}
            />
            {option}
          </label>
        ))}
      </div>
      <FieldError name={name} message={error} />
    </div>
  );
}

function TextField({
  name,
  label,
  required,
  error,
  full,
  ...input
}: {
  name: string;
  label: string;
  required?: boolean;
  error?: string;
  full?: boolean;
} & InputHTMLAttributes<HTMLInputElement>) {
  const id = `f-${name}`;
  return (
    <div className={full ? "field full" : "field"}>
      <label htmlFor={id}>
        {label}
        {required && (
          <>
            {" "}
            <span className="req" aria-hidden="true">*</span>
          </>
        )}
      </label>
      <input
        id={id}
        name={name}
        aria-required={required || undefined}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorId(name) : undefined}
        {...input}
      />
      <FieldError name={name} message={error} />
    </div>
  );
}

export function ConsultationForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const doneRef = useRef<HTMLDivElement>(null);
  const [step, setStep] = useState(1);
  const [errors, setErrors] = useState<Errors>({});
  const [sending, setSending] = useState(false);
  const [result, setResult] = useState<{ request: ConsultationRequest; sent: boolean } | null>(null);
  const timezone = useSyncExternalStore(noSubscribe, readTimeZone, () => "");
  const total = STEP_NAMES.length;

  useEffect(() => {
    if (formRef.current) restoreDraft(formRef.current);
  }, []);

  // Steps differ in height, so the top of the panel can end up above the screen after a change.
  // Bring it back just below the sticky header, and leave the page alone when it is still in view.
  function revealPanel() {
    const panel = panelRef.current;
    if (!panel) return;
    const headerClearance = parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop) || 0;
    if (panel.getBoundingClientRect().top < headerClearance) panel.scrollIntoView({ block: "start" });
  }

  function showStep(next: number) {
    flushSync(() => {
      setStep(next);
      setErrors({});
    });
    formRef.current
      ?.querySelector<HTMLElement>(`[data-step="${next}"] h3`)
      ?.focus({ preventScroll: true });
    revealPanel();
  }

  function handleChange(event: FormEvent<HTMLFormElement>) {
    const form = event.currentTarget;
    saveDraft(form);
    // An error clears as soon as its field is fixed; new errors wait for the next submit.
    if (Object.keys(errors).length) {
      const current = validate(step, new FormData(form));
      setErrors((previous) => {
        const next: Errors = {};
        for (const field of FIELD_ORDER) {
          if (previous[field] && current[field]) next[field] = current[field];
        }
        return next;
      });
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);

    const found = validate(step, data);
    const firstInvalid = FIELD_ORDER.find((field) => found[field]);
    if (firstInvalid) {
      flushSync(() => setErrors(found));
      form.querySelector<HTMLElement>(`[name="${firstInvalid}"]`)?.focus();
      return;
    }
    if (step < total) {
      showStep(step + 1);
      return;
    }

    const request = toRequest(data, timezone);
    setSending(true);
    const sent = await submitConsultation(request, data.get(HONEYPOT)).catch(() => false);
    if (sent) clearDraft();
    flushSync(() => setResult({ request, sent }));
    doneRef.current?.focus({ preventScroll: true });
    revealPanel();
  }

  const firstName = result?.request.name.split(" ")[0] ?? "";
  const summary = result ? summarize(result.request) : "";

  return (
    <div className="panel" ref={panelRef}>
      <form
        ref={formRef}
        noValidate
        hidden={result !== null}
        onSubmit={handleSubmit}
        onChange={handleChange}
      >
        <div className="progress">
          <span className="mono">
            Step {step} of {total}
          </span>
          <span className="mono">{STEP_NAMES[step - 1]}</span>
        </div>
        <div className="bar" aria-hidden="true">
          <i style={{ width: `${(step / total) * 100}%` }} />
        </div>
        <div className="trap" aria-hidden="true">
          <label>
            Company <input name={HONEYPOT} tabIndex={-1} autoComplete="off" />
          </label>
        </div>

        <div className="step" data-step="1" hidden={step !== 1}>
          <h3 tabIndex={-1}>How can we help?</h3>
          <p className="hint">Choose what feels closest. We will refine it together.</p>
          <ChipGroup
            label="You are looking for"
            name="need"
            type="checkbox"
            options={NEEDS}
            error={errors.need}
          />
          <div className="fields">
            <TextField
              name="brand"
              label="Brand name"
              required
              autoComplete="organization"
              error={errors.brand}
            />
            <TextField name="link" label="Website or Instagram" placeholder="@yourbrand" />
          </div>
        </div>

        <div className="step" data-step="2" hidden={step !== 2}>
          <h3 tabIndex={-1}>Where is your brand today?</h3>
          <p className="hint">So the first conversation starts in the right place.</p>
          <ChipGroup label="The commission" name="scope" type="radio" options={SCOPES} />
          <ChipGroup label="You would like to begin" name="start" type="radio" options={STARTS} />
        </div>

        <div className="step" data-step="3" hidden={step !== 3}>
          <h3 tabIndex={-1}>How shall we reach you?</h3>
          <p className="hint">
            We write back personally.
            {timezone && ` Your time zone: ${timezone.replace(/_/g, " ")}.`}
          </p>
          <div className="fields">
            <TextField
              name="name"
              label="Your name"
              required
              autoComplete="name"
              error={errors.name}
            />
            <TextField
              name="email"
              label="Email"
              required
              type="email"
              autoComplete="email"
              error={errors.email}
            />
            <TextField name="phone" label="Phone or WhatsApp" full type="tel" autoComplete="tel" />
          </div>
          <ChipGroup
            label="Preferred way to talk"
            name="contact"
            type="radio"
            options={CONTACTS}
            defaultValue="Video call"
          />
          <ChipGroup label="Days that suit you" name="days" type="checkbox" options={DAYS} />
          <ChipGroup label="Time of day" name="time" type="checkbox" options={TIMES} />
          <div className="fields">
            <div className="field full">
              <label htmlFor="f-message">Anything you would like us to know</label>
              <textarea id="f-message" name="message" />
            </div>
          </div>
          <label className="consent">
            <input
              type="checkbox"
              name="consent"
              aria-invalid={errors.consent ? true : undefined}
              aria-describedby={errors.consent ? errorId("consent") : undefined}
            />
            I agree that NUDO may use these details to reply to my request.
          </label>
          <FieldError name="consent" message={errors.consent} />
        </div>

        <div className="nav-row">
          <button
            className="back"
            type="button"
            hidden={step === 1}
            onClick={() => showStep(step - 1)}
          >
            <span aria-hidden="true">←</span> Back
          </button>
          <span />
          <button className="cta solid" type="submit" disabled={sending}>
            {sending ? (
              "Sending…"
            ) : (
              <>
                {step === total ? "Send request" : "Continue"}{" "}
                <span className="arr" aria-hidden="true">→</span>
              </>
            )}
          </button>
        </div>
      </form>

      {result && (
        <div className="done" ref={doneRef} tabIndex={-1}>
          <span className="mono">{result.sent ? "Request received" : "One last step"}</span>
          <h3>
            {result.sent ? "Thank you" : "Almost there"}
            {firstName && `, ${firstName}`}.
          </h3>
          <p>
            {result.sent
              ? `Your request for ${result.request.brand} is with us, and a confirmation is on its way to ${result.request.email}. This is what happens next.`
              : `Send your request to ${STUDIO_EMAIL} to confirm it. Your answers are ready below.`}
          </p>
          <ol className="next">
            <li>
              <span className="n">i.</span>
              <span>A founder reads your request and looks at your brand.</span>
            </li>
            <li>
              <span className="n">ii.</span>
              <span>We write to you to arrange your conversation.</span>
            </li>
            <li>
              <span className="n">iii.</span>
              <span>After we talk, we write a proposal for your brand alone.</span>
            </li>
          </ol>

          {result.sent ? (
            BOOKING_URL && (
              <div className="done-actions">
                <a
                  className="cta solid"
                  href={`${BOOKING_URL}${BOOKING_URL.includes("?") ? "&" : "?"}name=${encodeURIComponent(result.request.name)}&email=${encodeURIComponent(result.request.email)}`}
                  target="_blank"
                  rel="noopener"
                >
                  Choose your time <span className="arr" aria-hidden="true">→</span>
                </a>
              </div>
            )
          ) : (
            <>
              <div className="summary" tabIndex={0} role="region" aria-label="Your request">
                {summary}
              </div>
              <div className="done-actions">
                <a
                  className="cta solid"
                  href={`mailto:${STUDIO_EMAIL}?subject=${encodeURIComponent(`Consultation request — ${result.request.brand}`)}&body=${encodeURIComponent(`${summary}\n`)}`}
                >
                  Send by email <span className="arr" aria-hidden="true">→</span>
                </a>
                <CopyButton className="textbtn" text={summary} label="Copy request" />
              </div>
              <p className="preview-note">
                If the button does not open your email app, copy the request and send it to{" "}
                {STUDIO_EMAIL}.
              </p>
            </>
          )}
        </div>
      )}
    </div>
  );
}
