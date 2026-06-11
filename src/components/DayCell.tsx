import type { MonthCell } from "@/lib/calendar";
import type { CalendarGame } from "@/lib/types";
import PlatformDots from "./PlatformDots";

interface Props {
  cell: MonthCell;
  games: CalendarGame[];
  isToday: boolean;
  isSelected: boolean;
  onSelect: (key: string) => void;
  index: number; // 등장 애니메이션 딜레이용
}

export default function DayCell({
  cell,
  games,
  isToday,
  isSelected,
  onSelect,
  index,
}: Props) {
  // 다른 달 날짜는 투명한 빈칸으로
  if (!cell.inMonth) {
    return <div aria-hidden />;
  }

  const dayNum = cell.date.getDate();
  const hasGames = games.length > 0;
  const allPlatforms = games.flatMap((g) => g.platforms);

  return (
    <button
      type="button"
      onClick={() => onSelect(cell.key)}
      data-selected={isSelected || undefined}
      aria-pressed={isSelected}
      aria-label={`${cell.key}${hasGames ? `, 출시작 ${games.length}개` : ""}`}
      className={`day-cell clip-cut rise-in relative flex aspect-square flex-col p-2 text-left ${
        isToday ? "is-today" : ""
      }`}
      style={{ animationDelay: `${index * 12}ms` }}
    >
      <span className="flex items-start justify-between">
        <span
          className={`day-num font-display text-lg leading-none ${
            hasGames || isSelected ? "" : "text-bone-dim"
          }`}
        >
          {dayNum}
        </span>
        <PlatformDots platforms={allPlatforms} />
      </span>

      {hasGames && (
        <span className="slash-tag clip-slash mt-auto max-w-full truncate px-2 py-[3px] text-[10px] font-semibold uppercase tracking-wide">
          {games[0].name}
          {games.length > 1 ? ` +${games.length - 1}` : ""}
        </span>
      )}
    </button>
  );
}
