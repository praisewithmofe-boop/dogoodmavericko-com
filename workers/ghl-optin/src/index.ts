const GHL_UPSERT_URL = "https://services.leadconnectorhq.com/contacts/upsert";
const GHL_API_VERSION = "2021-07-28";
const LIST_TAGS = {
  terrific30: "terrific30-free",
  newsletter: "dogood-newsletter",
} as const;

type SignupList = keyof typeof LIST_TAGS;

const CONTACT_SOURCE = "dogoodmavericko.com";
const DEFAULT_LOCATION_ID = "B61Axi1jMZDmpwTLX4tR";
const PRODUCTION_ORIGIN = "https://dogoodmavericko.com";
const MAX_BODY_BYTES = 4096;
const MAX_NAME_LENGTH = 80;

export const RATE_LIMIT_MAX = 8;
export const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;

const EMAIL_PATTERN =
  /^[a-z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?(?:\.[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?)+$/i;

export interface Env {
  GHL_PRIVATE_INTEGRATION_TOKEN?: string;
  GHL_LOCATION_ID?: string;
}

export interface HandlerDeps {
  fetchImpl?: typeof fetch;
  now?: () => number;
}

interface RateBucket {
  start: number;
  count: number;
}

export function createHandler(deps: HandlerDeps = {}) {
  const hits = new Map<string, RateBucket>();
  const fetchImpl = deps.fetchImpl ?? fetch;
  const now = deps.now ?? (() => Date.now());

  return {
    async fetch(request: Request, env: Env): Promise<Response> {
      const origin = request.headers.get("Origin");
      const allowedOrigin = origin !== null && isAllowedOrigin(origin);

      if (request.method === "OPTIONS") {
        if (!allowedOrigin || origin === null) {
          return new Response(null, { status: 403 });
        }
        return new Response(null, { status: 204, headers: corsHeaders(origin) });
      }

      if (request.method !== "POST") {
        return json({ ok: false, error: "Use the signup form to join." }, 405, allowedOrigin ? origin : null);
      }

      if (origin !== null && !allowedOrigin) {
        return json({ ok: false, error: "This form can’t be submitted from this site." }, 403, null);
      }

      const corsOrigin = allowedOrigin ? origin : null;

      const contentType = request.headers.get("Content-Type") ?? "";
      if (!contentType.toLowerCase().startsWith("application/json")) {
        return json({ ok: false, error: "That submission could not be read." }, 400, corsOrigin);
      }

      const declaredLength = Number(request.headers.get("Content-Length"));
      if (Number.isFinite(declaredLength) && declaredLength > MAX_BODY_BYTES) {
        return json({ ok: false, error: "That submission is too large." }, 413, corsOrigin);
      }

      const raw = await request.text();
      if (raw.length > MAX_BODY_BYTES) {
        return json({ ok: false, error: "That submission is too large." }, 413, corsOrigin);
      }

      let data: unknown;
      try {
        data = JSON.parse(raw);
      } catch {
        return json({ ok: false, error: "That submission could not be read." }, 400, corsOrigin);
      }

      if (!data || typeof data !== "object" || Array.isArray(data)) {
        return json({ ok: false, error: "That submission could not be read." }, 400, corsOrigin);
      }

      const record = data as Record<string, unknown>;
      const email = cleanEmail(record.email);
      if (!email) {
        return json({ ok: false, error: "Enter a valid email address." }, 400, corsOrigin);
      }

      const list = signupList(record.list);
      if (!list) {
        return json({ ok: false, error: "That signup could not be accepted." }, 400, corsOrigin);
      }

      // Newsletter is email only. A phone on that request is ignored, and a tag
      // sent by the browser is never trusted — the list name picks the tag here.
      const phoneProvided = list === "terrific30" && typeof record.phone === "string" && record.phone.trim() !== "";
      const phone = phoneProvided ? cleanPhone(record.phone) : undefined;
      if (phoneProvided && !phone) {
        return json({ ok: false, error: "Enter a valid phone number." }, 400, corsOrigin);
      }

      const firstName = cleanName(record.firstName);
      const ip = clientKey(request);
      if (isRateLimited(hits, ip, now())) {
        const headers = new Headers();
        headers.set("Retry-After", String(Math.ceil(RATE_LIMIT_WINDOW_MS / 1000)));
        return json(
          { ok: false, error: "Too many attempts. Please wait a few minutes and try again." },
          429,
          corsOrigin,
          headers,
        );
      }

      const token = env.GHL_PRIVATE_INTEGRATION_TOKEN?.trim() ?? "";
      if (!token) {
        console.error("GoHighLevel token is not configured");
        return json(
          { ok: false, error: "Signup isn’t available right now. Please try again later." },
          500,
          corsOrigin,
        );
      }

      const locationId = env.GHL_LOCATION_ID?.trim() || DEFAULT_LOCATION_ID;
      const upsertBody: Record<string, string> = {
        locationId,
        email,
        source: CONTACT_SOURCE,
      };
      if (phone) upsertBody.phone = phone;
      if (firstName) upsertBody.firstName = firstName;

      let upsert: GhlResult;
      try {
        upsert = await ghlPost(fetchImpl, token, GHL_UPSERT_URL, upsertBody);
      } catch (error) {
        console.error(`GoHighLevel upsert request failed (${errorName(error)})`);
        return json(
          { ok: false, error: "We couldn’t complete your signup. Please try again." },
          502,
          corsOrigin,
        );
      }

      const contactId = contactIdFrom(upsert.payload);
      if (!upsert.ok || !contactId) {
        console.error(`GoHighLevel upsert failed with status ${upsert.status}`);
        return json(
          { ok: false, error: "We couldn’t complete your signup. Please try again." },
          502,
          corsOrigin,
        );
      }

      const tagUrl = `https://services.leadconnectorhq.com/contacts/${contactId}/tags`;
      let tagged: GhlResult;
      try {
        tagged = await ghlPost(fetchImpl, token, tagUrl, { tags: [LIST_TAGS[list]] });
      } catch (error) {
        console.error(`GoHighLevel tag request failed (${errorName(error)})`);
        return json(
          { ok: false, error: "We couldn’t complete your signup. Please try again." },
          502,
          corsOrigin,
        );
      }

      if (!tagged.ok) {
        console.error(`GoHighLevel tag failed with status ${tagged.status}`);
        return json(
          { ok: false, error: "We couldn’t complete your signup. Please try again." },
          502,
          corsOrigin,
        );
      }

      return json({ ok: true }, 200, corsOrigin);
    },
  };
}

const handler = createHandler();

const worker = {
  fetch(request: Request, env: Env): Promise<Response> {
    return handler.fetch(request, env);
  },
};

export default worker;

interface GhlResult {
  ok: boolean;
  status: number;
  payload: unknown;
}

async function ghlPost(
  fetchImpl: typeof fetch,
  token: string,
  url: string,
  body: unknown,
): Promise<GhlResult> {
  const response = await fetchImpl(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      Version: GHL_API_VERSION,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(12_000),
  });
  const text = await response.text();
  let payload: unknown = null;
  if (text) {
    try {
      payload = JSON.parse(text);
    } catch {
      payload = null;
    }
  }
  return { ok: response.ok, status: response.status, payload };
}

function contactIdFrom(payload: unknown): string | null {
  if (!payload || typeof payload !== "object") return null;
  const record = payload as Record<string, unknown>;
  const nested = record.contact;
  const candidates = [
    nested && typeof nested === "object" ? (nested as Record<string, unknown>).id : undefined,
    record.id,
  ];
  for (const candidate of candidates) {
    if (typeof candidate === "string" && /^[A-Za-z0-9_-]{1,64}$/.test(candidate)) {
      return candidate;
    }
  }
  return null;
}

function signupList(value: unknown): SignupList | null {
  if (value === undefined || value === null || value === "") return "terrific30";
  if (value === "terrific30" || value === "newsletter") return value;
  return null;
}

function cleanPhone(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const compact = value.trim().replace(/[\s().-]/g, "");
  if (!/^\+[1-9]\d{7,14}$/.test(compact)) return null;
  return compact;
}

function cleanEmail(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const email = value.trim().toLowerCase();
  if (!email || email.length > 254) return null;
  if (!EMAIL_PATTERN.test(email)) return null;
  return email;
}

function cleanName(value: unknown): string | undefined {
  if (typeof value !== "string") return undefined;
  let name = "";
  for (const char of value.trim()) {
    const code = char.codePointAt(0) ?? 0;
    if (code < 32 || code === 127) continue;
    name += char;
    if ([...name].length >= MAX_NAME_LENGTH) break;
  }
  const trimmed = name.trim();
  return trimmed || undefined;
}

function clientKey(request: Request): string {
  const ip = request.headers.get("CF-Connecting-IP")?.trim();
  if (ip) return ip.slice(0, 128);
  return "unknown";
}

function isRateLimited(hits: Map<string, RateBucket>, key: string, nowMs: number): boolean {
  if (hits.size >= 2000) {
    for (const [bucketKey, entry] of hits) {
      if (nowMs - entry.start >= RATE_LIMIT_WINDOW_MS) hits.delete(bucketKey);
    }
    if (hits.size > 5000) hits.clear();
  }

  const entry = hits.get(key);
  if (!entry || nowMs - entry.start >= RATE_LIMIT_WINDOW_MS) {
    hits.set(key, { start: nowMs, count: 1 });
    return false;
  }
  entry.count += 1;
  return entry.count > RATE_LIMIT_MAX;
}

export function isAllowedOrigin(origin: string): boolean {
  if (origin === PRODUCTION_ORIGIN) return true;
  let url: URL;
  try {
    url = new URL(origin);
  } catch {
    return false;
  }
  if (url.protocol !== "http:" && url.protocol !== "https:") return false;
  if (url.username || url.password || url.pathname !== "/" || url.search || url.hash) return false;
  return url.hostname === "localhost" || url.hostname === "127.0.0.1" || url.hostname === "[::1]";
}

function corsHeaders(origin: string): Headers {
  const headers = new Headers();
  headers.set("Access-Control-Allow-Origin", origin);
  headers.set("Access-Control-Allow-Methods", "POST, OPTIONS");
  headers.set("Access-Control-Allow-Headers", "Content-Type");
  headers.set("Access-Control-Max-Age", "86400");
  headers.set("Vary", "Origin");
  return headers;
}

function json(body: unknown, status: number, origin: string | null, extra?: Headers): Response {
  const headers = new Headers(extra);
  headers.set("Content-Type", "application/json; charset=utf-8");
  headers.set("Cache-Control", "no-store");
  if (origin) {
    corsHeaders(origin).forEach((value, key) => headers.set(key, value));
  }
  return new Response(JSON.stringify(body), { status, headers });
}

function errorName(error: unknown): string {
  return error instanceof Error ? error.name : "Error";
}
