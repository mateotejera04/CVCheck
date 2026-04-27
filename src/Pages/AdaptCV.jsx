import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  FiArrowRight,
  FiBriefcase,
  FiFileText,
  FiRefreshCw,
  FiSave,
  FiTrash2,
  FiZap,
} from "react-icons/fi";
import { useResumeData } from "../Contexts/ResumeDataContext";
import { useLocale } from "../Contexts/LocaleContext";
import { adaptCV } from "../utils/ai";
import {
  deleteAdaptedResume,
  getAdaptedResume,
  getAdaptedResumes,
  saveAdaptedResume,
} from "../db/database";
import showSuccessToast from "../Components/showSuccessToast";
import showErrorToast from "../Components/showErrorToast";
import ClassicTemplate from "../Components/Templates/ClassicTemplate";
import SidebarTemplate from "../Components/Templates/SidebarTemplate";
import StandardTemplate from "../Components/Templates/StandardTemplate";
import ModernTemplate from "../Components/Templates/ModernTemplate";

const TEMPLATE_BY_NAME = {
  classic: ClassicTemplate,
  sidebar: SidebarTemplate,
  standard: StandardTemplate,
  modern: ModernTemplate,
};

const pickTemplate = (name) => TEMPLATE_BY_NAME[name] || ModernTemplate;

export default function AdaptCV() {
  const { resume } = useResumeData();
  const { t, locale } = useLocale();
  const navigate = useNavigate();
  const { id } = useParams();

  const [jobTitle, setJobTitle] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [adapted, setAdapted] = useState(null);
  const [loading, setLoading] = useState(false);
  const [savedList, setSavedList] = useState([]);
  const [savedTemplate, setSavedTemplate] = useState(null);
  const readingMode = Boolean(id);

  const selectedTemplate = useMemo(() => {
    if (savedTemplate) return savedTemplate;
    return localStorage.getItem("selectedTemplate") || "modern";
  }, [savedTemplate]);

  const TemplateComponent = pickTemplate(selectedTemplate);

  const refreshSaved = async () => {
    try {
      const list = await getAdaptedResumes();
      setSavedList(list);
    } catch (err) {
      console.error("Failed to load adapted resumes:", err);
    }
  };

  useEffect(() => {
    refreshSaved();
  }, []);

  useEffect(() => {
    if (!id) {
      setAdapted(null);
      setJobTitle("");
      setJobDescription("");
      setSavedTemplate(null);
      return;
    }
    let cancelled = false;
    (async () => {
      try {
        const item = await getAdaptedResume(id);
        if (cancelled) return;
        if (!item) {
          showErrorToast(t("adaptCV.notFound"));
          navigate("/adapt-cv", { replace: true });
          return;
        }
        setAdapted(item.resume || null);
        setJobTitle(item.title || "");
        setJobDescription(item.jobDescription || "");
        setSavedTemplate(item.templateUsed || null);
      } catch (err) {
        console.error("Failed to load adapted resume:", err);
        if (!cancelled) showErrorToast(t("adaptCV.error"));
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [id, navigate, t]);

  const handleGenerate = async () => {
    if (!resume?.name) {
      showErrorToast(t("adaptCV.createFirstToast"));
      return;
    }
    if (!jobDescription.trim()) {
      showErrorToast(t("adaptCV.descriptionRequired"));
      return;
    }
    setLoading(true);
    try {
      const result = await adaptCV({
        resume,
        jobDescription: jobDescription.trim(),
        locale,
      });
      setAdapted(result);
    } catch (err) {
      console.error("Adapt CV failed:", err);
      showErrorToast(t("adaptCV.error"));
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!adapted) return;
    const fallback = jobDescription.trim().slice(0, 60);
    const title =
      jobTitle.trim() ||
      (fallback.length === 60 ? `${fallback}...` : fallback) ||
      t("adaptCV.untitled");
    try {
      const newId = await saveAdaptedResume({
        title,
        jobDescription: jobDescription.trim(),
        resume: adapted,
        templateUsed: selectedTemplate,
      });
      showSuccessToast(t("adaptCV.savedToast"));
      await refreshSaved();
      if (newId) navigate(`/adapt-cv/${newId}`);
    } catch (err) {
      console.error("Failed to save adapted resume:", err);
      showErrorToast(t("adaptCV.saveFailed"));
    }
  };

  const handleDelete = async (deleteId) => {
    if (!window.confirm(t("adaptCV.confirmDelete"))) return;
    try {
      await deleteAdaptedResume(deleteId);
      showSuccessToast(t("adaptCV.deletedToast"));
      if (deleteId === id) navigate("/adapt-cv", { replace: true });
      await refreshSaved();
    } catch (err) {
      console.error("Failed to delete adapted resume:", err);
      showErrorToast(t("adaptCV.error"));
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
              {t("adaptCV.gatingTitle")}{" "}
              <em className="italic font-normal">
                {t("adaptCV.gatingTitleEmphasis")}
              </em>
            </h2>
            <p className="text-[color:var(--text-secondary)] mb-7">
              {t("adaptCV.createFirst")}
            </p>
            <button
              onClick={() => navigate("/resume-form")}
              className="btn-primary inline-flex items-center gap-2"
            >
              {t("resumePage.createResume")} <FiArrowRight />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="surface-base min-h-screen">
      <div className="container-page py-8 md:py-12">
        <header className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <span className="h-px w-10 bg-[color:var(--text-muted)]" />
            <span className="eyebrow">{t("adaptCV.eyebrow")}</span>
          </div>
          <h1
            className="text-[32px] md:text-[40px] tracking-tight leading-[1.05] text-[color:var(--text-primary)] mb-3"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            {t("adaptCV.title")}{" "}
            <em className="italic font-normal">
              {t("adaptCV.titleEmphasis")}
            </em>
          </h1>
          <p className="text-[color:var(--text-secondary)] max-w-2xl">
            {t("adaptCV.subtitle")}
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-[400px_1fr] gap-6 items-start">
          <aside className="space-y-4 lg:sticky lg:top-24">
            <div
              className="p-6 rounded-2xl"
              style={{
                border: "1px solid var(--border-hairline)",
                backgroundColor: "var(--surface-card)",
              }}
            >
              <h3 className="eyebrow mb-4">{t("adaptCV.inputTitle")}</h3>
              <div className="space-y-4">
                <div>
                  <label className="text-xs uppercase tracking-[0.18em] text-[color:var(--text-muted)] mb-1.5 block">
                    {t("adaptCV.jobTitleLabel")}
                  </label>
                  <input
                    type="text"
                    value={jobTitle}
                    onChange={(e) => setJobTitle(e.target.value)}
                    placeholder={t("adaptCV.jobTitlePlaceholder")}
                    disabled={readingMode || loading}
                    className="w-full px-3.5 py-2.5 rounded-lg text-sm bg-[color:var(--surface-base)] border border-[color:var(--border-hairline)] focus:outline-none focus:border-[color:var(--text-primary)] transition-colors text-[color:var(--text-primary)] placeholder:text-[color:var(--text-muted)] disabled:opacity-60 disabled:cursor-not-allowed"
                  />
                </div>

                <div>
                  <label className="text-xs uppercase tracking-[0.18em] text-[color:var(--text-muted)] mb-1.5 block">
                    {t("adaptCV.jobDescriptionLabel")}
                  </label>
                  <textarea
                    rows={12}
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                    placeholder={t("adaptCV.placeholder")}
                    disabled={readingMode || loading}
                    className="w-full px-3.5 py-3 rounded-lg text-sm bg-[color:var(--surface-base)] border border-[color:var(--border-hairline)] focus:outline-none focus:border-[color:var(--text-primary)] transition-colors text-[color:var(--text-primary)] placeholder:text-[color:var(--text-muted)] resize-y disabled:opacity-60 disabled:cursor-not-allowed"
                  />
                </div>

                {!readingMode && (
                  <button
                    onClick={handleGenerate}
                    disabled={loading || !jobDescription.trim()}
                    className="btn-primary w-full inline-flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <>{t("adaptCV.generating")}</>
                    ) : adapted ? (
                      <>
                        <FiRefreshCw /> {t("adaptCV.regenerate")}
                      </>
                    ) : (
                      <>
                        <FiZap /> {t("adaptCV.generate")}
                      </>
                    )}
                  </button>
                )}

                {!readingMode && adapted && !loading && (
                  <button
                    onClick={handleSave}
                    className="btn-secondary w-full inline-flex items-center justify-center gap-2 text-sm"
                  >
                    <FiSave /> {t("adaptCV.save")}
                  </button>
                )}

                {readingMode && (
                  <button
                    onClick={() => navigate("/adapt-cv")}
                    className="btn-secondary w-full inline-flex items-center justify-center gap-2 text-sm"
                  >
                    <FiZap /> {t("adaptCV.newAdaptation")}
                  </button>
                )}
              </div>
            </div>

            <div
              className="p-6 rounded-2xl"
              style={{
                border: "1px solid var(--border-hairline)",
                backgroundColor: "var(--surface-card)",
              }}
            >
              <h3 className="eyebrow mb-4">{t("adaptCV.savedTitle")}</h3>
              {savedList.length === 0 ? (
                <p className="text-xs text-[color:var(--text-muted)]">
                  {t("adaptCV.noSaved")}
                </p>
              ) : (
                <ul className="space-y-1.5">
                  {savedList.map((item) => {
                    const isActive = item.id === id;
                    return (
                      <li
                        key={item.id}
                        className={`flex items-center justify-between gap-2 rounded-lg px-2 py-1.5 transition-colors ${
                          isActive
                            ? "bg-[color:var(--accent-soft)]"
                            : "hover:bg-[color:var(--accent-soft)]"
                        }`}
                      >
                        <button
                          onClick={() => navigate(`/adapt-cv/${item.id}`)}
                          className="flex-1 text-left text-sm text-[color:var(--text-secondary)] hover:text-[color:var(--text-primary)] truncate flex items-center gap-2"
                          title={item.title}
                        >
                          <FiBriefcase
                            className="opacity-60 shrink-0"
                            size={13}
                          />
                          <span className="truncate">
                            {item.title || t("adaptCV.untitled")}
                          </span>
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="p-1.5 text-[color:var(--text-muted)] hover:text-[color:var(--status-danger)] transition-colors shrink-0"
                          title={t("adaptCV.delete")}
                          aria-label={t("adaptCV.delete")}
                        >
                          <FiTrash2 size={14} />
                        </button>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          </aside>

          <div
            key={`${selectedTemplate}-${id || "new"}-${adapted ? "ready" : "empty"}`}
            className="rounded-2xl overflow-hidden"
            style={{
              backgroundColor: "#ffffff",
              border: "1px solid var(--border-hairline)",
            }}
          >
            {loading ? (
              <div className="p-16 text-center">
                <div className="w-14 h-14 mx-auto mb-6 rounded-full bg-[color:var(--accent-soft)] text-[color:var(--text-primary)] flex items-center justify-center">
                  <FiZap className="text-2xl animate-pulse" />
                </div>
                <h3
                  className="text-[24px] tracking-tight text-[color:var(--text-primary)] mb-2"
                  style={{ fontFamily: "var(--font-serif)" }}
                >
                  {t("adaptCV.loadingTitle")}
                </h3>
                <p className="text-sm text-[color:var(--text-secondary)] max-w-md mx-auto">
                  {t("adaptCV.loadingIntro")}
                </p>
              </div>
            ) : adapted ? (
              <TemplateComponent resume={adapted} />
            ) : (
              <div className="p-16 text-center">
                <div className="w-14 h-14 mx-auto mb-6 rounded-full bg-[color:var(--accent-soft)] text-[color:var(--text-primary)] flex items-center justify-center">
                  <FiFileText className="text-2xl" />
                </div>
                <h3
                  className="text-[24px] tracking-tight text-[color:var(--text-primary)] mb-2"
                  style={{ fontFamily: "var(--font-serif)" }}
                >
                  {t("adaptCV.emptyTitle")}
                </h3>
                <p className="text-sm text-[color:var(--text-secondary)] max-w-md mx-auto">
                  {t("adaptCV.empty")}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
