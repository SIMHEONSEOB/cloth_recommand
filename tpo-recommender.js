// 상황별(TPO) 추천 기능

// 상황별 의상 추천 함수
async function getTPORecommendations(weather, situation, gender, style) {
    try {
        // API 키 가져오기
        const apiKey = getOpenAIKey();
        if (!apiKey) {
            throw new Error('OpenAI API 키가 필요합니다.');
        }
        
        // OpenAI API 호출
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: "gpt-4",
                messages: [{
                    role: "user",
                    content: `당신은 대한민국 최고의 패션 전문가입니다. 현재 날씨와 사용자의 상황에 맞는 의상을 추천해주세요.

분석 정보:
- 현재 날씨: ${weather}
- 상황: ${situation}
- 성별: ${gender}
- 스타일 선호: ${style}

요구사항:
1. 상황에 맞는 의상 카테고리별 추천 (아우터, 상의, 하의, 신발)
2. 날씨 적합성 고려
3. 구체적인 아이템 이름으로 추천
4. 우선순위가 높은 아이템부터 정렬
5. 각 카테고리별 3개 이상 추천

출력 형식 (JSON):
{
  "outer": ["아이템1", "아이템2", "아이템3"],
  "top": ["아이템1", "아이템2", "아이템3"],
  "bottom": ["아이템1", "아이템2", "아이템3"],
  "shoes": ["아이템1", "아이템2", "아이템3"]
}

예시:
{
  "outer": ["트렌치코트", "라이더 자켓", "블레이저"],
  "top": ["와이셔츠", "니트", "티셔츠"],
  "bottom": ["슬랙스", "데님 팬츠", "치노 팬츠"],
  "shoes": ["로퍼", "스니커즈", "옥스포드"]
}

이 정보를 바탕으로 JSON 형식으로 추천해주세요.`
                }],
                max_tokens: 300,
                temperature: 0.7
            })
        });
        
        if (!response.ok) {
            const errorText = await response.text();
            console.error('API 응답 오류:', response.status, errorText);
            throw new Error(`TPO 추천 API 호출 실패: ${response.status} - ${errorText}`);
        }
        
        const data = await response.json();
        const responseText = data.choices[0].message.content;
        
        // JSON 파싱
        const jsonMatch = responseText.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
            return JSON.parse(jsonMatch[0]);
        } else {
            throw new Error('JSON 형식의 응답을 찾을 수 없습니다.');
        }
        
    } catch (error) {
        console.error('TPO 추천 생성 중 오류:', error);
        
        // API 호출 실패 시 기본 추천 제공
        const defaultRecommendations = {
            outer: ["기본 자켓", "코트", "카디건"],
            top: ["기본 티셔츠", "셔츠", "니트"],
            bottom: ["기본 청바지", "슬랙스", "치노"],
            shoes: ["기본 스니커즈", "로퍼", "부츠"]
        };
        
        return defaultRecommendations;
    }
}

// 현재 날씨 정보 가져오기
function getCurrentWeatherForTPO() {
    const weatherElement = document.getElementById('weather');
    return weatherElement ? weatherElement.textContent : '날씨 정보 없음';
}

// 현재 선택된 상황 가져오기
function getCurrentSituationForTPO() {
    const activeSituationBtn = document.querySelector('.situation-btn.active');
    return activeSituationBtn ? activeSituationBtn.textContent : '일상';
}

// 현재 선택된 성별 가져오기
function getCurrentGenderForTPO() {
    const activeGenderBtn = document.querySelector('.gender-selection button.active');
    return activeGenderBtn ? activeGenderBtn.textContent : '남성';
}

// 현재 선택된 스타일 가져오기
function getCurrentStyleForTPO() {
    const activeStyleBtn = document.querySelector('.style-selection button.active');
    return activeStyleBtn ? activeStyleBtn.textContent : '캐주얼';
}

// 추천된 의상으로 추천 그리드 업데이트
function updateRecommendationsGrid(recommendations) {
    const recommendationsGrid = document.getElementById('recommendations');
    recommendationsGrid.innerHTML = '';
    
    // 모든 카테고리의 추천 아이템을 하나의 배열로 합치기
    const allRecommendations = [];
    Object.keys(recommendations).forEach(category => {
        recommendations[category].forEach((item, index) => {
            allRecommendations.push({
                name: item,
                category: category,
                priority: index + 1
            });
        });
    });
    
    // 우선순위별로 정렬하여 표시
    allRecommendations.sort((a, b) => a.priority - b.priority);
    
    allRecommendations.forEach(item => {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'recommendation-item';
        itemDiv.dataset.category = item.category;
        itemDiv.dataset.priority = item.priority;
        
        itemDiv.innerHTML = `
            <div class="recommendation-content">
                <div class="recommendation-name">${item.name}</div>
                <div class="recommendation-category">${getCategoryName(item.category)}</div>
                <div class="recommendation-priority">추천 순위: ${item.priority}</div>
            </div>
            <div class="recommendation-action">
                <button class="add-to-outfit-btn" data-item="${item.name}" data-category="${item.category}">
                    <i class="fas fa-plus"></i>
                    추가
                </button>
            </div>
        `;
        
        recommendationsGrid.appendChild(itemDiv);
    });
    
    // 추가 버튼 이벤트 리스너
    document.querySelectorAll('.add-to-outfit-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const itemName = this.dataset.item;
            const category = this.dataset.category;
            addItemToOutfit(itemName, category);
        });
    });
}

// 카테고리 이름 변환
function getCategoryName(category) {
    const categoryNames = {
        'outer': '아우터',
        'top': '상의',
        'bottom': '하의',
        'shoes': '신발'
    };
    return categoryNames[category] || category;
}

// 의상 아이템 추가 함수 (main.js의 함수와 연동)
function addItemToOutfit(itemName, category) {
    const layer = document.getElementById(`layer-${category}`);
    if (layer && !layer.classList.contains('filled')) {
        const layerContent = layer.querySelector('.layer-content');
        layerContent.innerHTML = `
            <div class="item-name">${itemName}</div>
            <button class="remove-item-btn" onclick="removeItemFromOutfit('${category}')">
                <i class="fas fa-times"></i>
            </button>
        `;
        layer.classList.add('filled');
        
        // AI 스타일 평가 업데이트
        if (window.displayStyleRating) {
            window.displayStyleRating();
        }
    }
}

// 의상 아이템 제거 함수
function removeItemFromOutfit(category) {
    const layer = document.getElementById(`layer-${category}`);
    if (layer && layer.classList.contains('filled')) {
        const layerContent = layer.querySelector('.layer-content');
        const placeholderIcon = getPlaceholderIcon(category);
        const placeholderText = getPlaceholderText(category);
        
        layerContent.innerHTML = `
            <i class="fas ${placeholderIcon} placeholder-icon"></i>
            <div class="placeholder-text">${placeholderText}</div>
        `;
        layer.classList.remove('filled');
        
        // AI 스타일 평가 업데이트
        if (window.displayStyleRating) {
            window.displayStyleRating();
        }
    }
}

// 플레이스홀더 아이콘 가져오기
function getPlaceholderIcon(category) {
    const icons = {
        'outer': 'fa-vest',
        'top': 'fa-tshirt',
        'bottom': 'fa-socks',
        'shoes': 'fa-shoe-prints'
    };
    return icons[category] || 'fa-question';
}

// 플레이스홀더 텍스트 가져오기
function getPlaceholderText(category) {
    const texts = {
        'outer': '아우터',
        'top': '상의',
        'bottom': '하의',
        'shoes': '신발'
    };
    return texts[category] || category;
}

// 상황별 추천 업데이트 함수
async function updateTPORecommendations() {
    const weather = getCurrentWeatherForTPO();
    const situation = getCurrentSituationForTPO();
    const gender = getCurrentGenderForTPO();
    const style = getCurrentStyleForTPO();
    
    try {
        const recommendations = await getTPORecommendations(weather, situation, gender, style);
        updateRecommendationsGrid(recommendations);
    } catch (error) {
        console.error('TPO 추천 업데이트 중 오류:', error);
    }
}

// 이벤트 리스너 설정
document.addEventListener('DOMContentLoaded', function() {
    // 상황 버튼 클릭 이벤트
    document.querySelectorAll('.situation-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            // 활성 상태 변경
            document.querySelectorAll('.situation-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            // 추천 업데이트
            updateTPORecommendations();
        });
    });
    
    // 성별 및 스타일 버튼 클릭 시에도 추천 업데이트
    document.querySelectorAll('.gender-selection button, .style-selection button').forEach(btn => {
        btn.addEventListener('click', function() {
            setTimeout(updateTPORecommendations, 100);
        });
    });
    
    // 초기 로드 시 추천
    setTimeout(updateTPORecommendations, 1000);
});

// 전역 함수로 내보내기
window.updateTPORecommendations = updateTPORecommendations;
window.addItemToOutfit = addItemToOutfit;
window.removeItemFromOutfit = removeItemFromOutfit;
