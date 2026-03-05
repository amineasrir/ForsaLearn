import API from "../api/axios";

export const adminLogin = (data) => {
  return API.post("auth/login/admin", data);
};