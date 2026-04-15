import API from "../api/axios";

export const registerFormateur = (data) => {
  return API.post("auth/register/formateur", data);
};

export const loginFormateur = (data) => {
  return API.post("auth/login", data);
};

export const checkFormateurApproval = () => { 
  return API.get("formateur/check-approval");
};
