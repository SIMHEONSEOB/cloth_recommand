// 쿠팡 파트너 기능 - 기본 버전

// 쿠팡 파트너 ID (실제 사용 시 자신의 파트너 ID로 교체)
const COUPANG_PARTNER_ID = 'SEOB0001'; // 실제 파트너스 ID로 교체 필요

// 선택된 의상 정보 가져오기
function getSelectedOutfitItems() {
    const selectedItems = [];
    
    document.querySelectorAll('.outfit-layer.filled').forEach(layer => {
        const itemName = layer.querySelector('.item-name');
        const category = layer.dataset.category;
        
        if (itemName) {
            selectedItems.push({
                name: itemName.textContent,
                category: category
            });
        }
    });
    
    return selectedItems;
}

// 쿠팡 검색 URL 생성
function generateCoupangSearchUrl(itemName) {
    const baseUrl = 'https://www.coupang.com/np/search';
    const query = encodeURIComponent(itemName);
    const component = encodeURIComponent(COUPANG_PARTNER_ID);
    
    return `${baseUrl}?component=${component}&q=${query}`;
}

// 쿠팡 링크 생성
function createCoupangLink(item) {
    const link = document.createElement('a');
    link.href = generateCoupangSearchUrl(item.name);
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.className = 'coupang-link';
    
    link.innerHTML = `
        <div class="coupang-item">
            <div class="coupang-item-info">
                <h4>${item.name}</h4>
                <p class="coupang-category">${getCategoryName(item.category)}</p>
            </div>
            <div class="coupang-item-action">
                <i class="fas fa-external-link-alt"></i>
                <span>쿠팡에서 보기</span>
            </div>
        </div>
    `;
    
    return link;
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

// 쿠팡 검색 결과 표시
function displayCoupangLinks(items) {
    const coupangLinks = document.getElementById('coupang-links');
    
    if (items.length === 0) {
        coupangLinks.innerHTML = '<p class="no-items">선택된 의상이 없습니다. 먼저 의상을 선택해주세요.</p>';
        coupangLinks.classList.remove('hidden');
        return;
    }
    
    coupangLinks.innerHTML = '';
    
    items.forEach(item => {
        const link = createCoupangLink(item);
        coupangLinks.appendChild(link);
    });
    
    coupangLinks.classList.remove('hidden');
}

// 쿠팡 검색 버튼 이벤트 리스너
document.addEventListener('DOMContentLoaded', function() {
    const searchCoupangBtn = document.getElementById('search-coupang');
    
    if (searchCoupangBtn) {
        searchCoupangBtn.addEventListener('click', function() {
            // 로딩 상태 표시
            searchCoupangBtn.classList.add('loading');
            searchCoupangBtn.querySelector('i').className = 'fas fa-spinner';
            searchCoupangBtn.querySelector('span').textContent = '검색 중...';
            
            // 선택된 의상 정보 가져오기
            const selectedItems = getSelectedOutfitItems();
            
            // 잠시 후 결과 표시 (실제로는 API 호출이 필요)
            setTimeout(() => {
                displayCoupangLinks(selectedItems);
                
                // 버튼 상태 복원
                searchCoupangBtn.classList.remove('loading');
                searchCoupangBtn.querySelector('i').className = 'fas fa-shopping-bag';
                searchCoupangBtn.querySelector('span').textContent = '쿠팡에서 구매하기';
            }, 1000);
        });
    }
});

// 쿠팡 파트너 고지사항 추가
function addCoupangDisclaimer() {
    const coupangSection = document.getElementById('coupang-section');
    if (coupangSection) {
        const disclaimer = document.createElement('div');
        disclaimer.className = 'coupang-disclaimer';
        disclaimer.innerHTML = `
            <p><small>
                <i class="fas fa-info-circle"></i>
                이 포스팅은 쿠팡 파트너스 활동의 일환으로, 이에 따른 일정액의 수수료를 제공받습니다.
            </small></p>
        `;
        coupangSection.appendChild(disclaimer);
    }
}

// 페이지 로드 시 고지사항 추가
document.addEventListener('DOMContentLoaded', addCoupangDisclaimer);
