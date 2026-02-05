import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});


api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    // If it's a standard ApiResponse, unwrap it if successful
    if (response.data && Object.prototype.hasOwnProperty.call(response.data, 'isSuccess')) {
      if (response.data.isSuccess) {
        return response.data.result;
      }
      return Promise.reject(new Error(response.data.message || '요청 처리에 실패했습니다.'));
    }
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Skip retry for login and refresh token requests
    if (
      error.response && 
      error.response.status === 401 && 
      !originalRequest._retry &&
      !originalRequest.url.includes('/auth/login') &&
      !originalRequest.url.includes('/auth/reissue')
    ) {
      originalRequest._retry = true;

      try {
        const accessToken = localStorage.getItem('accessToken');
        const refreshToken = localStorage.getItem('refreshToken');

        if (!refreshToken) {
          throw new Error('Refresh token not found');
        }
        const response = await axios.post('/api/auth/reissue', {
          accessToken: accessToken,
          refreshToken: refreshToken
        });

        // Backend returns ApiResponse<TokenDto>
        const { accessToken: newAccessToken, refreshToken: newRefreshToken } = response.data.result;

        localStorage.setItem('accessToken', newAccessToken);
        localStorage.setItem('refreshToken', newRefreshToken);

        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(originalRequest);
      } catch (refreshError) {

        console.error('Token refresh failed', refreshError);
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
