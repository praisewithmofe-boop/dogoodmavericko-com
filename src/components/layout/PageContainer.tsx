interface PageContainerProps {
  children: React.ReactNode;
  className?: string;
}

export function PageContainer({ children, className = "" }: PageContainerProps) {
  return (
    <div className={`mx-auto w-full max-w-(--container-max) px-6 md:px-10 ${className}`}>
      {children}
    </div>
  );
}

interface SectionProps {
  children: React.ReactNode;
  className?: string;
  tone?: "paper" | "paper-dim" | "ink";
  id?: string;
}

const toneClasses: Record<NonNullable<SectionProps["tone"]>, string> = {
  paper: "bg-paper text-charcoal",
  "paper-dim": "bg-paper-dim text-charcoal",
  ink: "bg-ink text-bone",
};

export function Section({ children, className = "", tone = "paper", id }: SectionProps) {
  return (
    <section id={id} className={`py-16 md:py-24 lg:py-32 ${toneClasses[tone]} ${className}`}>
      <PageContainer>{children}</PageContainer>
    </section>
  );
}
