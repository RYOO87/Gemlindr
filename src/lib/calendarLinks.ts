import { addDays, format, parseISO } from "date-fns";

export interface CalendarEventInput {
  id?: number;
  name: string;
  released: string; // "YYYY-MM-DD"
  details?: string;
}

// 종일 일정: 시작일 = 출시일, 종료일 = 출시일 + 1일 (종료일 미포함 규칙)
function eventDates(released: string): { start: string; end: string } {
  const startDate = parseISO(released);
  return {
    start: format(startDate, "yyyyMMdd"),
    end: format(addDays(startDate, 1), "yyyyMMdd"),
  };
}

// 구글 캘린더 템플릿 링크 — OAuth 없이 미리 채워진 일정 생성 화면을 연다
export function buildGoogleCalendarUrl({
  name,
  released,
  details = "",
}: CalendarEventInput): string {
  const { start, end } = eventDates(released);
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: `${name} 출시`,
    dates: `${start}/${end}`,
    details,
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

// ICS 텍스트 필드 이스케이프 (RFC 5545)
function escapeIcsText(text: string): string {
  return text
    .replace(/\\/g, "\\\\")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,")
    .replace(/\r?\n/g, "\\n");
}

// 표준 VEVENT .ics — 구글/애플/아웃룩 캘린더 호환
export function buildIcsContent({
  id,
  name,
  released,
  details = "",
}: CalendarEventInput): string {
  const { start, end } = eventDates(released);
  const stamp = new Date().toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";

  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Gemlindr//Game Release Calendar//KO",
    "CALSCALE:GREGORIAN",
    "BEGIN:VEVENT",
    `UID:game-${id ?? start}-${start}@gemlindr`,
    `DTSTAMP:${stamp}`,
    `SUMMARY:${escapeIcsText(`${name} 출시`)}`,
    `DTSTART;VALUE=DATE:${start}`,
    `DTEND;VALUE=DATE:${end}`,
    `DESCRIPTION:${escapeIcsText(details)}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");
}

// 브라우저에서 .ics 파일 다운로드 트리거 (클라이언트 전용)
export function downloadIcs(filename: string, content: string): void {
  const blob = new Blob([content], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
