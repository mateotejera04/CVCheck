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
          <div
            className="p-12 rounded-2xl"
            style={{
              border: "1px solid var(--border-hairline)",
              backgroundColor: "var(--surface-card)",
            }}
          >
            <div className="w-14 h-14 mx-auto mb-6 rounded-full bg-[color:var(--accent-soft)] text-[color:var(--text-primary)] flex items-center justify-center">
              <FiFileText className="text-2xl" />
            </div>
            <h2
              className="text-[28px] tracking-tight text-[color:var(--text-primary)] mb-3"
              style={{ fontFamily: "var(--font-serif)" }}
            >
              Resume details <em className="italic font-normal">missing.</em>
            </h2>
            <p className="text-[color:var(--text-secondary)] mb-7">
              Fill in your details to start building a resume.
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
      <div className="container-page py-8 md:py-12">
        <div
          className="p-4 mb-6 flex flex-col lg:flex-row gap-4 lg:items-center lg:justify-between rounded-2xl"
          style={{
            border: "1px solid var(--border-hairline)",
            backgroundColor: "var(--surface-card)",
          }}
        >
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <span className="eyebrow">Template</span>
            <div
              className="inline-flex items-center rounded-full p-1 flex-wrap"
              style={{ backgroundColor: "var(--accent-soft)" }}
            >
              {templates.map((t) => (
                <button
                  key={t.value}
                  type="button"
                  onClick={() => setSelectedTemplate(t.value)}
                  className={`px-4 py-1.5 rounded-full text-sm transition-colors ${
                    selectedTemplate === t.value
                      ? "bg-[color:var(--text-primary)] text-[color:var(--surface-base)]"
                      : "text-[color:var(--text-secondary)] hover:text-[color:var(--text-primary)]"
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <span
              className="inline-flex items-center gap-1.5 text-[11px] uppercase tracking-[0.14em] px-3 py-1.5 rounded-full text-[color:var(--text-secondary)]"
              style={{ border: "1px solid var(--border-hairline)" }}
            >
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

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-6 items-start">
          <div
            key={selectedTemplate}
            className="rounded-2xl overflow-hidden"
            style={{
              backgroundColor: "#ffffff",
              border: "1px solid var(--border-hairline)",
            }}
          >
            {renderTemplate()}
          </div>

          <aside className="space-y-4 lg:sticky lg:top-24">
            <div
              className="p-6 rounded-2xl"
              style={{
                border: "1px solid var(--border-hairline)",
                backgroundColor: "var(--surface-card)",
              }}
            >
              <h3 className="eyebrow mb-4">Quick actions</h3>
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

            <div
              className="p-6 rounded-2xl"
              style={{
                border: "1px solid var(--border-hairline)",
                backgroundColor: "var(--surface-card)",
              }}
            >
              <div className="flex items-center gap-2 mb-4">
                <FiInfo className="text-[color:var(--text-primary)]" />
                <h3 className="eyebrow">Tips</h3>
              </div>
              <ul className="text-sm text-[color:var(--text-secondary)] space-y-2.5 leading-relaxed">
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
