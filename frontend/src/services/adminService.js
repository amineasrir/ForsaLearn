import API from "../api/axios";

export const adminLogin = (data) => {
  return API.post("auth/login/admin", data);
};

export const getAdminProfile = () => {
  return API.get("auth/me");
};

export const getAdminDashboardStats = () => {
  return API.get("admin/dashboard/stats");
};

export const getAdminRevenue = (period = "month") => {
  return API.get(`admin/dashboard/revenue?period=${period}`);
};

export const getAdminCourses = (params = {}) => {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "" && value !== "all") {
      searchParams.append(key, value);
    }
  });

  const query = searchParams.toString();
  return API.get(`admin/courses${query ? `?${query}` : ""}`);
};

export const deleteAdminCourse = (courseId) => {
  return API.delete(`admin/courses/${courseId}`);
};

export const getAdminUsers = (params = {}) => {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "" && value !== "all") {
      searchParams.append(key, value);
    }
  });

  const query = searchParams.toString();
  return API.get(`admin/users${query ? `?${query}` : ""}`);
};

export const getPendingFormateurs = () => {
  return API.get("admin/formateurs/pending");
};

export const approveFormateur = (id) => {
  return API.patch(`admin/formateurs/${id}/approve`);
};

export const rejectFormateur = (id, reason) => {
  return API.patch(`admin/formateurs/${id}/reject`, { reason });
};
