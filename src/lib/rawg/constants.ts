export const RAWG_BASE_URL = "https://api.rawg.io/api";

// RAWG 플랫폼 ID — 전체 목록은 GET /platforms?key=KEY 로 확인 가능
export const PLATFORM_IDS = {
  PC: 4,
  PLAYSTATION_5: 187,
  PLAYSTATION_4: 18,
  XBOX_SERIES_X: 186,
  XBOX_ONE: 1,
  NINTENDO_SWITCH: 7,
} as const;

// RAWG 스토어 ID — 전체 목록은 GET /stores?key=KEY 로 확인 가능
export const STORE_IDS = {
  STEAM: 1,
  MICROSOFT_STORE: 2,
  PLAYSTATION_STORE: 3,
  GOG: 5,
  NINTENDO_STORE: 6,
  XBOX_STORE: 7,
  EPIC_GAMES_STORE: 11,
} as const;

// 스토어 상세 응답에 이름이 없을 때 쓰는 ID → 표시명 매핑
export const STORE_NAMES: Record<number, string> = {
  1: "Steam",
  2: "Microsoft Store",
  3: "PlayStation Store",
  4: "App Store",
  5: "GOG",
  6: "Nintendo Store",
  7: "Xbox Store",
  8: "Google Play",
  9: "itch.io",
  11: "Epic Games Store",
};

export type PlatformFamily = "pc" | "playstation" | "xbox" | "switch" | "other";

// 플랫폼 식별 색 (디자인 시스템 6-1)
export const PLATFORM_COLORS: Record<PlatformFamily, string> = {
  pc: "#E8E2D5",
  playstation: "#3B82F6",
  xbox: "#22C55E",
  switch: "#F97316",
  other: "#9C968B",
};

export const PLATFORM_FAMILY_LABELS: Record<Exclude<PlatformFamily, "other">, string> = {
  pc: "PC",
  playstation: "PlayStation",
  xbox: "Xbox",
  switch: "Switch",
};

// RAWG 플랫폼 이름("PlayStation 5", "Xbox Series S/X" 등)을 색상 패밀리로 정규화
export function platformFamily(platformName: string): PlatformFamily {
  const n = platformName.toLowerCase();
  if (n.includes("playstation") || n.includes("ps vita")) return "playstation";
  if (n.includes("xbox")) return "xbox";
  if (n.includes("switch") || n.includes("nintendo")) return "switch";
  if (n === "pc" || n.includes("macos") || n.includes("linux")) return "pc";
  return "other";
}
