# Excalidraw에 다이어그램 임포트하는 법

발표용 PNG는 `diagrams/*.png` 그대로 PPT에 드래그-앤-드롭하면 끝. 도형 단위로 직접 편집하고 싶을 때만 Excalidraw로 가면 됨.

## 가장 빠른 길 — Excalidraw 내장 변환 사용

이게 결과물이 가장 깔끔함. Node에서 따로 변환 스크립트 돌릴 필요 없음.

1. https://excalidraw.com/ 접속 (로그인 불필요)
2. 좌측 사이드바에서 도구 모음 → 햄버거 또는 `≡` → **"Generate diagram with Mermaid"** 또는 캔버스 우상단의 **AI 아이콘**
3. `diagrams/import-ready/` 폴더의 `.mmd` 파일 내용을 **그대로 붙여넣기**
   - `architecture.mmd` (시스템 아키텍처)
   - `tech-stack.mmd` (기술 스택)
   - `api-spec.mmd` (API 명세)
4. **"Insert"** 클릭 → 캔버스에 도형으로 import됨
5. 도형 단위로 자유 편집 (위치, 색상, 크기). 인디고 톤 주려면 `Edit all` 또는 일괄 선택 후 stroke / background 변경
6. 메뉴 → **"Save to..."** → **`.excalidraw`** 파일로 저장 (다음번에 그대로 열기 가능)

## 임포트용 .mmd 파일

```
diagrams/import-ready/
├── architecture.mmd  ← 시스템 아키텍처 / 서버 흐름
├── tech-stack.mmd    ← 3 레포 기술 스택
└── api-spec.mmd      ← Spring 6 도메인 + NestJS /ai
```

`diagrams/*.mmd` (상위)는 mermaid CLI로 PNG 렌더링할 때 쓰는 themeVariables 포함 버전.
`diagrams/import-ready/*.mmd` 은 Excalidraw에 붙여넣기 전용으로 frontmatter를 제거한 깔끔한 버전.

## Excalidraw 자체 색상 테마 맞추는 팁

발표 인디고 톤 (`#3730a3` fill / `#c7d2fe` stroke / 흰 텍스트) 적용:

1. 캔버스에 import 직후 `Cmd+A`로 전체 선택
2. 우측 패널에서:
   - **Stroke** → 커스텀 hex `#c7d2fe`
   - **Background** → 커스텀 hex `#3730a3`
   - **Fill** → solid (격자 모양 첫 번째)
   - **Stroke style** → solid
   - **Edge** → roundedchar
3. 텍스트만 따로 선택 후 stroke `#ffffff`

## PNG로 다시 export

Excalidraw → 메뉴 → **Export image...** → PNG (배경 transparent 체크) → 다운로드. PPT에 그대로 드래그.

## Node 변환 스크립트는 왜 빠져있나?

`scripts/mmd-to-excalidraw.mjs`는 실험적으로 작성했지만 mermaid 11.x가 브라우저 전용 SVG `getBBox` API를 요구하고, jsdom은 이걸 구현하지 않아 Node 단독으로는 layout 계산이 깨짐. puppeteer로 진짜 헤드리스 Chrome 띄우면 가능하지만 결국 Excalidraw 내장 변환과 동일 결과라서 그쪽이 더 빠름. 스크립트는 참고용으로 남겨둠.
