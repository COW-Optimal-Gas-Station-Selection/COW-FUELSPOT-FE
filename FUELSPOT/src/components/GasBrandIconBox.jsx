const BRAND_TW_CLASSES = {
  "현대오일뱅크": "bg-blue-500 text-white",
  "S-OIL": "bg-green-500 text-white",
  "알뜰주유소": "bg-gray-500 text-white",
  ETC: "bg-gray-300 text-black",
};

// 브랜드 코드/이름 → assets/brands 파일명
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

function GasBrandIconBox({ brand }) {
  if (!brand) return null;

  const imageName = BRAND_IMAGE_MAP[brand];
  let imageSrc = null;
  if (imageName) {
    try {
      imageSrc = new URL(`../assets/brands/${imageName}`, import.meta.url).href;
    } catch (e) {
      imageSrc = null;
    }
  }

  const twClass = `${BRAND_TW_CLASSES[brand] || "bg-gray-300 text-black"} inline-flex items-center justify-center min-w-[2.25rem] h-6 px-2 py-0.5 rounded-lg font-semibold text-xs mr-2 shrink-0`;

  return imageSrc ? (
    <span className="inline-flex items-center justify-center h-7 w-9 shrink-0 mr-2 rounded-md overflow-hidden bg-white border border-gray-100">
      <img
        src={imageSrc}
        alt={brand}
        className="h-5 w-full object-contain"
      />
    </span>
  ) : (
    <span className={twClass}>{brand}</span>
  );
}

export default GasBrandIconBox;
