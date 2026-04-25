// src/Components/ResumeUploadModal.jsx
import React, { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaUpload,
  FaTimes,
  FaSpinner,
  FaCheckCircle,
  FaRobot,
} from "react-icons/fa";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

import { uploadFile, validateResumeFile } from "../services/fileStorage";
import { saveUploadedFile, createResume } from "../db/database";
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
      school: parsedData.education?.[0]?.school || "",
      tenth: parsedData.education?.[0]?.tenth || "",
      twelfth: parsedData.education?.[0]?.twelfth || "",
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

const ResumeUploadModal = ({ isOpen, onClose, onUploadSuccess }) => {
  const [uploadedFile, setUploadedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState({
    createResume: false,
    checkATS: false,
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStep, setProcessingStep] = useState("");
  const [showResumeLoader, setShowResumeLoader] = useState(false);
  const [showATSLoader, setShowATSLoader] = useState(false);

  const navigate = useNavigate();
  const { setResume } = useResumeData();

  // Handle file upload
  const handleFileUpload = async (files) => {
    const file = files[0];
    if (!file) return;

    // Validate file
    const validation = validateResumeFile(file);
    if (!validation.isValid) {
      validation.errors.forEach((error) => toast.error(error));
      return;
    }

    setIsUploading(true);
    const uploadToastId = toast.loading("Uploading your resume...");

    try {
      // Upload to Appwrite
      const uploadResult = await uploadFile(file);

      // Save metadata to Firestore
      await saveUploadedFile(uploadResult);

      setUploadedFile(uploadResult);
      toast.success("Resume uploaded successfully!", { id: uploadToastId });

      // Notify parent component
      if (onUploadSuccess) {
        onUploadSuccess(uploadResult);
      }
    } catch (error) {
      console.error("Upload error:", error);

      let errorMessage = "Failed to upload resume. Please try again.";
      if (error.message.includes("size")) {
        errorMessage =
          "File is too large. Please upload a file smaller than 10MB.";
      } else if (error.message.includes("type")) {
        errorMessage =
          "Invalid file type. Please upload PDF, DOC, DOCX, or TXT files.";
      }

      toast.error(errorMessage, { id: uploadToastId });
    } finally {
      setIsUploading(false);
    }
  };

  // Drag and drop handlers
  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files);
    }
  }, []);

  // File input change handler
  const handleInputChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFileUpload(e.target.files);
    }
  };

  // Handle option selection - only allow one option at a time
  const handleOptionToggle = (option) => {
    setSelectedOptions({
      createResume: false,
      checkATS: false,
      [option]: true, // Only the selected option will be true
    });
  };

  // Process selected options
  const handleDone = async () => {
    if (!uploadedFile) {
      toast.error("Please upload a resume first");
      return;
    }

    const selectedCount = Object.values(selectedOptions).filter(Boolean).length;
    if (selectedCount === 0) {
      toast.error("Please select an option");
      return;
    }

    setIsProcessing(true);

    try {
      // Process Create Resume
      if (selectedOptions.createResume) {
        setShowResumeLoader(true);
        setProcessingStep("Creating resume...");

        const parsedData = await parseResumeFromUpload(uploadedFile.fileUrl);
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
      else if (selectedOptions.checkATS) {
        setShowATSLoader(true);
        setProcessingStep("Checking ATS compatibility...");

        const atsData = await checkATSFromUpload(uploadedFile.fileUrl);

        // Wait a bit for the loader to complete its animation
        setTimeout(() => {
          setShowATSLoader(false);
          toast.success(`ATS Score: ${atsData.atsScore}/100`);

          // Close modal and navigate to ATS checker with results
          onClose();
          navigate("/ats-checker", {
            state: { atsResult: atsData, uploadedFile },
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
    setUploadedFile(null);
    setSelectedOptions({
      createResume: false,
      checkATS: false,
    });
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
          className="bg-white max-h-[95vh] no-scrollbar overflow-y-auto rounded-2xl max-w-md w-full mx-auto border border-zinc-200 shadow-xl"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-200">
            <h2 className="text-base font-semibold text-zinc-900">
              Upload resume
            </h2>
            <button
              onClick={handleClose}
              className="text-zinc-400 hover:text-zinc-600"
            >
              <FaTimes size={16} />
            </button>
          </div>

          <div className="px-6 py-5 space-y-5">
            <div
              className={`relative border-2 border-dashed rounded-xl p-6 text-center transition-colors ${
                dragActive
                  ? "border-sky-500 bg-sky-50"
                  : "border-zinc-300 hover:border-sky-400 hover:bg-zinc-50"
              } ${isUploading ? "pointer-events-none opacity-60" : ""}`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <input
                type="file"
                id="file-upload-modal"
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                onChange={handleInputChange}
                accept=".pdf,.doc,.docx,.txt"
                disabled={isUploading}
              />

              {isUploading ? (
                <div className="flex flex-col items-center py-2">
                  <FaSpinner className="animate-spin text-sky-600 text-2xl mb-3" />
                  <p className="text-sm font-medium text-zinc-700">
                    Uploading…
                  </p>
                </div>
              ) : uploadedFile ? (
                <div className="flex flex-col items-center py-2">
                  <FaCheckCircle className="text-green-600 text-2xl mb-2" />
                  <p className="text-sm font-semibold text-zinc-900 truncate max-w-full">
                    {uploadedFile.fileName}
                  </p>
                  <p className="text-xs text-green-700 mt-1">
                    Upload successful
                  </p>
                </div>
              ) : (
                <div className="flex flex-col items-center py-2">
                  <FaUpload className="text-sky-600 text-2xl mb-3" />
                  <p className="text-sm font-semibold text-zinc-900">
                    Drop your resume here
                  </p>
                  <p className="text-xs text-zinc-500 mt-1">
                    or click to browse — PDF, DOC, DOCX, TXT (max 10 MB)
                  </p>
                </div>
              )}
            </div>

            {uploadedFile && (
              <div className="space-y-2">
                <p className="text-sm font-medium text-zinc-700">
                  What would you like to do?
                </p>
                <OptionCheckbox
                  icon={<FaUpload />}
                  label="Create resume"
                  description="Build a new resume from this file"
                  checked={selectedOptions.createResume}
                  onChange={() => handleOptionToggle("createResume")}
                />
                <OptionCheckbox
                  icon={<FaRobot />}
                  label="Check ATS score"
                  description="Analyze ATS compatibility"
                  checked={selectedOptions.checkATS}
                  onChange={() => handleOptionToggle("checkATS")}
                />
              </div>
            )}
          </div>

          {uploadedFile && (
            <div className="px-6 py-4 border-t border-zinc-200">
              <button
                onClick={handleDone}
                disabled={
                  isProcessing ||
                  Object.values(selectedOptions).every((v) => !v)
                }
                className="btn-primary w-full"
              >
                {isProcessing ? (
                  <>
                    <FaSpinner className="animate-spin" />
                    {processingStep || "Processing…"}
                  </>
                ) : (
                  "Get started"
                )}
              </button>
            </div>
          )}
        </motion.div>
      </motion.div>

      {/* Loaders - Only render the active one */}
      {showResumeLoader && (
        <ResumeCreationLoader isVisible={showResumeLoader} />
      )}
      {showATSLoader && <ATSCheckingLoader isVisible={showATSLoader} />}
    </AnimatePresence>
  );
};

const OptionCheckbox = ({ icon, label, description, checked, onChange }) => (
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
      className={`w-9 h-9 rounded-lg flex items-center justify-center text-sm shrink-0 ${
        checked ? "bg-sky-600 text-white" : "bg-zinc-100 text-zinc-600"
      }`}
    >
      {icon}
    </span>
    <span className="flex-1 min-w-0">
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
      className={`w-4 h-4 rounded border-2 flex items-center justify-center shrink-0 ${
        checked ? "border-sky-600 bg-sky-600" : "border-zinc-300"
      }`}
    >
      {checked && <FaCheckCircle className="text-white text-xs" />}
    </span>
  </button>
);

export default ResumeUploadModal;
