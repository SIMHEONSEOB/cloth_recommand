export const clothes = [
  {
    id: 1,
    name: "두꺼운패딩-모자(검은색)",
    category: "outer",
    tempRange: [-10, 5],
    style: "casual",
    imagePath: "images/두꺼운패딩-모자(검은색).png",
    dustAlert: false
  },
  {
    id: 2,
    name: "니트-녹색",
    category: "top",
    tempRange: [5, 15],
    style: "casual",
    imagePath: "images/니트-녹색.png",
    dustAlert: false
  },
  {
    id: 3,
    name: "레큘러핏진(검은색)",
    category: "bottom",
    tempRange: [5, 20],
    style: "casual",
    imagePath: "images/레큘러핏진(검은색).png",
    dustAlert: false
  },
  {
    id: 4,
    name: "갈색팬츠",
    category: "bottom",
    tempRange: [10, 25],
    style: "casual",
    imagePath: "images/갈색팬츠.png",
    dustAlert: false
  },
  {
    id: 5,
    name: "맨투맨-회색",
    category: "top",
    tempRange: [10, 20],
    style: "casual",
    imagePath: "images/맨투맨-회색.png",
    dustAlert: false
  },
  {
    id: 6,
    name: "블랙진",
    category: "bottom",
    tempRange: [15, 25],
    style: "casual",
    imagePath: "images/블랙진.png",
    dustAlert: false
  },
  {
    id: 7,
    name: "스웨터 파란색",
    category: "top",
    tempRange: [5, 15],
    style: "casual",
    imagePath: "images/스웨터 파란색.png",
    dustAlert: false
  },
  {
    id: 8,
    name: "청바지",
    category: "bottom",
    tempRange: [15, 25],
    style: "casual",
    imagePath: "images/청바지.png",
    dustAlert: false
  },
  {
    id: 9,
    name: "기모 추리닝하의-흰색",
    category: "bottom",
    tempRange: [-5, 10],
    style: "casual",
    imagePath: "images/기모 추리닝하의-흰색.png",
    dustAlert: false
  },
  {
    id: 10,
    name: "마스크",
    category: "accessory",
    tempRange: [-20, 40],
    style: "any",
    imagePath: "images/마스크.svg",
    dustAlert: true
  },
  {
    id: 11,
    name: "마스크-추천",
    category: "accessory",
    tempRange: [-20, 40],
    style: "any",
    imagePath: "images/마스크-추천.svg",
    dustAlert: true
  }
];

// 온도별 분류
export const clothesByTemp = {
  veryCold: clothes.filter(item => item.tempRange[1] <= 0), // 매우 추움 (-20°C ~ 0°C)
  cold: clothes.filter(item => item.tempRange[0] <= 5 && item.tempRange[1] >= 0), // 추움 (0°C ~ 5°C)
  cool: clothes.filter(item => item.tempRange[0] >= 5 && item.tempRange[1] <= 15), // 서늘함 (5°C ~ 15°C)
  mild: clothes.filter(item => item.tempRange[0] >= 10 && item.tempRange[1] <= 20), // 온화함 (10°C ~ 20°C)
  warm: clothes.filter(item => item.tempRange[0] >= 15), // 더움 (15°C ~ 40°C)
};

// 카테고리별 분류
export const clothesByCategory = {
  outer: clothes.filter(item => item.category === 'outer'),
  top: clothes.filter(item => item.category === 'top'),
  bottom: clothes.filter(item => item.category === 'bottom'),
  accessory: clothes.filter(item => item.category === 'accessory')
};

// 스타일별 분류
export const clothesByStyle = {
  casual: clothes.filter(item => item.style === 'casual'),
  modern: clothes.filter(item => item.style === 'modern'),
  street: clothes.filter(item => item.style === 'street'),
  any: clothes.filter(item => item.style === 'any')
};

// 미세먼지 경고 필요 아이템
export const dustAlertItems = clothes.filter(item => item.dustAlert);

// 특정 온도에 맞는 옷 추천 함수
export const getClothesByTemp = (temperature) => {
  return clothes.filter(item => 
    temperature >= item.tempRange[0] && temperature <= item.tempRange[1]
  );
};

// 특정 카테고리와 온도에 맞는 옷 추천 함수
export const getClothesByCategoryAndTemp = (category, temperature) => {
  return clothes.filter(item => 
    item.category === category &&
    temperature >= item.tempRange[0] && temperature <= item.tempRange[1]
  );
};

// 미세먼지 경고 시 추천 아이템
export const getDustAlertItems = () => {
  return dustAlertItems;
};
