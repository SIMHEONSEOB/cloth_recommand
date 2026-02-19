// --- Clothing Items Configuration ---
// All items now use images from the images folder

const defaultOutfitData = [
    { gender: 'any', style: 'any', tempMin: -10, tempMax: 5, name: '두꺼운패딩-모자(검은색)', category: 'outer', imageUrl: 'images/두꺼운패딩-모자(검은색).png' },
    { gender: 'any', style: 'any', tempMin: 5, tempMax: 15, name: '니트-녹색', category: 'top', imageUrl: 'images/니트-녹색.png' },
    { gender: 'any', style: 'any', tempMin: 5, tempMax: 20, name: '레큘러핏진(검은색)', category: 'bottom', imageUrl: 'images/레큘러핏진(검은색).png' },
    { gender: 'any', style: 'any', tempMin: 10, tempMax: 25, name: '갈색팬츠', category: 'bottom', imageUrl: 'images/갈색팬츠.png' },
    { gender: 'any', style: 'any', tempMin: 10, tempMax: 18, name: '맨투맨-회색', category: 'top', imageUrl: 'images/맨투맨-회색.png' },
    { gender: 'any', style: 'any', tempMin: 15, tempMax: 25, name: '블랙진', category: 'bottom', imageUrl: 'images/블랙진.png' },
    { gender: 'any', style: 'any', tempMin: 5, tempMax: 15, name: '스웨터 파란색', category: 'top', imageUrl: 'images/스웨터 파란색.png' },
    { gender: 'any', style: 'any', tempMin: 15, tempMax: 25, name: '청바지', category: 'bottom', imageUrl: 'images/청바지.png' },
    { gender: 'any', style: 'any', tempMin: -5, tempMax: 10, name: '기모 추리닝하의-흰색', category: 'bottom', imageUrl: 'images/기모 추리닝하의-흰색.png' },
    // Mask item for fine dust
    { gender: 'any', style: 'any', tempMin: -100, tempMax: 100, name: '마스크', category: 'accessory', imageUrl: 'images/마스크.svg', isMask: true },
];

// --- DOM Elements ---
let darkModeToggle;
let weatherDisplay;
let apparentTempDisplay;
let locationDisplay;
let weatherComparisonDisplay;
let outfitExplanationDisplay;
let contextualAdviceDisplay;
let genderButtons;
let styleButtons;
let bodyTypeButtons;
let recommendationsDiv;

// --- State ---
let selectedGender = 'male';
let selectedStyle = 'casual';
let selectedBodyType = 'normal';
let selectedCategory = 'all';

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

function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
    const isDarkMode = document.body.classList.contains('dark-mode');
    localStorage.setItem('darkMode', isDarkMode);
    if (darkModeToggle) {
        darkModeToggle.innerHTML = isDarkMode ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
    }
}

// === Weather Functions ===

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

// Image handling functions
function getClothingSVG(itemName, color, category, imageUrl) {
    if (imageUrl) {
        const imageId = `img-${itemName.replace(/[^a-zA-Z0-9]/g, '-')}-${Date.now()}`;
        return `
            <div class="image-container">
                <div class="skeleton skeleton-image" id="skeleton-${imageId}"></div>
                <img 
                    id="${imageId}"
                    class="lazy-image" 
                    src="${imageUrl}" 
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

function handleImageLoad(imageId) {
    const img = document.getElementById(imageId);
    const skeleton = document.getElementById(`skeleton-${imageId}`);
    
    if (img && skeleton) {
        img.classList.add('loaded');
        skeleton.style.display = 'none';
    }
}

function handleImageError(imageId) {
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

function calculateApparentTemperature(temp, wind, humidity, bodyType) {
    let apparentTemp = 13.12 + 0.6215 * temp - 11.37 * Math.pow(wind, 0.16) + 0.3965 * temp * Math.pow(wind, 0.16);
    if (bodyType === 'cold-sensitive') apparentTemp -= 2;
    else if (bodyType === 'heat-sensitive') apparentTemp += 2;
    return Math.round(apparentTemp);
}

function getAdvice(apparentTemp, weather) {
    let explanation = '';
    let contextual = '';
    if (apparentTemp <= 5) explanation = "체온 유지를 위해 두꺼운 아우터는 필수예요.";
    else if (apparentTemp <= 15) explanation = "쌀쌀한 날씨예요. 가벼운 아우터나 따뜻한 상의가 좋겠어요.";
    else if (apparentTemp <= 22) explanation = "선선해서 활동하기 좋은 날씨네요.";
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

function updateWeatherUI(apparentTemp, weather) {
    if (locationDisplay) {
        locationDisplay.textContent = weather.location;
    }
    if (weatherDisplay) {
        weatherDisplay.textContent = `${weather.currentTemperature}℃`;
    }
    if (apparentTempDisplay) {
        apparentTempDisplay.textContent = `체감: ${apparentTemp}℃`;
    }
    if (weatherComparisonDisplay) {
        const tempDiff = weather.currentTemperature - weather.yesterdayTemperature;
        weatherComparisonDisplay.textContent = tempDiff > 0 ? `어제보다 ${tempDiff}℃ 높아요` : tempDiff < 0 ? `어제보다 ${Math.abs(tempDiff)}℃ 낮아요` : "어제와 기온이 비슷해요";
    }
}

function renderRecommendations(apparentTemp) {
    if (!recommendationsDiv) {
        console.error('recommendationsDiv 요소를 찾을 수 없습니다.');
        return;
    }
    
    recommendationsDiv.innerHTML = '';
    const customItems = JSON.parse(localStorage.getItem('customClothes')) || [];
    const sourceData = [...defaultOutfitData, ...customItems];

    const tempFilteredOutfits = sourceData.filter(item => {
        return apparentTemp >= item.tempMin && apparentTemp <= item.tempMax;
    });

    const filteredOutfits = tempFilteredOutfits.filter(item => {
        const genderMatch = item.gender === 'any' || item.gender === selectedGender;
        const styleMatch = item.style === 'any' || item.style === selectedStyle;
        return genderMatch && styleMatch;
    });

    if (filteredOutfits.length === 0) {
        recommendationsDiv.innerHTML = `<p style="text-align: center; grid-column: 1 / -1; opacity: 0.6;">추천 의상이 없습니다</p>`;
        return;
    }

    const categoryLabels = { outer: '아우터', top: '상의', bottom: '하의' };
    const availableCategories = ['outer', 'top', 'bottom'];
    const uniqueCategories = selectedCategory === 'all' ? availableCategories : [selectedCategory];

    uniqueCategories.forEach(category => {
        const candidates = filteredOutfits.filter(i => i.category === category);
        const item = candidates.length > 0 ? candidates[Math.floor(Math.random() * candidates.length)] : null;

        if (item) {
            const itemDiv = document.createElement('div');
            itemDiv.className = 'recommendation-item';

            const svgContent = getClothingSVG(item.name, '#888', category, item.imageUrl);

            itemDiv.innerHTML = `
                <div class="item-visual visual-${category}">
                    ${svgContent}
                </div>
                <div class="item-info">
                    <span class="item-category-badge badge-${category}">${categoryLabels[category]}</span>
                    <p class="item-name">${item.name}</p>
                </div>
            `;
            recommendationsDiv.appendChild(itemDiv);
        }
    });

    // Add mask recommendation if fine dust is bad or very bad
    if (weatherData.fineDustLevel === 'bad' || weatherData.fineDustLevel === 'very_bad') {
        const maskDiv = document.createElement('div');
        maskDiv.className = 'recommendation-item mask-recommendation';
        maskDiv.style.cssText = `
            border: 2px solid #ff6b6b;
            background: linear-gradient(135deg, rgba(255, 107, 107, 0.1), rgba(238, 90, 36, 0.1));
            animation: pulse 2s infinite;
        `;

        const maskImageUrl = weatherData.fineDustLevel === 'very_bad' ? 'images/마스크-추천.svg' : 'images/마스크.svg';
        const svgContent = getClothingSVG('마스크', '#ff6b6b', 'accessory', maskImageUrl);

        maskDiv.innerHTML = `
            <div class="item-visual visual-accessory">
                ${svgContent}
            </div>
            <div class="item-info">
                <span class="item-category-badge badge-accessory" style="background: #ff6b6b; color: white;">액세서리</span>
                <p class="item-name">마스크</p>
                <div style="font-size: 12px; color: #ff6b6b; font-weight: bold; margin-top: 5px;">
                    ${weatherData.fineDustLevel === 'very_bad' ? '미세먼지 매우 나쁨!' : '미세먼지 나쁨!'}
                </div>
            </div>
        `;
        recommendationsDiv.appendChild(maskDiv);
    }
    
    setTimeout(() => {
        initializeLazyLoading();
    }, 100);
}

function updateApp() {
    const apparentTemp = calculateApparentTemperature(weatherData.currentTemperature, weatherData.windSpeed, weatherData.humidity, selectedBodyType);
    updateWeatherUI(apparentTemp, weatherData);
    getAdvice(apparentTemp, weatherData);
    renderRecommendations(apparentTemp);
}

// --- Initialization ---
async function initializeApp() {
    // Initialize DOM elements
    darkModeToggle = document.getElementById('dark-mode-toggle');
    weatherDisplay = document.getElementById('weather');
    apparentTempDisplay = document.getElementById('apparent-temp');
    locationDisplay = document.getElementById('location');
    weatherComparisonDisplay = document.getElementById('weather-comparison');
    outfitExplanationDisplay = document.getElementById('outfit-explanation');
    contextualAdviceDisplay = document.getElementById('contextual-advice');
    genderButtons = document.querySelectorAll('.gender-selection button');
    styleButtons = document.querySelectorAll('.style-selection button');
    bodyTypeButtons = document.querySelectorAll('.body-type-selection button');
    recommendationsDiv = document.getElementById('recommendations');

    if (localStorage.getItem('darkMode') === 'true') {
        document.body.classList.add('dark-mode');
        if (darkModeToggle) {
            darkModeToggle.innerHTML = '<i class="fas fa-sun"></i>';
        }
    }

    // Set default selections
    const maleButton = document.querySelector('.gender-selection button[data-gender="male"]');
    if (maleButton) {
        maleButton.classList.add('active');
    }
    
    const casualButton = document.querySelector('.style-selection button[data-style="casual"]');
    if (casualButton) {
        casualButton.classList.add('active');
    }
    
    const normalButton = document.querySelector('.body-type-selection button[data-body-type="normal"]');
    if (normalButton) {
        normalButton.classList.add('active');
    }

    updateApp();

    // Add event listeners after DOM is ready
    const categoryButtons = document.querySelectorAll('.category-selection button');
    
    [...genderButtons, ...styleButtons, ...bodyTypeButtons, ...categoryButtons].forEach(button => {
        button.addEventListener('click', (e) => {
            const parent = e.target.closest('div');
            parent.querySelectorAll('button').forEach(btn => btn.classList.remove('active'));
            e.target.closest('button').classList.add('active');
            if (parent.classList.contains('gender-selection')) selectedGender = e.target.closest('button').dataset.gender;
            if (parent.classList.contains('style-selection')) selectedStyle = e.target.closest('button').dataset.style;
            if (parent.classList.contains('body-type-selection')) selectedBodyType = e.target.closest('button').dataset.bodyType;
            if (parent.classList.contains('category-selection')) selectedCategory = e.target.closest('button').dataset.category;
            updateApp();
        });
    });

    if (darkModeToggle) {
        darkModeToggle.addEventListener('click', toggleDarkMode);
    }
}

document.addEventListener('DOMContentLoaded', initializeApp);
