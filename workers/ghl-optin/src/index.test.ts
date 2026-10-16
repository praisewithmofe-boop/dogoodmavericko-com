import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { RATE_LIMIT_MAX, RATE_LIMIT_WINDOW_MS, createHandler } from "./index.ts";

const TOKEN = "pit-test-token-value";
const ORIGIN = "https://dogoodmavericko.com";

interface Call {
  url: string;
  method: string;
  headers: Headers;
  body: unknown;
}

function ghlMock(options?: {
  upsertStatus?: number;
  upsertPayload?: unknown;
  tagStatus?: number;
  failUpsert?: boolean;
  failTag?: boolean;
}) {
  const calls: Call[] = [];
  const fetchImpl: typeof fetch = async (input, init) => {
    const url = typeof input === "string" ? input : input instanceof URL ? input.toString() : input.url;
    const headers = new Headers(init?.headers);
    const raw = typeof init?.body === "string" ? init.body : "";
    calls.push({
      url,
      method: init?.method ?? "GET",
      headers,
      body: raw ? JSON.parse(raw) : null,
    });
    if (url.endsWith("/contacts/upsert")) {
      if (options?.failUpsert) throw new Error("upsert down");
      return new Response(
        JSON.stringify(options?.upsertPayload ?? { new: true, contact: { id: "abc123DEF" } }),
        { status: options?.upsertStatus ?? 200, headers: { "content-type": "application/json" } },
      );
    }
    if (options?.failTag) throw new Error("tag down");
    return new Response(JSON.stringify({ tags: ["terrific30-free"] }), {
      status: options?.tagStatus ?? 200,
      headers: { "content-type": "application/json" },
    });
  };
  return { calls, fetchImpl };
}

function handlerFor(mock = ghlMock(), now = () => 1_000_000) {
  return { handler: createHandler({ fetchImpl: mock.fetchImpl, now }), calls: mock.calls };
}

async function submit(
  handler: ReturnType<typeof createHandler>,
  body: unknown,
  init?: { origin?: string | null; ip?: string; method?: string; contentType?: string | null; raw?: string },
): Promise<{ status: number; text: string; json: { ok?: boolean; error?: string } | null; headers: Headers }> {
  const headers = new Headers();
  if (init?.contentType !== null) headers.set("Content-Type", init?.contentType ?? "application/json");
  if (init?.origin) headers.set("Origin", init.origin);
  if (init?.origin === undefined) headers.set("Origin", ORIGIN);
  if (init?.ip) headers.set("CF-Connecting-IP", init.ip);
  const method = init?.method ?? "POST";
  const raw = init?.raw ?? (body === undefined ? "" : JSON.stringify(body));
  const request = new Request("https://ghl-optin.example.workers.dev/", {
    method,
    headers,
    body: method === "GET" || method === "HEAD" || method === "OPTIONS" ? undefined : raw,
  });
  const response = await handler.fetch(request, { GHL_PRIVATE_INTEGRATION_TOKEN: TOKEN });
  const text = await response.text();
  let json: { ok?: boolean; error?: string } | null = null;
  try {
    json = text ? (JSON.parse(text) as { ok?: boolean; error?: string }) : null;
  } catch {
    json = null;
  }
  return { status: response.status, text, json, headers: response.headers };
}

describe("terrific 30 opt-in worker", () => {
  it("upserts without tags, then adds terrific30-free", async () => {
    const mock = ghlMock();
    const handler = createHandler({ fetchImpl: mock.fetchImpl, now: () => 1_000_000 });
    const response = await submit(handler, {
      firstName: "Ada",
      email: "Ada@Example.com",
      tags: ["should-not-stick"],
      locationId: "attacker",
    });

    assert.equal(response.status, 200);
    assert.deepEqual(response.json, { ok: true });
    assert.equal(response.text.includes(TOKEN), false);
    assert.equal(mock.calls.length, 2);

    const upsert = mock.calls[0];
    assert.equal(upsert.url, "https://services.leadconnectorhq.com/contacts/upsert");
    assert.equal(upsert.method, "POST");
    assert.equal(upsert.headers.get("Authorization"), `Bearer ${TOKEN}`);
    assert.equal(upsert.headers.get("Version"), "2021-07-28");
    assert.equal(upsert.headers.get("Content-Type"), "application/json");
    assert.deepEqual(upsert.body, {
      locationId: "B61Axi1jMZDmpwTLX4tR",
      email: "ada@example.com",
      firstName: "Ada",
      source: "dogoodmavericko.com",
    });
    assert.equal(Object.hasOwn(upsert.body as object, "tags"), false);

    const tag = mock.calls[1];
    assert.equal(tag.url, "https://services.leadconnectorhq.com/contacts/abc123DEF/tags");
    assert.deepEqual(tag.body, { tags: ["terrific30-free"] });
    assert.equal(tag.headers.get("Authorization"), `Bearer ${TOKEN}`);
    assert.equal(response.headers.get("Access-Control-Allow-Origin"), ORIGIN);
  });

  it("omits a blank first name and uses a configured location id", async () => {
    const mock = ghlMock();
    const handler = createHandler({ fetchImpl: mock.fetchImpl, now: () => 1_000_000 });
    const headers = new Headers({ "Content-Type": "application/json", Origin: ORIGIN });
    const request = new Request("https://ghl-optin.example.workers.dev/", {
      method: "POST",
      headers,
      body: JSON.stringify({ firstName: "   ", email: "ada@example.com" }),
    });
    const response = await handler.fetch(request, {
      GHL_PRIVATE_INTEGRATION_TOKEN: `  ${TOKEN}  `,
      GHL_LOCATION_ID: " loc_custom ",
    });
    assert.equal(response.status, 200);
    assert.deepEqual(mock.calls[0].body, {
      locationId: "loc_custom",
      email: "ada@example.com",
      source: "dogoodmavericko.com",
    });
    assert.equal(mock.calls[0].headers.get("Authorization"), `Bearer ${TOKEN}`);
  });

  it("accepts a top-level contact id", async () => {
    const mock = ghlMock({ upsertPayload: { id: "topLevelId" } });
    const handler = createHandler({ fetchImpl: mock.fetchImpl, now: () => 1_000_000 });
    const response = await submit(handler, { email: "ada@example.com" });
    assert.equal(response.status, 200);
    assert.equal(mock.calls[1].url, "https://services.leadconnectorhq.com/contacts/topLevelId/tags");
  });

  it("answers preflight for the production site and localhost", async () => {
    const { handler } = handlerFor();
    for (const origin of [ORIGIN, "http://localhost:3000", "http://127.0.0.1:8787", "https://localhost:3000"]) {
      const request = new Request("https://ghl-optin.example.workers.dev/", {
        method: "OPTIONS",
        headers: { Origin: origin, "Access-Control-Request-Method": "POST" },
      });
      const response = await handler.fetch(request, { GHL_PRIVATE_INTEGRATION_TOKEN: TOKEN });
      assert.equal(response.status, 204, origin);
      assert.equal(response.headers.get("Access-Control-Allow-Origin"), origin);
      assert.match(response.headers.get("Access-Control-Allow-Methods") ?? "", /POST/);
      assert.match(response.headers.get("Access-Control-Allow-Headers") ?? "", /Content-Type/);
    }
  });

  it("rejects browsers on other origins", async () => {
    const mock = ghlMock();
    const handler = createHandler({ fetchImpl: mock.fetchImpl, now: () => 1_000_000 });
    const response = await submit(handler, { email: "ada@example.com" }, { origin: "https://evil.example" });
    assert.equal(response.status, 403);
    assert.equal(response.headers.get("Access-Control-Allow-Origin"), null);
    assert.equal(mock.calls.length, 0);

    const preflight = await handler.fetch(
      new Request("https://ghl-optin.example.workers.dev/", {
        method: "OPTIONS",
        headers: { Origin: "https://dogoodmavericko.com.evil.example" },
      }),
      { GHL_PRIVATE_INTEGRATION_TOKEN: TOKEN },
    );
    assert.equal(preflight.status, 403);
  });

  it("allows a request with no Origin so the endpoint can be curled", async () => {
    const mock = ghlMock();
    const handler = createHandler({ fetchImpl: mock.fetchImpl, now: () => 1_000_000 });
    const response = await submit(handler, { email: "ada@example.com" }, { origin: null });
    assert.equal(response.status, 200);
    assert.equal(response.headers.get("Access-Control-Allow-Origin"), null);
  });

  it("rejects an invalid email before calling GoHighLevel", async () => {
    const mock = ghlMock();
    const handler = createHandler({ fetchImpl: mock.fetchImpl, now: () => 1_000_000 });
    const response = await submit(handler, { email: "not-an-email" });
    assert.equal(response.status, 400);
    assert.equal(response.json?.ok, false);
    assert.match(response.json?.error ?? "", /valid email/i);
    assert.equal(mock.calls.length, 0);
  });

  it("does not claim success when the token is missing", async () => {
    const mock = ghlMock();
    const handler = createHandler({ fetchImpl: mock.fetchImpl, now: () => 1_000_000 });
    const request = new Request("https://ghl-optin.example.workers.dev/", {
      method: "POST",
      headers: { "Content-Type": "application/json", Origin: ORIGIN },
      body: JSON.stringify({ email: "ada@example.com" }),
    });
    const response = await handler.fetch(request, {});
    const text = await response.text();
    assert.equal(response.status, 500);
    assert.equal(text.includes("pit-"), false);
    assert.equal(JSON.parse(text).ok, false);
    assert.equal(mock.calls.length, 0);
  });

  it("does not claim success when upsert or tagging fails", async () => {
    const upsertFail = ghlMock({ upsertStatus: 401, upsertPayload: { message: TOKEN } });
    const upsertHandler = createHandler({ fetchImpl: upsertFail.fetchImpl, now: () => 1_000_000 });
    const upsertResponse = await submit(upsertHandler, { email: "ada@example.com" });
    assert.equal(upsertResponse.status, 502);
    assert.equal(upsertResponse.json?.ok, false);
    assert.equal(upsertResponse.text.includes(TOKEN), false);
    assert.equal(upsertFail.calls.length, 1);

    const tagFail = ghlMock({ tagStatus: 500 });
    const tagHandler = createHandler({ fetchImpl: tagFail.fetchImpl, now: () => 1_000_000 });
    const tagResponse = await submit(tagHandler, { email: "ada@example.com" });
    assert.equal(tagResponse.status, 502);
    assert.equal(tagResponse.json?.ok, false);
    assert.equal(tagFail.calls.length, 2);

    const thrown = ghlMock({ failUpsert: true });
    const thrownHandler = createHandler({ fetchImpl: thrown.fetchImpl, now: () => 1_000_000 });
    const thrownResponse = await submit(thrownHandler, { email: "ada@example.com" });
    assert.equal(thrownResponse.status, 502);
    assert.equal(thrownResponse.text.includes(TOKEN), false);
  });

  it("rate limits repeated signups from one address", async () => {
    let nowMs = 5_000_000;
    const mock = ghlMock();
    const handler = createHandler({ fetchImpl: mock.fetchImpl, now: () => nowMs });
    for (let i = 0; i < RATE_LIMIT_MAX; i += 1) {
      const response = await submit(handler, { email: `person${i}@example.com` }, { ip: "203.0.113.5" });
      assert.equal(response.status, 200);
    }
    const blocked = await submit(handler, { email: "extra@example.com" }, { ip: "203.0.113.5" });
    assert.equal(blocked.status, 429);
    assert.match(blocked.json?.error ?? "", /wait/i);
    assert.equal(mock.calls.length, RATE_LIMIT_MAX * 2);

    const otherIp = await submit(handler, { email: "other@example.com" }, { ip: "203.0.113.9" });
    assert.equal(otherIp.status, 200);

    nowMs += RATE_LIMIT_WINDOW_MS;
    const again = await submit(handler, { email: "later@example.com" }, { ip: "203.0.113.5" });
    assert.equal(again.status, 200);
  });
});
