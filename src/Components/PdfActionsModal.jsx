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

  // Handle option selection - only allow one option at a time
  const handleOptionSelect = (option) => {
    setSelectedOption(option);
  };

  // Process selected option
  const handleProcess = async () => {
    if (!selectedResume) {
      toast.error("No resume selected");
      return;
    }

    if (!selectedOption) {
      toast.error("Please select an option");
      return;
    }

    setIsProcessing(true);

    try {
      // Process Create Resume
      if (selectedOption === "createResume") {
        setShowResumeLoader(true);
        setProcessingStep("Creating resume...");

        const parsedData = await parseResumeFromUpload(selectedResume.fileUrl);
        console.log("Parsed data from AI:", parsedData);

        const transformedData = transformParsedDataToResumeFormat(parsedData);
        console.log("Transformed data:", transformedData);

        // Ensure we have a name, use a fallback if needed
        if (!transformedData.name || transformedData.name.trim() === "") {
          transformedData.name = "User";
        }

        await createResume(transformedData);

        // Update the context with the new resume data
        setResume(transformedData);

        // Wait a bit for the loader to complete its animation
        setTimeout(() => {
          setShowResumeLoader(false);
          toast.success("Resume created successfully!");

          // Close modal and navigate to resume page
          onClose();
          navigate("/resume");
        }, 1000);
      }

      // Process ATS Check
      else if (selectedOption === "checkATS") {
        setShowATSLoader(true);
        setProcessingStep("Checking ATS compatibility...");

        const atsData = await checkATSFromUpload(selectedResume.fileUrl);

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
      toast.error("Failed to process resume. Please try again.");

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
        className="fixed inset-0 bg-zinc-900/40 z-50 flex items-center justify-center p-4"
        onClick={handleClose}
      >
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 8 }}
          transition={{ duration: 0.15 }}
          className="bg-white max-h-[95vh] overflow-y-auto rounded-2xl max-w-md w-full mx-auto border border-zinc-200 shadow-xl"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-200">
            <h2 className="text-base font-semibold text-zinc-900">
              Process resume
            </h2>
            <button
              onClick={handleClose}
              className="text-zinc-400 hover:text-zinc-600"
            >
              <FaTimes size={16} />
            </button>
          </div>

          <div className="px-6 py-5 space-y-4">
            {selectedResume && (
              <div className="px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-lg">
                <p className="text-xs font-medium text-zinc-500 mb-0.5">
                  Selected file
                </p>
                <p className="text-sm text-zinc-800 truncate">
                  {selectedResume.fileName}
                </p>
              </div>
            )}

            <p className="text-sm text-zinc-700">
              What would you like to do with this resume?
            </p>

            <div className="space-y-2">
              <OptionRadio
                icon={<FaUpload />}
                label="Create resume"
                description="Build a new resume from this file"
                checked={selectedOption === "createResume"}
                onChange={() => handleOptionSelect("createResume")}
              />
              <OptionRadio
                icon={<FaRobot />}
                label="Check ATS score"
                description="Analyze ATS compatibility"
                checked={selectedOption === "checkATS"}
                onChange={() => handleOptionSelect("checkATS")}
              />
            </div>
          </div>

          <div className="px-6 py-4 border-t border-zinc-200">
            <button
              onClick={handleProcess}
              disabled={isProcessing || !selectedOption}
              className="btn-primary w-full"
            >
              {isProcessing ? (
                <>
                  <FaSpinner className="animate-spin" />
                  {processingStep || "Processing…"}
                </>
              ) : (
                "Continue"
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
    className={`w-full flex items-center gap-3 p-3 rounded-xl border transition-colors text-left ${
      checked
        ? "border-sky-300 bg-sky-50"
        : "border-zinc-200 bg-white hover:border-zinc-300"
    }`}
  >
    <span
      className={`w-9 h-9 rounded-lg flex items-center justify-center text-sm ${
        checked ? "bg-sky-600 text-white" : "bg-zinc-100 text-zinc-600"
      }`}
    >
      {icon}
    </span>
    <span className="flex-1">
      <span
        className={`block text-sm font-semibold ${
          checked ? "text-sky-700" : "text-zinc-900"
        }`}
      >
        {label}
      </span>
      <span className="block text-xs text-zinc-500 mt-0.5">{description}</span>
    </span>
    <span
      className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
        checked ? "border-sky-600 bg-sky-600" : "border-zinc-300"
      }`}
    >
      {checked && <span className="w-1.5 h-1.5 bg-white rounded-full" />}
    </span>
  </button>
);

export default PdfActionsModal;
