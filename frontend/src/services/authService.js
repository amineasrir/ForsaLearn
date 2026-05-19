import API from "../api/axios";

export const requestPasswordReset = (payload) => {
  return API.post("auth/forgot-password", payload);
};

export const verifyPasswordResetOtp = (payload) => {
  return API.post("auth/verify-reset-otp", payload);
};

export const resetPasswordWithOtp = (payload) => {
  return API.post("auth/reset-password", payload);
};

export const loginUser = (payload) => {
  return API.post("auth/login", payload);
};
