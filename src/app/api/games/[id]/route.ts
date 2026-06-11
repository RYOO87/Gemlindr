import { NextRequest, NextResponse } from "next/server";
import { rawgFetch, RawgError } from "@/lib/rawg/client";
import { STORE_NAMES } from "@/lib/rawg/constants";
import type { GameDetailData, StoreLink } from "@/lib/types";

interface RawgGameDetail {
  id: number;
  name: string;
  released: string | null;
  tba: boolean;
  description_raw: string | null;
  background_image: string | null;
  platforms: { platform: { id: number; name: string } }[] | null;
  genres: { id: number; name: string }[] | null;
  stores: { store: { id: number; name: string } }[] | null;
}

interface RawgStoresResponse {
  results: { id: number; store_id: number; url: string }[] | null;
}

// GET /api/games/[id] — 게임 상세 + 스토어 URL을 합쳐서 반환
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  if (!/^\d+$/.test(id)) {
    return NextResponse.json(
      { error: "게임 ID는 숫자여야 합니다." },
      { status: 400 },
    );
  }

  try {
    const [detail, storesRes] = await Promise.all([
      rawgFetch<RawgGameDetail>(`/games/${id}`),
      rawgFetch<RawgStoresResponse>(`/games/${id}/stores`),
    ]);

    // /stores 응답에는 store_id와 URL만 있으므로 상세 응답의 스토어 이름과 매칭
    const storeNameById = new Map<number, string>(
      detail.stores?.map((s) => [s.store.id, s.store.name]) ?? [],
    );
    const stores: StoreLink[] = (storesRes.results ?? [])
      .filter((s) => s.url)
      .map((s) => ({
        name: storeNameById.get(s.store_id) ?? STORE_NAMES[s.store_id] ?? "Store",
        url: s.url,
      }));

    const body: GameDetailData = {
      id: detail.id,
      name: detail.name,
      released: detail.released,
      tba: detail.tba,
      description: detail.description_raw ?? "",
      background_image: detail.background_image,
      platforms: detail.platforms?.map((p) => p.platform.name) ?? [],
      genres: detail.genres?.map((g) => g.name) ?? [],
      stores,
    };

    return NextResponse.json(body, {
      headers: {
        // 게임 상세도 방문자 간 엣지 캐시 공유 — RAWG 무료 한도 보호
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
      },
    });
  } catch (e) {
    if (e instanceof RawgError) {
      return NextResponse.json(
        { error: e.message, code: e.code },
        { status: e.status },
      );
    }
    return NextResponse.json(
      { error: "게임 상세 정보를 불러오지 못했습니다." },
      { status: 502 },
    );
  }
}
