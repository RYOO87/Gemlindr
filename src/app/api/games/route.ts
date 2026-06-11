import { NextRequest, NextResponse } from "next/server";
import { rawgFetch, RawgError } from "@/lib/rawg/client";
import type { CalendarGame } from "@/lib/types";

interface RawgGameListItem {
  id: number;
  name: string;
  released: string | null;
  tba: boolean;
  background_image: string | null;
  platforms: { platform: { id: number; name: string } }[] | null;
  stores: { store: { id: number; name: string } }[] | null;
}

interface RawgListResponse {
  count: number;
  next: string | null;
  results: RawgGameListItem[];
}

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
const MAX_PAGES = 3; // 한 달 최대 120개 — 그 이상은 달력 표시상 의미 없음

// GET /api/games?start=YYYY-MM-DD&end=YYYY-MM-DD&platforms=4,187 (platforms 선택)
// RAWG 키는 서버에서만 사용하고 응답에 절대 포함하지 않는다.
export async function GET(request: NextRequest) {
  const sp = request.nextUrl.searchParams;
  const start = sp.get("start");
  const end = sp.get("end");
  const platforms = sp.get("platforms");

  if (!start || !end || !DATE_RE.test(start) || !DATE_RE.test(end)) {
    return NextResponse.json(
      { error: "start/end는 YYYY-MM-DD 형식이어야 합니다." },
      { status: 400 },
    );
  }
  if (platforms && !/^\d+(,\d+)*$/.test(platforms)) {
    return NextResponse.json(
      { error: "platforms는 콤마로 구분한 숫자 ID여야 합니다." },
      { status: 400 },
    );
  }

  try {
    const games: CalendarGame[] = [];

    for (let page = 1; page <= MAX_PAGES; page++) {
      const params: Record<string, string> = {
        dates: `${start},${end}`,
        ordering: "released",
        page_size: "40",
        page: String(page),
      };
      if (platforms) params.platforms = platforms;

      const data = await rawgFetch<RawgListResponse>("/games", params);
      games.push(
        ...data.results.map((g) => ({
          id: g.id,
          name: g.name,
          released: g.released,
          tba: g.tba,
          background_image: g.background_image,
          platforms: g.platforms?.map((p) => p.platform.name) ?? [],
          stores: g.stores?.map((s) => s.store.name) ?? [],
        })),
      );
      if (!data.next) break;
    }

    return NextResponse.json({ games });
  } catch (e) {
    if (e instanceof RawgError) {
      return NextResponse.json(
        { error: e.message, code: e.code },
        { status: e.status },
      );
    }
    return NextResponse.json(
      { error: "게임 데이터를 불러오지 못했습니다." },
      { status: 502 },
    );
  }
}
