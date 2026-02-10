
const weatherDisplay = document.getElementById('weather');
const locationDisplay = document.getElementById('location'); // 위치 표시 엘리먼트
const genderButtons = document.querySelectorAll('.gender-selection button');
const styleButtons = document.querySelectorAll('.style-selection button');
const recommendationsDiv = document.getElementById('recommendations');

let currentTemperature = '20℃'; // Placeholder temperature
let weatherCondition = '맑음'; // Placeholder weather
let currentLocation = 'Seoul'; // Placeholder location

// --- 의상 데이터 ---
const outfitData = [
    // ... (이전과 동일)
    { gender: 'male', style: 'casual', weather: '맑음', name: '그래픽 티셔츠', imageUrl: 'https://via.placeholder.com/220x220.png?text=Graphic+Tee' },
    { gender: 'male', style: 'casual', weather: '비', name: '방수 자켓', imageUrl: 'https://via.placeholder.com/220x220.png?text=Waterproof+Jacket' },
    { gender: 'male', style: 'casual', weather: '추움', name: '후드티', imageUrl: 'https://via.placeholder.com/220x220.png?text=Hoodie' },
    { gender: 'female', style: 'casual', weather: '맑음', name: '맥시 드레스', imageUrl: 'https://via.placeholder.com/220x220.png?text=Maxi+Dress' },
];

let selectedGender = 'male';
let selectedStyle = 'casual';

// --- 함수 ---

function updateWeatherUI() {
    weatherDisplay.textContent = currentTemperature;
    locationDisplay.textContent = currentLocation;
}

function renderRecommendations() {
    recommendationsDiv.innerHTML = '';
    const filteredOutfits = outfitData.filter(item =>
        item.gender === selectedGender &&
        item.style === selectedStyle &&
        (item.weather === weatherCondition || item.weather === 'any')
    );

    if (filteredOutfits.length === 0) {
        recommendationsDiv.innerHTML = `<p style="text-align: center; grid-column: 1 / -1;">추천 의상 없음</p>`;
    } else {
        filteredOutfits.forEach(item => {
            const itemDiv = document.createElement('div');
            itemDiv.className = 'recommendation-item';
            itemDiv.innerHTML = `<img src="${item.imageUrl}" alt="${item.name}"><p>${item.name}</p>`;
            recommendationsDiv.appendChild(itemDiv);
        });
    }
}

// --- Event Listeners & Initialization ---
genderButtons.forEach(button => {
    button.addEventListener('click', () => {
        selectedGender = button.dataset.gender;
        genderButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        renderRecommendations();
    });
});

styleButtons.forEach(button => {
    button.addEventListener('click', () => {
        selectedStyle = button.dataset.style;
        styleButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        renderRecommendations();
    });
});

function initializeApp() {
    genderButtons[0].classList.add('active');
    styleButtons[0].classList.add('active');
    updateWeatherUI();
    renderRecommendations();
}

initializeApp();
