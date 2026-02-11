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
          // If no refresh token, they were either not logged in or already logged out
          // Just reject the request without reloading everything
          return Promise.reject(error);
        }

        // Use the api instance itself to benefit from baseURL and other configs
        // The interceptor's url check will prevent recursion
        const result = await api.post('/auth/reissue', {
          accessToken: accessToken,
          refreshToken: refreshToken
        });

        // The response interceptor already unwraps result for successful responses
        const { accessToken: newAccessToken, refreshToken: newRefreshToken } = result;

        if (!newAccessToken || !newRefreshToken) {
          throw new Error('Invalid token response structure');
        }

        localStorage.setItem('accessToken', newAccessToken);
        localStorage.setItem('refreshToken', newRefreshToken);

        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        console.error('Token refresh failed:', refreshError.message || refreshError);

        // Only reload if we actually HAD a session that failed to refresh
        if (localStorage.getItem('refreshToken')) {
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          localStorage.removeItem('user');

          if (window.location.pathname !== '/') {
            window.location.href = '/';
          } else {
            window.location.reload();
          }
        }

        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
