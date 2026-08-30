import type { HTMLAttributes } from "react";

export const proseComponents = {
  h2: (props: HTMLAttributes<HTMLHeadingElement>) => (
    <h2 className="mt-12 mb-5 text-h3 font-semibold text-charcoal" {...props} />
  ),
  h3: (props: HTMLAttributes<HTMLHeadingElement>) => (
    <h3 className="mt-10 mb-4 text-subhead font-semibold text-charcoal" {...props} />
  ),
  p: (props: HTMLAttributes<HTMLParagraphElement>) => (
    <p className="mb-6 text-body-lg leading-relaxed text-charcoal" {...props} />
  ),
  a: (props: HTMLAttributes<HTMLAnchorElement>) => (
    <a
      className="text-gold-dark underline underline-offset-2 transition-colors hover:text-gold"
      {...props}
    />
  ),
  strong: (props: HTMLAttributes<HTMLElement>) => (
    <strong className="font-semibold text-charcoal" {...props} />
  ),
  ul: (props: HTMLAttributes<HTMLUListElement>) => (
    <ul className="mb-6 flex list-disc flex-col gap-2 pl-6 text-body-lg text-charcoal" {...props} />
  ),
  ol: (props: HTMLAttributes<HTMLOListElement>) => (
    <ol
      className="mb-6 flex list-decimal flex-col gap-2 pl-6 text-body-lg text-charcoal"
      {...props}
    />
  ),
  li: (props: HTMLAttributes<HTMLLIElement>) => <li className="leading-relaxed" {...props} />,
  blockquote: (props: HTMLAttributes<HTMLQuoteElement>) => (
    <blockquote
      className="my-8 border-l-2 border-gold pl-6 text-subhead font-medium text-charcoal"
      {...props}
    />
  ),
  hr: () => <hr className="my-10 border-border" />,
};
