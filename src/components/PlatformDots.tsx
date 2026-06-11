import {
  PLATFORM_COLORS,
  platformFamily,
  type PlatformFamily,
} from "@/lib/rawg/constants";

// 플랫폼 이름 배열 → 중복 제거된 색상 패밀리 (최대 4개)
export function uniqueFamilies(platforms: string[]): PlatformFamily[] {
  const set = new Set<PlatformFamily>();
  for (const p of platforms) {
    const f = platformFamily(p);
    if (f !== "other") set.add(f);
  }
  return [...set].slice(0, 4);
}

interface Props {
  platforms: string[];
  className?: string;
}

export default function PlatformDots({ platforms, className = "" }: Props) {
  const families = uniqueFamilies(platforms);
  if (families.length === 0) return null;
  return (
    <span className={`flex items-center gap-1 ${className}`} aria-hidden>
      {families.map((f) => (
        <span
          key={f}
          className="h-2 w-2 rounded-full"
          style={{ background: PLATFORM_COLORS[f] }}
        />
      ))}
    </span>
  );
}
