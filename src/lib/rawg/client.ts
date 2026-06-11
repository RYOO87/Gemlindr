import { RAWG_BASE_URL } from "./constants";

export type RawgErrorCode = "NO_API_KEY" | "UPSTREAM";

export class RawgError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly code: RawgErrorCode,
  ) {
    super(message);
    this.name = "RawgError";
  }
}

// 서버 전용 RAWG fetch 헬퍼. 키 주입과 에러 처리를 한 곳에서 담당한다.
// 이 모듈은 절대 클라이언트 컴포넌트에서 import하지 말 것 (키 노출 방지).
export async function rawgFetch<T>(
  path: string,
  params: Record<string, string> = {},
): Promise<T> {
  const key = process.env.RAWG_API_KEY;
  if (!key || key === "여기에_키") {
    throw new RawgError(
      "RAWG API 키가 설정되지 않았습니다. .env.local의 RAWG_API_KEY를 채워주세요.",
      503,
      "NO_API_KEY",
    );
  }

  const url = new URL(`${RAWG_BASE_URL}${path}`);
  url.searchParams.set("key", key);
  for (const [k, v] of Object.entries(params)) {
    url.searchParams.set(k, v);
  }

  // 같은 요청은 1시간 캐시 — RAWG 무료 한도 절약
  const res = await fetch(url, { next: { revalidate: 3600 } });
  if (!res.ok) {
    throw new RawgError(
      `RAWG 요청 실패 (${res.status})`,
      res.status === 404 ? 404 : 502,
      "UPSTREAM",
    );
  }
  return res.json() as Promise<T>;
}
