"use client";

import Script from "next/script";

const GHL_FORM_ID = "4YCUnpBYXnOXmDpqrbhD";
const GHL_FORM_HEIGHT = 519;

interface GhlOptInFormProps {
  className?: string;
}

// The real "Join Terrific 30" signup, embedded directly from the same
// GoHighLevel form already live on terrific30.com — submissions land in the
// same GHL location/contacts list and trigger the same welcome-email
// automation that's already built there, instead of creating a second,
// disconnected list. Embed snippet supplied by the account owner via GHL's
// Forms → Integrate tab; the fixed pixel height is a fallback before
// form_embed.js (GHL's own resize helper) adjusts it to the real content
// height — GHL's own snippet uses height:100%, which only works inside
// their page builder where the parent already has a defined height.
export function GhlOptInForm({ className = "" }: GhlOptInFormProps) {
  return (
    <div className={`overflow-hidden border ${className}`}>
      <iframe
        src={`https://api.highimpct.com/widget/form/${GHL_FORM_ID}`}
        style={{ width: "100%", height: `${GHL_FORM_HEIGHT}px`, border: "none" }}
        id={`inline-${GHL_FORM_ID}`}
        data-layout="{'id':'INLINE'}"
        data-trigger-type="alwaysShow"
        data-trigger-value=""
        data-activation-type="alwaysActivated"
        data-activation-value=""
        data-deactivation-type="neverDeactivate"
        data-deactivation-value=""
        data-form-name="Terrific 30 Form"
        data-height={GHL_FORM_HEIGHT}
        data-layout-iframe-id={`inline-${GHL_FORM_ID}`}
        data-form-id={GHL_FORM_ID}
        data-cookie-consent="true"
        data-cookie-consent-provider="auto"
        title="Terrific 30 sign-up form"
      />
      <Script id="ghl-form-embed" src="https://api.highimpct.com/js/form_embed.js" strategy="afterInteractive" />
    </div>
  );
}
