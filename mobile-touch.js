// 모바일 터치 이벤트 보정 및 반응형 개선

// 터치 이벤트 최적화
class TouchOptimizer {
    constructor() {
        this.touchStartX = 0;
        this.touchStartY = 0;
        this.touchEndX = 0;
        this.touchEndY = 0;
        this.swipeThreshold = 50;
        this.longPressThreshold = 500;
        this.longPressTimer = null;
        this.isLongPress = false;
        
        this.init();
    }
    
    init() {
        this.setupTouchEvents();
        this.setupButtonOptimization();
        this.setupScrollOptimization();
        this.setupViewportOptimization();
    }
    
    // 터치 이벤트 설정
    setupTouchEvents() {
        // 의상 레이어 터치 이벤트
        document.querySelectorAll('.outfit-layer').forEach(layer => {
            this.setupLayerTouchEvents(layer);
        });
        
        // 버튼 터치 이벤트
        document.querySelectorAll('button').forEach(button => {
            this.setupButtonTouchEvents(button);
        });
        
        // 추천 아이템 터치 이벤트
        document.querySelectorAll('.recommendation-item').forEach(item => {
            this.setupRecommendationTouchEvents(item);
        });
    }
    
    // 레이어 터치 이벤트 설정
    setupLayerTouchEvents(layer) {
        // 터치 시작
        layer.addEventListener('touchstart', (e) => {
            this.touchStartX = e.touches[0].clientX;
            this.touchStartY = e.touches[0].clientY;
            this.isLongPress = false;
            
            // 롱프레스 타이머 설정
            this.longPressTimer = setTimeout(() => {
                this.isLongPress = true;
                this.handleLongPress(layer);
            }, this.longPressThreshold);
            
            // 시각적 피드백
            layer.style.transform = 'scale(0.98)';
            layer.style.transition = 'transform 0.1s ease';
        }, { passive: true });
        
        // 터치 이동
        layer.addEventListener('touchmove', (e) => {
            this.touchEndX = e.touches[0].clientX;
            this.touchEndY = e.touches[0].clientY;
            
            // 롱프레스 타이머 취소
            if (this.longPressTimer) {
                clearTimeout(this.longPressTimer);
                this.longPressTimer = null;
            }
        }, { passive: true });
        
        // 터치 종료
        layer.addEventListener('touchend', (e) => {
            layer.style.transform = '';
            
            // 롱프레스 타이머 취소
            if (this.longPressTimer) {
                clearTimeout(this.longPressTimer);
                this.longPressTimer = null;
            }
            
            if (!this.isLongPress) {
                // 탭 이벤트 처리
                const deltaX = this.touchEndX - this.touchStartX;
                const deltaY = this.touchEndY - this.touchStartY;
                
                if (Math.abs(deltaX) < 10 && Math.abs(deltaY) < 10) {
                    this.handleLayerTap(layer);
                } else {
                    // 스와이프 이벤트 처리
                    this.handleSwipe(layer, deltaX, deltaY);
                }
            }
            
            this.isLongPress = false;
        }, { passive: true });
    }
    
    // 버튼 터치 이벤트 설정
    setupButtonTouchEvents(button) {
        button.addEventListener('touchstart', (e) => {
            button.style.transform = 'scale(0.95)';
            button.style.transition = 'transform 0.1s ease';
        }, { passive: true });
        
        button.addEventListener('touchend', (e) => {
            button.style.transform = '';
        }, { passive: true });
        
        // 더블탭 방지
        let lastTap = 0;
        button.addEventListener('touchend', (e) => {
            const currentTime = new Date().getTime();
            const tapLength = currentTime - lastTap;
            if (tapLength < 100 && tapLength > 0) {
                e.preventDefault();
            }
            lastTap = currentTime;
        }, { passive: false });
    }
    
    // 추천 아이템 터치 이벤트 설정
    setupRecommendationTouchEvents(item) {
        let startY = 0;
        let currentY = 0;
        let isDragging = false;
        
        item.addEventListener('touchstart', (e) => {
            startY = e.touches[0].clientY;
            isDragging = false;
            item.style.transition = 'none';
        }, { passive: true });
        
        item.addEventListener('touchmove', (e) => {
            currentY = e.touches[0].clientY;
            const deltaY = currentY - startY;
            
            if (Math.abs(deltaY) > 10) {
                isDragging = true;
                item.style.transform = `translateY(${deltaY * 0.5}px)`;
            }
        }, { passive: true });
        
        item.addEventListener('touchend', (e) => {
            item.style.transition = '';
            item.style.transform = '';
            
            if (!isDragging) {
                // 탭 이벤트 처리
                const addButton = item.querySelector('.add-to-outfit-btn');
                if (addButton) {
                    addButton.click();
                }
            }
        }, { passive: true });
    }
    
    // 롱프레스 처리
    handleLongPress(layer) {
        // 진동 피드백 (지원되는 경우)
        if (navigator.vibrate) {
            navigator.vibrate(50);
        }
        
        // 롱프레스 메뉴 표시
        this.showLongPressMenu(layer);
    }
    
    // 롱프레스 메뉴 표시
    showLongPressMenu(layer) {
        const menu = document.createElement('div');
        menu.className = 'long-press-menu';
        menu.innerHTML = `
            <button class="menu-item" onclick="clearLayer('${layer.id}')">
                <i class="fas fa-trash"></i> 비우기
            </button>
            <button class="menu-item" onclick="showLayerInfo('${layer.id}')">
                <i class="fas fa-info"></i> 정보
            </button>
        `;
        
        // 메뉴 위치 설정
        const rect = layer.getBoundingClientRect();
        menu.style.position = 'fixed';
        menu.style.top = `${rect.bottom + 10}px`;
        menu.style.left = `${rect.left}px`;
        menu.style.zIndex = '1000';
        
        document.body.appendChild(menu);
        
        // 메뉴 외부 클릭 시 닫기
        setTimeout(() => {
            document.addEventListener('click', function closeMenu() {
                menu.remove();
                document.removeEventListener('click', closeMenu);
            });
        }, 100);
    }
    
    // 레이어 탭 처리
    handleLayerTap(layer) {
        // 기존 탭 이벤트 처리
        if (layer.classList.contains('filled')) {
            // 의상 제거 버튼 시뮬레이션
            const removeBtn = layer.querySelector('.remove-item-btn');
            if (removeBtn) {
                removeBtn.click();
            }
        }
    }
    
    // 스와이프 처리
    handleSwipe(layer, deltaX, deltaY) {
        if (Math.abs(deltaX) > Math.abs(deltaY)) {
            // 수평 스와이프
            if (deltaX > this.swipeThreshold) {
                console.log('오른쪽 스와이프');
            } else if (deltaX < -this.swipeThreshold) {
                console.log('왼쪽 스와이프');
            }
        } else {
            // 수직 스와이프
            if (deltaY > this.swipeThreshold) {
                console.log('아래쪽 스와이프');
            } else if (deltaY < -this.swipeThreshold) {
                console.log('위쪽 스와이프');
            }
        }
    }
    
    // 버튼 최적화
    setupButtonOptimization() {
        // 버튼 최소 크기 설정
        const buttons = document.querySelectorAll('button');
        buttons.forEach(button => {
            const rect = button.getBoundingClientRect();
            if (rect.width < 44 || rect.height < 44) {
                button.style.minWidth = '44px';
                button.style.minHeight = '44px';
            }
        });
        
        // 버튼 간격 최적화
        const buttonGroups = document.querySelectorAll('.gender-selection, .style-selection, .situation-selection');
        buttonGroups.forEach(group => {
            const buttons = group.querySelectorAll('button');
            buttons.forEach(button => {
                button.style.margin = '4px';
            });
        });
    }
    
    // 스크롤 최적화
    setupScrollOptimization() {
        // 스크롤 성능 최적화
        let scrollTimeout;
        window.addEventListener('scroll', () => {
            if (scrollTimeout) {
                window.cancelAnimationFrame(scrollTimeout);
            }
            
            scrollTimeout = window.requestAnimationFrame(() => {
                // 스크롤 관련 처리
                this.updateScrollPosition();
            });
        }, { passive: true });
    }
    
    // 스크롤 위치 업데이트
    updateScrollPosition() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // 헤더 고정 처리
        const header = document.querySelector('header');
        if (header) {
            if (scrollTop > 100) {
                header.style.position = 'fixed';
                header.style.top = '0';
                header.style.left = '0';
                header.style.right = '0';
                header.style.zIndex = '100';
                header.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
            } else {
                header.style.position = '';
                header.style.top = '';
                header.style.left = '';
                header.style.right = '';
                header.style.zIndex = '';
                header.style.boxShadow = '';
            }
        }
    }
    
    // 뷰포트 최적화
    setupViewportOptimization() {
        // 뷰포트 메타 태그 설정
        const viewport = document.querySelector('meta[name="viewport"]');
        if (!viewport) {
            const meta = document.createElement('meta');
            meta.name = 'viewport';
            meta.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no';
            document.head.appendChild(meta);
        }
        
        // 화면 방향 변경 감지
        window.addEventListener('orientationchange', () => {
            setTimeout(() => {
                this.adjustLayoutForOrientation();
            }, 100);
        });
    }
    
    // 화면 방향에 따른 레이아웃 조정
    adjustLayoutForOrientation() {
        const orientation = window.orientation;
        const isLandscape = Math.abs(orientation) === 90;
        
        if (isLandscape) {
            // 가로 모드 레이아웃
            document.querySelector('.outfit-visualization').style.gridTemplateColumns = 'repeat(4, 1fr)';
            document.querySelector('.controls').style.flexDirection = 'row';
        } else {
            // 세로 모드 레이아웃
            document.querySelector('.outfit-visualization').style.gridTemplateColumns = 'repeat(2, 1fr)';
            document.querySelector('.controls').style.flexDirection = 'column';
        }
    }
}

// 전역 함수
function clearLayer(layerId) {
    const layer = document.getElementById(layerId);
    if (layer && layer.classList.contains('filled')) {
        const removeBtn = layer.querySelector('.remove-item-btn');
        if (removeBtn) {
            removeBtn.click();
        }
    }
}

function showLayerInfo(layerId) {
    const layer = document.getElementById(layerId);
    if (layer) {
        const itemName = layer.querySelector('.item-name');
        const categoryName = layer.querySelector('.layer-label');
        
        if (itemName) {
            alert(`카테고리: ${categoryName.textContent}\n아이템: ${itemName.textContent}`);
        } else {
            alert(`카테고리: ${categoryName.textContent}\n상태: 비어있음`);
        }
    }
}

// 초기화
document.addEventListener('DOMContentLoaded', () => {
    new TouchOptimizer();
});

// CSS 추가
const mobileCSS = `
/* 롱프레스 메뉴 */
.long-press-menu {
    background: white;
    border-radius: 8px;
    box-shadow: 0 4px 20px rgba(0,0,0,0.15);
    padding: 8px;
    min-width: 150px;
    animation: fadeInUp 0.3s ease;
}

.menu-item {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px 12px;
    border: none;
    background: none;
    width: 100%;
    text-align: left;
    border-radius: 4px;
    cursor: pointer;
    transition: background 0.2s ease;
}

.menu-item:hover {
    background: #f0f0f0;
}

/* 모바일 최적화 */
@media (max-width: 768px) {
    .controls {
        flex-direction: column;
        gap: 16px;
    }
    
    .control-group {
        width: 100%;
    }
    
    .gender-selection,
    .style-selection,
    .situation-selection {
        justify-content: space-between;
        flex-wrap: wrap;
    }
    
    .gender-selection button,
    .style-selection button,
    .situation-selection button {
        flex: 1;
        min-width: 60px;
        margin: 2px;
    }
    
    .recommendations-grid {
        grid-template-columns: 1fr;
        gap: 12px;
    }
    
    .coupang-section {
        margin-top: 16px;
    }
}

@media (max-width: 480px) {
    .header-container {
        flex-direction: column;
        text-align: center;
        gap: 16px;
    }
    
    .weather-info {
        text-align: center;
    }
    
    .ai-advisor-btn {
        width: 100%;
        padding: 16px;
        font-size: 1rem;
    }
    
    .coupang-btn {
        width: 100%;
        padding: 14px;
        font-size: 1rem;
    }
}
`;

// CSS 스타일시트에 추가
const styleSheet = document.createElement('style');
styleSheet.textContent = mobileCSS;
document.head.appendChild(styleSheet);
