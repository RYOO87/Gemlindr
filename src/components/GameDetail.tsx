"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { format, parseISO } from "date-fns";
import {
  PLATFORM_COLORS,
  platformFamily,
} from "@/lib/rawg/constants";
import type { GameDetailData } from "@/lib/types";
import AddToCalendar from "./AddToCalendar";

interface Props {
  gameId: number;
  onBack?: () => void;
}

export default function GameDetail({ gameId, onBack }: Props) {
  const [detail, setDetail] = useState<GameDetailData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError(null);
    setDetail(null);

    fetch(`/api/games/${gameId}`, { signal: controller.signal })
      .then(async (res) => {
        const body = await res.json();
        if (!res.ok) {
          throw new Error(body.error ?? "상세 정보를 불러오지 못했습니다.");
        }
        setDetail(body as GameDetailData);
      })
      .catch((e: Error) => {
        if (e.name !== "AbortError") setError(e.message);
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });

    return () => controller.abort();
  }, [gameId]);

  if (loading) {
    return (
      <p className="mt-8 animate-pulse text-sm text-neutral-600">
        기록을 불러오는 중...
      </p>
    );
  }

  if (error || !detail) {
    return (
      <div className="mt-8 text-sm text-neutral-700">
        {onBack && <BackButton onBack={onBack} />}
        <p className="mt-2 font-semibold text-blood-deep">
          기록을 불러오지 못했어요.
        </p>
        <p className="mt-1 text-neutral-600">{error}</p>
      </div>
    );
  }

  const releasedLabel = detail.released
    ? format(parseISO(detail.released), "M.d")
    : "TBA";
  const releasedYear = detail.released
    ? format(parseISO(detail.released), "yyyy")
    : "";
  const shortDescription =
    detail.description.length > 280
      ? `${detail.description.slice(0, 280)}…`
      : detail.description;

  return (
    <div className="mt-4">
      {onBack && <BackButton onBack={onBack} />}

      {/* 출시일 + 장르 한 줄 */}
      <p className="mt-3 flex items-baseline gap-2">
        <span className="font-display text-3xl text-blood-deep">
          {releasedLabel}
        </span>
        <span className="text-sm text-neutral-600">
          {releasedYear}
          {detail.genres.length > 0 &&
            ` · ${detail.genres.slice(0, 3).join(" / ")}`}
        </span>
      </p>

      {/* 커버 블록 */}
      <div className="clip-cut relative mt-3 aspect-video overflow-hidden bg-neutral-900">
        {detail.background_image ? (
          <Image
            src={detail.background_image}
            alt={`${detail.name} 커버 이미지`}
            fill
            sizes="(max-width: 860px) 100vw, 33vw"
            className="object-cover"
          />
        ) : (
          <div
            className="flex h-full items-center justify-center text-xs uppercase tracking-[0.3em] text-neutral-500"
            style={{
              backgroundImage:
                "radial-gradient(circle, rgba(242,237,228,.25) 1px, transparent 1.6px)",
              backgroundSize: "10px 10px",
            }}
          >
            cover art
          </div>
        )}
      </div>

      <h3 className="font-display mt-3 text-2xl leading-tight text-neutral-900">
        {detail.name}
      </h3>

      {shortDescription && (
        <p className="mt-2 text-xs leading-6 text-neutral-600">
          {shortDescription}
        </p>
      )}

      {/* 출시 플랫폼 */}
      <p className="mt-5 mb-2 text-[11px] font-semibold uppercase tracking-[0.25em] text-neutral-500">
        출시 플랫폼
      </p>
      <ul className="flex flex-wrap gap-2">
        {detail.platforms.map((p) => (
          <li
            key={p}
            className="clip-slash flex items-center gap-2 bg-[#17171a] px-3 py-1 text-xs text-bone"
          >
            <span
              className="h-2 w-2 rounded-full"
              style={{ background: PLATFORM_COLORS[platformFamily(p)] }}
              aria-hidden
            />
            {p}
          </li>
        ))}
      </ul>

      {/* 스토어 */}
      <p className="mt-5 mb-2 text-[11px] font-semibold uppercase tracking-[0.25em] text-neutral-500">
        스토어
      </p>
      {detail.stores.length === 0 ? (
        <p className="text-xs text-neutral-600">
          등록된 스토어 링크가 아직 없어요.
        </p>
      ) : (
        <ul className="space-y-2">
          {detail.stores.map((s) => (
            <li key={s.url}>
              <a
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                className="store-btn clip-cut-sm block px-3 py-2 text-xs font-semibold uppercase tracking-wider"
              >
                {s.name} ↗
              </a>
            </li>
          ))}
        </ul>
      )}

      <AddToCalendar detail={detail} />
    </div>
  );
}

function BackButton({ onBack }: { onBack: () => void }) {
  return (
    <button
      type="button"
      onClick={onBack}
      className="text-xs font-semibold text-neutral-600 underline underline-offset-2 hover:text-blood-deep"
    >
      ← 목록으로
    </button>
  );
}
