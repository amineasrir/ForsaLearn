import API from "../api/axios";

export const registerFormateur = (data) => {
  const config =
    typeof FormData !== "undefined" && data instanceof FormData
      ? {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      : undefined;

  return API.post("auth/register/formateur", data, config);
};

export const loginFormateur = (data) => {
  return API.post("auth/login", data);
};

export const checkFormateurApproval = () => {
  return API.get("formateur/check-approval");
};

export const getFormateurProfile = () => {
  return API.get("formateur/profile");
};

export const updateFormateurProfile = (payload) => {
  return API.put("formateur/profile", payload);
};

export const getFormateurDashboardStats = () => {
  return API.get("formateur/dashboard/stats");
};

export const getFormateurRevenue = (period = "month") => {
  return API.get(`formateur/dashboard/revenue?period=${period}`);
};

export const getFormateurCourses = (params = {}) => {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "" && value !== "all") {
      searchParams.append(key, value);
    }
  });

  const query = searchParams.toString();
  return API.get(`formateur/courses${query ? `?${query}` : ""}`);
};

export const getFormateurCourse = (courseId) => {
  return API.get(`formateur/courses/${courseId}`);
};

export const createFormateurCourse = (payload) => {
  return API.post("formateur/courses", payload);
};

export const uploadCourseVideo = (videoFile) => {
  const formData = new FormData();
  formData.append('video', videoFile);
  return API.post("upload/course/video", formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
};

export const uploadCourseThumbnail = (thumbnailFile) => {
  const formData = new FormData();
  formData.append('thumbnail', thumbnailFile);
  return API.post("upload/course/thumbnail", formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
};

export const updateFormateurCourse = (courseId, payload) => {
  return API.put(`formateur/courses/${courseId}`, payload);
};

export const saveFormateurCourseSections = (courseId, sections) => {
  return API.put(`formateur/courses/${courseId}`, { sections });
};

export const deleteFormateurCourse = (courseId) => {
  return API.delete(`formateur/courses/${courseId}`);
};

export const archiveFormateurCourse = (courseId) => {
  return API.patch(`formateur/courses/${courseId}/archive`);
};

export const getFormateurStudents = () => {
  return API.get("formateur/students");
};

export const getFormateurReviews = () => {
  return API.get("formateur/reviews");
};

export const getFormateurCourseAnalytics = (courseId) => {
  return API.get(`formateur/courses/${courseId}/analytics`);
};

export const getFormateurEarnings = () => {
  return API.get("payment/formateur/earnings");
};

export const getFormateurCertificates = () => {
  return API.get("certificate/instructor/issued");
};

export const getFormateurConversations = (params = {}) => {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "" && value !== "all") {
      searchParams.append(key, value);
    }
  });

  const query = searchParams.toString();
  return API.get(`messages/conversations${query ? `?${query}` : ""}`);
};

export const getFormateurConversationMessages = (conversationId) => {
  return API.get(`messages/conversations/${conversationId}/messages`);
};

export const createFormateurSupportTicket = (payload) => {
  return API.post('messages/conversations', {
    type: 'support',
    subject: payload.subject,
    category: payload.category,
    priority: payload.priority,
    initialMessage: payload.message
  });
};

export const updateFormateurSupportTicketStatus = (conversationId, status) => {
  return API.patch(`messages/support-tickets/${conversationId}/status`, { status });
};

export const sendFormateurConversationMessage = (conversationId, payload) => {
  return API.post(`messages/conversations/${conversationId}/messages`, payload);
};

export const markFormateurConversationAsRead = (conversationId) => {
  return API.patch(`messages/conversations/${conversationId}/read-all`);
};

export const getFormateurUnreadCount = () => {
  return API.get("messages/unread-count");
};
