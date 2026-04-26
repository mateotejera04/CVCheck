import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { RxCrossCircled, RxCross1, RxCross2 } from "react-icons/rx";
import { useResumeData } from "../Contexts/ResumeDataContext";
import RichTextInput from "../Components/RichTextInput";
import { GoLocation } from "react-icons/go";
import { GiBookCover } from "react-icons/gi";
import { GrTechnology } from "react-icons/gr";
import { FaCopy } from "react-icons/fa";
import { BsArrowClockwise } from "react-icons/bs";
import {
  FiUser,
  FiBookOpen,
  FiBarChart2,
  FiBriefcase,
  FiCalendar,
  FiAward,
  FiPhone,
  FiMail,
  FiGithub,
  FiLinkedin,
  FiMapPin,
  FiGlobe,
  FiCamera,
  FiUpload,
} from "react-icons/fi";
import {
  FaCheckCircle,
  FaLink,
  FaGithub,
  FaPlus,
  FaArrowRight,
  FaBookReader,
  FaArrowLeft,
  FaRegUser,
} from "react-icons/fa";
import { TbWorld } from "react-icons/tb";
import showSuccessToast from "../Components/showSuccessToast";
import { createResume, updateUserProfileImage } from "../db/database"; // 🔥 Firestore function
import { enhance } from "../utils/ai";
import { FaWandMagicSparkles } from "react-icons/fa6"; // AI icon
import { uploadProfileImage } from "../services/fileStorage";
import { useLocale } from "../Contexts/LocaleContext";

const ResumeForm = () => {
  const navigate = useNavigate();
  const { locale, t } = useLocale();
  const steps = t("resumeForm.steps", []);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiSuggestion, setAiSuggestion] = useState("");

  const [aiLoadingField, setAiLoadingField] = useState(null);
  const [aiSuggestions, setAiSuggestions] = useState({});
  const [imageUploading, setImageUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);

  const getNestedValue = (obj, path) => {
    return path
      .split(/[\.\[\]]/)
      .filter(Boolean)
      .reduce((acc, key) => acc?.[key], obj);
  };

  const handleEnhanceField = async (fieldKey) => {
    const value = getNestedValue(formData, fieldKey);
    if (!value) return;

    setAiLoadingField(fieldKey);
    const result = await enhance(value, locale);

    setAiSuggestions((prev) => ({ ...prev, [fieldKey]: result }));
    setAiLoadingField(null);
  };

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      setImageUploading(true);

      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => setImagePreview(e.target.result);
      reader.readAsDataURL(file);

      // Upload to Appwrite
      const uploadResult = await uploadProfileImage(file, t);

      // Update form data with image URL
      setFormData((prev) => ({ ...prev, imgUrl: uploadResult.fileUrl }));

      // Save to Firebase user profile
      await updateUserProfileImage(uploadResult.fileUrl);

      toast.success(t("resumeForm.profileImageUploaded"));
    } catch (error) {
      console.error("Image upload error:", error);
      toast.error(error.message || t("resumeForm.imageUploadFailed"));
      setImagePreview(null);
    } finally {
      setImageUploading(false);
    }
  };

  const [step, setStep] = useState(0);

  const defaultResumeData = {
    name: "",
    headline: "",
    description: "",
    imgUrl: "",
    education: {
      college: "",
      degree: "",
      specialization: "",
      location: "",
      startYear: "",
      endYear: "",
      cgpa: "",
      school: "",
      tenth: "",
      twelfth: "",
    },
    skills: [{ domain: "", languages: [""] }],
    projects: [{ name: "", description: "", github: "", demo: "" }],
    experience: [
      {
        company: "",
        role: "",
        technologies: "",
        years: "",
        description: "",
      },
    ],
    achievements: [{ title: "", description: "", year: "", month: "" }],
    contact: {
      phone: "",
      email: "",
      github: "",
      linkedin: "",
      location: "",
      websiteURL: "",
    },
  };

  const { resume, setResume } = useResumeData();

  const [formData, setFormData] = useState(() => resume || defaultResumeData);

  // Initialize image preview with existing image URL
  useEffect(() => {
    if (formData.imgUrl && !imagePreview) {
      setImagePreview(formData.imgUrl);
    }
  }, [formData.imgUrl, imagePreview]);

  const handleChange = (e, path) => {
    const keys = path.split(".");
    const updated = { ...formData };
    let curr = updated;
    keys.forEach((key, i) => {
      if (i === keys.length - 1) curr[key] = e.target.value;
      else curr = curr[key];
    });
    setFormData(updated);
    setResume(updated);
  };

  const addItem = (section, domainIndex = null) => {
    if (section === "skills") {
      if (domainIndex !== null) {
        const updatedSkills = [...formData.skills];
        updatedSkills[domainIndex].languages.push("");
        setFormData({ ...formData, skills: updatedSkills });
      } else {
        const newDomain = { domain: "", languages: [""] };
        setFormData({ ...formData, skills: [...formData.skills, newDomain] });
      }
    } else {
      const newItem =
        section === "projects"
          ? { name: "", description: "", github: "", demo: "" }
          : section === "experience"
          ? {
              company: "",
              role: "",
              technologies: "",
              years: "",
              description: "",
            }
          : { title: "", description: "", year: "", month: "" };

      setFormData({ ...formData, [section]: [...formData[section], newItem] });
    }
  };

  const handleSkillChange = (domainIndex, langIndex, value) => {
    const updatedSkills = [...formData.skills];
    updatedSkills[domainIndex].languages[langIndex] = value;
    setFormData({ ...formData, skills: updatedSkills });
  };

  const handleDomainChange = (index, value) => {
    const updatedSkills = [...formData.skills];
    updatedSkills[index].domain = value;
    setFormData({ ...formData, skills: updatedSkills });
  };

  const handleArrayChange = (section, index, field, value) => {
    const updated = [...formData[section]];
    updated[index][field] = value;
    setFormData({ ...formData, [section]: updated });
  };

  const handleSingleChange = (section, field, value) => {
    setFormData({
      ...formData,
      [section]: {
        ...formData[section],
        [field]: value,
      },
    });
  };

  const removeItem = (section, index) => {
    if (!Array.isArray(formData[section])) return;
    const updatedSection = [...formData[section]];
    updatedSection.splice(index, 1);
    setFormData((prev) => ({ ...prev, [section]: updatedSection }));
  };

  const removeSkill = (domainIndex, langIndex) => {
    const updatedSkills = [...formData.skills];
    updatedSkills[domainIndex].languages.splice(langIndex, 1);
    if (updatedSkills[domainIndex].languages.length === 0) {
      updatedSkills.splice(domainIndex, 1);
    }
    setFormData({ ...formData, skills: updatedSkills });
  };

  const nextStep = () => {
    if (step === 0 && !formData.name.trim())
      return toast.error(t("resumeForm.requiredName"));
    setStep((prev) => Math.min(prev + 1, steps.length - 1));
  };

  const prevStep = () => setStep((prev) => Math.max(prev - 1, 0));

  const saveResumeToFirebase = async () => {
    try {
      await createResume(formData);
      setResume(formData);
      showSuccessToast(t("resumeForm.saved"));
      navigate("/resume");
    } catch (err) {
      toast.error(t("resumeForm.saveFailed"));
      console.error("Firestore error:", err.message);
    }
  };

  const renderStep = () => {
    switch (step) {
      // Personal Info
      case 0:
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-8"
          >
            {/* Full Name */}
            <div className="relative group">
              <label className="flex items-center gap-2 text-[11px] uppercase tracking-[0.18em] text-[color:var(--text-muted)] mb-2">
                <FiUser className="text-[color:var(--text-primary)]" />
                {t("resumeForm.labels.name")} *
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder={t("resumeForm.placeholders.name")}
                  value={formData.name}
                  onChange={(e) => handleChange(e, "name")}
                  className="w-full pl-10 pr-3 py-3 border border-[color:var(--border-hairline)] rounded-xl focus:outline-none focus:border-[color:var(--text-primary)] focus:ring-2 focus:ring-[color:var(--accent-ring)] text-sm text-[color:var(--text-primary)] bg-[color:var(--surface-card)]"
                />
                <FiUser className="absolute left-4 top-4 text-gray-400 group-focus-within:text-[color:var(--text-primary)] transition-colors" />
              </div>
            </div>

            {/* Headline / Subtitle */}
            <div className="relative group">
              <label className="block text-[11px] uppercase tracking-[0.18em] text-[color:var(--text-muted)] mb-2">
                {t("resumeForm.labels.headline")}
              </label>
              <input
                type="text"
                placeholder={t("resumeForm.placeholders.headline")}
                value={formData.headline || ""}
                onChange={(e) => handleChange(e, "headline")}
                className="w-full px-3 py-3 border border-[color:var(--border-hairline)] rounded-xl focus:outline-none focus:border-[color:var(--text-primary)] focus:ring-2 focus:ring-[color:var(--accent-ring)] text-sm text-[color:var(--text-primary)] bg-[color:var(--surface-card)]"
              />
              <p className="text-xs text-gray-500 mt-1">
                {t("resumeForm.headlineHint")}
              </p>
            </div>

            {/* Description Field */}
            <div className="relative group">
              <label className="block text-[11px] uppercase tracking-[0.18em] text-[color:var(--text-muted)] mb-2">
                {t("resumeForm.labels.summary")}
              </label>

              <div className="relative">
                <RichTextInput
                  value={formData.description}
                  onChange={(html) =>
                    handleChange({ target: { value: html } }, "description")
                  }
                  placeholder={t("resumeForm.placeholders.summary")}
                />

                {/* Enhanced AI Button */}
                <motion.button
                  type="button"
                  title={t("resumeForm.enhanceWithAi")}
                  disabled={aiLoadingField === "description"}
                  onClick={() => handleEnhanceField("description")}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="absolute -top-3 right-2 p-2 rounded-full bg-[color:var(--text-primary)] hover:bg-[color:var(--accent-hover)] text-[color:var(--surface-base)] shadow-sm transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {aiLoadingField === "description" ? (
                    <BsArrowClockwise className="text-lg animate-spin" />
                  ) : (
                    <FaWandMagicSparkles className="text-lg animate-pulse" />
                  )}
                </motion.button>
              </div>

              {/* AI Suggestion */}
              {aiSuggestions["description"] && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4 p-4 bg-[color:var(--accent-soft)] border border-[color:var(--border-hairline)] rounded-xl relative"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <FaWandMagicSparkles className="text-[color:var(--text-primary)]" />
                    <span className="text-sm font-semibold text-[color:var(--text-primary)]">
                      {t("resumeForm.aiSuggestion")}
                    </span>
                  </div>
                  <p
                    className="text-sm text-[color:var(--text-secondary)] leading-relaxed"
                    dangerouslySetInnerHTML={{
                      __html: aiSuggestions["description"],
                    }}
                  />
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="absolute top-3 right-3 p-2 bg-[color:var(--text-primary)] hover:bg-[color:var(--accent-hover)] text-[color:var(--surface-base)] rounded-lg transition-colors"
                    title={t("resumeForm.applyEnhancement")}
                    onClick={() => {
                      handleChange(
                        { target: { value: aiSuggestions["description"] } },
                        "description"
                      );
                      setAiSuggestions((prev) => ({
                        ...prev,
                        description: "",
                      }));
                    }}
                  >
                    <FaCopy size={14} />
                  </motion.button>
                </motion.div>
              )}
            </div>

            {/* Profile Photo Upload */}
            <div className="relative group">
              <label className="flex items-center gap-2 text-[11px] uppercase tracking-[0.18em] text-[color:var(--text-muted)] mb-2">
                <FiCamera className="text-[color:var(--text-primary)]" />
                {t("resumeForm.labels.profilePhoto")}
              </label>

              <div className="flex items-center gap-4">
                {/* Photo Preview */}
                <div className="w-20 h-20 rounded-full border-2 border-gray-200 overflow-hidden bg-gray-50 flex items-center justify-center">
                  {imagePreview || formData.imgUrl ? (
                    <img
                      src={imagePreview || formData.imgUrl}
                      alt={t("profile.avatarAlt")}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <FiUser className="text-gray-400 text-2xl" />
                  )}
                </div>

                {/* Upload Button */}
                <div className="flex-1">
                  <input
                    type="file"
                    id="profile-photo"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    disabled={imageUploading}
                  />
                  <label
                    htmlFor="profile-photo"
                    className={`inline-flex items-center gap-2 px-4 py-3 border-2 border-dashed border-[color:var(--border-hairline)] rounded-xl cursor-pointer hover:border-[color:var(--text-primary)] hover:bg-[color:var(--accent-soft)] transition-all duration-300 ${
                      imageUploading ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                  >
                    {imageUploading ? (
                      <>
                        <BsArrowClockwise className="text-[color:var(--text-primary)] animate-spin" />
                        <span className="text-sm text-gray-600">
                          {t("resumeForm.uploadingPhoto")}
                        </span>
                      </>
                    ) : (
                      <>
                        <FiUpload className="text-[color:var(--text-primary)]" />
                        <span className="text-sm text-gray-600">
                          {formData.imgUrl ? t("resumeForm.changePhoto") : t("resumeForm.uploadPhoto")}
                        </span>
                      </>
                    )}
                  </label>
                  <p className="text-xs text-gray-500 mt-1">
                    {t("resumeForm.photoHint")}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        );

      // Education
      case 1:
        return (
          <div className="space-y-5">
            {/* College Name */}
            <div className="relative">
              <label
                htmlFor="college"
                className="block text-[11px] uppercase tracking-[0.18em] text-[color:var(--text-muted)] mb-2"
              >
                {t("resumeForm.labels.college")}
              </label>
              <FiBookOpen className="absolute top-9 left-3 text-gray-500 text-sm" />
              <input
                id="college"
                type="text"
                placeholder={t("resumeForm.placeholders.college")}
                value={formData.education.college}
                onChange={(e) => handleChange(e, "education.college")}
                className="w-full pl-10 pr-3 py-2.5 border border-[color:var(--border-hairline)] rounded-lg focus:outline-none focus:border-[color:var(--text-primary)] focus:ring-2 focus:ring-[color:var(--accent-ring)] text-sm text-[color:var(--text-primary)] bg-[color:var(--surface-card)]"
              />
            </div>

            <div className="relative">
              <label
                htmlFor="college"
                className="block text-[11px] uppercase tracking-[0.18em] text-[color:var(--text-muted)] mb-2"
              >
                {t("resumeForm.labels.degree")}
              </label>
              <FaBookReader className="absolute top-9 left-3 text-gray-500 text-sm" />
              <input
                id="college"
                type="text"
                placeholder={t("resumeForm.placeholders.degree")}
                value={formData.education.degree}
                onChange={(e) => handleChange(e, "education.degree")}
                className="w-full pl-10 pr-3 py-2.5 border border-[color:var(--border-hairline)] rounded-lg focus:outline-none focus:border-[color:var(--text-primary)] focus:ring-2 focus:ring-[color:var(--accent-ring)] text-sm text-[color:var(--text-primary)] bg-[color:var(--surface-card)]"
              />
            </div>

            <div className="relative">
              <label
                htmlFor="college"
                className="block text-[11px] uppercase tracking-[0.18em] text-[color:var(--text-muted)] mb-2"
              >
                {t("resumeForm.labels.specialization")}
              </label>
              <GiBookCover className="absolute top-9 left-3 text-gray-500 text-sm" />
              <input
                id="college"
                type="text"
                placeholder={t("resumeForm.placeholders.specialization")}
                value={formData.education.specialization}
                onChange={(e) => handleChange(e, "education.specialization")}
                className="w-full pl-10 pr-3 py-2.5 border border-[color:var(--border-hairline)] rounded-lg focus:outline-none focus:border-[color:var(--text-primary)] focus:ring-2 focus:ring-[color:var(--accent-ring)] text-sm text-[color:var(--text-primary)] bg-[color:var(--surface-card)]"
              />
            </div>

            <div className="relative">
              <label
                htmlFor="college"
                className="block text-[11px] uppercase tracking-[0.18em] text-[color:var(--text-muted)] mb-2"
              >
                {t("resumeForm.labels.location")}
              </label>
              <GoLocation className="absolute top-9 left-3 text-gray-500 text-sm" />
              <input
                id="college"
                type="text"
                placeholder={t("resumeForm.placeholders.collegeLocation")}
                value={formData.education.location}
                onChange={(e) => handleChange(e, "education.location")}
                className="w-full pl-10 pr-3 py-2.5 border border-[color:var(--border-hairline)] rounded-lg focus:outline-none focus:border-[color:var(--text-primary)] focus:ring-2 focus:ring-[color:var(--accent-ring)] text-sm text-[color:var(--text-primary)] bg-[color:var(--surface-card)]"
              />
            </div>

            {/* Start & End Year */}
            <div className="flex gap-4">
              <div className="flex-1 relative">
                <label
                  htmlFor="startYear"
                  className="block text-[11px] uppercase tracking-[0.18em] text-[color:var(--text-muted)] mb-2"
                >
                  {t("resumeForm.labels.startYear")}
                </label>
                <FiCalendar className="absolute top-9 left-3 text-gray-500 text-sm" />
                <input
                  id="startYear"
                  type="text"
                  placeholder={t("resumeForm.placeholders.startYear")}
                  value={formData.education.startYear}
                  onChange={(e) => handleChange(e, "education.startYear")}
                  className="w-full pl-10 pr-3 py-2.5 border border-[color:var(--border-hairline)] rounded-lg focus:outline-none focus:border-[color:var(--text-primary)] focus:ring-2 focus:ring-[color:var(--accent-ring)] text-sm text-[color:var(--text-primary)] bg-[color:var(--surface-card)]"
                />
              </div>
              <div className="flex-1 relative">
                <label
                  htmlFor="endYear"
                  className="block text-[11px] uppercase tracking-[0.18em] text-[color:var(--text-muted)] mb-2"
                >
                  {t("resumeForm.labels.endYear")}
                </label>
                <FiCalendar className="absolute top-9 left-3 text-gray-500 text-sm" />
                <input
                  id="endYear"
                  type="text"
                  placeholder={t("resumeForm.placeholders.endYear")}
                  value={formData.education.endYear}
                  onChange={(e) => handleChange(e, "education.endYear")}
                  className="w-full pl-10 pr-3 py-2.5 border border-[color:var(--border-hairline)] rounded-lg focus:outline-none focus:border-[color:var(--text-primary)] focus:ring-2 focus:ring-[color:var(--accent-ring)] text-sm text-[color:var(--text-primary)] bg-[color:var(--surface-card)]"
                />
              </div>
            </div>

            {/* CGPA */}
            <div className="relative">
              <label
                htmlFor="cgpa "
                className="block text-[11px] uppercase tracking-[0.18em] text-[color:var(--text-muted)] mb-2"
              >
                {t("resumeForm.labels.cgpa")}
              </label>
              <FiBarChart2 className="absolute top-9 left-3 text-gray-500 text-sm" />
              <input
                id="cgpa"
                type="text"
                placeholder={t("resumeForm.placeholders.cgpa")}
                value={formData.education.cgpa}
                onChange={(e) => handleChange(e, "education.cgpa")}
                className="w-full pl-10 pr-3 py-2.5 border border-[color:var(--border-hairline)] rounded-lg focus:outline-none focus:border-[color:var(--text-primary)] focus:ring-2 focus:ring-[color:var(--accent-ring)] text-sm text-[color:var(--text-primary)] bg-[color:var(--surface-card)]"
              />
            </div>

            {/* School Name */}
            <div className="relative">
              <label
                htmlFor="school"
                className="block text-[11px] uppercase tracking-[0.18em] text-[color:var(--text-muted)] mb-2"
              >
                {t("resumeForm.labels.school")}
              </label>
              <FiBookOpen className="absolute top-9 left-3 text-gray-500 text-sm" />
              <input
                id="school"
                type="text"
                placeholder={t("resumeForm.placeholders.school")}
                value={formData.education.school}
                onChange={(e) => handleChange(e, "education.school")}
                className="w-full pl-10 pr-3 py-2.5 border border-[color:var(--border-hairline)] rounded-lg focus:outline-none focus:border-[color:var(--text-primary)] focus:ring-2 focus:ring-[color:var(--accent-ring)] text-sm text-[color:var(--text-primary)] bg-[color:var(--surface-card)]"
              />
            </div>

            <div className="flex flex-row gap-4">
              {/* 10th Percentage */}
              <div className="relative flex-1">
                <label
                  htmlFor="tenth"
                  className="block text-[11px] uppercase tracking-[0.18em] text-[color:var(--text-muted)] mb-2"
                >
                  {t("resumeForm.labels.tenth")}
                </label>
                <FiBarChart2 className="absolute top-9 left-3 text-gray-500 text-sm" />
                <input
                  id="tenth"
                  type="text"
                  placeholder={t("resumeForm.placeholders.tenth")}
                  value={formData.education.tenth}
                  onChange={(e) => handleChange(e, "education.tenth")}
                  className="w-full pl-10 pr-3 py-2.5 border border-[color:var(--border-hairline)] rounded-lg focus:outline-none focus:border-[color:var(--text-primary)] focus:ring-2 focus:ring-[color:var(--accent-ring)] text-sm text-[color:var(--text-primary)] bg-[color:var(--surface-card)]"
                />
              </div>

              {/* 12th Percentage */}
              <div className="relative flex-1">
                <label
                  htmlFor="twelfth"
                  className="block text-[11px] uppercase tracking-[0.18em] text-[color:var(--text-muted)] mb-2"
                >
                  {t("resumeForm.labels.twelfth")}
                </label>
                <FiBarChart2 className="absolute top-9 left-3 text-gray-500 text-sm" />
                <input
                  id="twelfth"
                  type="text"
                  placeholder={t("resumeForm.placeholders.twelfth")}
                  value={formData.education.twelfth}
                  onChange={(e) => handleChange(e, "education.twelfth")}
                  className="w-full pl-10 pr-3 py-2.5 border border-[color:var(--border-hairline)] rounded-lg focus:outline-none focus:border-[color:var(--text-primary)] focus:ring-2 focus:ring-[color:var(--accent-ring)] text-sm text-[color:var(--text-primary)] bg-[color:var(--surface-card)]"
                />
              </div>
            </div>
          </div>
        );

      // Skills
      case 2:
        return (
          <div className="space-y-6">
            {formData.skills.map((skill, domainIndex) => (
              <div
                key={domainIndex}
                className="border border-[color:var(--border-hairline)] bg-[color:var(--surface-card)] p-5 rounded-2xl"
              >
                {/* Domain Header */}
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-sm font-medium text-[color:var(--text-primary)]">
                    {t("resumeForm.cards.skillDomain")} {domainIndex + 1}
                  </h3>
                  <button
                    type="button"
                    onClick={() => removeItem("skills", domainIndex)}
                    className="text-[color:var(--status-danger)] hover:opacity-70 hover:scale-110 transition"
                  >
                    <RxCross1 size={18} />
                  </button>
                </div>

                {/* Domain Input */}
                <input
                  type="text"
                  placeholder={t("resumeForm.placeholders.skillDomain")}
                  value={skill.domain}
                  onChange={(e) =>
                    handleDomainChange(domainIndex, e.target.value)
                  }
                  className="w-full mb-4 px-4 py-2 border border-[color:var(--border-hairline)] bg-[color:var(--surface-card)] rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[color:var(--accent-ring)] focus:border-[color:var(--text-primary)]"
                />

                {/* Skills List */}
                {skill.languages.map((lang, langIndex) => (
                  <div key={langIndex} className="mb-2 flex items-center gap-2">
                    <input
                      type="text"
                      placeholder={`${t("resumeForm.labels.skill")} ${langIndex + 1}`}
                      value={lang}
                      onChange={(e) =>
                        handleSkillChange(
                          domainIndex,
                          langIndex,
                          e.target.value
                        )
                      }
                      className="w-full px-4 py-2 border border-[color:var(--border-hairline)] bg-[color:var(--surface-card)] rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[color:var(--accent-ring)] focus:border-[color:var(--text-primary)]"
                    />
                    <button
                      type="button"
                      onClick={() => removeSkill(domainIndex, langIndex)}
                      className="text-[color:var(--status-danger)] hover:opacity-70 hover:scale-110 transition"
                    >
                      <RxCrossCircled size={18} />
                    </button>
                  </div>
                ))}

                {/* Add Skill Button */}
                <button
                  type="button"
                  onClick={() => addItem("skills", domainIndex)}
                  className="mt-4 text-sm px-4 py-1.5 border border-[color:var(--text-primary)] text-[color:var(--text-primary)] rounded-full hover:bg-[color:var(--text-primary)] hover:text-[color:var(--surface-base)] transition"
                >
                  + {t("resumeForm.add.skill")}
                </button>
              </div>
            ))}

            {/* Add New Domain Button */}
            <button
              type="button"
              onClick={() => addItem("skills")}
              className="w-full py-2.5 border border-[color:var(--text-primary)] text-[color:var(--text-primary)] rounded-full hover:bg-[color:var(--text-primary)] hover:text-[color:var(--surface-base)] transition"
            >
              + {t("resumeForm.add.skillDomain")}
            </button>
          </div>
        );

      // Projects
      case 3:
        return (
          <div>
            {formData.projects.map((project, index) => (
              <div
                key={index}
                className="mb-6 border border-[color:var(--border-hairline)] bg-[color:var(--surface-card)] p-5 rounded-2xl relative"
              >
                {/* Remove Button */}
                {formData.projects.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeItem("projects", index)}
                    className="absolute top-3 right-3 text-red-600 hover:text-red-700 transition text-sm flex items-center gap-1"
                  >
                    <RxCross1 size={18} />
                  </button>
                )}

                <div className="mb-3 relative">
                  <label className="block text-[11px] uppercase tracking-[0.18em] text-[color:var(--text-muted)] mb-2">
                    {t("resumeForm.labels.projectName")}
                  </label>
                  <div className="relative">
                    <FaLink className="absolute top-3 left-3 text-gray-500" />
                    <input
                      type="text"
                      placeholder={t("resumeForm.placeholders.projectName")}
                      value={project.name}
                      onChange={(e) =>
                        handleArrayChange(
                          "projects",
                          index,
                          "name",
                          e.target.value
                        )
                      }
                      className="pl-10 w-full px-4 py-2 border border-[color:var(--border-hairline)] bg-[color:var(--surface-card)] rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[color:var(--accent-ring)] focus:border-[color:var(--text-primary)]"
                    />
                  </div>
                </div>

                <div className="mb-3 relative">
                  <label className="block text-[11px] uppercase tracking-[0.18em] text-[color:var(--text-muted)] mb-2">
                    {t("resumeForm.labels.description")}
                  </label>

                  <div className="relative">
                    {/* RichTextInput */}
                    <RichTextInput
                      value={project.description}
                      onChange={(html) =>
                        handleArrayChange(
                          "projects",
                          index,
                          "description",
                          html
                        )
                      }
                      placeholder={t("resumeForm.placeholders.projectDescription")}
                    />

                    {/* AI Button */}
                    <button
                      type="button"
                      title={t("resumeForm.enhanceWithAi")}
                      disabled={
                        aiLoadingField === `projects[${index}].description`
                      }
                      onClick={() =>
                        handleEnhanceField(`projects[${index}].description`)
                      }
                      className="absolute -top-3 right-2 p-2 rounded-full bg-[color:var(--text-primary)] hover:bg-[color:var(--accent-hover)] text-[color:var(--surface-base)] shadow-sm transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {aiLoadingField === `projects[${index}].description` ? (
                        <BsArrowClockwise className="text-xl animate-spin" />
                      ) : (
                        <FaWandMagicSparkles className="text-xl animate-pulse" />
                      )}
                    </button>
                  </div>

                  {/* AI Suggestion Output */}
                  {aiSuggestions[`projects[${index}].description`] && (
                    <div className="bg-[color:var(--accent-soft)] border border-[color:var(--border-hairline)] mt-3 rounded p-3 relative">
                      <p
                        className="text-sm text-[color:var(--text-secondary)]"
                        dangerouslySetInnerHTML={{
                          __html:
                            aiSuggestions[`projects[${index}].description`],
                        }}
                      />
                      <button
                        className="absolute top-2 right-2 text-sm px-2 py-2 bg-[color:var(--surface-base)] hover:opacity-80 text-[color:var(--text-primary)] rounded-full"
                        title={t("resumeForm.copyAiSuggestion")}
                        onClick={() => {
                          handleArrayChange(
                            "projects",
                            index,
                            "description",
                            aiSuggestions[`projects[${index}].description`]
                          );
                          setAiSuggestions((prev) => ({
                            ...prev,
                            [`projects[${index}].description`]: "",
                          }));
                        }}
                      >
                        <FaCopy />
                      </button>
                    </div>
                  )}
                </div>

                <div className="mb-3 relative">
                  <label className="block text-[11px] uppercase tracking-[0.18em] text-[color:var(--text-muted)] mb-2">
                    {t("resumeForm.labels.github")}
                  </label>
                  <div className="relative">
                    <FaGithub className="absolute top-3 left-3 text-gray-500" />
                    <input
                      type="text"
                      placeholder={t("resumeForm.placeholders.githubRepo")}
                      value={project.github}
                      onChange={(e) =>
                        handleArrayChange(
                          "projects",
                          index,
                          "github",
                          e.target.value
                        )
                      }
                      className="pl-10 w-full px-4 py-2 border border-[color:var(--border-hairline)] bg-[color:var(--surface-card)] rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[color:var(--accent-ring)] focus:border-[color:var(--text-primary)]"
                    />
                  </div>
                </div>

                <div className="relative">
                  <label className="block text-[11px] uppercase tracking-[0.18em] text-[color:var(--text-muted)] mb-2">
                    {t("resumeForm.labels.demo")}
                  </label>
                  <div className="relative">
                    <TbWorld className="absolute top-3 left-3 text-gray-500" />
                    <input
                      type="text"
                      placeholder={t("resumeForm.placeholders.projectDemo")}
                      value={project.demo}
                      onChange={(e) =>
                        handleArrayChange(
                          "projects",
                          index,
                          "demo",
                          e.target.value
                        )
                      }
                      className="pl-10 w-full px-4 py-2 border border-[color:var(--border-hairline)] bg-[color:var(--surface-card)] rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[color:var(--accent-ring)] focus:border-[color:var(--text-primary)]"
                    />
                  </div>
                </div>
              </div>
            ))}

            <button
              type="button"
              onClick={() => addItem("projects")}
              className="w-full mt-2 flex items-center justify-center gap-2 px-4 py-2.5 border border-[color:var(--text-primary)] text-[color:var(--text-primary)] rounded-full hover:bg-[color:var(--text-primary)] hover:text-[color:var(--surface-base)] transition"
            >
              <FaPlus /> {t("resumeForm.add.project")}
            </button>
          </div>
        );

      // Experience
      case 4:
        return (
          <div>
            <div className="space-y-6">
              {formData.experience.map((exp, index) => (
                <div
                  key={index}
                  className="border border-[color:var(--border-hairline)] bg-[color:var(--surface-card)] p-5 rounded-2xl relative"
                >
                  {/* Remove Button */}
                  <button
                    type="button"
                    onClick={() => removeItem("experience", index)}
                    className="absolute top-2 right-2 text-red-600 hover:scale-110 transition"
                  >
                    <RxCross1 />
                  </button>

                  {/* Company Name */}
                  <div className="relative mb-3">
                    <label className="block text-[11px] uppercase tracking-[0.18em] text-[color:var(--text-muted)] mb-2">
                      {t("resumeForm.labels.company")}
                    </label>
                    <FiBriefcase className="absolute top-9 left-3 text-gray-500" />
                    <input
                      type="text"
                      placeholder={t("resumeForm.placeholders.company")}
                      value={exp.company}
                      onChange={(e) =>
                        handleArrayChange(
                          "experience",
                          index,
                          "company",
                          e.target.value
                        )
                      }
                      className="pl-10 w-full px-4 py-2 border border-[color:var(--border-hairline)] bg-[color:var(--surface-card)] rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[color:var(--accent-ring)] focus:border-[color:var(--text-primary)]"
                    />
                  </div>

                  <div className="relative mb-3">
                    <label className="block text-[11px] uppercase tracking-[0.18em] text-[color:var(--text-muted)] mb-2">
                      {t("resumeForm.labels.role")}
                    </label>
                    <FaRegUser className="absolute top-9 left-3 text-gray-500" />
                    <input
                      type="text"
                      placeholder={t("resumeForm.placeholders.role")}
                      value={exp.role}
                      onChange={(e) =>
                        handleArrayChange(
                          "experience",
                          index,
                          "role",
                          e.target.value
                        )
                      }
                      className="pl-10 w-full px-4 py-2 border border-[color:var(--border-hairline)] bg-[color:var(--surface-card)] rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[color:var(--accent-ring)] focus:border-[color:var(--text-primary)]"
                    />
                  </div>

                  <div className="relative mb-3">
                    <label className="block text-[11px] uppercase tracking-[0.18em] text-[color:var(--text-muted)] mb-2">
                      {t("resumeForm.labels.technologies")}
                    </label>
                    <GrTechnology className="absolute top-9 left-3 text-gray-500" />
                    <input
                      type="text"
                      placeholder={t("resumeForm.placeholders.technologies")}
                      value={exp.technologies}
                      onChange={(e) =>
                        handleArrayChange(
                          "experience",
                          index,
                          "technologies",
                          e.target.value
                        )
                      }
                      className="pl-10 w-full px-4 py-2 border border-[color:var(--border-hairline)] bg-[color:var(--surface-card)] rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[color:var(--accent-ring)] focus:border-[color:var(--text-primary)]"
                    />
                  </div>

                  {/* Duration */}
                  <div className="relative mb-3">
                    <label className="block text-[11px] uppercase tracking-[0.18em] text-[color:var(--text-muted)] mb-2">
                      {t("resumeForm.labels.years")}
                    </label>
                    <FiCalendar className="absolute top-9 left-3 text-gray-500" />
                    <input
                      type="text"
                      placeholder={t("resumeForm.placeholders.years")}
                      value={exp.years}
                      onChange={(e) =>
                        handleArrayChange(
                          "experience",
                          index,
                          "years",
                          e.target.value
                        )
                      }
                      className="pl-10 w-full px-4 py-2 border border-[color:var(--border-hairline)] bg-[color:var(--surface-card)] rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[color:var(--accent-ring)] focus:border-[color:var(--text-primary)]"
                    />
                  </div>

                  {/* Description */}
                  <div className="relative">
                    <label className="block text-[11px] uppercase tracking-[0.18em] text-[color:var(--text-muted)] mb-2">
                      {t("resumeForm.labels.description")}
                    </label>

                    <div className="relative">
                      <RichTextInput
                        value={exp.description}
                        onChange={(html) =>
                          handleArrayChange(
                            "experience",
                            index,
                            "description",
                            html
                          )
                        }
                        placeholder={t("resumeForm.placeholders.workDescription")}
                      />
                      {/* AI Button */}
                      <button
                        type="button"
                        title={t("resumeForm.enhanceWithAi")}
                        disabled={
                          aiLoadingField === `experience[${index}].description`
                        }
                        onClick={() =>
                          handleEnhanceField(`experience[${index}].description`)
                        }
                        className="absolute -top-3 right-2 p-2 rounded-full bg-[color:var(--text-primary)] hover:bg-[color:var(--accent-hover)] text-[color:var(--surface-base)] shadow-sm transition disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {aiLoadingField ===
                        `experience[${index}].description` ? (
                          <BsArrowClockwise className="text-lg animate-spin" />
                        ) : (
                          <FaWandMagicSparkles className="text-lg animate-pulse" />
                        )}
                      </button>
                    </div>

                    {/* AI Suggestion Output */}
                    {aiSuggestions[`experience[${index}].description`] && (
                      <div className="bg-gray-50 border mt-3 rounded p-3 relative">
                        <p
                          className="text-sm text-gray-800"
                          dangerouslySetInnerHTML={{
                            __html:
                              aiSuggestions[`experience[${index}].description`],
                          }}
                        />
                        <button
                          className="absolute top-2 right-2 text-sm px-2 py-2 bg-[color:var(--surface-base)] hover:opacity-80 text-[color:var(--text-primary)] rounded-full"
                          title={t("resumeForm.copyAiSuggestion")}
                          onClick={() => {
                            handleArrayChange(
                              "experience",
                              index,
                              "description",
                              aiSuggestions[`experience[${index}].description`]
                            );
                            setAiSuggestions((prev) => ({
                              ...prev,
                              [`experience[${index}].description`]: "",
                            }));
                          }}
                        >
                          <FaCopy />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {/* Add Button */}
              <button
                type="button"
                onClick={() => addItem("experience")}
                className="w-full py-2.5 border border-[color:var(--text-primary)] text-[color:var(--text-primary)] rounded-full hover:bg-[color:var(--text-primary)] hover:text-[color:var(--surface-base)] transition"
              >
                + {t("resumeForm.add.experience")}
              </button>
            </div>
          </div>
        );

      // Achievements
      case 5:
        return (
          <div>
            <div className="space-y-6">
              {formData.achievements.map((achieve, index) => (
                <div
                  key={index}
                  className="relative border border-[color:var(--border-hairline)] bg-[color:var(--surface-card)] p-3 md:p-5 rounded-2xl"
                >
                  {/* Remove Achievement */}
                  <button
                    type="button"
                    onClick={() => removeItem("achievements", index)}
                    className="absolute top-2 right-2 text-red-600 hover:scale-110 transition"
                  >
                    <RxCross1 />
                  </button>

                  {/* Title */}
                  <div className="relative mb-3">
                    <label className="block mb-2 text-[11px] uppercase tracking-[0.18em] text-[color:var(--text-muted)]">
                      {t("resumeForm.labels.achievementTitle")}
                    </label>
                    <FiAward className="absolute top-9 left-3 text-gray-500" />
                    <input
                      type="text"
                      placeholder={t("resumeForm.placeholders.achievementTitle")}
                      value={achieve.title}
                      onChange={(e) =>
                        handleArrayChange(
                          "achievements",
                          index,
                          "title",
                          e.target.value
                        )
                      }
                      className="pl-10 w-full px-3 py-2 border border-[color:var(--border-hairline)] bg-[color:var(--surface-card)] rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[color:var(--accent-ring)] focus:border-[color:var(--text-primary)]"
                    />
                  </div>

                  {/* Description */}
                  <div className="relative mb-3">
                    <label className="block mb-2 text-[11px] uppercase tracking-[0.18em] text-[color:var(--text-muted)]">
                      {t("resumeForm.labels.description")}
                    </label>

                    <div className="relative">
                      <RichTextInput
                        value={achieve.description}
                        onChange={(html) =>
                          handleArrayChange(
                            "achievements",
                            index,
                            "description",
                            html
                          )
                        }
                        placeholder={t("resumeForm.placeholders.achievementDescription")}
                      />
                      {/* AI Button */}
                      <button
                        type="button"
                        title={t("resumeForm.enhanceWithAi")}
                        disabled={
                          aiLoadingField ===
                          `achievements[${index}].description`
                        }
                        onClick={() =>
                          handleEnhanceField(
                            `achievements[${index}].description`
                          )
                        }
                        className="absolute -top-3 right-2 p-2 rounded-full bg-[color:var(--text-primary)] hover:bg-[color:var(--accent-hover)] text-[color:var(--surface-base)] shadow-sm transition disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {aiLoadingField ===
                        `achievements[${index}].description` ? (
                          <BsArrowClockwise className="text-lg animate-spin" />
                        ) : (
                          <FaWandMagicSparkles className="text-lg animate-pulse" />
                        )}
                      </button>
                    </div>

                    {/* AI Suggestion Output */}
                    {aiSuggestions[`achievements[${index}].description`] && (
                      <div className="bg-gray-50 border mt-3 rounded p-3 relative">
                        <p
                          className="text-sm text-gray-800"
                          dangerouslySetInnerHTML={{
                            __html:
                              aiSuggestions[
                                `achievements[${index}].description`
                              ],
                          }}
                        />
                        <button
                          className="absolute top-2 right-2 text-sm px-2 py-2 bg-[color:var(--surface-base)] hover:opacity-80 text-[color:var(--text-primary)] rounded-full"
                          title={t("resumeForm.copyAiSuggestion")}
                          onClick={() => {
                            handleArrayChange(
                              "achievements",
                              index,
                              "description",
                              aiSuggestions[
                                `achievements[${index}].description`
                              ]
                            );
                            setAiSuggestions((prev) => ({
                              ...prev,
                              [`achievements[${index}].description`]: "",
                            }));
                          }}
                        >
                          <FaCopy />
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Month & Year */}
                  <div className="flex gap-2">
                    <div className="relative w-1/2">
                      <label className="block mb-2 text-[11px] uppercase tracking-[0.18em] text-[color:var(--text-muted)]">
                        {t("resumeForm.labels.month")}
                      </label>
                      <FiCalendar className="absolute top-8.5 md:top-9 left-1.5 md:left-3 text-gray-500" />
                      <input
                        type="text"
                        placeholder={t("resumeForm.placeholders.month")}
                        value={achieve.month}
                        onChange={(e) =>
                          handleArrayChange(
                            "achievements",
                            index,
                            "month",
                            e.target.value
                          )
                        }
                        className="pl-7 md:pl-10 w-full px-0 md:px-3 py-2 border border-[color:var(--border-hairline)] bg-[color:var(--surface-card)] rounded-md text-xs md:text-sm focus:outline-none focus:ring-2 focus:ring-[color:var(--accent-ring)] focus:border-[color:var(--text-primary)]"
                      />
                    </div>

                    <div className="relative w-1/2">
                      <label className="block mb-2 text-[11px] uppercase tracking-[0.18em] text-[color:var(--text-muted)]">
                        {t("resumeForm.labels.year")}
                      </label>
                      <FiCalendar className="absolute top-8.5 md:top-9 left-1.5 md:left-3 text-gray-500" />
                      <input
                        type="text"
                        placeholder={t("resumeForm.placeholders.year")}
                        value={achieve.year}
                        onChange={(e) =>
                          handleArrayChange(
                            "achievements",
                            index,
                            "year",
                            e.target.value
                          )
                        }
                        className="pl-7 md:pl-10 w-full px-0 md:px-3 py-2 border border-[color:var(--border-hairline)] bg-[color:var(--surface-card)] rounded-md text-xs md:text-sm focus:outline-none focus:ring-2 focus:ring-[color:var(--accent-ring)] focus:border-[color:var(--text-primary)]"
                      />
                    </div>
                  </div>
                </div>
              ))}

              {/* Add Button */}
              <button
                type="button"
                onClick={() => addItem("achievements")}
                className="w-full mt-4 py-2.5 border border-[color:var(--text-primary)] text-[color:var(--text-primary)] rounded-full hover:bg-[color:var(--text-primary)] hover:text-[color:var(--surface-base)] transition"
              >
                + {t("resumeForm.add.achievement")}
              </button>
            </div>
          </div>
        );

      case 6:
        return (
          <div>
            {/* Phone */}
            <div className="relative mb-4">
              <label
                htmlFor="phone"
                className="block text-[11px] uppercase tracking-[0.18em] text-[color:var(--text-muted)] mb-2"
              >
                {t("resumeForm.labels.phone")}
              </label>
              <FiPhone className="absolute top-9 left-3 text-gray-500" />
              <input
                id="phone"
                type="text"
                placeholder={t("resumeForm.placeholders.phone")}
                value={formData.contact.phone}
                onChange={(e) =>
                  handleSingleChange("contact", "phone", e.target.value)
                }
                className="w-full px-4 py-2 pl-10 border border-[color:var(--border-hairline)] bg-[color:var(--surface-card)] rounded text-sm focus:outline-none focus:ring-2 focus:ring-[color:var(--accent-ring)] focus:border-[color:var(--text-primary)]"
              />
            </div>

            {/* Email */}
            <div className="relative mb-4">
              <label
                htmlFor="email"
                className="block text-[11px] uppercase tracking-[0.18em] text-[color:var(--text-muted)] mb-2"
              >
                {t("resumeForm.labels.email")}
              </label>
              <FiMail className="absolute top-9 left-3 text-gray-500" />
              <input
                id="email"
                type="email"
                placeholder={t("resumeForm.placeholders.email")}
                value={formData.contact.email}
                onChange={(e) =>
                  handleSingleChange("contact", "email", e.target.value)
                }
                className="w-full px-4 py-2 pl-10 border border-[color:var(--border-hairline)] bg-[color:var(--surface-card)] rounded text-sm focus:outline-none focus:ring-2 focus:ring-[color:var(--accent-ring)] focus:border-[color:var(--text-primary)]"
              />
            </div>

            {/* GitHub */}
            <div className="relative mb-4">
              <label
                htmlFor="github"
                className="block text-[11px] uppercase tracking-[0.18em] text-[color:var(--text-muted)] mb-2"
              >
                {t("resumeForm.labels.github")}
              </label>
              <FiGithub className="absolute top-9 left-3 text-gray-500" />
              <input
                id="github"
                type="text"
                placeholder={t("resumeForm.placeholders.githubProfile")}
                value={formData.contact.github}
                onChange={(e) =>
                  handleSingleChange("contact", "github", e.target.value)
                }
                className="w-full px-4 py-2 pl-10 border border-[color:var(--border-hairline)] bg-[color:var(--surface-card)] rounded text-sm focus:outline-none focus:ring-2 focus:ring-[color:var(--accent-ring)] focus:border-[color:var(--text-primary)]"
              />
            </div>

            {/* LinkedIn */}
            <div className="relative mb-4">
              <label
                htmlFor="linkedin"
                className="block text-[11px] uppercase tracking-[0.18em] text-[color:var(--text-muted)] mb-2"
              >
                {t("resumeForm.labels.linkedin")}
              </label>
              <FiLinkedin className="absolute top-9 left-3 text-gray-500" />
              <input
                id="linkedin"
                type="text"
                placeholder={t("resumeForm.placeholders.linkedin")}
                value={formData.contact.linkedin}
                onChange={(e) =>
                  handleSingleChange("contact", "linkedin", e.target.value)
                }
                className="w-full px-4 py-2 pl-10 border border-[color:var(--border-hairline)] bg-[color:var(--surface-card)] rounded text-sm focus:outline-none focus:ring-2 focus:ring-[color:var(--accent-ring)] focus:border-[color:var(--text-primary)]"
              />
            </div>

            {/* Location */}
            <div className="relative mb-4">
              <label
                htmlFor="location"
                className="block text-[11px] uppercase tracking-[0.18em] text-[color:var(--text-muted)] mb-2"
              >
                {t("resumeForm.labels.location")}
              </label>
              <FiMapPin className="absolute top-9 left-3 text-gray-500" />
              <input
                id="location"
                type="text"
                placeholder={t("resumeForm.placeholders.location")}
                value={formData.contact.location}
                onChange={(e) =>
                  handleSingleChange("contact", "location", e.target.value)
                }
                className="w-full px-4 py-2 pl-10 border border-[color:var(--border-hairline)] bg-[color:var(--surface-card)] rounded text-sm focus:outline-none focus:ring-2 focus:ring-[color:var(--accent-ring)] focus:border-[color:var(--text-primary)]"
              />
            </div>

            {/* Website URL */}
            <div className="relative mb-4">
              <label
                htmlFor="websiteURL"
                className="block text-[11px] uppercase tracking-[0.18em] text-[color:var(--text-muted)] mb-2"
              >
                {t("resumeForm.labels.website")}
              </label>
              <FiGlobe className="absolute top-9 left-3 text-gray-500" />
              <input
                id="websiteURL"
                type="text"
                placeholder={t("resumeForm.placeholders.website")}
                value={formData.contact.websiteURL}
                onChange={(e) =>
                  handleSingleChange("contact", "websiteURL", e.target.value)
                }
                className="w-full px-4 py-2 pl-10 border border-[color:var(--border-hairline)] bg-[color:var(--surface-card)] rounded text-sm focus:outline-none focus:ring-2 focus:ring-[color:var(--accent-ring)] focus:border-[color:var(--text-primary)]"
              />
            </div>
          </div>
        );
      // You can add similar UI for Projects, Experience, Achievements, and Contact here...
      default:
        return (
          <p className="text-center text-gray-500">{t("resumeForm.moreComing")}</p>
        );
    }
  };

  const progressPct = ((step + 1) / steps.length) * 100;

  return (
    <div className="surface-base min-h-screen">
      <div className="container-page py-12 md:py-16 max-w-3xl">
        <header className="mb-10">
          <div className="flex items-center gap-3 mb-5">
            <span className="h-px w-10 bg-[color:var(--text-muted)]" />
            <span className="eyebrow">
              {t("resumeForm.eyebrow")} {step + 1} / {steps.length}
            </span>
          </div>
          <h1
            className="text-[36px] md:text-[48px] tracking-tight leading-[1.05] text-[color:var(--text-primary)]"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            {steps[step]?.toLowerCase()}<em className="italic font-normal">.</em>
          </h1>
          <p className="mt-4 text-[14px] text-[color:var(--text-secondary)]">
            {t("resumeForm.intro")}
          </p>
        </header>

        <div className="mb-10">
          <div className="hidden md:flex justify-between items-center mb-4">
            {steps.map((stepName, index) => (
              <div
                key={stepName}
                className={`flex items-center gap-2 text-[11px] tracking-wide ${
                  index <= step
                    ? "text-[color:var(--text-primary)]"
                    : "text-[color:var(--text-muted)]"
                }`}
              >
                <span
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] ${
                    index < step
                      ? "bg-[color:var(--text-primary)] text-[color:var(--surface-base)]"
                      : index === step
                      ? "bg-[color:var(--surface-card)] text-[color:var(--text-primary)] border border-[color:var(--text-primary)]"
                      : "bg-transparent text-[color:var(--text-muted)] border border-[color:var(--border-hairline)]"
                  }`}
                >
                  {index < step ? "✓" : index + 1}
                </span>
                <span>{stepName}</span>
              </div>
            ))}
          </div>
          <div
            className="w-full h-px overflow-hidden"
            style={{ backgroundColor: "var(--border-hairline)" }}
          >
            <div
              className="h-full transition-all"
              style={{
                width: `${progressPct}%`,
                backgroundColor: "var(--text-primary)",
              }}
            />
          </div>
        </div>

        <div
          key={step}
          className="p-6 md:p-9 rounded-2xl"
          style={{
            border: "1px solid var(--border-hairline)",
            backgroundColor: "var(--surface-card)",
          }}
        >
          {renderStep()}
        </div>

        <div className="flex justify-between items-center mt-6">
          <button
            type="button"
            onClick={() => setStep((p) => Math.max(p - 1, 0))}
            disabled={step === 0}
            className="btn-secondary inline-flex items-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <FaArrowLeft /> {t("resumeForm.previous")}
          </button>

          {step === steps.length - 1 ? (
            <button
              type="button"
              onClick={saveResumeToFirebase}
              className="btn-primary inline-flex items-center gap-2"
            >
              <FaCheckCircle /> {t("resumeForm.saveResume")}
            </button>
          ) : (
            <button
              type="button"
              onClick={nextStep}
              className="btn-primary inline-flex items-center gap-2"
            >
              {t("resumeForm.next")} <FaArrowRight />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResumeForm;
