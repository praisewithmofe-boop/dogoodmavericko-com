import { DIAL_CODES } from "@/lib/dial-codes";

interface TerrificPhoneFieldProps {
  idPrefix: string;
  tone: "light" | "dark";
  countryIso: string;
  onCountryIso: (value: string) => void;
  phone: string;
  onPhone: (value: string) => void;
}

const FIELD = {
  light:
    "w-full border border-border bg-paper px-4 py-3 text-body text-charcoal outline-none transition-colors placeholder:text-slate focus-visible:border-gold-dark",
  dark:
    "w-full border border-bone/30 bg-paper/95 px-4 py-3.5 text-body text-charcoal outline-none transition-colors placeholder:text-slate focus-visible:border-gold-light",
} as const;

export function TerrificPhoneField({
  idPrefix,
  tone,
  countryIso,
  onCountryIso,
  phone,
  onPhone,
}: TerrificPhoneFieldProps) {
  const fieldClass = FIELD[tone];
  const countryId = `${idPrefix}-country`;
  const phoneId = `${idPrefix}-phone`;

  return (
    <>
      <label htmlFor={countryId} className="sr-only">
        Country code
      </label>
      <select
        id={countryId}
        value={countryIso}
        autoComplete="tel-country-code"
        onChange={(event) => onCountryIso(event.target.value)}
        className={`${fieldClass} sm:w-60 sm:shrink-0`}
      >
        {DIAL_CODES.map((country) => (
          <option key={country.iso} value={country.iso}>
            {country.name} +{country.dial}
          </option>
        ))}
      </select>
      <label htmlFor={phoneId} className="sr-only">
        Phone number
      </label>
      <input
        id={phoneId}
        type="tel"
        required
        inputMode="tel"
        autoComplete="tel-national"
        value={phone}
        onChange={(event) => onPhone(event.target.value)}
        placeholder="Phone number"
        className={`${fieldClass} sm:min-w-48 sm:flex-1`}
      />
    </>
  );
}
