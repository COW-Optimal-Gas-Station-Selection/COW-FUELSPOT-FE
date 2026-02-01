import api from './axios';

// 즐겨찾기 목록 조회
export const getFavorites = async () => {
    try {
        const response = await api.get('/favorites');
        return response.data;
    } catch (error) {
        console.error('Failed to fetch favorites:', error);
        throw error;
    }
};

// 즐겨찾기 추가
export const addFavorite = async (stationId) => {
    try {
        const response = await api.post('/favorites', { stationId });
        return response.data;
    } catch (error) {
        console.error('Failed to add favorite:', error);
        throw error;
    }
};

// 즐겨찾기 삭제
export const removeFavorite = async (stationId) => {
    try {
        await api.delete(`/favorites/${stationId}`);
    } catch (error) {
        console.error('Failed to remove favorite:', error);
        throw error;
    }
};
