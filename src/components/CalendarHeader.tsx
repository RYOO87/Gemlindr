import { format } from "date-fns";

interface Props {
  year: number;
  month: number; // 1~12
  onPrev: () => void;
  onNext: () => void;
}

export default function CalendarHeader({ year, month, onPrev, onNext }: Props) {
  const monthName = format(new Date(year, month - 1, 1), "MMMM").toUpperCase();

  return (
    <header className="relative pt-6 pb-2">
      {/* 하프톤 점 패턴 — 위로 갈수록 사라짐 */}
      <div className="halftone pointer-events-none absolute inset-0" aria-hidden />

      <div className="relative flex items-end justify-between gap-4">
        <div>
          <h1 className="skew-title font-display text-6xl uppercase leading-none text-blood sm:text-7xl">
            {monthName}
          </h1>
          <p className="mt-2 text-sm tracking-[0.4em] text-bone-dim">{year}</p>
        </div>
        <div className="flex gap-2 pb-1">
          <button
            type="button"
            onClick={onPrev}
            aria-label="이전 달"
            className="nav-btn clip-cut-sm font-display px-4 py-2 text-sm uppercase tracking-widest"
          >
            ◀ Prev
          </button>
          <button
            type="button"
            onClick={onNext}
            aria-label="다음 달"
            className="nav-btn clip-cut-sm font-display px-4 py-2 text-sm uppercase tracking-widest"
          >
            Next ▶
          </button>
        </div>
      </div>
    </header>
  );
}
