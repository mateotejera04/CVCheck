import { useEffect, useState } from "react";
import ClassicTemplate from "../Components/Templates/ClassicTemplate";
import SidebarTemplate from "../Components/Templates/SidebarTemplate";
import StandardTemplate from "../Components/Templates/StandardTemplate";
import ModernTemplate from "../Components/Templates/ModernTemplate";
import { useEditResume } from "../Contexts/EditResumeContext";
import { useResumeData } from "../Contexts/ResumeDataContext";
import {
  useClassicSetting,
  useSidebarSetting,
  useStandardSetting,
  useModernSetting,
} from "../Contexts/CombinedTemplateContext";
import { useNavigate } from "react-router-dom";
import {
  FiEdit2,
  FiSave,
  FiEye,
  FiFileText,
  FiArrowRight,
  FiInfo,
} from "react-icons/fi";
import {
  editClassicSettings,
  editSidebarSettings,
  editStandardSettings,
  editModernSettings,
  updateResume,
} from "../db/database";
import showSuccessToast from "../Components/showSuccessToast";
import showErrorToast from "../Components/showErrorToast";

const templates = [
  { value: "classic", label: "Classic" },
  { value: "sidebar", label: "Sidebar" },
  { value: "standard", label: "Standard" },
  { value: "modern", label: "Modern" },
];

export default function Resume() {
  const navigate = useNavigate();
  const { resume, setResume } = useResumeData();
  const { classicSettings, setClassicSettings } = useClassicSetting();
  const { sidebarSettings, setSidebarSettings } = useSidebarSetting();
  const { standardSettings, setStandardSettings } = useStandardSetting();
  const { modernSettings, setModernSettings } = useModernSetting();

  const [selectedTemplate, setSelectedTemplate] = useState(
    () => localStorage.getItem("selectedTemplate") || "classic"
  );
  const { isEditable, toggleEditing } = useEditResume();

  useEffect(() => {
    localStorage.setItem("selectedTemplate", selectedTemplate);
  }, [selectedTemplate]);

  const [sectionOrder] = useState([
    "details",
    "description",
    "skills",
    "experience",
    "projects",
    "education",
    "achievements",
  ]);

  const [visibleSections] = useState({
    details: true,
    description: true,
    skills: true,
    experience: true,
    projects: true,
    education: true,
    achievements: true,
  });

  const handleSaveAllChanges = async () => {
    try {
      await Promise.all([
        editClassicSettings(classicSettings),
        editSidebarSettings(sidebarSettings),
        editStandardSettings(standardSettings),
        editModernSettings(modernSettings),
        updateResume(resume),
      ]);
      showSuccessToast("Changes saved");
    } catch (err) {
      showErrorToast("Failed to save changes.");
      console.error(err);
    }
  };

  if (!resume?.name || resume.name.trim() === "") {
    return (
      <div className="surface-base min-h-screen">
        <div className="container-page py-20 max-w-xl mx-auto text-center">
          <div className="card-flat p-10">
            <div className="w-14 h-14 mx-auto mb-5 rounded-full bg-sky-50 text-sky-600 flex items-center justify-center">
              <FiFileText className="text-2xl" />
            </div>
            <h2 className="h-section mb-3">Resume details missing</h2>
            <p className="text-zinc-600 mb-6">
              Fill in your details to get started building a resume.
            </p>
            <button
              onClick={() => navigate("/resume-form")}
              className="btn-primary inline-flex items-center gap-2"
            >
              Create resume <FiArrowRight />
            </button>
          </div>
        </div>
      </div>
    );
  }

  const renderTemplate = () => {
    const common = {
      resume,
      onChange: setResume,
      sectionOrder,
      visibleSections,
    };
    if (selectedTemplate === "sidebar")
      return <SidebarTemplate {...common} settings={sidebarSettings} onSettingsChange={setSidebarSettings} />;
    if (selectedTemplate === "classic")
      return <ClassicTemplate {...common} settings={classicSettings} onSettingsChange={setClassicSettings} />;
    if (selectedTemplate === "standard")
      return <StandardTemplate {...common} settings={standardSettings} onSettingsChange={setStandardSettings} />;
    if (selectedTemplate === "modern")
      return <ModernTemplate {...common} settings={modernSettings} onSettingsChange={setModernSettings} />;
    return null;
  };

  return (
    <div className="surface-base min-h-screen">
      <div className="container-page py-8 md:py-10">
        {/* Toolbar */}
        <div className="card-flat p-4 mb-6 flex flex-col lg:flex-row gap-4 lg:items-center lg:justify-between">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <span className="text-xs uppercase tracking-wider text-zinc-500 font-medium">
              Template
            </span>
            <div className="inline-flex items-center bg-zinc-100 rounded-lg p-1 flex-wrap">
              {templates.map((t) => (
                <button
                  key={t.value}
                  type="button"
                  onClick={() => setSelectedTemplate(t.value)}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                    selectedTemplate === t.value
                      ? "bg-white text-zinc-900 shadow-sm"
                      : "text-zinc-600 hover:text-zinc-900"
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 text-xs text-zinc-500 px-2.5 py-1 rounded-md bg-zinc-100">
              <FiEye /> {isEditable ? "Edit mode" : "View mode"}
            </span>
            <button
              type="button"
              onClick={() => {
                if (isEditable) handleSaveAllChanges();
                toggleEditing();
              }}
              className="btn-primary inline-flex items-center gap-2 text-sm"
            >
              {isEditable ? (
                <>
                  <FiSave /> Save changes
                </>
              ) : (
                <>
                  <FiEdit2 /> Edit resume
                </>
              )}
            </button>
          </div>
        </div>

        {/* Preview + side panel */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-6 items-start">
          <div key={selectedTemplate} className="bg-white rounded-2xl border border-zinc-200 overflow-hidden">
            {renderTemplate()}
          </div>

          <aside className="space-y-4 lg:sticky lg:top-24">
            <div className="card-flat p-5">
              <h3 className="text-sm font-semibold text-zinc-900 mb-3">
                Quick actions
              </h3>
              <div className="space-y-2">
                <button
                  onClick={() => navigate("/resume-form")}
                  className="btn-secondary w-full inline-flex items-center justify-between text-sm"
                >
                  Edit details <FiArrowRight />
                </button>
                <button
                  onClick={() => navigate("/ats-checker")}
                  className="btn-secondary w-full inline-flex items-center justify-between text-sm"
                >
                  Check ATS score <FiArrowRight />
                </button>
              </div>
            </div>

            <div className="border border-zinc-200 rounded-2xl p-5 bg-white">
              <div className="flex items-center gap-2 mb-3">
                <FiInfo className="text-sky-600" />
                <h3 className="text-sm font-semibold text-zinc-900">Tips</h3>
              </div>
              <ul className="text-sm text-zinc-600 space-y-2.5 leading-relaxed">
                <li>Edit on a desktop for better layout control.</li>
                <li>Tweak the font size to balance density and readability.</li>
                <li>If a section feels too long, summarize. Too short — add specifics.</li>
              </ul>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
