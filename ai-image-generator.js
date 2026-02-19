// AI 이미지 생성 기능 - DALL-E 3 연동

// AI 이미지 생성 함수
async function generateAIImage(style, weather, gender, category) {
    try {
        const prompt = createImagePrompt(style, weather, gender, category);
        
        const response = await fetch('https://api.openai.com/v1/images/generations', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer YOUR_API_KEY' // 실제 OpenAI API 키로 교체
            },
            body: JSON.stringify({
                model: "dall-e-3",
                prompt: prompt,
                n: 1,
                size: "1024x1024",
                style: "natural" // 브랜드 없는 자연스러운 스타일
            })
        });
        
        if (!response.ok) {
            throw new Error('AI 이미지 생성 실패');
        }
        
        const data = await response.json();
        return data.data[0].url;
        
    } catch (error) {
        console.error('AI 이미지 생성 오류:', error);
        return null;
    }
}

// 이미지 생성 프롬프트 생성
function createImagePrompt(style, weather, gender, category) {
    const styleMap = {
        'casual': 'casual everyday fashion',
        'modern': 'modern minimalist fashion',
        'street': 'streetwear urban style'
    };
    
    const genderMap = {
        'male': 'mens',
        'female': 'womens',
        'unisex': 'unisex'
    };
    
    const categoryMap = {
        'outer': 'outerwear jacket coat',
        'top': 'shirt top blouse',
        'bottom': 'pants jeans skirt'
    };
    
    const weatherMap = {
        'cold': 'warm winter clothing',
        'cool': 'light jacket layered outfit',
        'warm': 'light breathable fabric',
        'hot': 'summer lightweight clothing'
    };
    
    return `Fashion photography of ${genderMap[gender]} ${categoryMap[category]} in ${styleMap[style]} style, suitable for ${weatherMap[weather]} weather. Clean white background, professional lighting, no visible brands or logos, minimalist aesthetic, high quality commercial fashion photography.`;
}

// 날씨에 따른 카테고리 결정
function getWeatherCategory(temperature) {
    if (temperature <= 5) return 'cold';
    if (temperature <= 15) return 'cool';
    if (temperature <= 22) return 'warm';
    return 'hot';
}

// AI 이미지 생성 UI 표시
function showAIGeneratorModal(category) {
    const modal = document.createElement('div');
    modal.className = 'ai-generator-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3><i class="fas fa-magic"></i> AI 이미지 생성</h3>
                <button class="close-btn" onclick="closeAIGeneratorModal()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="modal-body">
                <div class="generator-options">
                    <div class="option-group">
                        <label>스타일 선택</label>
                        <select id="ai-style-select">
                            <option value="casual">캐주얼</option>
                            <option value="modern">모던</option>
                            <option value="street">스트리트</option>
                        </select>
                    </div>
                    <div class="option-group">
                        <label>성별 선택</label>
                        <select id="ai-gender-select">
                            <option value="male">남성</option>
                            <option value="female">여성</option>
                            <option value="unisex">공용</option>
                        </select>
                    </div>
                    <div class="option-group">
                        <label>카테고리</label>
                        <input type="text" id="ai-category-input" value="${category}" readonly>
                    </div>
                </div>
                <div class="generator-preview" id="generator-preview">
                    <div class="preview-placeholder">
                        <i class="fas fa-image"></i>
                        <p>AI가 생성한 이미지가 여기에 표시됩니다</p>
                    </div>
                </div>
                <div class="generator-actions">
                    <button id="generate-btn" class="generate-btn">
                        <i class="fas fa-sparkles"></i>
                        이미지 생성하기
                    </button>
                    <button id="use-generated-btn" class="use-generated-btn" disabled>
                        <i class="fas fa-check"></i>
                        생성된 이미지 사용
                    </button>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // 이벤트 리스너 설정
    setupAIGeneratorEvents(category);
}

// AI 생성기 이벤트 설정
function setupAIGeneratorEvents(category) {
    const generateBtn = document.getElementById('generate-btn');
    const useGeneratedBtn = document.getElementById('use-generated-btn');
    const preview = document.getElementById('generator-preview');
    
    let generatedImageUrl = null;
    
    generateBtn.addEventListener('click', async function() {
        const style = document.getElementById('ai-style-select').value;
        const gender = document.getElementById('ai-gender-select').value;
        const weather = getWeatherCategory(getCurrentTemperature());
        
        // 로딩 상태 표시
        generateBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 생성 중...';
        generateBtn.disabled = true;
        
        try {
            generatedImageUrl = await generateAIImage(style, weather, gender, category);
            
            if (generatedImageUrl) {
                preview.innerHTML = `
                    <img src="${generatedImageUrl}" alt="AI 생성 이미지" class="generated-image">
                    <div class="image-info">
                        <span class="ai-badge">AI 생성 이미지</span>
                        <span class="no-copyright">저작권 무료</span>
                    </div>
                `;
                useGeneratedBtn.disabled = false;
            } else {
                preview.innerHTML = `
                    <div class="error-message">
                        <i class="fas fa-exclamation-triangle"></i>
                        <p>이미지 생성에 실패했습니다. 다시 시도해주세요.</p>
                    </div>
                `;
            }
        } catch (error) {
            console.error('이미지 생성 오류:', error);
            preview.innerHTML = `
                <div class="error-message">
                    <i class="fas fa-exclamation-triangle"></i>
                    <p>이미지 생성에 실패했습니다. 다시 시도해주세요.</p>
                </div>
            `;
        }
        
        // 버튼 상태 복원
        generateBtn.innerHTML = '<i class="fas fa-sparkles"></i> 이미지 생성하기';
        generateBtn.disabled = false;
    });
    
    useGeneratedBtn.addEventListener('click', function() {
        if (generatedImageUrl) {
            addAIGeneratedCloth(generatedImageUrl, category);
            closeAIGeneratorModal();
        }
    });
}

// AI 생성 의상 추가
function addAIGeneratedCloth(imageUrl, category) {
    const clothData = {
        id: `ai-${Date.now()}`,
        name: `AI 생성 ${category}`,
        category: category,
        style: document.getElementById('ai-style-select').value,
        gender: document.getElementById('ai-gender-select').value,
        image: imageUrl,
        isAI: true,
        temperature: getTemperatureRange()
    };
    
    // 의상 데이터에 추가
    if (window.clothesData) {
        window.clothesData.push(clothData);
    }
    
    // UI 업데이트
    if (window.updateRecommendations) {
        window.updateRecommendations();
    }
    
    // 성공 메시지 표시
    showNotification('AI 생성 이미지가 추가되었습니다!', 'success');
}

// 현재 온도 가져오기
function getCurrentTemperature() {
    const weatherElement = document.getElementById('weather');
    if (weatherElement) {
        const tempText = weatherElement.textContent;
        const tempMatch = tempText.match(/(\d+)°/);
        return tempMatch ? parseInt(tempMatch[1]) : 20;
    }
    return 20;
}

// 온도 범위 생성
function getTemperatureRange() {
    const temp = getCurrentTemperature();
    return {
        min: temp - 5,
        max: temp + 5
    };
}

// 모달 닫기
function closeAIGeneratorModal() {
    const modal = document.querySelector('.ai-generator-modal');
    if (modal) {
        modal.remove();
    }
}

// 알림 표시
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : 'info-circle'}"></i>
        <span>${message}</span>
    `;
    
    document.body.appendChild(notification);
    
    // 3초 후 자동 제거
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// 전역 함수로 내보내기
window.generateAIImage = generateAIImage;
window.showAIGeneratorModal = showAIGeneratorModal;
window.closeAIGeneratorModal = closeAIGeneratorModal;
