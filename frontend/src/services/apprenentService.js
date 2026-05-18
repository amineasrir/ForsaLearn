import API from "../api/axios";

export const registerApprenant = (data) => {
  return API.post("auth/register/visiteur", data);
};

export const loginApprenant = (data) => {
  return API.post("auth/login", data);
};

export const getApprenantProfile = () => {
  return API.get("auth/me");
};

export const updateApprenantProfile = (data) => {
  return API.put("visiteurs/profile", data);
};

export const getPublishedCourses = (params = {}) => {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "" && value !== "all") {
      searchParams.append(key, value);
    }
  });

  const query = searchParams.toString();
  return API.get(`courses${query ? `?${query}` : ""}`);
};

export const getCourseDetails = (courseId) => {
  return API.get(`courses/${courseId}`);
};

export const enrollInCourse = (courseId) => {
  return API.post(`courses/${courseId}/enroll`);
};

export const getEnrolledCourses = () => {
  return API.get("courses/student/my-courses");
};

export const getMyQuizAttempts = () => {
  return API.get("courses/student/quiz-attempts");
};

export const submitQuizAttempt = (courseId, lessonId, answers) => {
  return API.post(`courses/${courseId}/quizzes/${lessonId}/submit`, { answers });
};

export const getMyCertificates = () => {
  return API.get("certificate/my-certificates");
};

export const getCertificateDownloadUrl = (certificateId) => {
  return API.get(`certificate/download/${certificateId}`);
};

export const getMyPayments = () => {
  return API.get("payment/my-payments");
};

export const getConversations = (params = {}) => {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      searchParams.append(key, value);
    }
  });

  const query = searchParams.toString();
  return API.get(`messages/conversations${query ? `?${query}` : ""}`);
};

export const getConversationMessages = (conversationId, params = {}) => {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      searchParams.append(key, value);
    }
  });

  const query = searchParams.toString();
  return API.get(`messages/conversations/${conversationId}/messages${query ? `?${query}` : ""}`);
};

export const sendConversationMessage = (conversationId, payload) => {
  return API.post(`messages/conversations/${conversationId}/messages`, payload);
};

export const markConversationAsRead = (conversationId) => {
  return API.patch(`messages/conversations/${conversationId}/read-all`);
};

export const getCourseComments = (courseId) => {
  return API.get(`courses/${courseId}/comments`);
};

export const postCourseComment = (courseId, data) => {
  return API.post(`courses/${courseId}/comments`, data);
};

export const deleteCourseComment = (courseId, commentId) => {
  return API.delete(`courses/${courseId}/comments/${commentId}`);
};
