import api from './axios';

// 최근 검색어 조회
export const getRecentKeywords = async () => {
    try {
        const response = await api.get('/search/log');
        return response; // ApiResponse<Set<String>>
    } catch (error) {
        console.error('Failed to get recent keywords:', error);
        throw error;
    }
};

// 특정 검색어 삭제
export const deleteKeyword = async (keyword) => {
    try {
        const response = await api.delete('/search/log', {
            params: { keyword }
        });
        return response;
    } catch (error) {
        console.error('Failed to delete keyword:', error);
        throw error;
    }
};

// 전체 검색어 삭제
export const deleteAllKeywords = async () => {
    try {
        const response = await api.delete('/search/log/all');
        return response;
    } catch (error) {
        console.error('Failed to delete all keywords:', error);
        throw error;
    }
};
