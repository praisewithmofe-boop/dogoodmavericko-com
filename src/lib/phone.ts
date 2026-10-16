import { DEFAULT_COUNTRY_ISO, DIAL_CODES } from "./dial-codes.ts";

const REQUIRED = "Enter your phone number.";
const DIGITS_ONLY = "Enter a phone number using digits only.";
const INVALID = "Enter a valid phone number.";

export function toE164(
  countryIso: string,
  raw: string,
): { ok: true; phone: string } | { ok: false; error: string } {
  const country = DIAL_CODES.find((entry) => entry.iso === countryIso);
  if (!country) return { ok: false, error: INVALID };

  const trimmed = raw.trim();
  if (!trimmed) return { ok: false, error: REQUIRED };

  const stripped = trimmed.replace(/[\s().-]/g, "");
  if (!/^\d+$/.test(stripped)) return { ok: false, error: DIGITS_ONLY };

  const national = stripped.replace(/^0+/, "");
  if (national.length < 6 || national.length > 14) return { ok: false, error: INVALID };

  const phone = `+${country.dial}${national}`;
  const totalDigits = country.dial.length + national.length;
  if (totalDigits < 8 || totalDigits > 15) return { ok: false, error: INVALID };

  return { ok: true, phone };
}

export { DEFAULT_COUNTRY_ISO };
