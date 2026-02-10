
// --- DOM Elements ---
const darkModeToggle = document.getElementById('dark-mode-toggle');
const useMyClosetToggle = document.getElementById('use-my-closet-toggle');
const addToClosetButton = document.getElementById('add-to-closet');
const closetItemNameInput = document.getElementById('closet-item-name');
const closetItemCategorySelect = document.getElementById('closet-item-category');
const myClosetItemsDiv = document.getElementById('my-closet-items');

// (기존 DOM 요소들은 그대로 유지)
const weatherDisplay = document.getElementById('weather');
const apparentTempDisplay = document.getElementById('apparent-temp');
const locationDisplay = document.getElementById('location');
const weatherComparisonDisplay = document.getElementById('weather-comparison');
const outfitExplanationDisplay = document.getElementById('outfit-explanation');
const contextualAdviceDisplay = document.getElementById('contextual-advice');
const genderButtons = document.querySelectorAll('.gender-selection button');
const styleButtons = document.querySelectorAll('.style-selection button');
const bodyTypeButtons = document.querySelectorAll('.body-type-selection button');
const recommendationsDiv = document.getElementById('recommendations');


// --- State ---
let selectedGender = 'male';
let selectedStyle = 'casual';
let selectedBodyType = 'normal';
let myCloset = []; // { id, name, category, style, gender }
let useMyCloset = false;

// --- Weather & Outfit Data (Placeholders) ---
const weatherData = {
    currentTemperature: 20,
    yesterdayTemperature: 17,
    windSpeed: 5, // m/s
    humidity: 60, // %
    isRaining: false,
    fineDustLevel: 'good', // 'good', 'moderate', 'bad'
    dayNightTempDiff: 10,
    location: 'Seoul'
};

const defaultOutfitData = [
    { gender: 'any', style: 'any', tempMin: -100, tempMax: 5, name: '두꺼운 패딩', category: 'outer' },
    { gender: 'any', style: 'any', tempMin: 5, tempMax: 10, name: '경량 패딩', category: 'outer' },
    { gender: 'any', style: 'any', tempMin: 10, tempMax: 15, name: '자켓 또는 가디건', category: 'outer' },
    { gender: 'any', style: 'any', tempMin: 10, tempMax: 17, name: '맨투맨 또는 후드티', category: 'top' },
    { gender: 'any', style: 'any', tempMin: 18, tempMax: 22, name: '긴팔 셔츠', category: 'top' },
    { gender: 'any', style: 'any', tempMin: 23, tempMax: 100, name: '반팔 티셔츠', category: 'top' },
    { gender: 'any', style: 'any', tempMin: -100, tempMax: 15, name: '기모 바지', category: 'bottom' },
    { gender: 'any', style: 'any', tempMin: 16, tempMax: 100, name: '면바지 또는 슬랙스', category: 'bottom' },
    { gender: 'male', style: 'modern', tempMin: 10, tempMax: 22, name: '블레이저', category: 'outer' },
    { gender: 'female', style: 'modern', tempMin: 10, tempMax: 22, name: '블라우스', category: 'top' },
    { gender: 'any', style: 'street', tempMin: 10, tempMax: 25, name: '바람막이', category: 'outer' },
];

// --- Functions ---

// Dark Mode
function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
    const isDarkMode = document.body.classList.contains('dark-mode');
    localStorage.setItem('darkMode', isDarkMode);
    darkModeToggle.innerHTML = isDarkMode ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
}

// My Closet
function renderMyCloset() {
    myClosetItemsDiv.innerHTML = '';
    myCloset.forEach(item => {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'closet-item';
        itemDiv.innerHTML = `<span>${item.name} (${item.category})</span> <button class="closet-item-delete" data-id="${item.id}"><i class="fas fa-trash-alt"></i></button>`;
        myClosetItemsDiv.appendChild(itemDiv);
    });
    // 삭제 버튼에 이벤트 리스너 추가
    document.querySelectorAll('.closet-item-delete').forEach(button => {
        button.addEventListener('click', (e) => {
            const itemId = parseInt(e.currentTarget.dataset.id, 10);
            myCloset = myCloset.filter(item => item.id !== itemId);
            renderMyCloset();
            updateApp();
        });
    });
}

function addToCloset() {
    const name = closetItemNameInput.value.trim();
    const category = closetItemCategorySelect.value;
    if (name) {
        myCloset.push({ id: Date.now(), name, category, style: 'any', gender: 'any' });
        closetItemNameInput.value = '';
        renderMyCloset();
        updateApp();
    }
}

// (기존 함수들은 그대로 유지)
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

    outfitExplanationDisplay.textContent = explanation;
    contextualAdviceDisplay.textContent = contextual.trim();
}

function updateWeatherUI(apparentTemp, weather) {
    locationDisplay.textContent = weather.location;
    weatherDisplay.textContent = `${weather.currentTemperature}℃`;
    apparentTempDisplay.textContent = `체감: ${apparentTemp}℃`;

    const tempDiff = weather.currentTemperature - weather.yesterdayTemperature;
    weatherComparisonDisplay.textContent = tempDiff > 0 ? `어제보다 ${tempDiff}℃ 높아요` : tempDiff < 0 ? `어제보다 ${Math.abs(tempDiff)}℃ 낮아요` : "어제와 기온이 비슷해요";
}

function renderRecommendations(apparentTemp) {
    recommendationsDiv.innerHTML = '';
    const sourceData = useMyCloset ? myCloset : defaultOutfitData;
    
    // 온도에 맞는 아이템 필터링 (내 옷장 사용 시에는 온도 필터링을 완화하거나 다르게 적용 가능)
    const tempFilteredOutfits = sourceData.filter(item => {
        if (useMyCloset) return true; // 내 옷장 아이템은 모두 보여주기
        const tempMatch = apparentTemp >= item.tempMin && apparentTemp <= item.tempMax;
        return tempMatch;
    });
    
    const filteredOutfits = tempFilteredOutfits.filter(item => {
        const genderMatch = item.gender === 'any' || item.gender === selectedGender;
        const styleMatch = item.style === 'any' || item.style === selectedStyle;
        return genderMatch && styleMatch;
    });

    if (filteredOutfits.length === 0) {
        recommendationsDiv.innerHTML = `<p style="text-align: center; grid-column: 1 / -1;">추천 의상 없음</p>`;
        return;
    }

    const uniqueCategories = ['outer', 'top', 'bottom'];
    uniqueCategories.forEach(category => {
        const item = filteredOutfits.find(i => i.category === category);
        if (item) {
            const itemDiv = document.createElement('div');
            itemDiv.className = 'recommendation-item';
            itemDiv.innerHTML = `<img src="https://placehold.co/220x220.png?text=${item.name.replace(/ /g, '+')}" alt="${item.name}"><p>${item.name}</p>`;
            recommendationsDiv.appendChild(itemDiv);
        }
    });
}

function updateApp() {
    const apparentTemp = calculateApparentTemperature(weatherData.currentTemperature, weatherData.windSpeed, weatherData.humidity, selectedBodyType);
    updateWeatherUI(apparentTemp, weatherData);
    getAdvice(apparentTemp, weatherData);
    renderRecommendations(apparentTemp);
}

// --- Event Listeners ---

// (기존 이벤트 리스너들은 그대로 유지)
[...genderButtons, ...styleButtons, ...bodyTypeButtons].forEach(button => {
    button.addEventListener('click', (e) => {
        const parent = e.target.closest('div');
        parent.querySelectorAll('button').forEach(btn => btn.classList.remove('active'));
        e.target.closest('button').classList.add('active');
        if (parent.classList.contains('gender-selection')) selectedGender = e.target.closest('button').dataset.gender;
        if (parent.classList.contains('style-selection')) selectedStyle = e.target.closest('button').dataset.style;
        if (parent.classList.contains('body-type-selection')) selectedBodyType = e.target.closest('button').dataset.bodyType;
        updateApp();
    });
});

darkModeToggle.addEventListener('click', toggleDarkMode);
addToClosetButton.addEventListener('click', addToCloset);
useMyClosetToggle.addEventListener('change', (e) => {
    useMyCloset = e.target.checked;
    updateApp();
});

// --- Initialization ---
function initializeApp() {
    // Dark Mode 초기 설정
    if (localStorage.getItem('darkMode') === 'true') {
        document.body.classList.add('dark-mode');
        darkModeToggle.innerHTML = '<i class="fas fa-sun"></i>';
    }
    
    // My Closet 데이터 불러오기 (LocalStorage)
    const savedCloset = localStorage.getItem('myCloset');
    if (savedCloset) {
        myCloset = JSON.parse(savedCloset);
    }
    renderMyCloset();
    
    // 초기 활성 버튼 설정
    document.querySelector('.gender-selection button[data-gender="male"]').classList.add('active');
    document.querySelector('.style-selection button[data-style="casual"]').classList.add('active');
    document.querySelector('.body-type-selection button[data-body-type="normal"]').classList.add('active');
    
    updateApp();
}

// 내 옷장 데이터 저장 (페이지 벗어날 때)
window.addEventListener('beforeunload', () => {
    localStorage.setItem('myCloset', JSON.stringify(myCloset));
});

initializeApp();
