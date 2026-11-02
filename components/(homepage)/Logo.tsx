// components/(homepage)/Logo.tsx
// Compact logo: a small daisy mark + real text wordmark. Everything scales with font-size,
// so you resize it with one text-[..] class. Uses currentColor, so it works on any background.

export default function Logo({
  className = "",
  tagline = false, // "BE UNIQUELY YOU": only for large sizes (footer, loader)
}: {
  className?: string;
  tagline?: boolean;
}) {
  const petals = Array.from({ length: 10 }, (_, i) => i * 36);

  return (
    <span
      aria-label="Younique"
      className={`inline-flex items-center gap-[0.45em] leading-none ${className}`}
    >
      <svg
        viewBox="0 0 48 48"
        aria-hidden
        className="h-[1.3em] w-[1.3em] shrink-0"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      >
        {petals.map((r) => (
          <ellipse key={r} cx="24" cy="11.5" rx="3.4" ry="8.5" transform={`rotate(${r} 24 24)`} />
        ))}
        <circle cx="24" cy="24" r="3.4" fill="currentColor" stroke="none" />
      </svg>

      <span className="flex flex-col gap-[0.35em]">
        <span className="font-[family-name:var(--font-instrument)] text-[1em] uppercase tracking-[0.08em]">
          Younique
        </span>
        {tagline && (
          <span className="font-[family-name:var(--font-manrope)] text-[0.32em] font-semibold uppercase tracking-[0.32em] opacity-70">
            Be uniquely you
          </span>
        )}
      </span>
    </span>
  );
}