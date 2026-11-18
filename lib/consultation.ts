// The consultation request, shared by the form, the server action and the email templates.

export const NEEDS = [
  "A new brand identity",
  "To evolve an existing brand",
  "A website or online boutique",
  "Campaign and imagery",
  "A creative director on call",
  "Not sure yet",
];
export const SCOPES = ["A single project", "A complete brand", "An ongoing partnership", "Not sure yet"];
export const STARTS = ["As soon as possible", "In the coming months", "Simply exploring"];
export const CONTACTS = ["Video call", "Phone call", "WhatsApp"];
export const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri"];
export const TIMES = ["Morning", "Afternoon", "Evening"];

export const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export type ConsultationRequest = {
  need: string[];
  brand: string;
  link: string;
  scope: string;
  start: string;
  name: string;
  email: string;
  phone: string;
  contact: string;
  days: string[];
  time: string[];
  timezone: string;
  message: string;
};

const LABELS: [keyof ConsultationRequest, string][] = [
  ["name", "Name"],
  ["email", "Email"],
  ["phone", "Phone"],
  ["brand", "Brand"],
  ["link", "Website / Instagram"],
  ["need", "Looking for"],
  ["scope", "Commission"],
  ["start", "Begin"],
  ["contact", "Preferred contact"],
  ["days", "Days"],
  ["time", "Time of day"],
  ["timezone", "Time zone"],
  ["message", "Message"],
];

// Label and value pairs for the answered fields, in reading order.
export function describe(
  request: ConsultationRequest,
  keys: (keyof ConsultationRequest)[] = LABELS.map(([key]) => key),
): [string, string][] {
  return LABELS.filter(([key]) => keys.includes(key))
    .map(([key, label]): [string, string] => {
      const value = request[key];
      return [label, Array.isArray(value) ? value.join(", ") : value];
    })
    .filter(([, value]) => value);
}

export function summarize(request: ConsultationRequest) {
  return describe(request)
    .map(([label, value]) => `${label}: ${value}`)
    .join("\n");
}

// Server actions accept any POST body, so the request is rebuilt from scratch:
// free text is length-capped and every choice must be one the form offers.
export function parseRequest(input: unknown): ConsultationRequest | null {
  if (typeof input !== "object" || input === null) return null;
  const record = input as Record<string, unknown>;

  const text = (key: string, max: number) => {
    const value = record[key];
    if (value === undefined) return "";
    return typeof value === "string" && value.length <= max ? value.trim() : null;
  };
  const choice = (key: string, options: string[]) => {
    const value = text(key, 100);
    return value === "" || (value !== null && options.includes(value)) ? value : null;
  };
  const choices = (key: string, options: string[]) => {
    const value = record[key] ?? [];
    return Array.isArray(value) && value.every((item) => options.includes(item))
      ? [...new Set(value as string[])]
      : null;
  };

  const request = {
    need: choices("need", NEEDS),
    brand: text("brand", 120),
    link: text("link", 200),
    scope: choice("scope", SCOPES),
    start: choice("start", STARTS),
    name: text("name", 100),
    email: text("email", 200),
    phone: text("phone", 40),
    contact: choice("contact", CONTACTS),
    days: choices("days", DAYS),
    time: choices("time", TIMES),
    timezone: text("timezone", 64),
    message: text("message", 4000),
  };

  if (Object.values(request).some((value) => value === null)) return null;
  const valid = request as ConsultationRequest;
  if (!valid.need.length || !valid.brand || !valid.name || !EMAIL_PATTERN.test(valid.email)) {
    return null;
  }
  return valid;
}
