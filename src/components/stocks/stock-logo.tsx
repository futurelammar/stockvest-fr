import Image from "next/image";

const FALLBACK_PALETTE = ["bg-brand-emerald", "bg-brand-gold", "bg-brand-ink", "bg-brand-slate"];

function paletteIndex(seed: string) {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) hash = (hash * 31 + seed.charCodeAt(i)) % FALLBACK_PALETTE.length;
  return hash;
}

export function StockLogo({
  logoUrl,
  ticker,
  size = 40,
}: {
  logoUrl?: string;
  ticker: string;
  size?: number;
}) {
  if (logoUrl) {
    return (
      <Image
        src={logoUrl}
        alt={ticker}
        width={size}
        height={size}
        className="rounded-full border border-border object-cover"
      />
    );
  }   

  const bg = FALLBACK_PALETTE[paletteIndex(ticker)];
  return (
    <div
      className={`flex items-center justify-center rounded-full font-display text-sm text-brand-bone ${bg}`}
      style={{ width: size, height: size }}
    >
      {ticker.slice(0, 2)}
    </div>
  );
}