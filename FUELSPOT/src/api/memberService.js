import api from './axios';

export const signup = async (signupData) => {
  try {
    const response = await api.post('/members', signupData);
    return response.data;
  } catch (error) {
    if (error.response) {

      throw new Error(error.response.data || '회원가입 중 오류가 발생했습니다.');
    } else if (error.request) {

      throw new Error('서버와 연결할 수 없습니다. 네트워크 상태를 확인해주세요.');
    } else {

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

export const logout = async () => {
  try {
    const response = await api.post('/auth/logout');
    return response.data;
  } catch (error) {

    console.error('Logout error:', error);
    throw error;
  }
};

// 내 정보 조회
export const getMyInfo = async () => {
  try {
    const response = await api.get('/members/me');
    return response.data;
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.message || '내 정보 조회 중 오류가 발생했습니다.');
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
      throw new Error(error.response.data.message || '내 정보 수정 중 오류가 발생했습니다.');
    } else {
      throw new Error('요청 설정 중 오류가 발생했습니다.');
    }
  }
};

// 비밀번호 변경
export const changePassword = async (passwordData) => {
  try {
    const response = await api.patch('/members/password', passwordData);
    return response.data;
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.message || '비밀번호 변경 중 오류가 발생했습니다.');
    } else {
      throw new Error('요청 설정 중 오류가 발생했습니다.');
    }
  }
};

// 비밀번호 찾기: 인증 코드 발송
export const sendVerificationCode = async (emailRequest) => {
  try {
    const response = await api.post('/auth/email/send', emailRequest);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data || '인증 코드 발송 중 오류가 발생했습니다.');
  }
};

// 비밀번호 찾기: 인증 코드 검증
export const verifyCode = async (verificationRequest) => {
  try {
    const response = await api.post('/auth/email/verify', verificationRequest);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data || '인증 코드 검증 중 오류가 발생했습니다.');
  }
};

// 비밀번호 찾기: 비밀번호 재설정
export const resetPassword = async (resetRequest) => {
  try {
    const response = await api.post('/auth/password/reset', resetRequest);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data || '비밀번호 재설정 중 오류가 발생했습니다.');
  }
};

export const deleteAccount = async () => {
  try {
    const response = await api.delete('/members/me');
    return response.data;
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.message || '회원 탈퇴 중 오류가 발생했습니다.');
    } else {
      throw new Error('요청 설정 중 오류가 발생했습니다.');
    }
  }
};
