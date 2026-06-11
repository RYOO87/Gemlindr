# 🗓️ Gemlindr — 게임 출시 캘린더

> **"이번 달에 뭐 나오지?"** 를 끝내는 단 한 장의 달력.

기대작 출시일은 스팀, 에픽, PSN, 닌텐도 스토어에 뿔뿔이 흩어져 있습니다.
Gemlindr는 모든 플랫폼의 출시 예정작을 **스타일리쉬한 다크 달력 한 장**에 모으고,
마음에 드는 게임은 **버튼 한 번으로 내 캘린더에** 넣어줍니다. 이제 출시일을 놓칠 핑계가 없습니다.

## ✨ 무엇을 할 수 있나

- **월 달력 한눈에** — 날짜 칸마다 그날의 출시작이 빨간 슬래시 태그로 박힙니다. 플랫폼은 색 점(PC / PlayStation / Xbox / Switch)으로 구분.
- **Daily Log** — 날짜를 클릭하면 찢어진 노트 패널에 그날의 출시작이 기록됩니다. 커버, 장르, 출시 플랫폼, 스토어 바로가기까지.
- **내 캘린더에 추가** — 구글 캘린더 템플릿 링크 또는 `.ics` 다운로드(애플/아웃룩 호환). 로그인도, OAuth도 없습니다.
- **모바일 OK** — 860px 이하에서는 노트가 달력 아래로 얌전히 내려옵니다.

## 🎨 디자인

검정 잉크 위에 크림슨 한 방울 — 페르소나 5의 디자인 언어에서 영감을 받았습니다.

- 모서리를 **사선으로 잘라낸** 달력 칸과 버튼 (`clip-path`, `border-radius` 금지)
- 선택한 날짜는 칸 전체가 **크림슨으로 반전**
- 항상 떠 있는 크림색 **찢어진 노트 패널** (테이프, 빨간 여백선, 줄무늬)
- 폰트: [Anton](https://fonts.google.com/specimen/Anton) + [Inter](https://fonts.google.com/specimen/Inter) — 전부 무료 폰트

> 빨강은 "출시작 있음"의 신호로만 씁니다. 나머지는 조용한 검정.

## 🛠 기술 스택

| 역할 | 선택 |
|---|---|
| 프레임워크 | Next.js (App Router) + TypeScript |
| 스타일 | Tailwind CSS v4 + 커스텀 CSS 토큰 |
| 날짜 계산 | date-fns |
| 게임 데이터 | [RAWG Video Games Database API](https://rawg.io/apidocs) |
| 배포 | Vercel |

DB 없음, 로그인 없음, 크롤러 없음. 가장 좁은 끝-에서-끝 경로(Phase 0)만 깎았습니다.

## 🚀 시작하기

```bash
git clone https://github.com/<your-account>/gemlindr.git
cd gemlindr
npm install
```

1. [rawg.io/apidocs](https://rawg.io/apidocs)에서 무료 API 키를 발급받습니다.
2. 프로젝트 루트에 `.env.local` 파일을 만들고 키를 넣습니다:
   ```
   RAWG_API_KEY=발급받은_키
   ```
3. 실행:
   ```bash
   npm run dev
   ```
   → http://localhost:3000 (Windows라면 `run.bat` 더블클릭으로도 됩니다.)

## 🔐 보안 한 줄

RAWG 키는 **서버 라우트(`/api/games`)에서만** 사용됩니다. 브라우저에는 우리 서버가 정제한 JSON만 내려가고, 키는 번들·네트워크 어디에도 노출되지 않습니다.

## 🗺 로드맵

- **Phase 0 (지금)** — 달력 + 상세 + 캘린더 추가 ✅
- **Phase 1** — 캐시(DB) + 일일 동기화 + 플랫폼/장르 필터
- **Phase 2** — 즐겨찾기 + 출시 알림 + 구글 캘린더 동기화
- **Phase 3** — 정밀 출시일(IGDB) + 개인화

---

Powered by [RAWG](https://rawg.io) — 게임 데이터는 RAWG Video Games Database에서 제공받습니다.
