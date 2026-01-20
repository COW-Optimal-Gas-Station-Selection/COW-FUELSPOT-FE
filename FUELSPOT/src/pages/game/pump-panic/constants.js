export const GAME_CONFIG = {
  INITIAL_MONEY: 1000000,
  BASE_TANK_CAPACITY: 500,
  AUCTION_LOCATIONS: [
    { id: 'city', name: '도심지', traffic: 1.5, type: 'Urban', desc: '손님이 많지만 부지 비용이 비쌉니다.', cost: 500000 },
    { id: 'industrial', name: '산업단지', traffic: 1.0, type: 'Industrial', desc: '경유(Diesel) 수요가 매우 높습니다.', cost: 300000 },
    { id: 'highway', name: '시골길', traffic: 0.6, type: 'Rural', desc: '땅값은 싸지만 가끔 거물 손님이 옵니다.', cost: 100000 },
  ],
  FUEL_TYPES: {
    GASOLINE: { name: '휘발유', color: 'text-green-500', bgColor: 'bg-green-500', borderColor: 'border-green-500' },
    DIESEL: { name: '경유', color: 'text-yellow-500', bgColor: 'bg-yellow-500', borderColor: 'border-yellow-500' }
  },
  MIX_UP_PENALTY: 50000, 
  DAY_DURATION: 60, // 60 seconds per day
  INITIAL_DEBT: 2000000,
  DEBT_INTEREST: 0.2, // 20% interest on remaining debt each day
  UPGRADES: {
    PIPE_EFFICIENCY: { name: '최신형 배관', desc: '주유 속도가 대폭 증가합니다.', cost: 150000 },
    TANK_SIZE: { name: '대용량 지하탱크', desc: '기름 저장 공간이 확장됩니다.', cost: 200000 },
    HIRE_ALBA: { name: '베테랑 주유원', desc: '주유원을 고용하여 자동 주유를 시작합니다.', cost: 500000 },
    BOOMBOX: { name: '80s 붐박스', desc: '신나는 음악으로 손님의 인내심과 팁 확률을 높입니다.', cost: 100000 },
    CONVENIENCE_STORE: { name: '편의점 입점', desc: '주유 외 부가 수익을 창출합니다.', cost: 1000000 }
  }
};
