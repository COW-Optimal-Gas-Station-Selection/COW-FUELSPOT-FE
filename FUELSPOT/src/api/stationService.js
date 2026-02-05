import api from './axios';

/**
 * 근처 주유소 조회
 * @param {Object} params { lat, lon, radius }
 */
export const getNearbyStations = async (params) => {
    try {
        const response = await api.get('/gas-stations/nearby', { params });
        return response;
    } catch (error) {
        console.error('Failed to fetch nearby stations:', error);
        throw error;
    }
};

/**
 * 주유소 필터 조회
 * @param {Object} params { lat, lon, radius, fuelType, brand, isCarWash, isStore }
 */
export const getFilteredStations = async (params) => {
    try {
        const response = await api.get('/gas-stations/filter', { params });
        return response;
    } catch (error) {
        console.error('Failed to fetch filtered stations:', error);
        throw error;
    }
};

/**
 * 주유소 상세 정보 조회
 * @param {string} stationId 
 */
export const getStationDetail = async (stationId) => {
    try {
        const response = await api.get(`/gas-stations/${stationId}`);
        return response;
    } catch (error) {
        console.error('Failed to fetch station detail:', error);
        throw error;
    }
};

/**
 * 장소 검색
 * @param {string} keyword 
 */
export const searchPlaces = async (keyword) => {
    try {
        const response = await api.get('/map/search', { params: { keyword } });
        return response;
    } catch (error) {
        console.error('Failed to search places:', error);
        throw error;
    }
};

/**
 * 경로 조회
 * @param {string} origin "127.123,37.123"
 * @param {string} destination "127.456,37.456"
 */
export const getDirections = async (origin, destination) => {
    try {
        const response = await api.get('/map/direction', {
            params: { origin, destination }
        });
        return response;
    } catch (error) {
        console.error('Failed to fetch directions:', error);
        throw error;
    }
};

/**
 * 좌표를 주소로 변환
 * @param {number} lat 
 * @param {number} lon 
 */
export const getAddressFromCoords = async (lat, lon) => {
    try {
        const response = await api.get('/map/address', {
            params: { x: lon, y: lat }
        });
        return response;
    } catch (error) {
        console.error('Failed to get address from coords:', error);
        throw error;
    }
};

/**
 * 전국 평균 유가 조회
 */
export const getAveragePrices = async () => {
    try {
        const response = await api.get('/gas-stations/average');
        return response;
    } catch (error) {
        console.error('Failed to fetch average prices:', error);
        throw error;
    }
};

/**
 * 시도별 평균 유가 조회
 * @param {string} sido "SEOUL", "GYEONGGI", etc.
 */
export const getSidoAveragePrices = async (sido) => {
    try {
        const response = await api.get('/gas-stations/average/sido', { params: { sido } });
        return response;
    } catch (error) {
        console.error('Failed to fetch sido average prices:', error);
        throw error;
    }
};
