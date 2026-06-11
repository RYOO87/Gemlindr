"use client";

import {
  buildGoogleCalendarUrl,
  buildIcsContent,
  downloadIcs,
} from "@/lib/calendarLinks";
import type { GameDetailData } from "@/lib/types";

interface Props {
  detail: GameDetailData;
}

export default function AddToCalendar({ detail }: Props) {
  const disabled = detail.tba || !detail.released;

  const details = [
    `${detail.name} 출시일`,
    ...detail.stores.map((s) => `${s.name}: ${s.url}`),
  ].join("\n");

  const btnClass =
    "cal-btn clip-cut-sm font-display block w-full px-4 py-3 text-center text-sm uppercase tracking-widest";

  if (disabled) {
    return (
      <div className="mt-6 space-y-2">
        <button type="button" disabled className={btnClass}>
          ＋ 내 캘린더에 추가
        </button>
        <button type="button" disabled className={btnClass}>
          .ics 다운로드
        </button>
        <p className="text-center text-xs font-semibold text-neutral-500">
          출시일 미정 — 확정되면 추가할 수 있어요
        </p>
      </div>
    );
  }

  const event = {
    id: detail.id,
    name: detail.name,
    released: detail.released!,
    details,
  };

  const handleIcsDownload = () => {
    const safeName =
      detail.name.replace(/[^\w가-힣 -]/g, "").trim().replace(/\s+/g, "-") ||
      `game-${detail.id}`;
    downloadIcs(`${safeName}-release.ics`, buildIcsContent(event));
  };

  return (
    <div className="mt-6 space-y-2">
      <a
        href={buildGoogleCalendarUrl(event)}
        target="_blank"
        rel="noopener noreferrer"
        className={btnClass}
      >
        ＋ 내 캘린더에 추가
      </a>
      <button type="button" onClick={handleIcsDownload} className={btnClass}>
        .ics 다운로드
      </button>
    </div>
  );
}
