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

ChartJS.register(ArcElement, Tooltip, Legend);

const scoreColor = (s) => (s >= 80 ? "#16a34a" : s >= 60 ? "#d97706" : "#dc2626");
const scoreText = (s) =>
  s >= 80 ? "text-green-700" : s >= 60 ? "text-amber-700" : "text-red-700";
const scoreLabel = (s) =>
  s >= 80
    ? "Excellent ATS compatibility"
    : s >= 60
    ? "Good — small tweaks recommended"
    : "Needs optimization";

function FeedbackList({ type, items }) {
  if (!items?.length) return null;
  const isPositive = type === "suggestions";
  return (
    <div className="mt-3">
      <div
        className={`flex items-center gap-2 text-xs font-semibold uppercase tracking-wider mb-2 ${
          isPositive ? "text-green-700" : "text-red-700"
        }`}
      >
        {isPositive ? <FiThumbsUp /> : <FiThumbsDown />}
        {isPositive ? "Suggestions" : "To improve"}
      </div>
      <ul className="space-y-1.5 text-sm text-zinc-700 list-disc list-inside pl-1">
        {items.map((item, i) => (
          <li key={i}>{item}</li>
        ))}
      </ul>
    </div>
  );
}

function LoadingState() {
  return (
    <div className="card-flat p-10 md:p-14 text-center max-w-xl mx-auto">
      <div className="w-14 h-14 mx-auto mb-6 rounded-full bg-sky-50 text-sky-600 flex items-center justify-center">
        <FiCpu className="text-2xl animate-pulse" />
      </div>
      <h2 className="text-xl font-semibold text-zinc-900 mb-2">
        Analyzing your resume…
      </h2>
      <p className="text-sm text-zinc-600 mb-8">
        Scanning for ATS readiness and optimization opportunities.
      </p>
      <div className="w-full bg-zinc-100 rounded-full h-1 overflow-hidden">
        <div className="bg-sky-600 h-1 animate-pulse" style={{ width: "70%" }} />
      </div>
    </div>
  );
}

export default function ATSCompatibilityChecker() {
  const { resume } = useResumeData();
  const location = useLocation();
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
      showErrorToast("Please create or upload your resume first.");
      return;
    }
    setCurrentStep("loading");
    try {
      await new Promise((r) => setTimeout(r, 3000));
      const result = await atsScore(resume);
      setAtsResult(result);
    } catch (err) {
      showErrorToast("Failed to check ATS compatibility. Please try again.");
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
      <div className="container-page py-10 md:py-14">
        {currentStep === "intro" && (
          <div className="max-w-xl mx-auto">
            <div className="text-center mb-8">
              <p className="eyebrow mb-3">ATS Checker</p>
              <h1 className="h-section mb-3">Is your resume ATS-ready?</h1>
              <p className="text-zinc-600">
                Most companies use Applicant Tracking Systems to filter resumes.
                Run a quick analysis to see how yours scores.
              </p>
            </div>

            <div className="card-flat p-6 md:p-8">
              <button
                onClick={handleCheckATS}
                disabled={!resume?.name}
                className="btn-primary w-full inline-flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FiSearch /> Check my resume
              </button>
              {!resume?.name && (
                <p className="text-xs text-red-600 mt-3 text-center">
                  Create or upload a resume first to use this feature.
                </p>
              )}
            </div>
          </div>
        )}

        {currentStep === "loading" && <LoadingState />}

        {currentStep === "result" && atsResult && (
          <div className="max-w-6xl mx-auto">
            <header className="mb-8">
              <p className="eyebrow mb-2">ATS Report</p>
              <h1 className="h-section mb-2">Compatibility report</h1>
              {uploadedFile && (
                <p className="text-sm text-zinc-500 inline-flex items-center gap-1.5">
                  <FiFileText /> {uploadedFile.fileName}
                </p>
              )}
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
              {/* Score panel */}
              <aside className="card-flat p-6 lg:sticky lg:top-24">
                <h2 className="text-sm font-semibold text-zinc-500 uppercase tracking-wider mb-4 text-center">
                  Overall score
                </h2>
                <div className="relative w-40 h-40 mx-auto mb-5">
                  <Doughnut
                    data={{
                      datasets: [
                        {
                          data: [atsResult.atsScore, 100 - atsResult.atsScore],
                          backgroundColor: [scoreColor(atsResult.atsScore), "#f4f4f5"],
                          borderColor: ["#ffffff", "#ffffff"],
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
                    <span className={`text-3xl font-bold ${scoreText(atsResult.atsScore)}`}>
                      {atsResult.atsScore}%
                    </span>
                    <span className="text-xs text-zinc-500 mt-1">ATS friendly</span>
                  </div>
                </div>

                <p className={`text-sm font-medium text-center mb-1 ${scoreText(atsResult.atsScore)}`}>
                  {scoreLabel(atsResult.atsScore)}
                </p>
                <p className="text-xs text-zinc-600 text-center mb-6">
                  {atsResult.atsScore >= 80
                    ? "Your resume is well-structured for ATS."
                    : atsResult.atsScore >= 60
                    ? "Some tweaks can improve parsing accuracy."
                    : "Consider significant updates for better performance."}
                </p>

                <button
                  onClick={handleReset}
                  className="btn-secondary w-full inline-flex items-center justify-center gap-2 text-sm"
                >
                  <FiRefreshCw /> Recheck resume
                </button>
              </aside>

              {/* Feedback */}
              <div className="lg:col-span-2 space-y-6">
                {atsResult.sectionWiseFeedback &&
                  Object.keys(atsResult.sectionWiseFeedback).length > 0 && (
                    <section className="card-flat p-6">
                      <h3 className="text-base font-semibold text-zinc-900 mb-5">
                        Section breakdown
                      </h3>
                      <div className="space-y-5">
                        {Object.entries(atsResult.sectionWiseFeedback).map(
                          ([section, feedback]) => (
                            <div
                              key={section}
                              className="border border-zinc-200 rounded-xl p-4"
                            >
                              <h4 className="text-sm font-semibold text-zinc-900 capitalize">
                                {section.replace(/([A-Z])/g, " $1").trim()}
                              </h4>
                              <FeedbackList type="missing" items={feedback.missing} />
                              <FeedbackList type="suggestions" items={feedback.suggestions} />
                              {!feedback.missing?.length &&
                                !feedback.suggestions?.length && (
                                  <p className="text-xs text-zinc-500 italic mt-2">
                                    Looks good — no specific feedback for this section.
                                  </p>
                                )}
                            </div>
                          )
                        )}
                      </div>
                    </section>
                  )}

                {atsResult.generalTips?.length > 0 && (
                  <section className="card-flat p-6">
                    <h3 className="text-base font-semibold text-zinc-900 mb-4">
                      General tips
                    </h3>
                    <ul className="space-y-2.5">
                      {atsResult.generalTips.map((tip, i) => (
                        <li key={i} className="flex items-start gap-2.5 text-sm text-zinc-700">
                          <FiCheckCircle className="text-green-600 mt-0.5 shrink-0" />
                          <span>{tip}</span>
                        </li>
                      ))}
                    </ul>
                  </section>
                )}

                {!atsResult.sectionWiseFeedback &&
                  !atsResult.generalTips?.length && (
                    <section className="card-flat p-10 text-center">
                      <FiCpu className="text-3xl text-zinc-300 mx-auto mb-3" />
                      <h3 className="text-base font-semibold text-zinc-900 mb-1">
                        All clear
                      </h3>
                      <p className="text-sm text-zinc-600">
                        Your resume looks well-optimized for ATS.
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
