export const validateNickname = (nickname) => ({
  isLengthValid: nickname.length >= 2 && nickname.length <= 10
});

export const validateEmail = (email) => ({
  isEmailFormat: email.length > 0 && email.includes('@') && email.includes('.')
});

export const validatePassword = (password) => ({
  isLengthValid: password.length >= 8,
  isComplexValid: password.length > 0 && 
    /[A-Za-z]/.test(password) && 
    /\d/.test(password) && 
    /[@$!%*#?&]/.test(password)
});

export const validateConfirmPassword = (password, confirmPassword) => ({
  isMatch: confirmPassword.length > 0 && password === confirmPassword
});
