// 내 정보 조회
export const getMyInfo = async () => {
  try {
    const response = await api.get('/members/me');
    return response.data;
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data || '내 정보 조회 중 오류가 발생했습니다.');
    } else if (error.request) {
      throw new Error('서버와 연결할 수 없습니다. 네트워크 상태를 확인해주세요.');
    } else {
      throw new Error('요청 설정 중 오류가 발생했습니다.');
    }
  }
};

// 내 정보 수정
export const updateMyInfo = async (updateData) => {
  try {
    const response = await api.patch('/members/me', updateData);
    return response.data;
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data || '내 정보 수정 중 오류가 발생했습니다.');
    } else if (error.request) {
      throw new Error('서버와 연결할 수 없습니다. 네트워크 상태를 확인해주세요.');
    } else {
      throw new Error('요청 설정 중 오류가 발생했습니다.');
    }
  }
};
import api from './axios';

export const signup = async (signupData) => {
  try {
    const response = await api.post('/members', signupData);
    return response.data;
  } catch (error) {
    if (error.response) {
      // 서버가 응답을 보냈으나 에러 상태인 경우
      throw new Error(error.response.data || '회원가입 중 오류가 발생했습니다.');
    } else if (error.request) {
      // 요청이 전송되었으나 응답을 받지 못한 경우
      throw new Error('서버와 연결할 수 없습니다. 네트워크 상태를 확인해주세요.');
    } else {
      // 그 외 설정 중 에러 발생
      throw new Error('요청 설정 중 오류가 발생했습니다.');
    }
  }
};

export const login = async (loginData) => {
  try {
    const response = await api.post('/auth/login', loginData);
    return response.data;
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data || '로그인 중 오류가 발생했습니다.');
    } else if (error.request) {
      throw new Error('서버와 연결할 수 없습니다. 네트워크 상태를 확인해주세요.');
    } else {
      throw new Error('요청 설정 중 오류가 발생했습니다.');
    }
  }
};

export const deleteAccount = async () => {
  try {
    const response = await api.delete('/members/me');
    return response.data;
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data || '회원 탈퇴 중 오류가 발생했습니다.');
    } else if (error.request) {
      throw new Error('서버와 연결할 수 없습니다. 네트워크 상태를 확인해주세요.');
    } else {
      throw new Error('요청 설정 중 오류가 발생했습니다.');
    }
  }
};
