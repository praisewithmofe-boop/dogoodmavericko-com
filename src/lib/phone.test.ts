import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { DEFAULT_COUNTRY_ISO } from "./dial-codes.ts";
import { toE164 } from "./phone.ts";

describe("toE164", () => {
  it("defaults the country list to the United States", () => {
    assert.equal(DEFAULT_COUNTRY_ISO, "US");
  });

  it("builds a US number in E.164 and ignores spacing", () => {
    assert.deepEqual(toE164("US", "(202) 555-0123"), { ok: true, phone: "+12025550123" });
  });

  it("uses the selected country and drops a trunk zero", () => {
    assert.deepEqual(toE164("NG", "0801 234 5678"), { ok: true, phone: "+2348012345678" });
    assert.deepEqual(toE164("GB", "07911 123456"), { ok: true, phone: "+447911123456" });
  });

  it("rejects letters, an empty value, and a number that is the wrong length", () => {
    const empty = toE164("US", "");
    const letters = toE164("US", "call me");
    const short = toE164("US", "123");
    assert.equal(empty.ok, false);
    assert.equal(letters.ok, false);
    assert.equal(short.ok, false);
    if (!letters.ok) assert.match(letters.error, /digits only/i);
    if (!short.ok) assert.match(short.error, /valid phone/i);
  });
});
