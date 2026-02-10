import React from "react";

export enum FUEL_TYPE {
  GASOLINE = '휘발유',
  DIESEL = '경유',
  PREMIUM_GASOLINE = '고급휘발유',
  LPG = '자동차부탄',
  KEROSENE = '실내등유',
}

type FuelType = FUEL_TYPE.GASOLINE | FUEL_TYPE.DIESEL | FUEL_TYPE.PREMIUM_GASOLINE | FUEL_TYPE.LPG | FUEL_TYPE.KEROSENE;

const FUEL_STYLE: Record<FuelType, { accent: string }> = {
  [FUEL_TYPE.GASOLINE]: { accent: 'border-l-blue-400' },
  [FUEL_TYPE.DIESEL]: { accent: 'border-l-cyan-500' },
  [FUEL_TYPE.PREMIUM_GASOLINE]: { accent: 'border-l-indigo-400' },
  [FUEL_TYPE.LPG]: { accent: 'border-l-slate-400' },
  [FUEL_TYPE.KEROSENE]: { accent: 'border-l-orange-400' },
};

interface FuelPriceBoxProps {
  fuelType: FuelType;
  price: number;
}

const FuelPriceBox: React.FC<FuelPriceBoxProps> = ({ fuelType, price }) => {
  const style = FUEL_STYLE[fuelType] || FUEL_STYLE[FUEL_TYPE.GASOLINE];
  return (
    <div className={`bg-white border border-gray-100 border-l-4 ${style.accent} rounded-lg p-3 flex flex-col items-start gap-1 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-sm hover:border-gray-200 cursor-default shadow-sm`}>
      <span className="text-gray-500 text-[11px] font-medium uppercase tracking-tight">
        {fuelType}
      </span>
      <div className="flex items-baseline gap-0.5">
        <span className="text-gray-900 font-bold text-lg leading-none tracking-tight">
          {price.toLocaleString()}
        </span>
        <span className="text-gray-500 text-xs font-normal">원</span>
      </div>
    </div>
  );
};

export default FuelPriceBox;
