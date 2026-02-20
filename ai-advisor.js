// AI 코디네이터 TPO 어드바이스 기능

// OpenAI API 연동 함수
async function getAIAdvice(weather, selectedClothes) {
    try {
        // OpenAI API 호출
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer sk-proj-4Q3h8kL2mN9pX7rJ6vW5T3yF1zG8bD2cV9nK7sQ5xP1mR4tY6uI3oE8wA2fG7h'
            },
            body: JSON.stringify({
                model: "gpt-4",
                messages: [{
                    role: "user",
                    content: `당신은 대한민국 최고의 패션 전문가입니다. 다음 정보를 종합적으로 분석하여 실용적이고 구체적인 조언을 제공해주세요.

분석 기준:
1. 날씨 조건: ${weather}
2. 선택된 의상: ${selectedClothes}
3. TPO(시간, 장소, 상황) 고려
4. 실용성과 안전성 우선

조언 스타일:
- "내일 비가 올 예정이니 신발은 방수가 되는 로퍼를 추천해요" 같은 구체적이고 실용적인 조언
- 온도 변화에 대비한 레이어링 조언
- 미세먼지 농도에 따른 액세서리 추천
- 활동량에 따른 소재와 착용감 조언
- 2문장으로 간결하게 전달

답변 형식:
첫 번째 문장: 날씨와 옷의 적합성 평가
두 번째 문장: 구체적인 개선 조언이나 추가 아이템 추천

오늘 날씨: ${weather}, 선택한 옷: ${selectedClothes}. 이 코디가 적절할까? 실용적인 TPO 조언을 부탁드립니다.`
                }],
                max_tokens: 150,
                temperature: 0.7
            })
        });
        
        if (!response.ok) {
            const errorText = await response.text();
            console.error('API 응답 오류:', response.status, errorText);
            throw new Error(`AI API 호출 실패: ${response.status} - ${errorText}`);
        }
        
        const data = await response.json();
        return data.choices[0].message.content;
        
    } catch (error) {
        console.error('AI 어드바이스 오류:', error);
        
        // API 호출 실패 시 대체 조언 제공
        const fallbackAdvices = [
            "오늘 날씨에 맞춰 따뜻한 아우터를 추가하면 더 좋을 것 같아요.",
            "체온 유지를 위해 두꺼운 아우터는 필수예요. 일교차가 커요.",
            "밤을 대비해 겉옷을 챙기세요. 낮과 밤 온도 차이가 큽니다.",
            "미세먼지 농도가 높을 때는 마스크 착용을 추천드립니다.",
            "비가 올 예정이니 우산이나 방수 재킷을 준비하세요."
        ];
        
        return fallbackAdvices[Math.floor(Math.random() * fallbackAdvices.length)];
    }
}

// 날씨 조건 분석 함수
function analyzeWeatherConditions(weather) {
    const conditions = [];
    
    // 기온 분석
    const tempMatch = weather.match(/(\d+)도/);
    if (tempMatch) {
        const temp = parseInt(tempMatch[1]);
        if (temp < 0) {
            conditions.push('매우 추움');
        } else if (temp < 10) {
            conditions.push('추움');
        } else if (temp < 20) {
            conditions.push('서늘함');
        } else if (temp < 25) {
            conditions.push('온화함');
        } else {
            conditions.push('더움');
        }
    }
    
    // 미세먼지 분석
    if (weather.includes('미세먼지')) {
        conditions.push('미세먼지 주의');
    }
    
    // 풍속 분석
    if (weather.includes('바람')) {
        conditions.push('바람 강함');
    }
    
    return conditions.length > 0 ? conditions.join(', ') : '평이한 날씨';
}

// 현재 선택된 의상 정보 가져오기
function getSelectedClothes() {
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
function getCurrentWeather() {
    const weatherElement = document.getElementById('weather');
    return weatherElement ? weatherElement.textContent : '날씨 정보 없음';
}

// 이벤트 리스너 설정
document.addEventListener('DOMContentLoaded', function() {
    const aiAdviceBtn = document.getElementById('get-ai-advice');
    const aiAdviceResult = document.getElementById('ai-advice-result');
    const aiAdviceText = document.getElementById('ai-advice-text');
    const aiAdviceTime = document.getElementById('ai-advice-time');
    
    if (aiAdviceBtn) {
        aiAdviceBtn.addEventListener('click', async function() {
            // 로딩 상태 표시
            aiAdviceBtn.classList.add('loading');
            aiAdviceBtn.querySelector('i').className = 'fas fa-spinner';
            aiAdviceBtn.querySelector('span').textContent = 'AI 분석 중...';
            
            // 현재 선택된 의상과 날씨 정보
            const selectedClothes = getSelectedClothes();
            const currentWeather = getCurrentWeather();
            
            try {
                // AI 조언 요청
                const advice = await getAIAdvice(currentWeather, selectedClothes);
                
                // 결과 표시
                aiAdviceText.textContent = advice;
                aiAdviceTime.textContent = new Date().toLocaleTimeString('ko-KR', { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                });
                
                // 결과 섹션 표시
                aiAdviceResult.classList.remove('hidden');
                
                // 버튼 상태 복원
                aiAdviceBtn.classList.remove('loading');
                aiAdviceBtn.querySelector('i').className = 'fas fa-magic';
                aiAdviceBtn.querySelector('span').textContent = 'TPO 어드바이스 받기';
                
            } catch (error) {
                console.error('AI 어드바이스 오류:', error);
                
                // 에러 메시지 표시
                aiAdviceText.textContent = 'AI 조언을 가져오는 중 오류가 발생했습니다. 다시 시도해주세요.';
                aiAdviceTime.textContent = new Date().toLocaleTimeString('ko-KR', { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                });
                
                // 결과 섹션 표시
                aiAdviceResult.classList.remove('hidden');
                
                // 버튼 상태 복원
                aiAdviceBtn.classList.remove('loading');
                aiAdviceBtn.querySelector('i').className = 'fas fa-magic';
                aiAdviceBtn.querySelector('span').textContent = 'TPO 어드바이스 받기';
            }
        });
    }
});
