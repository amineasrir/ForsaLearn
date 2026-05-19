import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import ApprenantLayout from "../../components/apprenant/ApprenantLayout";
import {
  getApprenantProfile,
  updateApprenantProfile,
} from "../../services/apprenentService";
import { getUserAvatar } from "../../utils/userAvatar";
import "./apprenant.css";

const defaultFormData = {
  fullName: "",
  phoneNumber: "",
  gender: "prefer-not-to-say",
  bio: "",
  interests: "",
  skillsNeeded: "",
};

const toCommaSeparated = (value) =>
  Array.isArray(value) ? value.join(", ") : "";

const toArray = (value) =>
  String(value || "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

const createFormDataFromUser = (user) => ({
  fullName: user?.fullName || "",
  phoneNumber: user?.phoneNumber || "",
  gender: user?.gender || "prefer-not-to-say",
  bio: user?.bio || "",
  interests: toCommaSeparated(user?.interests),
  skillsNeeded: toCommaSeparated(user?.skillsNeeded),
});

const formatGender = (value, t) => {
  const labels = {
    male: t("apprenant.genderMale", "Male"),
    female: t("apprenant.genderFemale", "Female"),
    other: t("apprenant.genderOther", "Other"),
    "prefer-not-to-say": t("apprenant.genderPreferNotToSay", "Prefer not to say"),
  };

  return labels[value] || t("apprenant.notSpecified", "Not specified");
};

const ApprenantProfile = () => {
  const { t } = useTranslation();
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState(defaultFormData);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    let isMounted = true;

    const loadProfile = async () => {
      try {
        setLoading(true);
        setError("");
        const response = await getApprenantProfile();
        const loadedUser = response.data?.user || null;

        if (!isMounted) {
          return;
        }

        setUser(loadedUser);
        setFormData(createFormDataFromUser(loadedUser));
      } catch (requestError) {
        if (isMounted) {
          setError(
            requestError.response?.data?.message ||
            t("apprenant.profileLoadError", "Failed to load profile.")
          );
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadProfile();

    return () => {
      isMounted = false;
    };
  }, [t]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleEditToggle = () => {
    setSuccess("");
    setError("");

    if (editMode) {
      setFormData(createFormDataFromUser(user));
    }

    setEditMode((prev) => !prev);
  };

  const handleCancel = () => {
    setFormData(createFormDataFromUser(user));
    setEditMode(false);
    setError("");
    setSuccess("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      const payload = {
        fullName: formData.fullName.trim(),
        phoneNumber: formData.phoneNumber.trim(),
        gender: formData.gender,
        bio: formData.bio.trim(),
        interests: toArray(formData.interests),
        skillsNeeded: toArray(formData.skillsNeeded),
      };

      const response = await updateApprenantProfile(payload);
      const updatedUser = response.data?.user || null;

      setUser(updatedUser);
      setFormData(createFormDataFromUser(updatedUser));
      setEditMode(false);
      setSuccess(
        t("apprenant.profileSaved", "Profile updated successfully.")
      );
    } catch (requestError) {
      setError(
        requestError.response?.data?.message ||
        t("apprenant.profileSaveError", "Failed to update profile.")
      );
    } finally {
      setSaving(false);
    }
  };

  const profileData = {
    fullName: user?.fullName || t("apprenant.student", "Student"),
    registrationDate: user?.createdAt
      ? new Date(user.createdAt).toLocaleString()
      : t("apprenant.na", "N/A"),
    phone: user?.phoneNumber || t("apprenant.na", "N/A"),
    email: user?.email || t("apprenant.na", "N/A"),
    gender: formatGender(user?.gender, t),
    interests:
      toCommaSeparated(user?.interests) || t("apprenant.na", "N/A"),
    skillsNeeded:
      toCommaSeparated(user?.skillsNeeded) || t("apprenant.na", "N/A"),
    bio: user?.bio || t("apprenant.noBio", "No bio available."),
  };

  if (loading) {
    return (
      <ApprenantLayout>
        <div className="profile-page-content">
          <div className="profile-details">
            <p className="value">
              {t("apprenant.loadingProfile", "Loading profile...")}
            </p>
          </div>
        </div>
      </ApprenantLayout>
    );
  }

  return (
    <ApprenantLayout>
      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}

      <div className="profile-page-content">
        <h2 className="profile-title">
          {t("apprenant.myProfile")}

        </h2>

        <div className="profile-header-info" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '2rem' }}>
          <img 
            src={getUserAvatar(user)} 
            alt="Profile Avatar" 
            style={{ width: '100px', height: '100px', borderRadius: '50%', objectFit: 'cover', border: '3px solid var(--primary)', backgroundColor: 'var(--bg-secondary)' }} 
          />
          <div>
            <h3 style={{ margin: 0, fontSize: '1.5rem' }}>{profileData.fullName}</h3>
            <p style={{ margin: '0.25rem 0 0', color: 'var(--muted)' }}>{profileData.email}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="profile-details">
            <div>
              <label>{t("apprenant.fullName")}</label>
              {editMode ? (
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                />
              ) : (
                <p className="value">{profileData.fullName}</p>
              )}
            </div>

            <div>
              <label>{t("apprenant.registrationDate")}</label>
              <p className="value">{profileData.registrationDate}</p>
            </div>

            <div>
              <label>{t("apprenant.phoneNumber")}</label>
              {editMode ? (
                <input
                  type="text"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                />
              ) : (
                <p className="value">{profileData.phone}</p>
              )}
            </div>

            <div>
              <label>{t("email", "Email")}</label>
              <p className="value">{profileData.email}</p>
            </div>

            <div>
              <label>{t("apprenant.gender")}</label>
              {editMode ? (
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                >
                  <option value="prefer-not-to-say">
                    {t("apprenant.genderPreferNotToSay", "Prefer not to say")}
                  </option>
                  <option value="male">{t("apprenant.genderMale", "Male")}</option>
                  <option value="female">
                    {t("apprenant.genderFemale", "Female")}
                  </option>
                  <option value="other">{t("apprenant.genderOther", "Other")}</option>
                </select>
              ) : (
                <p className="value">{profileData.gender}</p>
              )}
            </div>

            <div>
              <label>{t("apprenant.interests", "Interests")}</label>
              {editMode ? (
                <input
                  type="text"
                  name="interests"
                  value={formData.interests}
                  onChange={handleChange}
                  placeholder={t(
                    "apprenant.interestsPlaceholder",
                    "UI/UX, AI, Design"
                  )}
                />
              ) : (
                <p className="value">{profileData.interests}</p>
              )}
            </div>

            <div>
              <label>{t("apprenant.learningGoals", "Learning Goals")}</label>
              {editMode ? (
                <input
                  type="text"
                  name="skillsNeeded"
                  value={formData.skillsNeeded}
                  onChange={handleChange}
                  placeholder={t(
                    "apprenant.skillsNeededPlaceholder",
                    "React, Node.js, English"
                  )}
                />
              ) : (
                <p className="value">{profileData.skillsNeeded}</p>
              )}
            </div>

            <div>
              <label>{t("apprenant.bio")}</label>
              {editMode ? (
                <textarea
                  name="bio"
                  rows="4"
                  value={formData.bio}
                  onChange={handleChange}
                />
              ) : (
                <p className="value">{profileData.bio}</p>
              )}
            </div>
          </div>

          {editMode && (
            <div className="profile-actions">
              <button
                type="button"
                className="cancel-btn"
                onClick={handleCancel}
              >
                {t("apprenant.cancel", "Cancel")}
              </button>
              <button type="submit" className="save-btn" disabled={saving}>
                {saving
                  ? t("apprenant.saving", "Saving...")
                  : t("apprenant.saveChanges", "Save Changes")}
              </button>
            </div>
          )}
        </form>
      </div>
    </ApprenantLayout>
  );
};

export default ApprenantProfile;
