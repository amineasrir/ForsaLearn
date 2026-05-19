import defaultAvatar from "../assets/image/student/ava.jpg";
import { getMediaUrl } from "./mediaUrl";

const extractAvatarValue = (source) => {
  if (!source) {
    return "";
  }

  if (typeof source === "string") {
    return source.trim();
  }

  return String(
    source.profilePicture ||
      source.profileImage ||
      source.avatar ||
      source.image ||
      ""
  ).trim();
};

export const getUserAvatar = (source, fallback = defaultAvatar) => {
  const avatarValue = extractAvatarValue(source);

  if (
    !avatarValue ||
    avatarValue === "default-avatar.jpg" ||
    avatarValue === "default-avatar"
  ) {
    return fallback;
  }

  if (
    avatarValue.startsWith("http://") ||
    avatarValue.startsWith("https://") ||
    avatarValue.startsWith("data:") ||
    avatarValue.startsWith("blob:") ||
    avatarValue.startsWith("/static/")
  ) {
    return avatarValue;
  }

  return getMediaUrl(avatarValue);
};

export { defaultAvatar };
