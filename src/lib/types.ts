// /api/games 가 달력용으로 반환하는 게임 1건
export interface CalendarGame {
  id: number;
  name: string;
  released: string | null; // "YYYY-MM-DD"
  tba: boolean;
  background_image: string | null;
  platforms: string[];
  stores: string[];
}

export interface StoreLink {
  name: string;
  url: string;
}

// /api/games/[id] 가 반환하는 상세 정보
export interface GameDetailData {
  id: number;
  name: string;
  released: string | null;
  tba: boolean;
  description: string;
  background_image: string | null;
  platforms: string[];
  genres: string[];
  stores: StoreLink[];
}
