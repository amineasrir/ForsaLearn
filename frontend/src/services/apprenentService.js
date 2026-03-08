import API from "../api/axios";

export const registerApprenant = (data) => {
  return API.post("auth/register/visiteur", data);
};