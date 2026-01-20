import React from "react";

export enum FUEL_TYPE {
  GASOLINE = '휘발유',
  DIESEL = '경유',
  PREMIUM = '고급휘발유',
}

type FuelType = FUEL_TYPE.GASOLINE | FUEL_TYPE.DIESEL | FUEL_TYPE.PREMIUM;

const FUEL_STYLE: Record<FuelType, { bg: string; label: string; price: string; border: string }> = {
  [FUEL_TYPE.GASOLINE]: {
    bg: 'bg-[#fefce8]',
    border: 'border-[#fef08a]',
    label: 'text-[#71717a]',
    price: 'text-[#a65f00]',
  },
  [FUEL_TYPE.DIESEL]: {
    bg: 'bg-[#f0fdf4]',
    border: 'border-[#bbf7d0]',
    label: 'text-[#71717a]',
    price: 'text-[#008236]',
  },
  [FUEL_TYPE.PREMIUM]: {
    bg: 'bg-[#faf5ff]',
    border: 'border-[#f3e8ff]',
    label: 'text-[#71717a]',
    price: 'text-[#8200db]',
  },
};

interface FuelPriceBoxProps {
  fuelType: FuelType;
  price: number;
}

const FuelPriceBox: React.FC<FuelPriceBoxProps> = ({ fuelType, price }) => {
  const style = FUEL_STYLE[fuelType] || FUEL_STYLE[FUEL_TYPE.GASOLINE];
  return (
    <div className={`${style.bg} ${style.border} border rounded-lg p-3 flex flex-col items-start gap-1 transition-all hover:shadow-md cursor-default`}>
      <span className={`${style.label} text-[11px] font-medium uppercase tracking-tight`}>
        {fuelType}
      </span>
      <div className="flex items-baseline gap-0.5">
        <span className={`${style.price} font-bold text-lg leading-none`}>
          {price.toLocaleString()}
        </span>
        <span className={`${style.label} text-xs font-normal`}>원</span>
      </div>
    </div>
  );
};

export default FuelPriceBox;
