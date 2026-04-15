export const AUTH_KEYS = {
  token: "authToken",
  user: "authUser",
  adminToken: "adminToken",
  adminUser: "adminUser"
};

export const setAuthSession = ({ token, user }) => {
  if (token) {
    localStorage.setItem(AUTH_KEYS.token, token);
  }

  if (user) {
    localStorage.setItem(AUTH_KEYS.user, JSON.stringify(user));
  }
};

export const getAuthToken = () => {
  return (
    localStorage.getItem(AUTH_KEYS.adminToken) ||
    localStorage.getItem(AUTH_KEYS.token) ||
    localStorage.getItem("token") ||
    localStorage.getItem("apprenentToken")
  );
};

export const getStoredUser = () => {
  const rawUser =
    localStorage.getItem(AUTH_KEYS.adminUser) ||
    localStorage.getItem(AUTH_KEYS.user) ||
    localStorage.getItem("user") ||
    localStorage.getItem("apprenent");

  if (!rawUser) {
    return null;
  }

  try {
    return JSON.parse(rawUser);
  } catch (error) {
    return null;
  }
};

export const clearUserSession = () => {
  localStorage.removeItem(AUTH_KEYS.token);
  localStorage.removeItem(AUTH_KEYS.user);
  localStorage.removeItem(AUTH_KEYS.adminToken);
  localStorage.removeItem(AUTH_KEYS.adminUser);
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  localStorage.removeItem("apprenentToken");
  localStorage.removeItem("apprenent");
};
