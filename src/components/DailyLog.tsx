"use client";

import { format, parseISO } from "date-fns";
import type { CalendarGame } from "@/lib/types";
import GameDetail from "./GameDetail";
import PlatformDots from "./PlatformDots";

interface Props {
  selectedDate: string | null;
  games: CalendarGame[]; // 선택한 날짜의 출시작
  selectedGameId: number | null;
  onSelectGame: (id: number | null) => void;
}

export default function DailyLog({
  selectedDate,
  games,
  selectedGameId,
  onSelectGame,
}: Props) {
  return (
    <aside className="note-wrap">
      <div className="note-tape" aria-hidden />
      <div className="note min-h-[480px] px-10 py-8 pb-10">
        <h2 className="font-display text-3xl uppercase tracking-wide text-blood-deep">
          Daily Log
        </h2>
        {selectedDate && (
          <p className="mt-1 text-xs font-semibold tracking-[0.25em] text-neutral-500">
            {format(parseISO(selectedDate), "yyyy.MM.dd")}
          </p>
        )}

        {!selectedDate ? (
          <p className="mt-8 text-sm leading-7 text-neutral-600">
            달력에서 날짜를 선택하면
            <br />
            그날의 출시작이 여기에 기록됩니다.
          </p>
        ) : games.length === 0 ? (
          <p className="mt-8 text-sm leading-7 text-neutral-600">
            이 날은 출시 예정작이 없어요.
          </p>
        ) : selectedGameId !== null ? (
          <GameDetail
            gameId={selectedGameId}
            onBack={games.length > 1 ? () => onSelectGame(null) : undefined}
          />
        ) : (
          <ul className="mt-6 space-y-2">
            {games.map((g) => (
              <li key={g.id}>
                <button
                  type="button"
                  onClick={() => onSelectGame(g.id)}
                  className="log-item clip-slash flex w-full items-center justify-between gap-3 px-3 py-2 text-left"
                >
                  <span className="truncate text-sm font-semibold">
                    {g.name}
                  </span>
                  <PlatformDots platforms={g.platforms} />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </aside>
  );
}
