const BRAND_TW_CLASSES = {
  "현대오일뱅크": "bg-blue-500 text-white",
  "S-OIL": "bg-green-500 text-white",
  "알뜰주유소": "bg-gray-500 text-white",
};

const BRAND_IMAGE_MAP = {
  "현대오일뱅크": "hyundai.png",
  "S-OIL": "s-oil.png",
  "알뜰주유소": "altteul.png",
};



function GasBrandIconBox({ brand }) {
  const imageName = BRAND_IMAGE_MAP[brand];
  let imageSrc = null;
  if (imageName) {
    try {
      imageSrc = new URL(`../assets/brands/${imageName}`, import.meta.url).href;
    } catch (e) {
      imageSrc = null;
    }
  }

  const twClass = `${BRAND_TW_CLASSES[brand] || 'bg-gray-300 text-black'} inline-block px-2 py-0.5 rounded-lg font-semibold text-sm mr-2 align-middle`;

  return imageSrc ? (
    <img
      src={imageSrc}
      alt={brand}
      className="h-6 mr-2 align-middle rounded-md bg-white object-contain"
      style={{ background: undefined }}
    />
  ) : (
    <span className={twClass}>{brand}</span>
  );
}

export default GasBrandIconBox;
