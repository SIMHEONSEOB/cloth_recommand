// AI 스타일리스트 한 줄 평 기능

// API 설정 가져오기
import { API_CONFIG } from './config.js';

// AI 스타일 평가 함수
async function getAIStyleRating(weather, selectedClothes, situation = '일상') {
    try {
        // Google Gemini API 호출
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${API_CONFIG.GEMINI_API_KEY}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: `당신은 대한민국 최고의 패션 심사위원입니다. 현재 날씨와 사용자가 선택한 의상을 분석하여 따끔하지만 위트 있는 한 줄 평을 해주세요.

분석 정보:
- 현재 날씨: ${weather}
- 선택된 의상: ${selectedClothes}
- 상황: ${situation}

요구사항:
1. 100자 이내의 짧은 한 줄 평
2. 패션 전문가의 시선에서 평가
3. 따끔하지만 상처되지 않는 위트 있는 표현
4. 현재 날씨와 상황에 대한 적합성 평가
5. 점수(1-100점)와 함께 평가

출력 형식:
"오늘의 코디 점수: 85점 - [한 줄 평가 내용]"

예시:
"오늘의 코디 점수: 75점 - 5도 날씨에 반팔과 패딩은 좀 과하지 않나요? 계절을 고려한 센스가 필요해요!"

이 정보를 바탕으로 오늘의 코디 점수와 한 줄 평을 부탁드립니다.`
                    }]
                }]
            })
        });
        
        if (!response.ok) {
            const errorText = await response.text();
            console.error('API 응답 오류:', response.status, errorText);
            throw new Error(`AI 스타일리스트 API 호출 실패: ${response.status} - ${errorText}`);
        }
        
        const data = await response.json();
        return data.candidates[0].content.parts[0].text;
        
    } catch (error) {
        console.error('AI 스타일리스트 생성 중 오류:', error);
        
        // API 호출 실패 시 대체 평가 제공
        const fallbackRatings = [
            "오늘의 코디 점수: 70점 - 무난한 선택이지만, 조금 더 특별한 포인트를 추가해보세요!",
            "오늘의 코디 점수: 80점 - 날씨를 잘 고려했네요. 이대로도 충분히 멋져요!",
            "오늘의 코디 점수: 65점 - 용기 있는 선택이지만, 조금 더 안정적인 조합이 좋을 것 같아요.",
            "오늘의 코디 점수: 85점 - 당신의 센스가 돋보이는 코디네요. 오늘 하루 멋지게 보내세요!",
            "오늘의 코디 점수: 75점 - 기본은 갖췄어요. 여기에 작은 액세서리를 추가하면 완벽할 거예요!"
        ];
        
        return fallbackRatings[Math.floor(Math.random() * fallbackRatings.length)];
    }
}

// 현재 선택된 의상 정보 가져오기
function getSelectedClothesForRating() {
    const selectedItems = [];
    
    document.querySelectorAll('.outfit-layer.filled').forEach(layer => {
        const itemName = layer.querySelector('.item-name');
        if (itemName) {
            selectedItems.push(itemName.textContent);
        }
    });
    
    return selectedItems.length > 0 ? selectedItems.join(', ') : '선택된 의상 없음';
}

// 현재 날씨 정보 가져오기
function getCurrentWeatherForRating() {
    const weatherElement = document.getElementById('weather');
    return weatherElement ? weatherElement.textContent : '날씨 정보 없음';
}

// 현재 선택된 상황 가져오기
function getCurrentSituation() {
    const activeSituationBtn = document.querySelector('.situation-btn.active');
    return activeSituationBtn ? activeSituationBtn.textContent : '일상';
}

// 스타일 평가 표시 함수
async function displayStyleRating() {
    const selectedClothes = getSelectedClothesForRating();
    const currentWeather = getCurrentWeatherForRating();
    const situation = getCurrentSituation();
    
    if (selectedClothes === '선택된 의상 없음') {
        return;
    }
    
    try {
        // AI 스타일 평가 요청
        const rating = await getAIStyleRating(currentWeather, selectedClothes, situation);
        
        // 날씨 비교 텍스트 대신 AI 평가 표시
        const weatherComparison = document.getElementById('weather-comparison');
        if (weatherComparison) {
            weatherComparison.innerHTML = `<strong>${rating}</strong>`;
            weatherComparison.style.color = '#6366f1';
            weatherComparison.style.fontWeight = '600';
            weatherComparison.style.fontSize = '1.1rem';
            weatherComparison.style.lineHeight = '1.4';
            weatherComparison.style.marginTop = '8px';
            weatherComparison.style.padding = '8px 12px';
            weatherComparison.style.backgroundColor = '#f0f9ff';
            weatherComparison.style.borderRadius = '8px';
            weatherComparison.style.border = '1px solid #e0f2fe';
        }
        
    } catch (error) {
        console.error('스타일 평가 표시 중 오류:', error);
    }
}

// 이벤트 리스너 설정
document.addEventListener('DOMContentLoaded', function() {
    // 의상이 변경될 때마다 스타일 평가 업데이트
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                const target = mutation.target;
                if (target.classList.contains('outfit-layer')) {
                    // 의상 변경 후 약간의 지연 후 평가 업데이트
                    setTimeout(displayStyleRating, 500);
                }
            }
        });
    });
    
    // 모든 의상 레이어 관찰
    document.querySelectorAll('.outfit-layer').forEach(layer => {
        observer.observe(layer, { attributes: true });
    });
    
    // 초기 로드 시 평가
    setTimeout(displayStyleRating, 1000);
});

// 전역 함수로 내보내기
window.getAIStyleRating = getAIStyleRating;
window.displayStyleRating = displayStyleRating;
