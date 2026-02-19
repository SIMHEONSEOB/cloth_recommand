// API 설정 가져오기
import { API_CONFIG } from './config.js';

// --- Global Functions ---
window.handleImageLoad = function(imageId) {
    const img = document.getElementById(imageId);
    const skeleton = document.getElementById(`skeleton-${imageId}`);
    
    if (img && skeleton) {
        img.classList.add('loaded');
        skeleton.style.display = 'none';
    }
};

window.handleImageError = function(imageId) {
    const img = document.getElementById(imageId);
    const skeleton = document.getElementById(`skeleton-${imageId}`);
    
    if (img && skeleton) {
        const container = img.parentElement;
        container.innerHTML = `
            <div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;background:var(--bg-color);border-radius:8px;">
                <i class="fas fa-tshirt" style="font-size:3rem;opacity:0.4;color:var(--text-color);"></i>
            </div>
        `;
    }
};

// TPO 어드바이스 기능
async function getAIAdvice(weather, selectedClothes) {
    try {
        // Google Gemini API 호출 (실제 사용 시 API 키 필요)
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key=${API_CONFIG.GEMINI_API_KEY}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: `당신은 패션 전문가입니다. 날씨와 사용자가 고른 옷을 분석해 2문장으로 조언하세요. 한국어로 답변하고, 구체적이고 실용적인 조언을 제공해주세요.

오늘 날씨: ${weather}, 선택한 옷: ${selectedClothes}. 이 코디가 적절할까? TPO(시간, 장소, 상황)를 고려해서 조언해주세요.`
                    }]
                }]
            })
        });
        
        if (!response.ok) {
            const errorText = await response.text();
            console.error('API 응답 오류:', response.status, errorText);
            throw new Error(`AI API 호출 실패: ${response.status} - ${errorText}`);
        }
        
        const data = await response.json();
        return data.candidates[0].content.parts[0].text;
        
    } catch (error) {
        console.error('AI 조언 생성 중 오류:', error);
        // 폴백 로직: 기본 조언 생성
        return generateFallbackAdvice(weather, selectedClothes);
    }
}

// 폴백 조언 생성 함수 (API 실패 시 사용)
function generateFallbackAdvice(weather, selectedClothes) {
    const temp = weather.currentTemperature;
    // selectedClothes가 배열이 아닌 경우 처리
    const clothes = Array.isArray(selectedClothes) 
        ? selectedClothes.map(item => item.name).join(', ')
        : String(selectedClothes);
    
    let advice = '';
    
    // 기온 기반 조언
    if (temp <= 0) {
        advice = `오늘은 ${temp}℃로 매우 추워요. ${clothes} 선택은 좋지만, 히트텍 내의나 목도리를 추가하면 더 따뜻하게 보낼 수 있어요.`;
    } else if (temp <= 10) {
        advice = `${temp}℃의 쌀쌀한 날씨네요. ${clothes} 조합은 적절해요. 간절기 날씨에 맞게 아우터를 준비하면 좋겠습니다.`;
    } else if (temp <= 20) {
        advice = `${temp}℃으로 선선한 날씨입니다. ${clothes} 선택은 딱 좋아요! 일교차가 크니 얇은 겉옷을 챙기는 걸 추천해요.`;
    } else {
        advice = `오늘은 ${temp}℃으로 더워요. ${clothes} 선택은 시원하고 좋네요! 자외선 차단 모자나 선글라스를 추가하면 완벽할 거예요.`;
    }
    
    // 미세먼지 조언 추가
    if (weather.fineDustLevel === 'bad' || weather.fineDustLevel === 'very_bad') {
        advice += ` 미세먼지가 ${weather.fineDustLevel === 'very_bad' ? '매우' : ''} 나쁘니 마스크 꼭 착용하세요!`;
    }
    
    // 비 조언 추가
    if (weather.isRaining) {
        advice += ` 비가 오니 우산이나 방수 신발을 준비하시는 걸 잊지 마세요!`;
    }
    
    return advice;
}

// 현재 선택된 의상 정보 가져오기
function getCurrentOutfit() {
    const outfit = [];
    
    // 각 레이어에 의상 이미지가 있는지 확인
    const outerLayer = document.querySelector('#layer-outer .outfit-item-image');
    const topLayer = document.querySelector('#layer-top .outfit-item-image');
    const bottomLayer = document.querySelector('#layer-bottom .outfit-item-image');
    
    if (outerLayer && outerLayer.src && !outerLayer.src.includes('data:image')) {
        outfit.push({ category: '아우터', name: outerLayer.alt || '아우터' });
    }
    if (topLayer && topLayer.src && !topLayer.src.includes('data:image')) {
        outfit.push({ category: '상의', name: topLayer.alt || '상의' });
    }
    if (bottomLayer && bottomLayer.src && !bottomLayer.src.includes('data:image')) {
        outfit.push({ category: '하의', name: bottomLayer.alt || '하의' });
    }
    
    return outfit;
}

// AI 스타일리스트 기능
async function getAIStyleRating(weather, selectedClothes) {
    try {
        // Google Gemini API 호출 (실제 사용 시 API 키 필요)
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${API_CONFIG.GEMINI_API_KEY}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: `당신은 패션 전문가입니다. 현재 날씨와 사용자가 선택한 옷을 보고 코디 점수를 매겨주세요. 100점 만점에 따라 점수를 매기고, 한 줄로 간결하게 평가해주세요. 예: '오늘 코디 점수: 85점 - 완벽한 데이트룩!'

현재 기온은 ${weather.currentTemperature}도이고 사용자는 ${selectedClothes}를 골랐어. 이 코디에 대해 패션 전문가로서 따끔하지만 위트 있게 한 줄 평을 해줘.`
                    }]
                }]
            })
        });
        
        if (!response.ok) {
            throw new Error('AI 스타일리스트 API 호출 실패');
        }
        
        const data = await response.json();
        return data.candidates[0].content.parts[0].text;
        
    } catch (error) {
        console.error('AI 스타일리스트 생성 중 오류:', error);
        return generateStyleRatingFallback(weather, selectedClothes);
    }
}

// 폴백 스타일리스트 생성 함수
function generateStyleRatingFallback(weather, selectedClothes) {
    const temp = weather.currentTemperature;
    const clothes = Array.isArray(selectedClothes) 
        ? selectedClothes.map(item => item.name).join(', ')
        : String(selectedClothes);
    
    let rating = 75; // 기본 점수
    let comment = '';
    
    // 온도 기반 점수 조정
    if (temp <= 0) {
        rating = weatherData.fineDustLevel === 'very_bad' ? 95 : 90;
        comment = '추위에 맞는 완벽한 방한 코디!';
    } else if (temp <= 10) {
        rating = 85;
        comment = '계절기에 어울리는 세련된 코디!';
    } else if (temp <= 20) {
        rating = 80;
        comment = '쾌적한 날씨에 어울리는 자연스러운 코디!';
    } else {
        rating = 75;
        comment = '시원한 날씨에 적합한 가벽운 코디!';
    }
    
    // 미세먼지 조정
    if (weather.fineDustLevel === 'very_bad') {
        rating += 5;
        comment = comment.replace('!', ' + 마스크까지 완벽!');
    }
    
    // 의상 다양성 보너스
    const clothesCount = clothes.split(',').length;
    if (clothesCount >= 3) rating += 5;
    
    return `오늘 코디 점수: ${rating}점 - ${comment}`;
}

// 현재 코디 점수 표시 함수
async function displayStyleRating() {
    const currentOutfit = getCurrentOutfit();
    
    if (currentOutfit.length === 0) {
        // 의상이 없으면 기본 메시지
        const weatherComparisonDisplay = document.getElementById('weather-comparison');
        if (weatherComparisonDisplay) {
            weatherComparisonDisplay.textContent = '의상을 선택해 코디 점수를 받아보세요';
        }
        return;
    }
    
    // 로딩 표시
    const weatherComparisonDisplay = document.getElementById('weather-comparison');
    if (weatherComparisonDisplay) {
        weatherComparisonDisplay.innerHTML = '🤖 AI가 코디를 분석 중입니다...';
    }
    
    try {
        const clothesInfo = currentOutfit.map(item => item.name).join(', ');
        const rating = await getAIStyleRating(weatherData, clothesInfo);
        
        if (weatherComparisonDisplay) {
            weatherComparisonDisplay.innerHTML = rating;
        }
        
    } catch (error) {
        console.error('스타일 점수 표시 오류:', error);
        if (weatherComparisonDisplay) {
            weatherComparisonDisplay.textContent = '코디 점수 분석에 실패했습니다.';
        }
    }
}

// TPO 어드바이스 표시 함수
window.showTPOAdvice = async function() {
    const currentOutfit = getCurrentOutfit();
    
    if (currentOutfit.length === 0) {
        alert('먼저 의상을 선택해주세요!');
        return;
    }
    
    // 로딩 표시
    const adviceSection = document.getElementById('contextual-advice');
    if (adviceSection) {
        adviceSection.innerHTML = '<div style="text-align: center;">🤖 AI가 분석 중입니다...</div>';
    }
    
    try {
        const weatherInfo = `
            기온: ${weatherData.currentTemperature}℃
            바람: ${weatherData.windSpeed}m/s
            습도: ${weatherData.humidity}%
            비: ${weatherData.isRaining ? '오는 중' : '안 옴'}
            미세먼지: ${weatherData.fineDustLevel}
        `;
        
        const clothesInfo = currentOutfit.map(item => `${item.category}: ${item.name}`).join(', ');
        
        const advice = await getAIAdvice(weatherInfo, clothesInfo);
        
        // 조언 표시
        if (adviceSection) {
            adviceSection.innerHTML = `
                <div style="background: linear-gradient(135deg, #667eea, #764ba2); color: white; padding: 15px; border-radius: 10px; margin-top: 10px;">
                    <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 8px;">
                        <span style="font-size: 20px;">🤖</span>
                        <strong>AI 조언</strong>
                    </div>
                    <div style="line-height: 1.5;">${advice}</div>
                </div>
            `;
        }
        
    } catch (error) {
        console.error('TPO 어드바이스 오류:', error);
        if (adviceSection) {
            adviceSection.innerHTML = '<div style="color: #ff6b6b;">🤖 AI 조언을 불러오는 데 실패했습니다. 잠시 후 다시 시도해주세요.</div>';
        }
    }
}

// Add item to outfit layer
window.addItemToOutfit = function(itemName, imageUrl, category) {
    const layer = document.getElementById(`layer-${category}`);
    if (!layer) return;
    
    const layerContent = layer.querySelector('.layer-content');
    if (!layerContent) return;
    
    // Create image element for the outfit
    const imageId = `outfit-${itemName.replace(/[^a-zA-Z0-9]/g, '-')}-${Date.now()}`;
    
    // 한글 파일 이름을 URL 인코딩
    const encodedImageUrl = imageUrl.includes('.png') ? 
        imageUrl.split('/').map(part => 
            part.includes('.png') ? encodeURIComponent(part) : part
        ).join('/') : imageUrl;
    
    layerContent.innerHTML = `
        <div class="outfit-item-container">
            <div class="skeleton skeleton-image" id="skeleton-${imageId}"></div>
            <img 
                id="${imageId}"
                class="outfit-item-image" 
                src="${encodedImageUrl}" 
                alt="${itemName}"
                loading="lazy"
                onload="handleImageLoad('${imageId}')"
                onerror="handleImageError('${imageId}')"
                style="width:100%;height:100%;object-fit:contain;border-radius:8px;"
            >
            <button class="remove-item-btn" onclick="removeItemFromOutfit('${category}')">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;
    
    // Add visual feedback
    layer.classList.add('item-added');
    setTimeout(() => {
        layer.classList.remove('item-added');
    }, 300);
    
    // AI 스타일리스트 점수 자동 업데이트
    displayStyleRating();
};

// Remove item from outfit layer
window.removeItemFromOutfit = function(category) {
    const layer = document.getElementById(`layer-${category}`);
    if (!layer) return;
    
    const layerContent = layer.querySelector('.layer-content');
    if (!layerContent) return;
    
    // Restore placeholder
    const placeholders = {
        outer: '<i class="fas fa-vest placeholder-icon"></i><div class="placeholder-text">아우터</div>',
        top: '<i class="fas fa-tshirt placeholder-icon"></i><div class="placeholder-text">상의</div>',
        bottom: '<i class="fas fa-socks placeholder-icon"></i><div class="placeholder-text">하의</div>'
    };
    
    layerContent.innerHTML = placeholders[category] || '';
    
    // Add visual feedback
    layer.classList.add('item-removed');
    setTimeout(() => {
        layer.classList.remove('item-removed');
    }, 300);
    
    // AI 스타일리스트 점수 자동 업데이트
    displayStyleRating();
};

// --- Clothing Items Configuration ---
// All items now use images from the images folder

const defaultOutfitData = [
    // 남성 의상
    { gender: 'any', style: 'casual', tempMin: -10, tempMax: 5, name: '두꺼운패딩-모자(검은색)', category: 'outer', imageUrl: 'images/두꺼운패딩-모자(검은색).png' },
    { gender: 'any', style: 'modern', tempMin: -5, tempMax: 8, name: '니트-녹색', category: 'top', imageUrl: 'images/니트-녹색.png' },
    { gender: 'any', style: 'street', tempMin: 5, tempMax: 20, name: '레큘러핏진(검은색)', category: 'bottom', imageUrl: 'images/레큘러핏진(검은색).png' },
    { gender: 'any', style: 'casual', tempMin: 10, tempMax: 25, name: '갈색팬츠', category: 'bottom', imageUrl: 'images/갈색팬츠.png' },
    { gender: 'any', style: 'modern', tempMin: 10, tempMax: 18, name: '맨투맨-회색', category: 'top', imageUrl: 'images/맨투맨-회색.png' },
    { gender: 'any', style: 'street', tempMin: 15, tempMax: 25, name: '블랙진', category: 'bottom', imageUrl: 'images/블랙진.png' },
    { gender: 'any', style: 'casual', tempMin: 15, tempMax: 25, name: '기모 추리닝하의-흰색', category: 'bottom', imageUrl: 'images/기모 추리닝하의-흰색.png' },
    { gender: 'any', style: 'modern', tempMin: 20, tempMax: 30, name: '스웨터 파란색', category: 'top', imageUrl: 'images/스웨터 파란색.png' },
    { gender: 'any', style: 'street', tempMin: 20, tempMax: 35, name: '청바지', category: 'bottom', imageUrl: 'images/청바지.png' },
    
    // 추가 남성 의상
    { gender: 'male', style: 'modern', tempMin: -5, tempMax: 8, name: '남성 맨투맨 남색', category: 'top', imageUrl: 'images/남성 맨투맨 남색.png' },
    { gender: 'male', style: 'casual', tempMin: 5, tempMax: 15, name: '남성 반집업 흰색', category: 'top', imageUrl: 'images/남성 반집업 흰색.png' },
    { gender: 'male', style: 'modern', tempMin: -5, tempMax: 8, name: '남성 스웨터 갈색', category: 'top', imageUrl: 'images/남성 스웨터 갈색.png' },
    { gender: 'male', style: 'casual', tempMin: -5, tempMax: 8, name: '남성 스웨터 스트라이프 회색', category: 'top', imageUrl: 'images/남성 스웨터 스트라이프 회색.png' },
    { gender: 'male', style: 'modern', tempMin: 10, tempMax: 20, name: '남성 검은바지 1', category: 'bottom', imageUrl: 'images/남성 검은바지 1.png' },
    { gender: 'male', style: 'casual', tempMin: 10, tempMax: 20, name: '남성 검은바지 2', category: 'bottom', imageUrl: 'images/남성 검은바지 2.png' },
    { gender: 'male', style: 'modern', tempMin: 10, tempMax: 20, name: '남성 연갈색 바지', category: 'bottom', imageUrl: 'images/남성 연갈색 바지.png' },
    { gender: 'male', style: 'casual', tempMin: 15, tempMax: 25, name: '남성 하얀바지', category: 'bottom', imageUrl: 'images/남성 하얀바지.png' },
    
    // 여성 의상 추가
    { gender: 'female', style: 'modern', tempMin: -10, tempMax: 5, name: '여성 롱치마 검정', category: 'outer', imageUrl: 'images/여성 롱치마 검정.png' },
    { gender: 'female', style: 'casual', tempMin: -10, tempMax: 5, name: '여성 패딩', category: 'outer', imageUrl: 'images/여성 패딩.png' },
    { gender: 'female', style: 'modern', tempMin: -5, tempMax: 8, name: '여성 스웨터-아이보리', category: 'top', imageUrl: 'images/여성 스웨터-아이보리.png' },
    { gender: 'female', style: 'casual', tempMin: -5, tempMax: 8, name: '여성 스웨터-초록', category: 'top', imageUrl: 'images/여성 스웨터-초록.png' },
    { gender: 'female', style: 'modern', tempMin: 5, tempMax: 15, name: '여성 셔츠', category: 'top', imageUrl: 'images/여성 셔츠.png' },
    { gender: 'female', style: 'casual', tempMin: 5, tempMax: 15, name: '여성 추리닝', category: 'top', imageUrl: 'images/여성 추리닝.png' },
    { gender: 'female', style: 'modern', tempMin: 10, tempMax: 20, name: '여성 갈색바지1', category: 'bottom', imageUrl: 'images/여성 갈색바지1.png' },
    { gender: 'female', style: 'casual', tempMin: 10, tempMax: 20, name: '여성 데님바지', category: 'bottom', imageUrl: 'images/여성 데님바지.png' },
    { gender: 'female', style: 'street', tempMin: 10, tempMax: 20, name: '여성 청바지', category: 'bottom', imageUrl: 'images/여성 청바지.png' },
    { gender: 'female', style: 'modern', tempMin: 15, tempMax: 25, name: '여성 반집업', category: 'top', imageUrl: 'images/여성 반집업.png' },
    { gender: 'female', style: 'casual', tempMin: 15, tempMax: 25, name: '여성 쇼트재킷 연갈색', category: 'outer', imageUrl: 'images/여성 쇼트재킷 연갈색.png' },
    { gender: 'female', style: 'street', tempMin: 15, tempMax: 25, name: '여성 집업 스웨터 연두', category: 'top', imageUrl: 'images/여성 집업 스웨터 연두.png' },
    { gender: 'female', style: 'modern', tempMin: 20, tempMax: 30, name: '여성 스웨터-빨강', category: 'top', imageUrl: 'images/여성 스웨터-빨강.png' },
    { gender: 'female', style: 'casual', tempMin: 20, tempMax: 30, name: '여성 갈색바지2', category: 'bottom', imageUrl: 'images/여성 갈색바지2.png' },
    { gender: 'female', style: 'street', tempMin: 20, tempMax: 35, name: '여성 데님 스커트', category: 'bottom', imageUrl: 'images/여성 데님 스커트.png' },
    { gender: 'female', style: 'modern', tempMin: 25, tempMax: 35, name: '여성 데님바지', category: 'bottom', imageUrl: 'images/여성 데님바지.png' },
    
    // 액세서리
    { gender: 'any', style: 'any', tempMin: -20, tempMax: 40, name: '마스크', category: 'accessory', imageUrl: 'images/마스크.svg', dustAlert: true },
    { gender: 'any', style: 'any', tempMin: -20, tempMax: 40, name: '마스크-추천', category: 'accessory', imageUrl: 'images/마스크-추천.svg', dustAlert: true }
];

// --- DOM Elements ---
let weatherDisplay;
let locationDisplay;
let weatherComparisonDisplay;
let outfitExplanationDisplay;
let contextualAdviceDisplay;
let genderButtons;
let styleButtons;
let recommendationsDiv;

// --- State ---
let selectedGender = 'male';
let selectedStyle = 'casual';
let selectedCategory = 'all';
let selectedSituation = 'daily';

// --- API Constants ---
const KOREA_WEATHER_API_KEY = 'cc408361b08a3bdccaa9d4b3aa113443dd11d6ed128fdd19d059f295314bc1f5';
const KOREA_WEATHER_BASE_URL = 'https://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getUltraSrtNcst';
const AIR_KOREA_BASE_URL = 'https://apis.data.go.kr/B552584/ArpltnInforInqireSvc/getMsrstnAcctoRltmMesureDnsty';

// --- Weather & Outfit Data ---
let weatherData = {
    currentTemperature: 20,
    yesterdayTemperature: 17,
    windSpeed: 5,
    humidity: 60,
    isRaining: false,
    fineDustLevel: 'good',
    dayNightTempDiff: 10,
    location: 'Seoul'
};

// --- Functions ---


// Image handling functions
function getClothingSVG(itemName, color, category, imageUrl) {
    if (imageUrl) {
        const imageId = `img-${itemName.replace(/[^a-zA-Z0-9]/g, '-')}-${Date.now()}`;
        
        // 한글 파일 이름을 URL 인코딩
        const encodedImageUrl = imageUrl.includes('.png') ? 
            imageUrl.split('/').map(part => 
                part.includes('.png') ? encodeURIComponent(part) : part
            ).join('/') : imageUrl;
        
        return `
            <div class="image-container">
                <div class="skeleton skeleton-image" id="skeleton-${imageId}"></div>
                <img 
                    id="${imageId}"
                    class="lazy-image" 
                    src="${encodedImageUrl}" 
                    alt="${itemName}" 
                    loading="lazy"
                    onload="handleImageLoad('${imageId}')"
                    onerror="handleImageError('${imageId}')"
                    style="width:100%;height:100%;object-fit:contain;border-radius:8px;"
                >
            </div>
        `;
    }
    return `<i class="fas fa-tshirt" style="font-size:3rem;opacity:0.4;"></i>`;
}

function initializeLazyLoading() {
    const images = document.querySelectorAll('img[loading="lazy"]');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    const skeleton = document.getElementById(`skeleton-${img.id}`);
                    
                    if (skeleton) {
                        skeleton.style.display = 'block';
                    }
                    
                    img.classList.add('loading');
                    
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                    }
                    
                    observer.unobserve(img);
                }
            });
        });
        
        images.forEach(img => imageObserver.observe(img));
    } else {
        images.forEach(img => {
            const skeleton = document.getElementById(`skeleton-${img.id}`);
            if (skeleton) {
                skeleton.style.display = 'block';
            }
            img.classList.add('loading');
        });
    }
}

function getAdvice(weather) {
    let explanation = '';
    let contextual = '';
    if (weather.currentTemperature <= 5) explanation = "체온 유지를 위해 두꺼운 아우터는 필수예요.";
    else if (weather.currentTemperature <= 15) explanation = "쌀쌀한 날씨예요. 가벼운 아우터나 따뜻한 상의가 좋겠어요.";
    else if (weather.currentTemperature <= 22) explanation = "선선해서 활동하기 좋은 날씨네요.";
    else explanation = "더운 날씨에 대비해 시원하게 입으세요.";
    if (weather.dayNightTempDiff >= 10) contextual += "일교차가 커요. 밤을 대비해 겉옷을 챙기세요. ";
    if (weather.isRaining) contextual += "비가 오니 방수 기능이 있는 신발이나 옷을 추천해요. ";
    if (weather.fineDustLevel === 'bad') contextual += "미세먼지가 심하니 마스크를 꼭 착용하세요.";
    
    if (outfitExplanationDisplay) {
        outfitExplanationDisplay.textContent = explanation;
    }
    if (contextualAdviceDisplay) {
        contextualAdviceDisplay.textContent = contextual.trim();
    }
}

function updateWeatherUI(weather) {
    if (locationDisplay) {
        let locationText = weather.location;
        let dustEmoji = '';
        let dustText = '';
        
        switch(weather.fineDustLevel) {
            case 'good':
                dustEmoji = '😊';
                dustText = '좋음';
                break;
            case 'moderate':
                dustEmoji = '�';
                dustText = '보통';
                break;
            case 'bad':
                dustEmoji = '�';
                dustText = '나쁨';
                break;
            case 'very_bad':
                dustEmoji = '😷';
                dustText = '매우 나쁨';
        }
        
        locationDisplay.innerHTML = `${locationText} ${dustEmoji} 미세먼지: ${dustText}`;
    }
    if (weatherDisplay) {
        let weatherText = `${weather.currentTemperature}℃`;
        if (weather.isRaining) weatherText += ' (비)';
        weatherDisplay.textContent = weatherText;
    }

    // 어제와 비교 업데이트
    if (weatherComparisonDisplay) {
        const tempDiff = weather.currentTemperature - weather.yesterdayTemperature;
        const diffText = tempDiff > 0 ? `어제보다 ${tempDiff}℃ 높아요` : 
                        tempDiff < 0 ? `어제보다 ${Math.abs(tempDiff)}℃ 낮아요` : 
                        '어제와 같아요';
        weatherComparisonDisplay.textContent = diffText;
    }
}

function renderRecommendations(weather) {
    if (!recommendationsDiv) {
        console.error('recommendationsDiv 요소를 찾을 수 없습니다.');
        return;
    }
    
    recommendationsDiv.innerHTML = '';
    const customItems = JSON.parse(localStorage.getItem('customClothes')) || [];
    const sourceData = [...defaultOutfitData, ...customItems];

    const tempMin = weather.currentTemperature - 10;
    const tempMax = weather.currentTemperature + 10;
    const tempFilteredOutfits = sourceData.filter(item => {
        return item.tempMin <= tempMax && item.tempMax >= tempMin;
    });

    const filteredOutfits = tempFilteredOutfits.filter(item => {
        const genderMatch = item.gender === 'any' || item.gender === selectedGender;
        const styleMatch = item.style === 'any' || item.style === selectedStyle;
        return genderMatch && styleMatch;
    });

    // 필터링된 의상이 너무 적으면 스타일 필터링만 적용
    if (filteredOutfits.length < 3) {
        const styleFilteredOutfits = sourceData.filter(item => {
            const genderMatch = item.gender === 'any' || item.gender === selectedGender;
            const styleMatch = item.style === 'any' || item.style === selectedStyle;
            return genderMatch && styleMatch;
        });
        
        // 스타일 필터링만으로도 의상이 적으면 성별 필터링만 적용
        if (styleFilteredOutfits.length < 3) {
            const genderFilteredOutfits = sourceData.filter(item => {
                return item.gender === 'any' || item.gender === selectedGender;
            });
            
            if (genderFilteredOutfits.length > 0) {
                // 성별 필터링된 의상 사용
                const finalOutfits = genderFilteredOutfits.slice(0, 9); // 최대 9개 표시
                renderOutfitItems(finalOutfits, weatherData);
                return;
            }
        } else {
            // 스타일 필터링된 의상 사용
            const finalOutfits = styleFilteredOutfits.slice(0, 9);
            renderOutfitItems(finalOutfits, weatherData);
            return;
        }
    }

    // 최종 필터링된 의상 렌더링
    const finalOutfits = filteredOutfits.slice(0, 9); // 최대 9개 표시
    renderOutfitItems(finalOutfits, weatherData);
}

function renderOutfitItems(outfits, weather) {
    const categoryLabels = { outer: '아우터', top: '상의', bottom: '하의' };
    
    // "전체" 카테고리 선택 시 모든 카테고리의 의상 표시
    if (selectedCategory === 'all') {
        // 각 카테고리별로 최소 1개씩 보장
        const categories = ['outer', 'top', 'bottom'];
        categories.forEach(category => {
            const candidates = outfits.filter(i => i.category === category);
            if (candidates.length > 0) {
                // 각 카테고리에서 1-3개 랜덤 선택
                const numToShow = Math.min(candidates.length, Math.ceil(candidates.length / 2));
                const shuffled = [...candidates].sort(() => Math.random() - 0.5);
                const selected = shuffled.slice(0, numToShow);
                
                selected.forEach(item => {
                    renderSingleOutfitItem(item, categoryLabels[category], weather);
                });
            }
        });
    } else {
        // 특정 카테고리 선택 시 해당 카테고리 의상만 표시
        const candidates = outfits.filter(i => i.category === selectedCategory);
        const numToShow = Math.min(candidates.length, 6); // 최대 6개 표시
        const shuffled = [...candidates].sort(() => Math.random() - 0.5);
        const selected = shuffled.slice(0, numToShow);
        
        selected.forEach(item => {
            renderSingleOutfitItem(item, categoryLabels[selectedCategory], weather);
        });
    }
    
    // 마스크 추천 추가
    addMaskRecommendation();
    
    // 레이지 로딩 초기화
    setTimeout(() => {
        initializeLazyLoading();
    }, 100);
}

function renderSingleOutfitItem(item, categoryLabel, weather) {
    const itemDiv = document.createElement('div');
    itemDiv.className = 'recommendation-item';
    itemDiv.style.cursor = 'pointer';
    itemDiv.onclick = () => addItemToOutfit(item.name, item.imageUrl, item.category);

    // 스타일에 따른 시각적 구분 추가
    const styleColors = {
        'casual': '#4CAF50',
        'modern': '#2196F3', 
        'street': '#FF9800'
    };
    const styleColor = styleColors[item.style] || '#888';

    const svgContent = getClothingSVG(item.name, styleColor, item.category, item.imageUrl);

    itemDiv.innerHTML = `
        <div class="item-visual">
            ${svgContent}
        </div>
        <div class="item-info">
            <span class="item-category-badge badge-${item.category}" style="background: ${styleColor}; color: white;">${categoryLabel}</span>
            <p class="item-name">${item.name}</p>
            
            <!-- 쿠팡 제휴 정보 표시 -->
            ${item.affiliate && item.affiliate.coupang ? `
                <div class="affiliate-info" style="
                    background: linear-gradient(135deg, rgba(255, 107, 107, 0.1), rgba(238, 90, 36, 0.1));
                    padding: 8px;
                    border-radius: 8px;
                    margin: 8px 0;
                    font-size: 11px;
                ">
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <span style="color: #ff6b6b; font-weight: bold;">
                            ⭐ ${item.affiliate.coupang.rating} (${item.affiliate.coupang.reviewCount}리뷰)
                        </span>
                        <span style="color: #2196F3; font-weight: bold;">
                            ${item.affiliate.coupang.price.toLocaleString()}원
                        </span>
                    </div>
                    <div style="margin-top: 4px; color: #666; font-size: 10px;">
                        🚀 쿠팡 바로구매 가능
                    </div>
                    <button onclick="event.stopPropagation(); window.open('https://www.coupang.com/vp/products/${item.affiliate.coupang.productId}?itemId=${item.affiliate.coupang.itemId}&ref=SEOB0001', '_blank')" style="
                        margin-top: 6px;
                        width: 100%;
                        padding: 6px;
                        background: linear-gradient(135deg, #ff6b6b, #ee5a24);
                        color: white;
                        border: none;
                        border-radius: 6px;
                        font-size: 11px;
                        font-weight: bold;
                        cursor: pointer;
                    ">
                        🛒 쿠팡에서 구매하기
                    </button>
                </div>
            ` : `
                <div class="affiliate-info" style="
                    background: linear-gradient(135deg, rgba(33, 150, 243, 0.1), rgba(33, 150, 243, 0.1));
                    padding: 8px;
                    border-radius: 8px;
                    margin: 8px 0;
                    font-size: 11px;
                ">
                    <div style="margin-top: 4px; color: #666; font-size: 10px;">
                        🔍 쿠팡에서 검색하기
                    </div>
                    <button onclick="event.stopPropagation(); window.open('https://www.coupang.com/np/search?q=${encodeURIComponent(item.name)}&ref=SEOB0001', '_blank')" style="
                        margin-top: 6px;
                        width: 100%;
                        padding: 6px;
                        background: linear-gradient(135deg, #2196F3, #1976D2);
                        color: white;
                        border: none;
                        border-radius: 6px;
                        font-size: 11px;
                        font-weight: bold;
                        cursor: pointer;
                    ">
                        🔍 쿠팡에서 검색
                    </button>
                </div>
            `}
            
            <div style="font-size: 11px; opacity: 0.7; margin-top: 5px;">
                <span style="color: ${styleColor};">●</span> ${item.style === 'casual' ? '캐주얼' : item.style === 'modern' ? '모던' : '스트릿'}
            </div>
            <div style="font-size: 12px; opacity: 0.7; margin-top: 5px;">클릭하여 착용</div>
        </div>
    `;
    recommendationsDiv.appendChild(itemDiv);
}

// 마스크 추천 추가 함수
function addMaskRecommendation() {
    // Add mask recommendation if fine dust is bad or very bad
    if (weatherData.fineDustLevel === 'bad' || weatherData.fineDustLevel === 'very_bad') {
        const maskDiv = document.createElement('div');
        maskDiv.className = 'recommendation-item mask-recommendation';
        maskDiv.style.cursor = 'pointer';
        maskDiv.onclick = () => addItemToOutfit('마스크', maskImageUrl, 'accessory');
        maskDiv.style.cssText = `
            border: 2px solid #ff6b6b;
            background: linear-gradient(135deg, rgba(255, 107, 107, 0.1), rgba(238, 90, 36, 0.1));
            animation: pulse 2s infinite;
            cursor: pointer;
        `;

        const maskImageUrl = weatherData.fineDustLevel === 'very_bad' ? 'images/마스크-추천.svg' : 'images/마스크.svg';
        const svgContent = getClothingSVG('마스크', '#ff6b6b', 'accessory', maskImageUrl);

        maskDiv.innerHTML = `
            <div class="item-visual">
                ${svgContent}
            </div>
            <div class="item-info">
                <span class="item-category-badge badge-accessory" style="background: #ff6b6b; color: white;">액세서리</span>
                <p class="item-name">마스크</p>
                <div style="font-size: 12px; color: #ff6b6b; font-weight: bold; margin-top: 5px;">
                    ${weatherData.fineDustLevel === 'very_bad' ? '미세먼지 매우 나쁨!' : '미세먼지 나쁨!'}
                </div>
                <div style="font-size: 11px; opacity: 0.8; margin-top: 3px;">클릭하여 착용</div>
            </div>
        `;
        recommendationsDiv.appendChild(maskDiv);
    }
}

function updateApp() {
    updateWeatherUI(weatherData);
    getAdvice(weatherData);
    renderRecommendations(weatherData);
}

// --- Initialization ---
async function initializeApp() {
    // Initialize DOM elements
    weatherDisplay = document.getElementById('weather');
    locationDisplay = document.getElementById('location');
    weatherComparisonDisplay = document.getElementById('weather-comparison');
    outfitExplanationDisplay = document.getElementById('outfit-explanation');
    contextualAdviceDisplay = document.getElementById('contextual-advice');
    genderButtons = document.querySelectorAll('.gender-selection button');
    styleButtons = document.querySelectorAll('.style-selection button');
    recommendationsDiv = document.getElementById('recommendations');


    updateApp();

    // 날씨 데이터와 미세먼지 데이터 가져오기
    await getUserLocationAndFetchWeather();

    // Initialize lazy loading for images
    initializeLazyLoading();

    // Set default selections
    const maleButton = document.querySelector('.gender-selection button[data-gender="male"]');
    if (maleButton) {
        maleButton.classList.add('active');
    }
    
    const casualButton = document.querySelector('.style-selection button[data-style="casual"]');
    if (casualButton) {
        casualButton.classList.add('active');
    }

    updateApp();

    // Add event listeners after DOM is ready
    const categoryButtons = document.querySelectorAll('.category-selection button');
    
    [...genderButtons, ...styleButtons, ...categoryButtons].forEach(button => {
        button.addEventListener('click', (e) => {
            const parent = e.target.closest('div');
            parent.querySelectorAll('button').forEach(btn => btn.classList.remove('active'));
            e.target.closest('button').classList.add('active');
            if (parent.classList.contains('gender-selection')) selectedGender = e.target.closest('button').dataset.gender;
            if (parent.classList.contains('style-selection')) selectedStyle = e.target.closest('button').dataset.style;
            if (parent.classList.contains('category-selection')) selectedCategory = e.target.closest('button').dataset.category;
            updateApp();
        });
    });

    // TPO 상황별 추천 버튼 이벤트 리스너 추가
    const tpoButtons = document.querySelectorAll('.tpo-buttons button');
    tpoButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const situation = e.target.closest('button').dataset.situation;
            handleTPOSelection(situation);
        });
    });

    // 기본 상황 선택
    const dailyButton = document.querySelector('.tpo-buttons button[data-situation="daily"]');
    if (dailyButton) {
        dailyButton.classList.add('active');
    }

}

document.addEventListener('DOMContentLoaded', initializeApp);

// === Weather and Air Quality Functions ===

// TPO 상황별 추천 처리 함수
function handleTPOSelection(situation) {
    // 활성 버튼 업데이트
    const tpoButtons = document.querySelectorAll('.tpo-buttons button');
    tpoButtons.forEach(btn => btn.classList.remove('active'));
    const activeButton = document.querySelector(`.tpo-buttons button[data-situation="${situation}"]`);
    if (activeButton) {
        activeButton.classList.add('active');
    }
    
    // 선택된 상황 업데이트
    selectedSituation = situation;
    
    // 상황별 추천 로직 적용
    applyTPORecommendations(situation);
}

// 상황별 추천 적용 함수
function applyTPORecommendations(situation) {
    const temp = weatherData.currentTemperature;
    const gender = selectedGender;
    
    let filteredData = [...defaultOutfitData];
    
    // 상황별 필터링
    switch(situation) {
        case 'daily':
            // 일상: 모든 스타일 허용
            break;
        case 'date':
            // 데이트: 모던, 캐주얼 스타일 우선, 깔끔한 의상
            filteredData = filteredData.filter(item => 
                item.style === 'modern' || item.style === 'casual'
            );
            // 데이트에 적합한 의상만 남기기
            filteredData = filteredData.filter(item => 
                !item.name.includes('운동') && 
                !item.name.includes('트레이닝') &&
                !item.name.includes('후드')
            );
            break;
        case 'work':
            // 출근: 모던 스타일, 격식 있는 의상
            filteredData = filteredData.filter(item => 
                item.style === 'modern'
            );
            // 출근에 적합한 의상만 남기기
            filteredData = filteredData.filter(item => 
                !item.name.includes('반팔') && 
                !item.name.includes('반소매') &&
                !item.name.includes('트레이닝') &&
                !item.name.includes('운동')
            );
            break;
    }
    
    // 온도 필터링 적용
    filteredData = filteredData.filter(item => 
        temp >= item.tempMin && temp <= item.tempMax
    );
    
    // 성별 필터링 적용
    if (gender !== 'any') {
        filteredData = filteredData.filter(item => 
            item.gender === 'any' || item.gender === gender
        );
    }
    
    // 추천 업데이트
    renderRecommendations(filteredData);
}

async function getReverseGeocodedAddress(lat, lon) {
    try {
        const nominatimUrl = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=18&addressdetails=1`;
        const response = await fetch(nominatimUrl, {
            headers: { 'User-Agent': 'ClothRecommendApp/1.0' }
        });
        if (!response.ok) throw new Error(`Reverse geocoding failed: ${response.statusText}`);
        const data = await response.json();
        if (data.address) {
            const address = data.address;
            if (address.neighbourhood) return address.neighbourhood;
            if (address.suburb) return address.suburb;
            if (address.village) return address.village;
            if (address.town) return address.town;
            if (address.city) return address.city;
            if (address.county) return address.county;
            return data.display_name;
        }
        return '알 수 없는 위치';
    } catch (error) {
        console.error('Reverse geocoding 중 오류 발생:', error);
        return '알 수 없는 위치';
    }
}

function getBaseDateTime() {
    const now = new Date();
    if (now.getMinutes() < 40) {
        now.setHours(now.getHours() - 1);
    }

    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const base_date = `${year}${month}${day}`;
    const base_time = String(now.getHours()).padStart(2, '0') + '00';

    return { base_date, base_time };
}

function convertToKMA(lat, lon) {
    const RE = 6371.00877;
    const GRID = 5.0;
    const SLAT1 = 30.0;
    const SLAT2 = 60.0;
    const OLON = 126.0;
    const OLAT = 38.0;
    const XO = 43;
    const YO = 136;

    const DEGRAD = Math.PI / 180.0;

    const re = RE / GRID;
    const slat1 = SLAT1 * DEGRAD;
    const slat2 = SLAT2 * DEGRAD;
    const olon = OLON * DEGRAD;
    const olat = OLAT * DEGRAD;

    let sn = Math.tan(Math.PI * 0.25 + slat2 * 0.5) / Math.tan(Math.PI * 0.25 + slat1 * 0.5);
    sn = Math.log(Math.cos(slat1) / Math.cos(slat2)) / Math.log(sn);
    let sf = Math.tan(Math.PI * 0.25 + slat1 * 0.5);
    sf = Math.pow(sf, sn) * Math.cos(slat1) / sn;
    let ro = Math.tan(Math.PI * 0.25 + olat * 0.5);
    ro = re * sf / Math.pow(ro, sn);

    let ra = Math.tan(Math.PI * 0.25 + lat * DEGRAD * 0.5);
    ra = re * sf / Math.pow(ra, sn);
    let theta = lon * DEGRAD - olon;
    if (theta > Math.PI) theta -= 2.0 * Math.PI;
    if (theta < -Math.PI) theta += 2.0 * Math.PI;
    theta *= sn;

    const nx = Math.floor(ra * Math.sin(theta) + XO + 0.5);
    const ny = Math.floor(ro - ra * Math.cos(theta) + YO + 0.5);

    return { nx, ny };
}

async function fetchWeatherData(nx, ny, locationName = '현재 위치') {
    const { base_date, base_time } = getBaseDateTime();
    let url = `${KOREA_WEATHER_BASE_URL}?serviceKey=${KOREA_WEATHER_API_KEY}`;
    url += `&pageNo=1&numOfRows=1000&dataType=JSON`;
    url += `&base_date=${base_date}&base_time=${base_time}`;
    url += `&nx=${nx}&ny=${ny}`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            if (response.status === 500) {
                throw new Error('SERVER_ERROR');
            } else if (response.status === 401) {
                throw new Error('API_KEY_ERROR');
            } else {
                throw new Error(`HTTP_ERROR_${response.status}`);
            }
        }
        const data = await response.json();
        console.log('Korea Weather API raw data:', data);
        
        if (data.response.header.resultCode !== '00') {
            const errorCode = data.response.header.resultCode;
            const errorMsg = data.response.header.resultMsg;
            if (errorCode === '03') {
                throw new Error('NO_DATA_ERROR');
            } else if (errorCode === '04') {
                throw new Error('API_KEY_ERROR');
            } else {
                throw new Error(`API_ERROR_${errorCode}: ${errorMsg}`);
            }
        }

        if (!data.response.body || !data.response.body.items || !data.response.body.items.item) {
            throw new Error('NO_DATA_ERROR');
        }

        const items = data.response.body.items.item;
        let T1H, REH, WSD, PTY, RN1;
        items.forEach(item => {
            if (item.category === 'T1H') T1H = item.obsrValue;
            if (item.category === 'REH') REH = item.obsrValue;
            if (item.category === 'WSD') WSD = item.obsrValue;
            if (item.category === 'PTY') PTY = item.obsrValue;
            if (item.category === 'RN1') RN1 = item.obsrValue;
        });

        if (T1H === undefined) {
            throw new Error('NO_TEMPERATURE_DATA');
        }

        let isRainingValue = false;
        if (PTY && PTY !== '0') isRainingValue = true;
        else if (RN1 && parseFloat(RN1) > 0) isRainingValue = true;

        weatherData = {
            currentTemperature: Math.round(parseFloat(T1H)),
            yesterdayTemperature: weatherData.yesterdayTemperature || 17,
            windSpeed: WSD !== undefined ? parseFloat(WSD) : 5,
            humidity: REH !== undefined ? parseFloat(REH) : 60,
            isRaining: isRainingValue,
            fineDustLevel: weatherData.fineDustLevel || 'good',
            dayNightTempDiff: weatherData.dayNightTempDiff || 10,
            location: locationName,
        };
        
        console.log('날씨 데이터 성공적으로 로드됨:', weatherData);
        updateApp();
    } catch (error) {
        console.error('날씨 정보를 가져오는 중 오류 발생:', error);
        
        // 폴백 데이터 설정
        weatherData = {
            currentTemperature: 20, 
            yesterdayTemperature: 17, 
            windSpeed: 5,
            humidity: 60, 
            isRaining: false, 
            fineDustLevel: 'good',
            dayNightTempDiff: 10, 
            location: locationName || '서울 (기본값)',
        };
        console.log('서울 기준 기본 날씨 데이터로 폴백됨');
        updateApp();
    }
}

async function fetchAirQualityData(lat, lon) {
    try {
        const nearestStation = await findNearestStation(lat, lon);
        if (!nearestStation) {
            console.log('가까운 측정소를 찾을 수 없습니다.');
            return null;
        }

        // 현재 시간 기반으로 searchCondition 설정
        const now = new Date();
        const hour = now.getHours();
        let searchCondition = 'HOUR';
        
        // 시간대에 따라 조건 설정
        if (hour >= 6 && hour < 12) {
            searchCondition = 'HOUR';
        } else if (hour >= 12 && hour < 18) {
            searchCondition = 'HOUR';
        } else {
            searchCondition = 'HOUR';
        }

        let url = `${AIR_KOREA_BASE_URL}?serviceKey=${KOREA_WEATHER_API_KEY}`;
        url += `&returnType=json`;
        url += `&numOfRows=100`;
        url += `&pageNo=1`;
        url += `&stationName=${encodeURIComponent(nearestStation.stationName)}`;
        url += `&searchCondition=${searchCondition}`;
        url += `&ver=1.3`;
        url += `&dataTerm=DAILY`;

        console.log('Air Korea API URL:', url);

        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Air Korea API error: ${response.status}`);
        }

        const data = await response.json();
        console.log('Air Korea API raw data:', data);
        console.log('API Response Header:', data.response?.header);

        if (data.response?.header?.resultCode !== '00') {
            const errorCode = data.response?.header?.resultCode;
            const errorMsg = data.response?.header?.resultMsg;
            console.error(`API Error Details - Code: ${errorCode}, Message: ${errorMsg}`);
            throw new Error(`Air Korea API error: ${errorMsg} (${errorCode})`);
        }

        if (!data.response.body || !data.response.body.items || data.response.body.items.length === 0) {
            console.log('미세먼지 데이터가 없습니다.');
            return null;
        }

        const latestData = data.response.body.items[0];
        const pm10Value = latestData.pm10Value ? parseFloat(latestData.pm10Value) : null;
        const pm25Value = latestData.pm25Value ? parseFloat(latestData.pm25Value) : null;

        let fineDustLevel = 'good';
        if (pm10Value !== null) {
            if (pm10Value <= 30) {
                fineDustLevel = 'good';
            } else if (pm10Value <= 80) {
                fineDustLevel = 'moderate';
            } else if (pm10Value <= 150) {
                fineDustLevel = 'bad';
            } else {
                fineDustLevel = 'very_bad';
            }
        }

        console.log(`미세먼지 수치: PM10=${pm10Value}, PM25=${pm25Value}, 등급=${fineDustLevel}`);

        return {
            pm10: pm10Value,
            pm25: pm25Value,
            level: fineDustLevel,
            stationName: nearestStation.stationName
        };

    } catch (error) {
        console.error('미세먼지 정보를 가져오는 중 오류 발생:', error);
        
        // API 실패 시 서울 기준 데이터로 폴백
        console.log('서울 기준 미세먼지 데이터로 폴백...');
        return {
            pm10: 25,
            pm25: 15,
            level: 'good',
            stationName: '서울'
        };
    }
}

async function findNearestStation(lat, lon) {
    try {
        const stations = [
            { stationName: '중구', lat: 37.563569, lon: 126.997969 },
            { stationName: '종로구', lat: 37.574444, lon: 126.976944 },
            { stationName: '강남구', lat: 37.517222, lon: 127.047333 },
            { stationName: '강동구', lat: 37.530833, lon: 127.123056 },
            { stationName: '강북구', lat: 37.639722, lon: 127.025556 },
            { stationName: '강서구', lat: 37.550833, lon: 126.849722 },
            { stationName: '광진구', lat: 37.548056, lon: 127.083583 },
            { stationName: '구로구', lat: 37.495556, lon: 126.888889 },
            { stationName: '금천구', lat: 37.466389, lon: 126.900278 },
            { stationName: '노원구', lat: 37.654444, lon: 127.058611 },
            { stationName: '도봉구', lat: 37.659444, lon: 127.048889 },
            { stationName: '동대문구', lat: 37.581111, lon: 127.055556 },
            { stationName: '동작구', lat: 37.512778, lon: 126.939444 },
            { stationName: '마포구', lat: 37.566389, lon: 126.908611 },
            { stationName: '서대문구', lat: 37.579444, lon: 126.946944 },
            { stationName: '성동구', lat: 37.544444, lon: 127.047222 },
            { stationName: '성북구', lat: 37.589444, lon: 127.018056 },
            { stationName: '송파구', lat: 37.504167, lon: 127.127222 },
            { stationName: '양천구', lat: 37.516389, lon: 126.865833 },
            { stationName: '영등포구', lat: 37.526389, lon: 126.894722 },
            { stationName: '용산구', lat: 37.524444, lon: 126.966944 },
            { stationName: '은평구', lat: 37.517222, lon: 126.939444 },
            { stationName: '종로구', lat: 37.595556, lon: 126.983889 }
        ];

        let nearestStation = null;
        let minDistance = Infinity;

        stations.forEach(station => {
            const distance = calculateDistance(lat, lon, station.lat, station.lon);
            if (distance < minDistance) {
                minDistance = distance;
                nearestStation = station;
            }
        });

        return nearestStation;
    } catch (error) {
        console.error('측정소 찾기 오류:', error);
        return null;
    }
}

function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}

async function getUserLocationAndFetchWeather() {
    let finalLocationName = '서울';
    try {
        const position = await new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject, { 
                enableHighAccuracy: false, 
                timeout: 10000, 
                maximumAge: 0 
            });
        });
        
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        const { nx, ny } = convertToKMA(lat, lon);
        const geocodedLocation = await getReverseGeocodedAddress(lat, lon);
        
        if (geocodedLocation && geocodedLocation !== '알 수 없는 위치') {
            finalLocationName = geocodedLocation;
        } else {
            finalLocationName = '현재 위치';
        }
        
        // 날씨 데이터와 미세먼지 데이터를 병렬로 호출
        await Promise.all([
            fetchWeatherData(nx, ny, finalLocationName),
            fetchAirQualityData(lat, lon)
        ]);
        
        // 미세먼지 데이터가 있으면 날씨 데이터에 통합
        const airQualityData = await fetchAirQualityData(lat, lon);
        if (airQualityData) {
            weatherData.fineDustLevel = airQualityData.level;
            console.log(`미세먼지 정보 통합됨: ${airQualityData.level} (${airQualityData.pm10}μg/m³)`);
            updateApp();
        }
        
    } catch (error) {
        console.error('위치 정보를 가져오는 데 실패했습니다:', error);
        await fetchWeatherData(55, 127, finalLocationName);
        
        // 서울 기준 미세먼지 데이터 시도
        const seoulAirQuality = await fetchAirQualityData(37.5665, 126.9780);
        if (seoulAirQuality) {
            weatherData.fineDustLevel = seoulAirQuality.level;
            console.log(`서울 기준 미세먼지 정보 통합됨: ${seoulAirQuality.level} (${seoulAirQuality.pm10}μg/m³)`);
            updateApp();
        }
    }
}
