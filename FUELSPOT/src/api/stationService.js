
export const stationService = {
  /**
   * 전국의 평균 유가 정보를 가져옵니다.
   */
  getAveragePrices: async () => {
    // 실제 API 연동 시: 
    // const response = await API.get('/api/stations/average-prices');
    // return response.data;

    // 임시 Mock 데이터 반환 (추후 서버 연동 시 위 코드로 교체)
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          gasoline: 1584,
          diesel: 1412,
          premium: 1795,
          updatedAt: new Date().toISOString()
        });
      }, 500);
    });
  }
};
