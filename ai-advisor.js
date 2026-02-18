// AI 코디네이터 TPO 어드바이스 기능

// OpenAI API 연동 함수
async function getAIAdvice(weather, selectedClothes) {
    try {
        // OpenAI API 호출 (실제 사용 시 API 키 필요)
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer YOUR_API_KEY' // 실제 API 키로 교체 필요
            },
            body: JSON.stringify({
                model: "gpt-3.5-turbo",
                messages: [{
                    role: "system", 
                    content: "당신은 패션 전문가입니다. 날씨와 사용자가 고른 옷을 분석해 2문장으로 조언하세요. 한국어로 답변하고, 구체적이고 실용적인 조언을 제공해주세요."
                }, {
                    role: "user",
                    content: `오늘 날씨: ${weather}, 선택한 옷: ${selectedClothes}. 이 코디가 적절할까? TPO(시간, 장소, 상황)를 고려해서 조언해주세요.` 
                }]
            })
        });
        
        if (!response.ok) {
            throw new Error('AI API 호출 실패');
        }
        
        const data = await response.json();
        return data.choices[0].message.content;
        
    } catch (error) {
        console.error('AI 어드바이스 오류:', error);
        
        // API 호출 실패 시 대체 조언 제공
        const fallbackAdvices = [
            "오늘 날씨에 맞춰 따뜻한 아우터를 추가하면 더 좋을 것 같아요. 스타일리시하게 코디 완성해보세요!",
            "선택하신 옷이 잘 어울러요! 날씨가 쌀쌀하니 얇은 니트나 스카프를 추가해보는 건 어떨까요?",
            "좋은 선택이세요! 오늘 날씨를 고려하면 레이어링으로 온도 조절하면 더 편안할 거예요.",
            "스타일이 멋지네요! 날씨가 좀 춥다면 보온성 좋은 아이템으로 코디를 보강해보세요."
        ];
        
        return fallbackAdvices[Math.floor(Math.random() * fallbackAdvices.length)];
    }
}

// 현재 선택된 의상 정보 가져오기
function getSelectedClothes() {
    const selectedItems = [];
    
    document.querySelectorAll('.outfit-layer.filled').forEach(layer => {
        const itemName = layer.querySelector('.item-name');
        const category = layer.dataset.category;
        
        if (itemName) {
            selectedItems.push(`${category}: ${itemName.textContent}`);
        }
    });
    
    if (selectedItems.length === 0) {
        return "아직 선택된 옷이 없습니다";
    }
    
    return selectedItems.join(', ');
}

// 현재 날씨 정보 가져오기
function getCurrentWeather() {
    const weatherElement = document.getElementById('weather');
    const locationElement = document.getElementById('location');
    
    const weather = weatherElement ? weatherElement.textContent : '정보 없음';
    const location = locationElement ? locationElement.textContent : '정보 없음';
    
    return `${location} - ${weather}`;
}

// AI 어드바이스 버튼 이벤트 리스너
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
                console.error('AI 어드바이스 처리 중 오류:', error);
                
                // 에러 처리
                aiAdviceText.textContent = '죄송합니다. 잠시 후 다시 시도해주세요.';
                aiAdviceTime.textContent = new Date().toLocaleTimeString('ko-KR', { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                });
                
                aiAdviceResult.classList.remove('hidden');
                
                // 버튼 상태 복원
                aiAdviceBtn.classList.remove('loading');
                aiAdviceBtn.querySelector('i').className = 'fas fa-magic';
                aiAdviceBtn.querySelector('span').textContent = 'TPO 어드바이스 받기';
            }
        });
    }
});

// 전역 함수로 내보내기
window.getAIAdvice = getAIAdvice;
window.getSelectedClothes = getSelectedClothes;
window.getCurrentWeather = getCurrentWeather;
