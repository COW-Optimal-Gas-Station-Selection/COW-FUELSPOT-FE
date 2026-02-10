import api from './axios';

// 제조사(브랜드) 목록 조회
export const getBrands = async () => {
    try {
        const response = await api.get('/cars/brands');
        return response;
    } catch (error) {
        console.error('Failed to fetch brands:', error);
        throw error;
    }
};

// 특정 브랜드의 모델 목록 조회
export const getModels = async (brand) => {
    try {
        const response = await api.get('/cars/models', {
            params: { brand }
        });
        return response;
    } catch (error) {
        console.error('Failed to fetch models:', error);
        throw error;
    }
};
