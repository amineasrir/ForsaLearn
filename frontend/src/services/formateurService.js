import API from "../api/axios";

export const registerFormateur = (data) => {
  return API.post("auth/register/formateur", data);
};

export const checkFormateurApproval = () => { 
  const token = localStorage.getItem("token");
  return API.get("formateur/check-approval", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}