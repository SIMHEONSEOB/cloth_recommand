# 🌤️ 오늘 뭐 입지? — 날씨 기반 의상 추천 웹앱

> 실시간 날씨 정보와 AI 코디네이터를 결합한 스마트 패션 추천 시스템

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat-square&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat-square&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat-square&logo=javascript&logoColor=black)
![AI](https://img.shields.io/badge/AI-OpenAI_GPT-blue?style=flat-square&logo=openai&logoColor=white)

---

## 📖 프로젝트 소개

**"오늘 뭐 입지?"** 는 사용자의 현재 위치를 기반으로 실시간 날씨 데이터를 가져와, **AI 코디네이터**가 날씨와 선택된 의상을 분석하여 전문적인 패션 조언을 제공하는 차세대 스마트 웹 애플리케이션입니다.

단순한 날씨 정보를 넘어, **AI 기반 TPO 어드바이스**, **현대적인 UI/UX**, **개인화된 추천**을 통해 사용자에게 완벽한 코디 경험을 제공합니다.

---

## ✨ 주요 기능

### 🌡️ 실시간 날씨 연동
- **기상청 초단기실황 API** 연동으로 실시간 기온, 습도, 풍속 정보 제공
- **브라우저 Geolocation API**를 활용한 현재 위치 자동 감지
- 위도/경도 → 기상청 격자 좌표 자동 변환

### 🤖 AI 코디네이터 TPO 어드바이스
- **OpenAI GPT-3.5-turbo** 기반 전문가 조언
- 날씨와 선택된 의상 조합 분석
- TPO(시간, 장소, 상황) 고려 맞춤 조언
- 실용적인 2문장 조언 제공
- API 실패 시 스마트 폴백 시스템

### 👕 스마트 의상 추천
- 체감온도 기반 아우터/상의/하의 카테고리별 추천
- **성별 선택** (남성/여성)
- **스타일 선택** (캐주얼/모던/스트리트)
- **시각적 의상 레이어링**: 3단계 의상 조합 시각화
- **드래그 앤 드롭**: 직관적인 의상 조합

### 🎨 현대적 디자인
- **kpop.fit 영감**: 그라데이션 배경과 유리 효과
- **동글동글 버튼**: 일관된 완벽한 동그라미 디자인
- **미니멀리즘**: 불필요한 기능 제거로 핵심에 집중
- **반응형 디자인**: 모바일에서 완벽한 표시
- **다크 모드**: 원클릭 테마 전환

### 🌙 사용자 경험
- **직관적인 인터페이스**: 복잡한 기능 제거
- **실시간 피드백**: 로딩 애니메이션과 상태 표시
- **데이터 영속성**: localStorage 기반 설정 저장

---

## 🛠️ 기술 스택

| 분류 | 기술 |
|------|------|
| **마크업** | HTML5, Semantic HTML |
| **스타일링** | CSS3, CSS Variables, Backdrop-filter |
| **로직** | Vanilla JavaScript (ES Modules) |
| **AI 연동** | OpenAI API (GPT-3.5-turbo) |
| **날씨 API** | 기상청 초단기실황 조회 서비스 |
| **폰트** | Google Fonts (Noto Sans KR) |
| **아이콘** | Font Awesome 6 |
| **저장소** | localStorage |

---

## 📁 프로젝트 구조

```
cloth_recommand/
├── index.html           # 메인 HTML (kpop.fit 스타일)
├── style.css            # 현대적 CSS (그라데이션, 유리 효과)
├── main.js              # 핵심 로직 (날씨 API, 추천 엔진)
├── ai-advisor.js        # AI 코디네이터 기능
├── clothesData.js       # 의상 데이터 관리
├── images/              # 의상 이미지 폴더
│   ├── 남성 맨투맨 남색.png
│   ├── 여성 블라우스 흰색.png
│   └── ... (30개+ 의상)
├── sitemap.xml          # SEO 사이트맵
├── robots.txt           # 검색 엔진 지시
├── privacy.html         # 개인정보처리방침
└── README.md            # 프로젝트 문서 (현재 파일)
```

---

## � 시작하기

### 1. 클론

```bash
git clone https://github.com/SIMHEONSEOB/cloth_recommand.git
cd cloth_recommand
```

### 2. 실행

별도의 빌드 과정 없이 `index.html` 파일을 브라우저에서 열면 바로 사용할 수 있습니다.

> **Live Server 사용 권장**: VS Code의 [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) 확장을 사용하면 ES Module 지원과 실시간 리로드가 가능합니다.

### 3. AI 기능 설정

AI 코디네이터 기능을 사용하려면 OpenAI API 키가 필요합니다:

```javascript
// ai-advisor.js 파일에서
'Authorization': 'Bearer YOUR_API_KEY' // 실제 OpenAI API 키로 교체
```

### 4. 위치 권한 허용

앱 실행 시 브라우저가 위치 권한을 요청합니다. **허용**을 선택하면 현재 위치 기반 날씨를 제공합니다.

> ⚠️ 위치 권한을 거부하면 **서울** 기준으로 날씨가 표시됩니다.

---

## 🎯 사용 방법

### 1. 기본 설정
1. **성별 선택**: 남성/여성 중 선택
2. **스타일 선택**: 캐주얼/모던/스트리트 중 선택
3. **위치 권한 허용**: 브라우저가 위치 정보 접근을 요청하면 허용

### 2. 의상 추천 확인
- 현재 날씨에 맞는 의상이 추천됩니다
- 의상을 클릭하여 코디에 추가할 수 있습니다

### 3. AI 코디네이터 활용
- 의상 조합을 완성한 후 "TPO 어드바이스 받기" 버튼 클릭
- AI가 날씨와 선택된 옷을 분석하여 전문가 조언 제공
- "오늘 영하 5도인데 얇은 코트를 고르셨네요. 히트텍을 껴입거나 목도리를 추가하는 걸 추천해요!"

### 4. 시각적 코디
- 선택된 의상이 3단계 레이어로 시각화됩니다
- 아우터/상의/하의 레이어링으로 코디 확인

---

## 🎨 디자인 특징

### kpop.fit 영감 디자인
- **그라데이션 배경**: `linear-gradient(135deg, #667eea 0%, #764ba2 100%)`
- **유리 효과**: `backdrop-filter: blur(10px)`와 반투명 카드
- **현대적 색상**: 인디고, 퍼플, 핑크 톤의 그라데이션
- **동글동글 버튼**: 완벽한 동그라미 디자인

### UI/UX 개선
- **미니멀리즘**: 불필요한 섹션 제거로 핵심 기능에 집중
- **일관된 디자인**: 모든 요소가 통일된 스타일 시스템
- **부드러운 애니메이션**: 자연스러운 전환 효과

---

## 🤖 AI 코디네이터 상세

### 기술 구현
```javascript
async function getAIAdvice(weather, selectedClothes) {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer YOUR_API_KEY'
        },
        body: JSON.stringify({
            model: "gpt-3.5-turbo",
            messages: [{
                role: "system", 
                content: "당신은 패션 전문가입니다. 날씨와 사용자가 고른 옷을 분석해 2문장으로 조언하세요."
            }, {
                role: "user",
                content: `오늘 날씨: ${weather}, 선택한 옷: ${selectedClothes}. 이 코디가 적절할까?`
            }]
        })
    });
}
```

### 폴백 시스템
- API 호출 실패 시 4가지 대체 조언 제공
- 에러 처리와 사용자 친화적 메시지
- 오프라인에서도 기능 작동

---

## 📱 반응형 디자인

### 모바일 최적화
- 768px 이하에서 완벽한 레이아웃
- 터치 친화적인 버튼 크기
- 세로 모드에서의 최적화된 표시

### 데스크톱 경험
- 1200px 최대 너비로 넓은 화면 지원
- 마우스 호버 효과와 상호작용
- 키보드 내비게이션 지원

---

## 🔧 개발 환경

### 브라우저 지원
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

### 개발 도구
- **VS Code**: 코드 편집기
- **Live Server**: 로컬 개발 서버
- **Chrome DevTools**: 디버깅 및 성능 분석

---

## 📸 미리보기

| 라이트 모드 | 다크 모드 |
|:-----------:|:---------:|
| 그라데이션 배경의 현대적 UI | 어두운 배경의 눈 편한 UI |

---

## 📜 라이선스

이 프로젝트는 자유롭게 사용할 수 있습니다.

---

## 🤝 기여

버그 리포트, 기능 제안, 코드 개선은 언제나 환영합니다!

---

<p align="center">
  Made with ❤️ by <strong>SIMHEONSEOB</strong>
</p>
