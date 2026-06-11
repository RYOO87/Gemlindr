import {
  addDays,
  endOfMonth,
  format,
  isSameMonth,
  startOfMonth,
  startOfWeek,
} from "date-fns";

export interface MonthCell {
  date: Date;
  key: string; // "yyyy-MM-dd" — 출시일 매칭/선택 상태 키로 사용
  inMonth: boolean; // 보고 있는 달의 날짜인지 (false면 앞뒤 빈칸용 이웃 달 날짜)
}

/**
 * 해당 월의 달력 그리드용 42칸(6주) 배열을 반환한다.
 * 일요일 시작 기준으로, 월의 앞뒤를 이웃 달 날짜로 채운다.
 * @param year  연도 (예: 2026)
 * @param month 월 1~12 (예: 6 = 6월)
 */
export function getMonthGrid(year: number, month: number): MonthCell[] {
  const monthStart = startOfMonth(new Date(year, month - 1, 1));
  const gridStart = startOfWeek(monthStart, { weekStartsOn: 0 }); // 일요일 시작

  return Array.from({ length: 42 }, (_, i) => {
    const date = addDays(gridStart, i);
    return {
      date,
      key: format(date, "yyyy-MM-dd"),
      inMonth: isSameMonth(date, monthStart),
    };
  });
}

/**
 * 해당 월의 시작일/종료일을 "YYYY-MM-DD" 문자열로 반환한다.
 * RAWG의 dates={start},{end} 파라미터에 그대로 쓴다.
 * 예: getMonthRange(2026, 6) → { start: "2026-06-01", end: "2026-06-30" }
 */
export function getMonthRange(
  year: number,
  month: number,
): { start: string; end: string } {
  const d = new Date(year, month - 1, 1);
  return {
    start: format(startOfMonth(d), "yyyy-MM-dd"),
    end: format(endOfMonth(d), "yyyy-MM-dd"),
  };
}
