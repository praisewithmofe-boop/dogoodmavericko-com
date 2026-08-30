import Image from "next/image";
import { PORTRAIT_IMAGE } from "@/lib/constants";

interface PortraitFrameProps {
  className?: string;
  sizes?: string;
}

export function PortraitFrame({ className = "", sizes = "100vw" }: PortraitFrameProps) {
  return (
    <div className={`relative overflow-hidden bg-paper-dim ${className}`}>
      {PORTRAIT_IMAGE ? (
        <Image
          src={PORTRAIT_IMAGE}
          alt="Portrait of Dogood Mavericko"
          fill
          sizes={sizes}
          className="object-cover object-top"
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center">
          <span className="text-h3 font-bold tracking-[0.02em] text-slate/25">DM</span>
        </div>
      )}
    </div>
  );
}
