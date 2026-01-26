// 각 주유소별 즐겨찾기 수를 임의로 생성한 mock 데이터
// 실제 API가 없으므로 프론트에서 임시로 사용
import { STATIONS } from '../../../constants/stations'

// id: 즐겨찾기 수
export const mockFavoriteCounts = STATIONS.reduce((acc, station) => {
  acc[station.id] = Math.floor(Math.random() * 100) + 1 // 1~100명 랜덤
  return acc
}, {})
