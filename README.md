# To:DAY - 일정 관리 웹 애플리케이션

React + TypeScript + Vite 기반의 일정 관리 웹 애플리케이션입니다.

## 기술 스택

- **Frontend**: React 19, TypeScript
- **Build Tool**: Vite
- **Router**: React Router v7
- **Styling**: Inline Styles (추후 CSS Modules 또는 Styled Components 도입 예정)

## 시작하기

```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run dev

# 빌드
npm run build

# 프로덕션 미리보기
npm run preview
```

개발 서버는 기본적으로 `http://localhost:5173`에서 실행됩니다.

## 팀원 안내

- 로그인은 현재 임시 구현이므로 아무 이메일/비밀번호나 입력하면 됩니다
- 모든 메인 페이지는 로그인 후 접근 가능합니다
- 사이드바를 통해 페이지 간 이동이 가능합니다

## 프로젝트 구조

```
src/
├── App.tsx                           # 라우팅 설정
├── main.tsx                          # 애플리케이션 진입점
├── index.css                         # 전역 스타일
│
├── components/                       # 재사용 가능한 컴포넌트
│   └── layout/
│       ├── MainLayout.tsx           # 메인 레이아웃 (사이드바 + 콘텐츠)
│       ├── Sidebar.tsx              # 왼쪽 네비게이션 사이드바
│       └── ProtectedRoute.tsx       # 인증 보호 라우트 컴포넌트
│
├── pages/                            # 페이지 컴포넌트
│   ├── auth/
│   │   └── LoginPage.tsx            # 로그인 페이지
│   ├── DashboardPage.tsx            # 대시보드 페이지
│   ├── CalendarPage.tsx             # 캘린더 페이지 (메인)
│   ├── GoalTrackerPage.tsx          # 할일 목록 페이지
│   ├── CommunityPage.tsx            # 커뮤니티 페이지
│   └── AnalyticsPage.tsx            # 분석 및 추천 페이지
│
└── styles/                           # 스타일 관련 파일 (추후 사용)
```

## 라우팅 구조

```
/                          → 자동으로 /dashboard로 리다이렉트
/login                     → 로그인 페이지 (인증 불필요)

# 메인 앱 (인증 필요)
/dashboard                 → 대시보드
/calendar                  → 캘린더
/goal-tracker              → 할일 목록
/community                 → 커뮤니티
/analytics                 → 분석 및 추천
```

## 주요 기능

### 1. 인증 시스템
- `ProtectedRoute`: 로그인하지 않은 사용자를 `/login`으로 리다이렉트
- `LoginPage`: 임시 로그인 구현 (localStorage 사용)
- 추후 백엔드 API 연동 및 JWT 토큰 기반 인증으로 업그레이드 예정

### 2. 레이아웃
- **MainLayout**: 모든 메인 페이지에 적용되는 공통 레이아웃
  - 왼쪽: 고정 사이드바 (220px)
  - 오른쪽: 페이지 콘텐츠 영역
- **Sidebar**: 네비게이션 메뉴 및 사용자 정보 표시

### 3. 페이지 구성
각 페이지는 독립적인 컴포넌트로 구성되어 있으며, 현재는 레이아웃만 구현된 상태입니다.

## 개발 가이드

### 새로운 페이지 추가하기

1. `src/pages/` 디렉터리에 새 페이지 컴포넌트 생성
2. `src/App.tsx`에 라우트 추가
3. 필요시 `src/components/layout/Sidebar.tsx`의 메뉴에 추가

### 컴포넌트 작성 규칙

- 함수형 컴포넌트와 TypeScript 사용
- Props는 interface로 타입 정의
- 파일명은 PascalCase (예: `MyComponent.tsx`)

## 향후 계획

- [ ] 백엔드 API 연동
- [ ] JWT 기반 인증 시스템 구현
- [ ] 캘린더 기능 구현
- [ ] 할일 관리 기능 구현
- [ ] 반응형 디자인 적용
- [ ] CSS 라이브러리 도입 (Tailwind CSS / Styled Components)
- [ ] 상태 관리 라이브러리 도입 (Zustand / Recoil)
