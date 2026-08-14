import { SITE } from "@/lib/site-config";

export function Logo({ withName = true }: { withName?: boolean }) {
  return (
    <div className="flex items-center justify-center gap-3">
      <div className="flex h-11 w-11 items-center justify-center rounded-full border border-gold-dim bg-black shadow-gold-glow">
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none">
          <path
            d="M12 2 L21 7 L21 17 L12 22 L3 17 L3 7 Z"
            stroke="#e3a83c"
            strokeWidth="1.4"
          />
          <path d="M12 2 V22 M3 7 L21 17 M21 7 L3 17" stroke="#e3a83c" strokeWidth="0.8" />
        </svg>
      </div>
      {withName && <span className="text-sm font-medium text-gray-300">{SITE.name}</span>}
    </div>
  );
}
