
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


const KOREA_WEATHER_API_KEY = 'c20657a3a6e6112251b4e6f3ec95231b89d6f4add90dab6fe0ed3c85aa328f92';
const KOREA_WEATHER_BASE_URL = 'https://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getUltraSrtNcst';

// --- State ---
let selectedGender = 'male';
let selectedStyle = 'casual';
let selectedBodyType = 'normal';
let myCloset = []; // { id, name, category, style, gender }
let useMyCloset = false;

// --- Weather & Outfit Data (Placeholders) ---
let weatherData = {
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

// Lat/Long to KMA grid coordinate conversion function
// Based on: https://www.weather.go.kr/weather/forecast/digital-forecast.jsp
// and various JS implementations available online.
function convertToKMA(lat, lon) {
    const RE = 6371.00877; // 지구 반경 (km)
    const GRID = 5.0; // 격자 간격 (km)
    const SLAT1 = 30.0; // 표준 위도 1
    const SLAT2 = 60.0; // 표준 위도 2
    const OLON = 126.0; // 기준점 경도
    const OLAT = 38.0; // 기준점 위도
    const XO = 43; // 기준점 X좌표
    const YO = 136; // 기준점 Y좌표

    const DEGRAD = Math.PI / 180.0;
    const RADDEG = 180.0 / Math.PI;

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

// Helper function to format date and time for the API
function getBaseDateTime() {
    const now = new Date();
    let hours = now.getHours();
    const minutes = now.getMinutes();

    // Data is updated every 10 minutes, on the 40th minute.
    // So if current minute is less than 40, use previous hour's data.
    // For getUltraSrtNcst, base_time values are 00, 01, 02, ..., 23.
    // API base_time is HHMM format, e.g., 0600 for 6 AM
    
    // Adjust time to the nearest base_time for the API
    // Example: If current time is 06:35, base_time should be 0600.
    // If current time is 06:05, base_time should be 0500 (since 0600 data not ready yet at :05)
    
    let base_time_hours = hours;
    if (minutes < 40) { // If current minute is before :40, use previous hour's data
        base_time_hours--;
        if (base_time_hours < 0) base_time_hours = 23; // Handle midnight
    }

    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const base_date = `${year}${month}${day}`;
    const base_time = String(base_time_hours).padStart(2, '0') + '00';

    return { base_date, base_time };
}

async function fetchWeatherData(nx, ny, locationName = '현재 위치') {
    const { base_date, base_time } = getBaseDateTime();

    let url = `${KOREA_WEATHER_BASE_URL}?serviceKey=${decodeURIComponent(KOREA_WEATHER_API_KEY)}`;
    url += `&pageNo=1&numOfRows=1000&dataType=JSON`;
    url += `&base_date=${base_date}&base_time=${base_time}`;
    url += `&nx=${nx}&ny=${ny}`;


    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`날씨 정보를 가져오지 못했습니다: ${response.statusText}`);
        }
        const data = await response.json();
        console.log('Korea Weather API raw data:', data);

        if (data.response.header.resultCode !== '00') {
            throw new Error(`API 오류: ${data.response.header.resultMsg}`);
        }

        const items = data.response.body.items.item;
        let T1H, REH, WSD, PTY, RN1; // PTY: 강수형태, RN1: 1시간 강수량

        items.forEach(item => {
            if (item.category === 'T1H') T1H = item.obsrValue; // 1시간 기온
            if (item.category === 'REH') REH = item.obsrValue; // 습도
            if (item.category === 'WSD') WSD = item.obsrValue; // 풍속
            if (item.category === 'PTY') PTY = item.obsrValue; // 강수형태 (0: 없음, 1: 비, 2: 비/눈, 3: 눈, 4: 소나기)
            if (item.category === 'RN1') RN1 = item.obsrValue; // 1시간 강수량 (mm)
        });

        let isRainingValue = false;
        if (PTY && PTY !== '0') { // PTY indicates some form of precipitation
            isRainingValue = true;
        } else if (RN1 && parseFloat(RN1) > 0) { // RN1 indicates actual rainfall
            isRainingValue = true;
        }


        weatherData = {
            currentTemperature: T1H !== undefined ? Math.round(parseFloat(T1H)) : 20,
            yesterdayTemperature: weatherData.yesterdayTemperature || 17, // Placeholder
            windSpeed: WSD !== undefined ? parseFloat(WSD) : 5,
            humidity: REH !== undefined ? parseFloat(REH) : 60,
            isRaining: isRainingValue,
            fineDustLevel: weatherData.fineDustLevel || 'good', // Placeholder
            dayNightTempDiff: weatherData.dayNightTempDiff || 10, // Placeholder
            location: locationName, // Use dynamic location name
        };
        console.log('Processed weather data:', weatherData);

    } catch (error) {
        console.error('날씨 정보를 가져오는 중 오류 발생:', error);
        // 오류 발생 시 기본값 설정
        weatherData = {
            currentTemperature: 20,
            yesterdayTemperature: 17,
            windSpeed: 5,
            humidity: 60,
            isRaining: false,
            fineDustLevel: 'good',
            dayNightTempDiff: 10,
            location: locationName,
        };
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
            itemDiv.className = 'closet-item';
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
async function initializeApp() {
    // Dark Mode 초기 설정
    if (localStorage.getItem('darkMode') === 'true') {
        document.body.classList.add('dark-mode');
        darkModeToggle.innerHTML = '<i class="fas fa-sun"></i>';
    }

    // Fetch weather data first
    await getUserLocationAndFetchWeather(); // Call the new function for geolocation
    
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

// Function to get user's location and fetch weather
async function getUserLocationAndFetchWeather() {
    return new Promise((resolve) => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                async (position) => {
                    const lat = position.coords.latitude;
                    const lon = position.coords.longitude;
                    const { nx, ny } = convertToKMA(lat, lon);
                    await fetchWeatherData(nx, ny, '현재 위치');
                    resolve();
                },
                async (error) => {
                    console.error('위치 정보를 가져오는 데 실패했습니다:', error);
                    // Fallback to Seoul if geolocation fails or denied
                    await fetchWeatherData(55, 127, '서울'); // Use literal values
                    resolve();
                },
                { enableHighAccuracy: false, timeout: 10000, maximumAge: 0 }
            );
        } else {
            console.warn('이 브라우저는 지리적 위치를 지원하지 않습니다.');
            // Fallback to Seoul if geolocation is not supported
            await fetchWeatherData(55, 127, '서울'); // Use literal values
            resolve();
        }
    });
}


(async () => {
    await initializeApp();
})();
