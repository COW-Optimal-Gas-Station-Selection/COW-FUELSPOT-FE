import React from "react";

export enum FUEL_TYPE {
  GASOLINE = '휘발유',
  DIESEL = '경유',
  PREMIUM = '고급휘발유',
}

type FuelType = FUEL_TYPE.GASOLINE | FUEL_TYPE.DIESEL | FUEL_TYPE.PREMIUM;

const FUEL_STYLE: Record<FuelType, { bg: string; label: string; price: string }> = {
  [FUEL_TYPE.GASOLINE]: {
    bg: 'bg-[#fafbe7]',
    label: 'text-[#b6a000]',
    price: 'text-[#e09c00]',
  },
  [FUEL_TYPE.DIESEL]: {
    bg: 'bg-[#e7faed]',
    label: 'text-[#00b66d]',
    price: 'text-[#00b66d]',
  },
  [FUEL_TYPE.PREMIUM]: {
    bg: 'bg-[#f7e7fa]',
    label: 'text-[#a000b6]',
    price: 'text-[#a000b6]',
  },
};

interface FuelPriceBoxProps {
  fuelType: FuelType;
  price: number;
}

const FuelPriceBox: React.FC<FuelPriceBoxProps> = ({ fuelType, price }) => {
  const style = FUEL_STYLE[fuelType] || FUEL_STYLE[FUEL_TYPE.GASOLINE];
  return (
    <div className={`${style.bg} rounded-xl p-4 min-w-[120px] text-center shadow-sm`}>
      <div className={`${style.label} font-bold text-base`}>{fuelType}</div>
      <div className={`${style.price} font-bold text-2xl`}>{price}원</div>
    </div>
  );
};

export default FuelPriceBox;
