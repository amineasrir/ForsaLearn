import API from "../api/axios";

export const registerFormateur = (data) => {
  return API.post("auth/register/formateur", data);
};