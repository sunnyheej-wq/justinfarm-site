# 렌탈클리어

가전렌탈 비교와 선택 기준을 다루는 정적 블로그입니다. Cloudflare Pages와 `justinfarm.com` 배포를 기준으로 만들었습니다.

## 주요 구조

```txt
/                                      홈
/compare/                             가전렌탈 비교 허브
/blog/                                렌탈 가이드 목록
/blog/rental-contract-checklist/      계약 전 체크리스트
/blog/water-purifier-rental-guide/    정수기 렌탈 가이드
/blog/air-purifier-rental-guide/      공기청정기 렌탈 가이드
/blog/bidet-rental-guide/             비데 렌탈 가이드
/blog/rental-vs-buy-guide/            렌탈 vs 구매 비교
/admin/                               운영 체크리스트
/privacy/                             개인정보처리방침
/terms/                               이용약관
/editorial-policy/                    편집 정책
```

## 운영 원칙

- 모든 주요 배너와 CTA는 렌탈 상담 링크로 연결합니다.
- 검색 품질을 고려해 비교 기준, 주의사항, FAQ, 편집 정책, 개인정보처리방침을 제공합니다.
- 네이버와 구글 SEO를 위해 고유 title, description, canonical, sitemap, robots 구성을 유지합니다.
- 가격, 사은품, 약정 조건은 변동될 수 있으므로 본문에서 최종 확인 필요성을 안내합니다.

## 로컬 확인

```powershell
C:\Users\justi\.cache\codex-runtimes\codex-primary-runtime\dependencies\python\python.exe -m http.server 8788 --bind 127.0.0.1
```

접속 주소:

```txt
http://127.0.0.1:8788/
```

## Cloudflare Pages 배포

```powershell
$env:Path = "C:\Program Files\nodejs;$env:APPDATA\npm;" + $env:Path
& "$env:APPDATA\npm\wrangler.cmd" pages deploy . --project-name justinfarm --branch main
```
