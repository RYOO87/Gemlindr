"use client";

import { useEffect, useMemo, useState } from "react";
import { format } from "date-fns";
import { getMonthGrid, getMonthRange } from "@/lib/calendar";
import {
  PLATFORM_COLORS,
  PLATFORM_FAMILY_LABELS,
} from "@/lib/rawg/constants";
import type { CalendarGame } from "@/lib/types";
import CalendarHeader from "./CalendarHeader";
import DayCell from "./DayCell";
import DailyLog from "./DailyLog";

const WEEKDAYS = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

interface GamesError {
  message: string;
  noKey: boolean;
}

export default function CalendarPage() {
  const today = useMemo(() => new Date(), []);
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth() + 1); // 1~12
  const [games, setGames] = useState<CalendarGame[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<GamesError | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedGameId, setSelectedGameId] = useState<number | null>(null);

  // 보는 달이 바뀔 때마다 그 달의 출시작을 가져온다
  useEffect(() => {
    const { start, end } = getMonthRange(year, month);
    const controller = new AbortController();
    setLoading(true);
    setError(null);

    fetch(`/api/games?start=${start}&end=${end}`, {
      signal: controller.signal,
    })
      .then(async (res) => {
        const body = await res.json();
        if (!res.ok) {
          const err = new Error(
            body.error ?? "게임 데이터를 불러오지 못했습니다.",
          ) as Error & { noKey?: boolean };
          err.noKey = body.code === "NO_API_KEY";
          throw err;
        }
        setGames(body.games as CalendarGame[]);
      })
      .catch((e: Error & { noKey?: boolean }) => {
        if (e.name !== "AbortError") {
          setGames([]);
          setError({ message: e.message, noKey: !!e.noKey });
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });

    return () => controller.abort();
  }, [year, month]);

  // 출시일("YYYY-MM-DD") → 그날 출시작 목록
  const gamesByDate = useMemo(() => {
    const map = new Map<string, CalendarGame[]>();
    for (const g of games) {
      if (!g.released) continue;
      const list = map.get(g.released) ?? [];
      list.push(g);
      map.set(g.released, list);
    }
    return map;
  }, [games]);

  const grid = useMemo(() => getMonthGrid(year, month), [year, month]);
  const todayKey = format(today, "yyyy-MM-dd");

  const moveMonth = (delta: number) => {
    const d = new Date(year, month - 1 + delta, 1);
    setYear(d.getFullYear());
    setMonth(d.getMonth() + 1);
    setSelectedDate(null);
    setSelectedGameId(null);
  };

  const handleSelectDate = (key: string) => {
    setSelectedDate(key);
    const dayGames = gamesByDate.get(key) ?? [];
    // 1개면 바로 상세, 여러 개면 패널에서 리스트 먼저
    setSelectedGameId(dayGames.length === 1 ? dayGames[0].id : null);
  };

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col px-4 py-6 sm:px-8">
      <CalendarHeader
        year={year}
        month={month}
        onPrev={() => moveMonth(-1)}
        onNext={() => moveMonth(1)}
      />

      <div className="app-grid mt-6 flex-1">
        <section aria-label="출시 달력">
          {error && (
            <div className="clip-cut mb-4 bg-ash px-5 py-4 text-sm leading-7">
              <p className="font-display text-lg uppercase tracking-wider text-blood">
                {error.noKey ? "RAWG API 키가 필요해요" : "데이터를 못 불러왔어요"}
              </p>
              {error.noKey ? (
                <ol className="mt-1 list-inside list-decimal text-bone-dim">
                  <li>
                    <a
                      href="https://rawg.io/apidocs"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline hover:text-blood"
                    >
                      rawg.io/apidocs
                    </a>
                    에서 무료 키를 발급받기
                  </li>
                  <li>
                    프로젝트 루트의 <code>.env.local</code>에{" "}
                    <code>RAWG_API_KEY=발급받은_키</code> 입력
                  </li>
                  <li>개발 서버 재시작</li>
                </ol>
              ) : (
                <p className="mt-1 text-bone-dim">{error.message}</p>
              )}
            </div>
          )}

          {/* 요일 헤더 — 일요일만 크림슨 */}
          <div className="grid grid-cols-7 gap-[6px]">
            {WEEKDAYS.map((d) => (
              <div
                key={d}
                className={`pb-2 text-center text-[11px] font-semibold tracking-[0.25em] ${
                  d === "SUN" ? "text-blood" : "text-bone-dim"
                }`}
              >
                {d}
              </div>
            ))}
          </div>

          <div className="relative">
            <div
              className={`grid grid-cols-7 gap-[6px] ${
                loading ? "opacity-40" : ""
              }`}
            >
              {grid.map((cell, i) => (
                <DayCell
                  key={cell.key}
                  cell={cell}
                  games={gamesByDate.get(cell.key) ?? []}
                  isToday={cell.key === todayKey}
                  isSelected={cell.key === selectedDate}
                  onSelect={handleSelectDate}
                  index={i}
                />
              ))}
            </div>
            {loading && (
              <p
                className="font-display absolute inset-0 flex items-center justify-center text-2xl uppercase tracking-[0.3em] text-blood"
                role="status"
              >
                Loading…
              </p>
            )}
          </div>

          {/* 플랫폼 색 범례 */}
          <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-[11px] uppercase tracking-wider text-bone-dim">
            {(
              Object.keys(PLATFORM_FAMILY_LABELS) as Array<
                keyof typeof PLATFORM_FAMILY_LABELS
              >
            ).map((f) => (
              <li key={f} className="flex items-center gap-2">
                <span
                  className="h-2 w-2 rounded-full"
                  style={{ background: PLATFORM_COLORS[f] }}
                  aria-hidden
                />
                {PLATFORM_FAMILY_LABELS[f]}
              </li>
            ))}
          </ul>
        </section>

        <DailyLog
          selectedDate={selectedDate}
          games={selectedDate ? (gamesByDate.get(selectedDate) ?? []) : []}
          selectedGameId={selectedGameId}
          onSelectGame={setSelectedGameId}
        />
      </div>

      <footer className="mt-10 flex items-center justify-between border-t border-white/10 pt-4 text-xs text-bone-dim">
        <span className="font-display uppercase tracking-[0.25em]">
          Game Release Calendar
        </span>
        <a
          href="https://rawg.io"
          target="_blank"
          rel="noopener noreferrer"
          className="underline underline-offset-2 hover:text-blood"
        >
          Powered by RAWG
        </a>
      </footer>
    </div>
  );
}
