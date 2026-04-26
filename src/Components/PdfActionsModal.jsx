// src/Components/PdfActionsModal.jsx
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaTimes, FaSpinner, FaRobot, FaUpload } from "react-icons/fa";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

import { createResume } from "../db/database";
import { parseResumeFromUpload, checkATSFromUpload } from "../utils/ai";
import { useResumeData } from "../Contexts/ResumeDataContext";
import ResumeCreationLoader from "./Loaders/ResumeCreationLoader";
import ATSCheckingLoader from "./Loaders/ATSCheckingLoader";
import { useLocale } from "../Contexts/LocaleContext";

// Transform OpenAI parsed data to match the expected resume structure
const transformParsedDataToResumeFormat = (parsedData) => {
  return {
    name: parsedData.name || "",
    description: parsedData.description || "",
    contact: {
      email: parsedData.contact?.email || "",
      phone: parsedData.contact?.phone || "",
      location: parsedData.contact?.location || "",
      linkedin: parsedData.contact?.linkedin || "",
      github: parsedData.contact?.github || "",
      websiteURL: parsedData.contact?.website || "",
    },
    skills: parsedData.skills?.map((skill) => ({
      domain: typeof skill === "string" ? "General" : skill.domain || "General",
      languages:
        typeof skill === "string" ? [skill] : skill.languages || [skill],
    })) || [{ domain: "General", languages: [] }],
    experience:
      parsedData.experience?.map((exp) => ({
        company: exp.company || "",
        role: exp.role || "",
        technologies: exp.technologies || "",
        years: exp.duration || "",
        description: exp.description || "",
      })) || [],
    projects:
      parsedData.projects?.map((proj) => ({
        name: proj.name || "",
        description: proj.description || "",
        github: proj.link || "",
        demo: proj.demo || "",
      })) || [],
    education: {
      college: parsedData.education?.[0]?.institution || "",
      degree: parsedData.education?.[0]?.degree || "",
      specialization: parsedData.education?.[0]?.specialization || "",
      location: parsedData.education?.[0]?.location || "",
      startYear:
        parsedData.education?.[0]?.duration?.split("-")?.[0]?.trim() || "",
      endYear:
        parsedData.education?.[0]?.duration?.split("-")?.[1]?.trim() || "",
      cgpa:
        parsedData.education?.[0]?.gpa || parsedData.education?.[0]?.cgpa || "",
      school: "",
      tenth: "",
      twelfth: "",
    },
    achievements:
      parsedData.achievements?.map((ach) => ({
        title: ach.title || "",
        description: ach.description || "",
        year: ach.year || "",
        month: ach.month || "",
      })) || [],
    certifications: parsedData.certifications || [],
  };
};

const PdfActionsModal = ({ isOpen, onClose, selectedResume }) => {
  const [selectedOption, setSelectedOption] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStep, setProcessingStep] = useState("");
  const [showResumeLoader, setShowResumeLoader] = useState(false);
  const [showATSLoader, setShowATSLoader] = useState(false);

  const navigate = useNavigate();
  const { setResume } = useResumeData();
  const { locale, t } = useLocale();

  // Handle option selection - only allow one option at a time
  const handleOptionSelect = (option) => {
    setSelectedOption(option);
  };

  // Process selected option
  const handleProcess = async () => {
    if (!selectedResume) {
      toast.error(t("uploadModal.noResumeSelected"));
      return;
    }

    if (!selectedOption) {
      toast.error(t("uploadModal.selectOptionError"));
      return;
    }

    setIsProcessing(true);

    try {
      // Process Create Resume
      if (selectedOption === "createResume") {
        setShowResumeLoader(true);
        setProcessingStep(t("uploadModal.creatingResume"));

        const parsedData = await parseResumeFromUpload(selectedResume.fileUrl, locale);
        console.log("Parsed data from AI:", parsedData);

        const transformedData = transformParsedDataToResumeFormat(parsedData);
        console.log("Transformed data:", transformedData);

        // Ensure we have a name, use a fallback if needed
        if (!transformedData.name || transformedData.name.trim() === "") {
          transformedData.name = t("profile.userFallback");
        }

        await createResume(transformedData);

        // Update the context with the new resume data
        setResume(transformedData);

        // Wait a bit for the loader to complete its animation
        setTimeout(() => {
          setShowResumeLoader(false);
          toast.success(t("uploadModal.resumeCreated"));

          // Close modal and navigate to resume page
          onClose();
          navigate("/resume");
        }, 1000);
      }

      // Process ATS Check
      else if (selectedOption === "checkATS") {
        setShowATSLoader(true);
        setProcessingStep(t("uploadModal.checkingAts"));

        const atsData = await checkATSFromUpload(selectedResume.fileUrl, locale);

        // Wait a bit for the loader to complete its animation
        setTimeout(() => {
          setShowATSLoader(false);
          toast.success(`ATS Score: ${atsData.atsScore}/100`);

          // Close modal and navigate to ATS checker with results
          onClose();
          navigate("/ats-checker", {
            state: { atsResult: atsData, uploadedFile: selectedResume },
          });
        }, 1000);
      }

    } catch (error) {
      console.error("Processing error:", error);
      toast.error(t("uploadModal.processFailed"));

      // Hide all loaders on error
      setShowResumeLoader(false);
      setShowATSLoader(false);
    } finally {
      setIsProcessing(false);
      setProcessingStep("");
    }
  };

  // Reset modal state when closed
  const handleClose = () => {
    setSelectedOption("");
    setIsProcessing(false);
    setProcessingStep("");
    setShowResumeLoader(false);
    setShowATSLoader(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        style={{ backgroundColor: "rgba(26, 18, 11, 0.4)" }}
        onClick={handleClose}
      >
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 8 }}
          transition={{ duration: 0.15 }}
          className="max-h-[95vh] overflow-y-auto rounded-2xl max-w-md w-full mx-auto shadow-xl"
          style={{
            backgroundColor: "var(--surface-card)",
            border: "1px solid var(--border-hairline)",
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <div
            className="flex items-center justify-between px-7 py-5"
            style={{ borderBottom: "1px solid var(--border-hairline)" }}
          >
            <h2
              className="text-[18px] tracking-tight text-[color:var(--text-primary)]"
              style={{ fontFamily: "var(--font-serif)" }}
            >
              {t("uploadModal.processTitle")}
            </h2>
            <button
              onClick={handleClose}
              className="text-[color:var(--text-muted)] hover:text-[color:var(--text-primary)]"
            >
              <FaTimes size={16} />
            </button>
          </div>

          <div className="px-7 py-6 space-y-4">
            {selectedResume && (
              <div
                className="px-3 py-2.5 rounded-lg"
                style={{
                  backgroundColor: "var(--accent-soft)",
                  border: "1px solid var(--border-hairline)",
                }}
              >
                <p className="text-[10px] uppercase tracking-[0.18em] text-[color:var(--text-muted)] mb-1">
                  {t("uploadModal.selectedFile")}
                </p>
                <p className="text-sm text-[color:var(--text-primary)] truncate">
                  {selectedResume.fileName}
                </p>
              </div>
            )}

            <p className="eyebrow">{t("uploadModal.question")}</p>

            <div className="space-y-2">
              <OptionRadio
                icon={<FaUpload />}
                label={t("uploadModal.createResume")}
                description={t("uploadModal.createResumeDescription")}
                checked={selectedOption === "createResume"}
                onChange={() => handleOptionSelect("createResume")}
              />
              <OptionRadio
                icon={<FaRobot />}
                label={t("uploadModal.checkAts")}
                description={t("uploadModal.checkAtsDescription")}
                checked={selectedOption === "checkATS"}
                onChange={() => handleOptionSelect("checkATS")}
              />
            </div>
          </div>

          <div
            className="px-7 py-5"
            style={{ borderTop: "1px solid var(--border-hairline)" }}
          >
            <button
              onClick={handleProcess}
              disabled={isProcessing || !selectedOption}
              className="btn-primary w-full"
            >
              {isProcessing ? (
                <>
                  <FaSpinner className="animate-spin" />
                  {processingStep || t("common.processing")}
                </>
              ) : (
                t("common.continue")
              )}
            </button>
          </div>
        </motion.div>
      </motion.div>

      {showResumeLoader && (
        <ResumeCreationLoader isVisible={showResumeLoader} />
      )}
      {showATSLoader && <ATSCheckingLoader isVisible={showATSLoader} />}
    </AnimatePresence>
  );
};

const OptionRadio = ({ icon, label, description, checked, onChange }) => (
  <button
    type="button"
    onClick={onChange}
    className="w-full flex items-center gap-3 p-3 rounded-xl transition-colors text-left"
    style={{
      border: `1px solid ${
        checked ? "var(--text-primary)" : "var(--border-hairline)"
      }`,
      backgroundColor: checked ? "var(--accent-soft)" : "transparent",
    }}
  >
    <span
      className="w-9 h-9 rounded-full flex items-center justify-center text-sm"
      style={{
        backgroundColor: checked
          ? "var(--text-primary)"
          : "var(--surface-muted)",
        color: checked ? "var(--surface-base)" : "var(--text-primary)",
      }}
    >
      {icon}
    </span>
    <span className="flex-1">
      <span className="block text-sm text-[color:var(--text-primary)]">
        {label}
      </span>
      <span className="block text-xs text-[color:var(--text-muted)] mt-0.5">
        {description}
      </span>
    </span>
    <span
      className="w-4 h-4 rounded-full flex items-center justify-center"
      style={{
        border: `2px solid ${
          checked ? "var(--text-primary)" : "var(--border-hairline)"
        }`,
        backgroundColor: checked ? "var(--text-primary)" : "transparent",
      }}
    >
      {checked && (
        <span
          className="w-1.5 h-1.5 rounded-full"
          style={{ backgroundColor: "var(--surface-base)" }}
        />
      )}
    </span>
  </button>
);

export default PdfActionsModal;
