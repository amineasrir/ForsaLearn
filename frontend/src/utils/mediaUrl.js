const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

export const getMediaUrl = (path) => {
  if (!path) return path;
  if (typeof path !== 'string') return path;
  if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('data:')) {
    return path;
  }
  if (path.startsWith('/')) {
    return `${API_BASE_URL}${path}`;
  }
  return `${API_BASE_URL}/${path}`;
};
