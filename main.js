// --- SVG Clothing Templates ---
// Each function returns an SVG string for a clothing item, with customizable colors.

const clothingSVGs = {
    // === OUTERS ===
    '두꺼운 패딩': (color = '#2d3748') => `
        <svg viewBox="0 0 220 180" xmlns="http://www.w3.org/2000/svg">
            <defs><linearGradient id="pd1" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="${color}"/><stop offset="100%" stop-color="${adjustColor(color, -30)}"/></linearGradient></defs>
            <path d="M50 15 Q45 10 35 15 L10 55 Q5 65 12 70 L20 75 L18 160 Q18 170 28 170 L90 170 L90 90 L130 90 L130 170 L192 170 Q202 170 202 160 L200 75 L208 70 Q215 65 210 55 L185 15 Q175 10 170 15 L140 30 Q120 40 110 40 Q100 40 80 30 Z" fill="url(#pd1)" stroke="${adjustColor(color, -50)}" stroke-width="1.5"/>
            <path d="M60 50 Q70 55 85 55 L90 90 L50 90 Z" fill="${adjustColor(color, 15)}" opacity="0.3"/>
            <path d="M160 50 Q150 55 135 55 L130 90 L170 90 Z" fill="${adjustColor(color, 15)}" opacity="0.3"/>
            <line x1="110" y1="40" x2="110" y2="170" stroke="${adjustColor(color, -40)}" stroke-width="2" stroke-dasharray="4,4"/>
            <circle cx="110" cy="65" r="3" fill="${adjustColor(color, 40)}"/>
            <circle cx="110" cy="85" r="3" fill="${adjustColor(color, 40)}"/>
            <circle cx="110" cy="105" r="3" fill="${adjustColor(color, 40)}"/>
            <circle cx="110" cy="125" r="3" fill="${adjustColor(color, 40)}"/>
            <rect x="75" y="10" width="70" height="12" rx="3" fill="${adjustColor(color, -20)}" opacity="0.7"/>
        </svg>`,

    // 경량 패딩은 실제 이미지 사용 (images/light_padding.png)

    '자켓 또는 가디건': (color = '#d97706') => `
        <svg viewBox="0 0 220 180" xmlns="http://www.w3.org/2000/svg">
            <defs><linearGradient id="jk1" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="${color}"/><stop offset="100%" stop-color="${adjustColor(color, -20)}"/></linearGradient></defs>
            <path d="M58 18 Q52 12 42 18 L15 60 Q10 68 16 72 L28 75 L26 158 Q26 165 35 165 L92 165 L92 82 L128 82 L128 165 L185 165 Q194 165 194 158 L192 75 L204 72 Q210 68 205 60 L178 18 Q168 12 162 18 L140 32 Q120 42 110 42 Q100 42 80 32 Z" fill="url(#jk1)" stroke="${adjustColor(color, -40)}" stroke-width="1.5"/>
            <path d="M92 42 L92 165" stroke="${adjustColor(color, -30)}" stroke-width="2"/>
            <path d="M128 42 L128 165" stroke="${adjustColor(color, -30)}" stroke-width="2"/>
            <path d="M92 42 L105 50 L110 42 L115 50 L128 42" fill="none" stroke="${adjustColor(color, -35)}" stroke-width="1.5"/>
            <rect x="35" y="100" width="30" height="25" rx="4" fill="${adjustColor(color, -15)}" opacity="0.4"/>
            <rect x="155" y="100" width="30" height="25" rx="4" fill="${adjustColor(color, -15)}" opacity="0.4"/>
        </svg>`,

    '블레이저': (color = '#1f2937') => `
        <svg viewBox="0 0 220 180" xmlns="http://www.w3.org/2000/svg">
            <defs><linearGradient id="bl1" x1="0" y1="0" x2="0.5" y2="1"><stop offset="0%" stop-color="${adjustColor(color, 15)}"/><stop offset="100%" stop-color="${color}"/></linearGradient></defs>
            <path d="M55 15 Q48 10 38 15 L12 58 Q8 66 14 70 L28 74 L26 160 Q26 168 36 168 L94 168 L94 78 L126 78 L126 168 L184 168 Q194 168 194 160 L192 74 L206 70 Q212 66 208 58 L182 15 Q172 10 165 15 L140 32 Q122 42 110 42 Q98 42 80 32 Z" fill="url(#bl1)" stroke="${adjustColor(color, -30)}" stroke-width="1.5"/>
            <path d="M94 42 L94 168" stroke="${adjustColor(color, -20)}" stroke-width="2"/>
            <path d="M126 42 L126 168" stroke="${adjustColor(color, -20)}" stroke-width="2"/>
            <path d="M94 42 L108 75 L110 42 L112 75 L126 42" fill="${adjustColor(color, 10)}" stroke="${adjustColor(color, -20)}" stroke-width="1"/>
            <circle cx="106" cy="95" r="3" fill="${adjustColor(color, 50)}"/>
            <circle cx="106" cy="120" r="3" fill="${adjustColor(color, 50)}"/>
            <rect x="60" y="15" width="20" height="30" rx="2" fill="${adjustColor(color, 10)}" stroke="${adjustColor(color, -20)}" stroke-width="1" transform="rotate(-15,70,30)"/>
            <rect x="140" y="15" width="20" height="30" rx="2" fill="${adjustColor(color, 10)}" stroke="${adjustColor(color, -20)}" stroke-width="1" transform="rotate(15,150,30)"/>
        </svg>`,

    '바람막이': (color = '#0ea5e9') => `
        <svg viewBox="0 0 220 180" xmlns="http://www.w3.org/2000/svg">
            <defs><linearGradient id="wk1" x1="0" y1="0" x2="1" y2="0.5"><stop offset="0%" stop-color="${color}"/><stop offset="50%" stop-color="${adjustColor(color, 15)}"/><stop offset="100%" stop-color="${color}"/></linearGradient></defs>
            <path d="M55 18 Q48 12 38 18 L14 58 Q9 66 15 70 L26 73 L24 155 Q24 162 34 162 L92 162 L92 80 L128 80 L128 162 L186 162 Q196 162 196 155 L194 73 L205 70 Q211 66 206 58 L182 18 Q172 12 165 18 L140 33 Q120 42 110 42 Q100 42 80 33 Z" fill="url(#wk1)" stroke="${adjustColor(color, -35)}" stroke-width="1.2" opacity="0.92"/>
            <line x1="110" y1="42" x2="110" y2="162" stroke="${adjustColor(color, -25)}" stroke-width="2"/>
            <rect x="80" y="8" width="60" height="16" rx="8" fill="${adjustColor(color, -20)}" opacity="0.6"/>
            <path d="M24 75 L35 80 L24 85" fill="none" stroke="${adjustColor(color, 40)}" stroke-width="1.5"/>
            <path d="M196 75 L185 80 L196 85" fill="none" stroke="${adjustColor(color, 40)}" stroke-width="1.5"/>
            <circle cx="110" cy="60" r="2" fill="${adjustColor(color, 50)}"/>
            <circle cx="110" cy="78" r="2" fill="${adjustColor(color, 50)}"/>
        </svg>`,

    // === TOPS ===
    '맨투맨 또는 후드티': (color = '#6b7280') => `
        <svg viewBox="0 0 190 160" xmlns="http://www.w3.org/2000/svg">
            <defs><linearGradient id="hw1" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="${adjustColor(color, 10)}"/><stop offset="100%" stop-color="${color}"/></linearGradient></defs>
            <path d="M50 12 Q44 8 36 12 L10 48 Q6 56 12 60 L24 63 L22 145 Q22 152 32 152 L85 152 L85 75 L105 75 L105 152 L158 152 Q168 152 168 145 L166 63 L178 60 Q184 56 180 48 L154 12 Q146 8 140 12 L125 22 Q110 32 95 32 Q80 32 65 22 Z" fill="url(#hw1)" stroke="${adjustColor(color, -30)}" stroke-width="1.5"/>
            <path d="M70 0 Q75 -5 95 -5 Q115 -5 120 0 L125 22 Q118 30 95 32 Q72 30 65 22 Z" fill="${adjustColor(color, -10)}" stroke="${adjustColor(color, -30)}" stroke-width="1"/>
            <ellipse cx="95" cy="30" rx="18" ry="8" fill="${adjustColor(color, -25)}" opacity="0.5"/>
            <path d="M42 95 L22 95 L22 130 L42 125 Z" fill="${adjustColor(color, -8)}" stroke="${adjustColor(color, -25)}" stroke-width="1" rx="3"/>
        </svg>`,

    '긴팔 셔츠': (color = '#e5e7eb') => `
        <svg viewBox="0 0 190 160" xmlns="http://www.w3.org/2000/svg">
            <defs><linearGradient id="ls1" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="${color}"/><stop offset="100%" stop-color="${adjustColor(color, -15)}"/></linearGradient></defs>
            <path d="M52 14 Q46 8 38 14 L12 50 Q8 58 14 62 L26 65 L24 146 Q24 153 34 153 L86 153 L86 72 L104 72 L104 153 L156 153 Q166 153 166 146 L164 65 L176 62 Q182 58 178 50 L152 14 Q144 8 138 14 L122 26 Q108 35 95 35 Q82 35 68 26 Z" fill="url(#ls1)" stroke="${adjustColor(color, -40)}" stroke-width="1.2"/>
            <path d="M72 5 L80 14 L95 18 L110 14 L118 5" fill="none" stroke="${adjustColor(color, -40)}" stroke-width="1.5"/>
            <path d="M80 14 L95 22 L110 14" fill="${color}" stroke="${adjustColor(color, -40)}" stroke-width="1"/>
            <line x1="95" y1="35" x2="95" y2="153" stroke="${adjustColor(color, -25)}" stroke-width="1.5"/>
            <circle cx="95" cy="55" r="2" fill="${adjustColor(color, -50)}"/>
            <circle cx="95" cy="75" r="2" fill="${adjustColor(color, -50)}"/>
            <circle cx="95" cy="95" r="2" fill="${adjustColor(color, -50)}"/>
            <circle cx="95" cy="115" r="2" fill="${adjustColor(color, -50)}"/>
            <circle cx="95" cy="135" r="2" fill="${adjustColor(color, -50)}"/>
            <rect x="24" y="80" width="8" height="12" rx="2" fill="${adjustColor(color, -20)}" opacity="0.4"/>
            <rect x="158" y="80" width="8" height="12" rx="2" fill="${adjustColor(color, -20)}" opacity="0.4"/>
        </svg>`,

    '반팔 티셔츠': (color = '#3b82f6') => `
        <svg viewBox="0 0 190 160" xmlns="http://www.w3.org/2000/svg">
            <defs><linearGradient id="ts1" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="${adjustColor(color, 10)}"/><stop offset="100%" stop-color="${color}"/></linearGradient></defs>
            <path d="M52 14 Q46 8 38 14 L20 42 Q16 50 22 54 L38 56 L36 146 Q36 153 46 153 L86 153 L86 68 L104 68 L104 153 L144 153 Q154 153 154 146 L152 56 L168 54 Q174 50 170 42 L152 14 Q144 8 138 14 L122 26 Q108 35 95 35 Q82 35 68 26 Z" fill="url(#ts1)" stroke="${adjustColor(color, -30)}" stroke-width="1.5"/>
            <ellipse cx="95" cy="28" rx="22" ry="10" fill="${adjustColor(color, -15)}" opacity="0.4"/>
        </svg>`,

    '블라우스': (color = '#f9a8d4') => `
        <svg viewBox="0 0 190 160" xmlns="http://www.w3.org/2000/svg">
            <defs><linearGradient id="bls1" x1="0" y1="0" x2="0.5" y2="1"><stop offset="0%" stop-color="${adjustColor(color, 10)}"/><stop offset="100%" stop-color="${color}"/></linearGradient></defs>
            <path d="M55 14 Q48 8 40 14 L14 50 Q10 58 16 62 L28 65 L26 148 Q26 155 36 155 L86 155 L86 72 L104 72 L104 155 L154 155 Q164 155 164 148 L162 65 L174 62 Q180 58 176 50 L150 14 Q142 8 135 14 L120 26 Q108 35 95 35 Q82 35 70 26 Z" fill="url(#bls1)" stroke="${adjustColor(color, -30)}" stroke-width="1.2"/>
            <path d="M70 5 Q75 0 95 -2 Q115 0 120 5 L120 26 Q108 35 95 35 Q82 35 70 26 Z" fill="${adjustColor(color, 8)}" stroke="${adjustColor(color, -25)}" stroke-width="1"/>
            <path d="M80 10 Q88 20 95 22 Q102 20 110 10" fill="none" stroke="${adjustColor(color, -35)}" stroke-width="1" opacity="0.5"/>
            <path d="M86 72 L86 155" stroke="${adjustColor(color, -18)}" stroke-width="1"/>
            <path d="M104 72 L104 155" stroke="${adjustColor(color, -18)}" stroke-width="1"/>
            <circle cx="95" cy="50" r="2.5" fill="${adjustColor(color, -40)}"/>
            <circle cx="95" cy="68" r="2.5" fill="${adjustColor(color, -40)}"/>
            <circle cx="95" cy="86" r="2.5" fill="${adjustColor(color, -40)}"/>
            <path d="M26 100 Q20 102 16 110 Q20 118 26 120" fill="none" stroke="${adjustColor(color, -15)}" stroke-width="1" opacity="0.5"/>
            <path d="M164 100 Q170 102 174 110 Q170 118 164 120" fill="none" stroke="${adjustColor(color, -15)}" stroke-width="1" opacity="0.5"/>
        </svg>`,

    // === BOTTOMS ===
    // 기모 바지는 실제 이미지 사용 (images/fleece_pants.png)

    '면바지 또는 슬랙스': (color = '#92400e') => `
        <svg viewBox="0 0 170 180" xmlns="http://www.w3.org/2000/svg">
            <defs><linearGradient id="sl1" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="${adjustColor(color, 10)}"/><stop offset="100%" stop-color="${color}"/></linearGradient></defs>
            <path d="M28 10 Q25 5 22 10 L22 15 L18 168 Q17 175 28 175 L68 175 Q72 175 72 170 L80 85 L90 85 L98 170 Q98 175 102 175 L142 175 Q153 175 152 168 L148 15 L148 10 Q145 5 142 10 Z" fill="url(#sl1)" stroke="${adjustColor(color, -30)}" stroke-width="1.2"/>
            <path d="M22 15 L148 15" stroke="${adjustColor(color, 20)}" stroke-width="2"/>
            <rect x="74" y="15" width="22" height="8" rx="2" fill="${adjustColor(color, -15)}" opacity="0.5"/>
            <path d="M52 20 L46 170" stroke="${adjustColor(color, 15)}" stroke-width="0.8" opacity="0.25"/>
            <path d="M118 20 L124 170" stroke="${adjustColor(color, 15)}" stroke-width="0.8" opacity="0.25"/>
        </svg>`,
};

// Color utility function
function adjustColor(hex, amount) {
    hex = hex.replace('#', '');
    if (hex.length === 3) hex = hex.split('').map(c => c + c).join('');
    const num = parseInt(hex, 16);
    let r = Math.min(255, Math.max(0, (num >> 16) + amount));
    let g = Math.min(255, Math.max(0, ((num >> 8) & 0x00FF) + amount));
    let b = Math.min(255, Math.max(0, (num & 0x0000FF) + amount));
    return '#' + [r, g, b].map(c => c.toString(16).padStart(2, '0')).join('');
}

// Unique ID counter for SVG gradients to prevent ID collisions
let svgIdCounter = 0;

// Get SVG for an item, with fallback for custom closet items
// Also supports real image URLs via the item's imageUrl property
function getClothingSVG(itemName, color, category, imageUrl) {
    // If the item has a real image URL, use an <img> tag
    if (imageUrl) {
        return `<img src="${imageUrl}" alt="${itemName}" style="width:100%;height:100%;object-fit:contain;border-radius:8px;">`;
    }
    const svgFn = clothingSVGs[itemName];
    svgIdCounter++;
    let svg;
    if (svgFn) {
        svg = svgFn(color);
    } else {
        // Generate a generic SVG based on category
        svg = generateGenericSVG(category || 'top', color);
    }
    // Replace all gradient IDs with unique versions to avoid DOM collisions
    svg = svg.replace(/id="(\w+)"/g, (match, id) => `id="${id}_${svgIdCounter}"`);
    svg = svg.replace(/url\(#(\w+)\)/g, (match, id) => `url(#${id}_${svgIdCounter})`);
    return svg;
}

function generateGenericSVG(category, color = '#888') {
    if (category === 'outer') {
        return `<svg viewBox="0 0 220 180" xmlns="http://www.w3.org/2000/svg">
            <defs><linearGradient id="gen" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="${color}"/><stop offset="100%" stop-color="${adjustColor(color, -25)}"/></linearGradient></defs>
            <path d="M55 18 Q48 12 38 18 L14 58 Q9 66 15 70 L26 73 L24 155 Q24 162 34 162 L92 162 L92 80 L128 80 L128 162 L186 162 Q196 162 196 155 L194 73 L205 70 Q211 66 206 58 L182 18 Q172 12 165 18 L140 33 Q120 42 110 42 Q100 42 80 33 Z" fill="url(#gen)" stroke="${adjustColor(color, -35)}" stroke-width="1.2"/>
            <line x1="110" y1="42" x2="110" y2="162" stroke="${adjustColor(color, -25)}" stroke-width="2"/>
        </svg>`;
    } else if (category === 'top') {
        return `<svg viewBox="0 0 190 160" xmlns="http://www.w3.org/2000/svg">
            <defs><linearGradient id="gen" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="${adjustColor(color, 10)}"/><stop offset="100%" stop-color="${color}"/></linearGradient></defs>
            <path d="M52 14 Q46 8 38 14 L20 42 Q16 50 22 54 L38 56 L36 146 Q36 153 46 153 L86 153 L86 68 L104 68 L104 153 L144 153 Q154 153 154 146 L152 56 L168 54 Q174 50 170 42 L152 14 Q144 8 138 14 L122 26 Q108 35 95 35 Q82 35 68 26 Z" fill="url(#gen)" stroke="${adjustColor(color, -30)}" stroke-width="1.5"/>
            <ellipse cx="95" cy="28" rx="22" ry="10" fill="${adjustColor(color, -15)}" opacity="0.4"/>
        </svg>`;
    } else {
        return `<svg viewBox="0 0 170 180" xmlns="http://www.w3.org/2000/svg">
            <defs><linearGradient id="gen" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="${color}"/><stop offset="100%" stop-color="${adjustColor(color, -20)}"/></linearGradient></defs>
            <path d="M25 10 Q22 5 20 10 L20 15 L15 165 Q14 175 25 175 L70 175 L78 85 L92 85 L100 175 L145 175 Q156 175 155 165 L150 15 L150 10 Q148 5 145 10 Z" fill="url(#gen)" stroke="${adjustColor(color, -30)}" stroke-width="1.5"/>
            <path d="M20 15 L150 15" stroke="${adjustColor(color, 20)}" stroke-width="2"/>
        </svg>`;
    }
}

// --- DOM Elements ---
const darkModeToggle = document.getElementById('dark-mode-toggle');
const useMyClosetToggle = document.getElementById('use-my-closet-toggle');
const addToClosetButton = document.getElementById('add-to-closet');
const closetItemNameInput = document.getElementById('closet-item-name');
const closetItemCategorySelect = document.getElementById('closet-item-category');
const myClosetItemsDiv = document.getElementById('my-closet-items');

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

// Avatar DOM
const clothingLayerOuter = document.getElementById('clothing-layer-outer');
const clothingLayerTop = document.getElementById('clothing-layer-top');
const clothingLayerBottom = document.getElementById('clothing-layer-bottom');
const avatarHint = document.getElementById('avatar-hint');
const avatarResetBtn = document.getElementById('avatar-reset-btn');
const slotOuterName = document.getElementById('slot-outer-name');
const slotTopName = document.getElementById('slot-top-name');
const slotBottomName = document.getElementById('slot-bottom-name');
const slotOuter = document.getElementById('slot-outer');
const slotTop = document.getElementById('slot-top');
const slotBottom = document.getElementById('slot-bottom');


const KOREA_WEATHER_API_KEY = 'cc408361b08a3bdccaa9d4b3aa113443dd11d6ed128fdd19d059f295314bc1f5';
const KOREA_WEATHER_BASE_URL = 'https://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getUltraSrtNcst';

// --- State ---
let selectedGender = 'male';
let selectedStyle = 'casual';
let selectedBodyType = 'normal';
let myCloset = [];
let useMyCloset = false;
let currentAvatarOutfit = {
    outer: null,
    top: null,
    bottom: null,
};

// --- Default colors per item ---
const itemColors = {
    '두꺼운 패딩': '#2d3748',
    '경량 패딩': '#6366f1',
    '자켓 또는 가디건': '#d97706',
    '블레이저': '#1f2937',
    '바람막이': '#0ea5e9',
    '맨투맨 또는 후드티': '#6b7280',
    '긴팔 셔츠': '#e5e7eb',
    '반팔 티셔츠': '#3b82f6',
    '블라우스': '#f9a8d4',
    '기모 바지': '#374151',
    '면바지 또는 슬랙스': '#92400e',
};

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

const defaultOutfitData = [
    { gender: 'any', style: 'any', tempMin: -100, tempMax: 5, name: '두꺼운 패딩', category: 'outer', color: '#2d3748' },
    { gender: 'any', style: 'any', tempMin: 5, tempMax: 10, name: '경량 패딩', category: 'outer', color: '#2d3748', imageUrl: 'images/light_padding.png' },
    { gender: 'any', style: 'any', tempMin: 10, tempMax: 15, name: '자켓 또는 가디건', category: 'outer', color: '#d97706' },
    { gender: 'any', style: 'any', tempMin: 10, tempMax: 17, name: '맨투맨 또는 후드티', category: 'top', color: '#6b7280' },
    { gender: 'any', style: 'any', tempMin: 18, tempMax: 22, name: '긴팔 셔츠', category: 'top', color: '#e5e7eb' },
    { gender: 'any', style: 'any', tempMin: 23, tempMax: 100, name: '반팔 티셔츠', category: 'top', color: '#3b82f6' },
    { gender: 'any', style: 'any', tempMin: -100, tempMax: 15, name: '기모 바지', category: 'bottom', color: '#374151', imageUrl: 'images/fleece_pants.png' },
    { gender: 'any', style: 'any', tempMin: 16, tempMax: 100, name: '면바지 또는 슬랙스', category: 'bottom', color: '#92400e' },
    { gender: 'male', style: 'modern', tempMin: 10, tempMax: 22, name: '블레이저', category: 'outer', color: '#1f2937' },
    { gender: 'female', style: 'modern', tempMin: 10, tempMax: 22, name: '블라우스', category: 'top', color: '#f9a8d4' },
    { gender: 'any', style: 'street', tempMin: 10, tempMax: 25, name: '바람막이', category: 'outer', color: '#0ea5e9' },
];

// --- Functions ---

function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
    const isDarkMode = document.body.classList.contains('dark-mode');
    localStorage.setItem('darkMode', isDarkMode);
    darkModeToggle.innerHTML = isDarkMode ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
}

// === Avatar System ===

function renderAvatar(outfit) {
    // Hide all layers first
    clothingLayerOuter.style.display = 'none';
    clothingLayerTop.style.display = 'none';
    clothingLayerBottom.style.display = 'none';
    clothingLayerOuter.innerHTML = '';
    clothingLayerTop.innerHTML = '';
    clothingLayerBottom.innerHTML = '';

    // Reset all outfit slots
    slotOuter.classList.remove('active');
    slotTop.classList.remove('active');
    slotBottom.classList.remove('active');
    slotOuterName.textContent = '미착용';
    slotTopName.textContent = '미착용';
    slotBottomName.textContent = '미착용';
    document.querySelectorAll('.slot-remove').forEach(btn => btn.style.display = 'none');

    let hasAnyItem = false;

    if (outfit.outer) {
        const svg = getClothingSVG(outfit.outer.name, outfit.outer.color, 'outer', outfit.outer.imageUrl);
        if (svg) {
            clothingLayerOuter.innerHTML = svg;
            clothingLayerOuter.style.display = 'flex';
        }
        slotOuterName.textContent = outfit.outer.name;
        slotOuter.classList.add('active');
        slotOuter.querySelector('.slot-remove').style.display = 'flex';
        hasAnyItem = true;
    }

    if (outfit.top) {
        const svg = getClothingSVG(outfit.top.name, outfit.top.color, 'top', outfit.top.imageUrl);
        if (svg) {
            clothingLayerTop.innerHTML = svg;
            clothingLayerTop.style.display = 'flex';
        }
        slotTopName.textContent = outfit.top.name;
        slotTop.classList.add('active');
        slotTop.querySelector('.slot-remove').style.display = 'flex';
        hasAnyItem = true;
    }

    if (outfit.bottom) {
        const svg = getClothingSVG(outfit.bottom.name, outfit.bottom.color, 'bottom', outfit.bottom.imageUrl);
        if (svg) {
            clothingLayerBottom.innerHTML = svg;
            clothingLayerBottom.style.display = 'flex';
        }
        slotBottomName.textContent = outfit.bottom.name;
        slotBottom.classList.add('active');
        slotBottom.querySelector('.slot-remove').style.display = 'flex';
        hasAnyItem = true;
    }

    // Show/hide hint
    if (avatarHint) {
        avatarHint.style.display = hasAnyItem ? 'none' : 'block';
    }

    currentAvatarOutfit = outfit;

    // Update try-on button states
    updateTryOnButtonStates();
}

function tryOnOutfitItem(item) {
    if (!item || !item.category) {
        console.warn('Invalid item provided to tryOnOutfitItem:', item);
        return;
    }

    currentAvatarOutfit[item.category] = item;
    renderAvatar(currentAvatarOutfit);

    // Scroll to avatar section smoothly
    const avatarSection = document.getElementById('avatar-section');
    if (avatarSection) {
        avatarSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
}

function removeOutfitItem(category) {
    currentAvatarOutfit[category] = null;
    renderAvatar(currentAvatarOutfit);
}

function resetAvatar() {
    currentAvatarOutfit = { outer: null, top: null, bottom: null };
    renderAvatar(currentAvatarOutfit);
}

function updateTryOnButtonStates() {
    document.querySelectorAll('#recommendations .try-on-button').forEach(btn => {
        try {
            const itemData = JSON.parse(btn.dataset.item);
            const current = currentAvatarOutfit[itemData.category];
            if (current && current.name === itemData.name) {
                btn.classList.add('worn');
                btn.innerHTML = '<i class="fas fa-check"></i> 착용 중';
            } else {
                btn.classList.remove('worn');
                btn.innerHTML = '<i class="fas fa-shirt"></i> 입어보기';
            }
        } catch (e) { /* ignore */ }
    });
}

// === My Closet ===

function renderMyCloset() {
    myClosetItemsDiv.innerHTML = '';
    myCloset.forEach(item => {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'closet-item';
        const categoryLabel = item.category === 'outer' ? '아우터' : item.category === 'top' ? '상의' : '하의';
        itemDiv.innerHTML = `
            <span>${item.name} (${categoryLabel})</span>
            <div class="closet-item-actions">
                <button class="try-on-button" data-item='${JSON.stringify(item)}'><i class="fas fa-shirt"></i> 입어보기</button>
                <button class="closet-item-delete" data-id="${item.id}"><i class="fas fa-trash-alt"></i></button>
            </div>
        `;
        myClosetItemsDiv.appendChild(itemDiv);
    });

    document.querySelectorAll('#my-closet-items .try-on-button').forEach(button => {
        button.addEventListener('click', (e) => {
            const itemData = JSON.parse(e.currentTarget.dataset.item);
            tryOnOutfitItem(itemData);
        });
    });

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
        // Assign a random color for the closet item
        const hue = Math.floor(Math.random() * 360);
        const color = `hsl(${hue}, 50%, 45%)`;
        // Convert HSL to hex for SVG compatibility
        const hexColor = hslToHex(hue, 50, 45);

        myCloset.push({ id: Date.now(), name, category, style: 'any', gender: 'any', color: hexColor });
        closetItemNameInput.value = '';
        renderMyCloset();
        updateApp();
    }
}

function hslToHex(h, s, l) {
    s /= 100;
    l /= 100;
    const a = s * Math.min(l, 1 - l);
    const f = n => {
        const k = (n + h / 30) % 12;
        const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
        return Math.round(255 * color).toString(16).padStart(2, '0');
    };
    return `#${f(0)}${f(8)}${f(4)}`;
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

async function getReverseGeocodedAddress(lat, lon) {
    try {
        const nominatimUrl = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=18&addressdetails=1`;
        const response = await fetch(nominatimUrl, {
            headers: { 'User-Agent': 'GeminiCLIWeatherApp/1.0' }
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
    let hours = now.getHours();
    const minutes = now.getMinutes();
    let base_time_hours = hours;
    if (minutes < 40) {
        base_time_hours--;
        if (base_time_hours < 0) base_time_hours = 23;
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
    let url = `${KOREA_WEATHER_BASE_URL}?serviceKey=${KOREA_WEATHER_API_KEY}`;
    url += `&pageNo=1&numOfRows=1000&dataType=JSON`;
    url += `&base_date=${base_date}&base_time=${base_time}`;
    url += `&nx=${nx}&ny=${ny}`;

    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`날씨 정보를 가져오지 못했습니다: ${response.statusText}`);
        const data = await response.json();
        console.log('Korea Weather API raw data:', data);
        if (data.response.header.resultCode !== '00') throw new Error(`API 오류: ${data.response.header.resultMsg}`);

        const items = data.response.body.items.item;
        let T1H, REH, WSD, PTY, RN1;
        items.forEach(item => {
            if (item.category === 'T1H') T1H = item.obsrValue;
            if (item.category === 'REH') REH = item.obsrValue;
            if (item.category === 'WSD') WSD = item.obsrValue;
            if (item.category === 'PTY') PTY = item.obsrValue;
            if (item.category === 'RN1') RN1 = item.obsrValue;
        });

        let isRainingValue = false;
        if (PTY && PTY !== '0') isRainingValue = true;
        else if (RN1 && parseFloat(RN1) > 0) isRainingValue = true;

        weatherData = {
            currentTemperature: T1H !== undefined ? Math.round(parseFloat(T1H)) : 20,
            yesterdayTemperature: weatherData.yesterdayTemperature || 17,
            windSpeed: WSD !== undefined ? parseFloat(WSD) : 5,
            humidity: REH !== undefined ? parseFloat(REH) : 60,
            isRaining: isRainingValue,
            fineDustLevel: weatherData.fineDustLevel || 'good',
            dayNightTempDiff: weatherData.dayNightTempDiff || 10,
            location: locationName,
        };
    } catch (error) {
        console.error('날씨 정보를 가져오는 중 오류 발생:', error);
        weatherData = {
            currentTemperature: 20, yesterdayTemperature: 17, windSpeed: 5,
            humidity: 60, isRaining: false, fineDustLevel: 'good',
            dayNightTempDiff: 10, location: locationName,
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

    const tempFilteredOutfits = sourceData.filter(item => {
        if (useMyCloset) return true;
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

    const uniqueCategories = ['outer', 'top', 'bottom'];
    const categoryLabels = { outer: '아우터', top: '상의', bottom: '하의' };

    uniqueCategories.forEach(category => {
        const item = filteredOutfits.find(i => i.category === category);
        if (item) {
            const itemDiv = document.createElement('div');
            itemDiv.className = 'recommendation-item';

            // Get SVG visual
            const svgContent = getClothingSVG(item.name, item.color || itemColors[item.name] || '#888', category, item.imageUrl);
            const current = currentAvatarOutfit[item.category];
            const isWorn = current && current.name === item.name;

            itemDiv.innerHTML = `
                <div class="item-visual visual-${category}">
                    ${svgContent || `<i class="fas fa-${category === 'outer' ? 'vest-patches' : category === 'top' ? 'shirt' : 'socks'}" style="font-size:3rem;opacity:0.4;"></i>`}
                </div>
                <div class="item-info">
                    <span class="item-category-badge badge-${category}">${categoryLabels[category]}</span>
                    <p class="item-name">${item.name}</p>
                    <button class="try-on-button ${isWorn ? 'worn' : ''}" data-item='${JSON.stringify(item)}'>
                        <i class="fas fa-${isWorn ? 'check' : 'shirt'}"></i> ${isWorn ? '착용 중' : '입어보기'}
                    </button>
                </div>
            `;
            recommendationsDiv.appendChild(itemDiv);
        }
    });

    // Bind try-on buttons
    document.querySelectorAll('#recommendations .try-on-button').forEach(button => {
        button.addEventListener('click', (e) => {
            const btn = e.target.closest('button');
            const itemData = JSON.parse(btn.dataset.item);
            tryOnOutfitItem(itemData);
        });
    });
}

function updateApp() {
    const apparentTemp = calculateApparentTemperature(weatherData.currentTemperature, weatherData.windSpeed, weatherData.humidity, selectedBodyType);
    updateWeatherUI(apparentTemp, weatherData);
    getAdvice(apparentTemp, weatherData);
    renderRecommendations(apparentTemp);
}

// --- Event Listeners ---

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

// Avatar controls
avatarResetBtn.addEventListener('click', resetAvatar);
document.querySelectorAll('.slot-remove').forEach(btn => {
    btn.addEventListener('click', (e) => {
        const category = e.currentTarget.dataset.category;
        removeOutfitItem(category);
    });
});

// --- Initialization ---
async function initializeApp() {
    if (localStorage.getItem('darkMode') === 'true') {
        document.body.classList.add('dark-mode');
        darkModeToggle.innerHTML = '<i class="fas fa-sun"></i>';
    }

    await getUserLocationAndFetchWeather();

    const savedCloset = localStorage.getItem('myCloset');
    if (savedCloset) {
        myCloset = JSON.parse(savedCloset);
    }
    renderMyCloset();

    document.querySelector('.gender-selection button[data-gender="male"]').classList.add('active');
    document.querySelector('.style-selection button[data-style="casual"]').classList.add('active');
    document.querySelector('.body-type-selection button[data-body-type="normal"]').classList.add('active');

    updateApp();
    renderAvatar({ outer: null, top: null, bottom: null });
}

window.addEventListener('beforeunload', () => {
    localStorage.setItem('myCloset', JSON.stringify(myCloset));
});

async function getUserLocationAndFetchWeather() {
    let finalLocationName = '서울';
    try {
        const position = await new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject, { enableHighAccuracy: false, timeout: 10000, maximumAge: 0 });
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
        await fetchWeatherData(nx, ny, finalLocationName);
    } catch (error) {
        console.error('위치 정보를 가져오는 데 실패했습니다:', error);
        await fetchWeatherData(55, 127, finalLocationName);
    }
}

document.addEventListener('DOMContentLoaded', initializeApp);