import {
  siInstagram,
  siYoutube,
  siFacebook,
  siRumble,
  siSubstack,
  siTiktok,
  siSnapchat,
  siApplepodcasts,
  siSpotify,
} from "simple-icons";

const ICONS = {
  instagram: siInstagram,
  youtube: siYoutube,
  facebook: siFacebook,
  rumble: siRumble,
  substack: siSubstack,
  tiktok: siTiktok,
  snapchat: siSnapchat,
  applepodcasts: siApplepodcasts,
  spotify: siSpotify,
} as const;

export type SocialIconName = keyof typeof ICONS;

interface SocialIconProps {
  name: SocialIconName;
  className?: string;
}

// Official brand glyphs (via simple-icons) for social and podcast platforms,
// rendered in the site's own monochrome palette rather than each platform's
// native brand color — keeps every row consistent with the site's
// black/white/gold design system.
export function SocialIcon({ name, className = "" }: SocialIconProps) {
  const icon = ICONS[name];

  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d={icon.path} />
    </svg>
  );
}
