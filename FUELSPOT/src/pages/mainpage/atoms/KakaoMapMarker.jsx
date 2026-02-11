import { useEffect, useRef } from 'react';

// 브랜드 이미지 매핑 (GasBrandIconBox.jsx와 동일)
const BRAND_IMAGE_MAP = {
  "현대오일뱅크": "hyundai.png",
  "S-OIL": "s-oil.png",
  "알뜰주유소": "altteul.png",
  "GS칼텍스": "gs.png",
  "SK에너지": "sk.png",
  SKE: "sk.png",
  SKG: "sk.png",
  GSC: "gs.png",
  HDO: "hyundai.png",
  SOL: "s-oil.png",
  RTE: "altteul.png",
  RTX: "altteul.png",
  RTO: "altteul.png",
  E1G: "E1_LOGO.svg",
  NHO: "nhoil.png",
};

const KakaoMapMarker = ({ mapInstance, position, station, isSelected, selectedFuel, onClick }) => {
  const overlayRef = useRef();

  useEffect(() => {
    if (!mapInstance || !position) return;

    // 현재 유종 가격 찾기
    const fuelKeyMap = {
      gasoline: 'GASOLINE',
      diesel: 'DIESEL',
      premium: 'PREMIUM_GASOLINE',
      lpg: 'LPG',
      kerosene: 'KEROSENE'
    };

    const targetKey = fuelKeyMap[selectedFuel] || 'GASOLINE';
    const priceValue = station.prices?.[targetKey];
    const price = priceValue ? priceValue.toLocaleString() : '-';

    // 브랜드 이미지 경로 생성
    const imageName = BRAND_IMAGE_MAP[station.brand];
    let imageSrc = null;
    if (imageName) {
      imageSrc = new URL(`../../../assets/brands/${imageName}`, import.meta.url).href;
    }

    const content = document.createElement('div');
    content.className = `relative flex flex-col items-center transition-all duration-300 ${isSelected ? 'scale-125 z-[100]' : 'scale-110 hover:scale-120 hover:z-[110]'}`;

    // 마커 박스 HTML
    content.innerHTML = `
      <div style="
        display: flex;
        flex-direction: column;
        align-items: center;
        filter: drop-shadow(0 6px 12px rgba(0,0,0,0.25));
      ">
        <div style="
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 6px 16px 6px 8px;
          background: ${isSelected ? '#155dfc' : 'rgba(255, 255, 255, 0.98)'};
          border-radius: 16px;
          border: 2px solid ${isSelected ? '#155dfc' : '#ffffff'};
          white-space: nowrap;
          transition: all 0.2s;
        ">
          <div style="
            width: 36px;
            height: 36px;
            border-radius: 50%;
            background: white;
            overflow: hidden;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-shrink: 0;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          ">
            ${imageSrc ? `<img src="${imageSrc}" style="width: 26px; height: 26px; object-fit: contain;"/>` : `<span style="font-size: 12px; font-weight: bold; color: #64748b;">${station.brand?.substring(0, 1)}</span>`}
          </div>
          <div style="display: flex; flex-direction: column; align-items: flex-start; gap: 0;">
            <span style="
              font-size: 11px;
              font-weight: 700;
              color: ${isSelected ? 'rgba(255,255,255,0.9)' : '#64748b'};
              line-height: 1.2;
              margin-bottom: 1px;
            ">${station.name}</span>
            <span style="
              font-size: 19px;
              font-weight: 800;
              color: ${isSelected ? 'white' : '#1e293b'};
              letter-spacing: -0.02em;
              line-height: 1;
            ">${price}</span>
          </div>
        </div>
        <div style="
          width: 0;
          height: 0;
          border-left: 9px solid transparent;
          border-right: 9px solid transparent;
          border-top: 9px solid ${isSelected ? '#155dfc' : 'rgba(255, 255, 255, 0.98)'};
          margin-top: -1px;
        "></div>
      </div>
    `;

    content.addEventListener('click', (e) => {
      e.stopPropagation();
      onClick?.(station);
    });

    const overlay = new window.kakao.maps.CustomOverlay({
      position,
      content,
      yAnchor: 1, // 포인터 끝이 위치에 닿도록
      zIndex: isSelected ? 100 : 10
    });

    // 호버 시 z-index 최상단으로 올리기
    content.addEventListener('mouseenter', () => {
      overlay.setZIndex(isSelected ? 110 : 90);
    });
    content.addEventListener('mouseleave', () => {
      overlay.setZIndex(isSelected ? 100 : 10);
    });

    overlay.setMap(mapInstance);
    overlayRef.current = overlay;

    return () => {
      if (overlayRef.current) overlayRef.current.setMap(null);
    };
  }, [mapInstance, position, station, isSelected, selectedFuel, onClick]);

  return null;
};

export default KakaoMapMarker;
