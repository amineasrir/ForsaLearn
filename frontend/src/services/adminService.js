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

export const approveAdminCourse = (courseId) => {
  return API.patch(`admin/courses/${courseId}/approve`);
};

export const getAdminCourseDetails = (courseId) => {
  return API.get(`admin/courses/${courseId}`);
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

export const getAdminUserDetails = (userId) => {
  return API.get(`admin/users/${userId}`);
};

export const approveFormateur = (id) => {
  return API.patch(`admin/formateurs/${id}/approve`);
};

export const rejectFormateur = (id, reason) => {
  return API.patch(`admin/formateurs/${id}/reject`, { reason });
};

export const getAdminConversations = (params = {}) => {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "" && value !== "all") {
      searchParams.append(key, value);
    }
  });

  const query = searchParams.toString();
  return API.get(`messages/conversations${query ? `?${query}` : ""}`);
};

export const getAdminConversationMessages = (conversationId) => {
  return API.get(`messages/conversations/${conversationId}/messages`);
};

export const sendAdminConversationMessage = (conversationId, payload) => {
  return API.post(`messages/conversations/${conversationId}/messages`, payload);
};

export const markAdminConversationAsRead = (conversationId) => {
  return API.patch(`messages/conversations/${conversationId}/read-all`);
};

export const getAdminUnreadMessagesCount = () => {
  return API.get("messages/unread-count");
};

export const pinAdminConversation = (conversationId) => {
  return API.patch(`messages/conversations/${conversationId}/pin`);
};

export const unpinAdminConversation = (conversationId) => {
  return API.patch(`messages/conversations/${conversationId}/unpin`);
};

export const muteAdminConversation = (conversationId) => {
  return API.patch(`messages/conversations/${conversationId}/mute`);
};

export const unmuteAdminConversation = (conversationId) => {
  return API.patch(`messages/conversations/${conversationId}/unmute`);
};

export const archiveAdminConversation = (conversationId) => {
  return API.patch(`messages/conversations/${conversationId}/archive`);
};

export const updateAdminSupportTicketStatus = (conversationId, status) => {
  return API.patch(`messages/support-tickets/${conversationId}/status`, { status });
};
