import { useState, useEffect } from "react";
import { useResumeData } from "../Contexts/ResumeDataContext";
import { useLocation } from "react-router-dom";
import { atsScore } from "../utils/ai";
import {
  FiCpu,
  FiCheckCircle,
  FiThumbsUp,
  FiThumbsDown,
  FiFileText,
  FiRefreshCw,
  FiSearch,
} from "react-icons/fi";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import showErrorToast from "../Components/showErrorToast";
import { useLocale } from "../Contexts/LocaleContext";

ChartJS.register(ArcElement, Tooltip, Legend);

const scoreColor = (s) => (s >= 80 ? "#3f6b3a" : s >= 60 ? "#9a6b1f" : "#9a3a2a");
const scoreText = (s) =>
  s >= 80
    ? "text-[color:var(--status-success)]"
    : s >= 60
    ? "text-[color:var(--status-warn)]"
    : "text-[color:var(--status-danger)]";
const scoreLabel = (s, t) =>
  s >= 80
    ? t("ats.excellent")
    : s >= 60
    ? t("ats.good")
    : t("ats.needsWork");

function FeedbackList({ type, items, t }) {
  if (!items?.length) return null;
  const isPositive = type === "suggestions";
  return (
    <div className="mt-3">
      <div
        className={`flex items-center gap-2 text-[11px] uppercase tracking-[0.18em] mb-2 ${
          isPositive
            ? "text-[color:var(--status-success)]"
            : "text-[color:var(--status-danger)]"
        }`}
      >
        {isPositive ? <FiThumbsUp /> : <FiThumbsDown />}
        {isPositive ? t("ats.suggestions") : t("ats.toImprove")}
      </div>
      <ul className="space-y-1.5 text-sm text-[color:var(--text-secondary)] list-disc list-inside pl-1">
        {items.map((item, i) => (
          <li key={i}>{item}</li>
        ))}
      </ul>
    </div>
  );
}

function LoadingState({ t }) {
  return (
    <div
      className="p-12 md:p-16 text-center max-w-xl mx-auto rounded-2xl"
      style={{
        border: "1px solid var(--border-hairline)",
        backgroundColor: "var(--surface-card)",
      }}
    >
      <div className="w-14 h-14 mx-auto mb-7 rounded-full bg-[color:var(--accent-soft)] text-[color:var(--text-primary)] flex items-center justify-center">
        <FiCpu className="text-2xl animate-pulse" />
      </div>
      <h2
        className="text-[24px] tracking-tight text-[color:var(--text-primary)] mb-2"
        style={{ fontFamily: "var(--font-serif)" }}
      >
        {t("ats.loadingTitle")}{" "}
        <em className="italic font-normal">{t("ats.loadingTitleEmphasis")}</em>
      </h2>
      <p className="text-sm text-[color:var(--text-secondary)] mb-8">
        {t("ats.loadingIntro")}
      </p>
      <div
        className="w-full h-px overflow-hidden"
        style={{ backgroundColor: "var(--border-hairline)" }}
      >
        <div
          className="h-full animate-pulse"
          style={{ width: "70%", backgroundColor: "var(--text-primary)" }}
        />
      </div>
    </div>
  );
}

export default function ATSCompatibilityChecker() {
  const { resume } = useResumeData();
  const location = useLocation();
  const { locale, t } = useLocale();
  const [currentStep, setCurrentStep] = useState("intro");
  const [atsResult, setAtsResult] = useState(() => {
    if (location.state?.atsResult) return location.state.atsResult;
    const saved = localStorage.getItem("atsResult");
    return saved ? JSON.parse(saved) : null;
  });
  const [uploadedFile, setUploadedFile] = useState(
    location.state?.uploadedFile || null
  );

  useEffect(() => {
    if (atsResult) {
      setCurrentStep("result");
      localStorage.setItem("atsResult", JSON.stringify(atsResult));
    }
  }, [atsResult]);

  const handleCheckATS = async () => {
    if (!resume?.name) {
      showErrorToast(t("ats.createFirstToast"));
      return;
    }
    setCurrentStep("loading");
    try {
      await new Promise((r) => setTimeout(r, 3000));
      const result = await atsScore(resume, locale);
      setAtsResult(result);
    } catch (err) {
      showErrorToast(t("ats.checkFailed"));
      console.error(err);
      setCurrentStep("intro");
    }
  };

  const handleReset = () => {
    setAtsResult(null);
    setUploadedFile(null);
    localStorage.removeItem("atsResult");
    setCurrentStep("intro");
  };

  return (
    <div className="surface-base min-h-screen">
      <div className="container-page py-12 md:py-16">
        {currentStep === "intro" && (
          <div className="max-w-xl mx-auto">
            <div className="text-center mb-10">
              <div className="inline-flex items-center gap-3 mb-6">
                <span className="h-px w-10 bg-[color:var(--text-muted)]" />
                <span className="eyebrow">{t("ats.checker")}</span>
                <span className="h-px w-10 bg-[color:var(--text-muted)]" />
              </div>
              <h1
                className="text-[36px] md:text-[44px] tracking-tight leading-[1.05] text-[color:var(--text-primary)] mb-5"
                style={{ fontFamily: "var(--font-serif)" }}
              >
                {t("ats.introTitle")}{" "}
                <em className="italic font-normal">{t("ats.introTitleEmphasis")}</em>
              </h1>
              <p className="text-[color:var(--text-secondary)]">
                {t("ats.intro")}
              </p>
            </div>

            <div
              className="p-7 md:p-9 rounded-2xl"
              style={{
                border: "1px solid var(--border-hairline)",
                backgroundColor: "var(--surface-card)",
              }}
            >
              <button
                onClick={handleCheckATS}
                disabled={!resume?.name}
                className="btn-primary w-full inline-flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FiSearch /> {t("ats.checkMyResume")}
              </button>
              {!resume?.name && (
                <p className="text-xs text-[color:var(--status-danger)] mt-3 text-center">
                  {t("ats.createFirst")}
                </p>
              )}
            </div>
          </div>
        )}

        {currentStep === "loading" && <LoadingState t={t} />}

        {currentStep === "result" && atsResult && (
          <div className="max-w-6xl mx-auto">
            <header className="mb-10">
              <div className="flex items-center gap-3 mb-5">
                <span className="h-px w-10 bg-[color:var(--text-muted)]" />
                <span className="eyebrow">{t("ats.report")}</span>
              </div>
              <h1
                className="text-[36px] md:text-[44px] tracking-tight leading-[1.05] text-[color:var(--text-primary)] mb-3"
                style={{ fontFamily: "var(--font-serif)" }}
              >
                {t("ats.reportTitle")}{" "}
                <em className="italic font-normal">{t("ats.reportTitleEmphasis")}</em>
              </h1>
              {uploadedFile && (
                <p className="text-sm text-[color:var(--text-muted)] inline-flex items-center gap-1.5">
                  <FiFileText /> {uploadedFile.fileName}
                </p>
              )}
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
              <aside
                className="p-7 lg:sticky lg:top-24 rounded-2xl"
                style={{
                  border: "1px solid var(--border-hairline)",
                  backgroundColor: "var(--surface-card)",
                }}
              >
                <h2 className="eyebrow text-center mb-5">{t("ats.overallScore")}</h2>
                <div className="relative w-40 h-40 mx-auto mb-6">
                  <Doughnut
                    data={{
                      datasets: [
                        {
                          data: [atsResult.atsScore, 100 - atsResult.atsScore],
                          backgroundColor: [
                            scoreColor(atsResult.atsScore),
                            "#ede3cf",
                          ],
                          borderColor: ["#fbf7ee", "#fbf7ee"],
                          borderWidth: 4,
                          circumference: 270,
                          rotation: -135,
                          cutout: "75%",
                        },
                      ],
                    }}
                    options={{
                      cutout: "75%",
                      plugins: {
                        legend: { display: false },
                        tooltip: { enabled: false },
                      },
                      aspectRatio: 1,
                    }}
                  />
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span
                      className={`text-[40px] tracking-tight tabular-nums leading-none ${scoreText(
                        atsResult.atsScore
                      )}`}
                      style={{ fontFamily: "var(--font-serif)" }}
                    >
                      {atsResult.atsScore}%
                    </span>
                    <span className="text-[10px] tracking-[0.18em] uppercase text-[color:var(--text-muted)] mt-2">
                      {t("ats.friendly")}
                    </span>
                  </div>
                </div>

                <p
                  className={`text-sm text-center mb-2 ${scoreText(
                    atsResult.atsScore
                  )}`}
                >
                  {scoreLabel(atsResult.atsScore, t)}
                </p>
                <p className="text-xs text-[color:var(--text-secondary)] text-center mb-6">
                  {atsResult.atsScore >= 80
                    ? t("ats.excellentDetail")
                    : atsResult.atsScore >= 60
                    ? t("ats.goodDetail")
                    : t("ats.needsWorkDetail")}
                </p>

                <button
                  onClick={handleReset}
                  className="btn-secondary w-full inline-flex items-center justify-center gap-2 text-sm"
                >
                  <FiRefreshCw /> {t("ats.recheck")}
                </button>
              </aside>

              <div className="lg:col-span-2 space-y-6">
                {atsResult.sectionWiseFeedback &&
                  Object.keys(atsResult.sectionWiseFeedback).length > 0 && (
                    <section
                      className="p-7 rounded-2xl"
                      style={{
                        border: "1px solid var(--border-hairline)",
                        backgroundColor: "var(--surface-card)",
                      }}
                    >
                      <h3 className="eyebrow mb-5">{t("ats.sectionBreakdown")}</h3>
                      <div className="space-y-5">
                        {Object.entries(atsResult.sectionWiseFeedback).map(
                          ([section, feedback]) => (
                            <div
                              key={section}
                              className="rounded-xl p-5"
                              style={{
                                border: "1px solid var(--border-hairline)",
                              }}
                            >
                              <h4
                                className="text-[16px] tracking-tight text-[color:var(--text-primary)] capitalize"
                                style={{ fontFamily: "var(--font-serif)" }}
                              >
                                {section.replace(/([A-Z])/g, " $1").trim()}
                              </h4>
                              <FeedbackList
                                type="missing"
                                items={feedback.missing}
                                t={t}
                              />
                              <FeedbackList
                                type="suggestions"
                                items={feedback.suggestions}
                                t={t}
                              />
                              {!feedback.missing?.length &&
                                !feedback.suggestions?.length && (
                                  <p className="text-xs text-[color:var(--text-muted)] italic mt-2">
                                    {t("ats.sectionGood")}
                                  </p>
                                )}
                            </div>
                          )
                        )}
                      </div>
                    </section>
                  )}

                {atsResult.generalTips?.length > 0 && (
                  <section
                    className="p-7 rounded-2xl"
                    style={{
                      border: "1px solid var(--border-hairline)",
                      backgroundColor: "var(--surface-card)",
                    }}
                  >
                    <h3 className="eyebrow mb-4">{t("ats.generalTips")}</h3>
                    <ul className="space-y-3">
                      {atsResult.generalTips.map((tip, i) => (
                        <li
                          key={i}
                          className="flex items-start gap-2.5 text-sm text-[color:var(--text-secondary)]"
                        >
                          <FiCheckCircle className="text-[color:var(--status-success)] mt-0.5 shrink-0" />
                          <span>{tip}</span>
                        </li>
                      ))}
                    </ul>
                  </section>
                )}

                {!atsResult.sectionWiseFeedback &&
                  !atsResult.generalTips?.length && (
                    <section
                      className="p-10 text-center rounded-2xl"
                      style={{
                        border: "1px solid var(--border-hairline)",
                        backgroundColor: "var(--surface-card)",
                      }}
                    >
                      <FiCpu className="text-3xl text-[color:var(--text-muted)] mx-auto mb-3 opacity-50" />
                      <h3
                        className="text-[20px] tracking-tight text-[color:var(--text-primary)] mb-1"
                        style={{ fontFamily: "var(--font-serif)" }}
                      >
                        {t("ats.allClear")}
                      </h3>
                      <p className="text-sm text-[color:var(--text-secondary)]">
                        {t("ats.allClearDetail")}
                      </p>
                    </section>
                  )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
