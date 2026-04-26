import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  FiPlus,
  FiUpload,
  FiEdit2,
  FiFileText,
  FiClock,
  FiTrash2,
  FiEye,
  FiDownload,
  FiCheckCircle,
  FiArrowRight,
  FiCpu,
} from "react-icons/fi";
import { useResumeData } from "../Contexts/ResumeDataContext";
import { useAuth } from "../Contexts/AuthContext";
import { getUserUploadedResumes, deleteUploadedResume } from "../db/database";
import ResumeUploadModal from "../Components/ResumeUploadModal";
import DeleteConfirmModal from "../Components/DeleteConfirmModal";
import PdfActionsModal from "../Components/PdfActionsModal";
import toast from "react-hot-toast";

export default function Dashboard() {
  const { resume } = useResumeData();
  const { user } = useAuth();
  const [uploadedResumes, setUploadedResumes] = useState([]);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, resume: null });
  const [pdfActionsModal, setPdfActionsModal] = useState({ isOpen: false, resume: null });
  const [isDeleting, setIsDeleting] = useState(false);
  const [loadingResumes, setLoadingResumes] = useState(true);
  const [selectedTemplate, setSelectedTemplate] = useState("Classic");

  useEffect(() => {
    const stored = localStorage.getItem("selectedTemplate");
    if (stored) setSelectedTemplate(stored.charAt(0).toUpperCase() + stored.slice(1));
  }, []);

  const memberSince = user.metadata?.creationTime
    ? new Date(user.metadata.creationTime).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "Unknown";

  const loadUploadedResumes = async () => {
    try {
      setLoadingResumes(true);
      const resumes = await getUserUploadedResumes();
      const sorted = resumes
        .sort((a, b) => new Date(b.uploadedAt) - new Date(a.uploadedAt))
        .slice(0, 5);
      setUploadedResumes(sorted);
    } catch (err) {
      console.error("Error loading uploaded resumes:", err);
      toast.error("Failed to load uploaded resumes");
    } finally {
      setLoadingResumes(false);
    }
  };

  useEffect(() => {
    if (user) loadUploadedResumes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const handleUploadSuccess = () => loadUploadedResumes();

  const handleDeleteResume = (r) => setDeleteModal({ isOpen: true, resume: r });

  const confirmDeleteResume = async () => {
    if (!deleteModal.resume) return;
    setIsDeleting(true);
    try {
      await deleteUploadedResume(deleteModal.resume.id);
      setUploadedResumes((prev) => prev.filter((r) => r.id !== deleteModal.resume.id));
      toast.success("Resume deleted");
      setDeleteModal({ isOpen: false, resume: null });
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete resume");
    } finally {
      setIsDeleting(false);
    }
  };

  const closeDeleteModal = () => {
    if (!isDeleting) setDeleteModal({ isOpen: false, resume: null });
  };

  const handlePdfActions = (r) => setPdfActionsModal({ isOpen: true, resume: r });
  const closePdfActionsModal = () => setPdfActionsModal({ isOpen: false, resume: null });

  const handleViewPdf = (r) => {
    if (r.fileUrl) window.open(r.fileUrl, "_blank");
    else toast.error("File URL not available");
  };

  const handleDownloadPdf = async (r) => {
    try {
      const res = await fetch(r.fileUrl);
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = r.fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      toast.success("Download started");
    } catch (err) {
      console.error(err);
      toast.error("Failed to download file");
    }
  };

  const formatDate = (date) => {
    if (!date) return "—";
    if (typeof date === "object" && date.seconds) date = new Date(date.seconds * 1000);
    else date = new Date(date);
    return date.toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const quickActions = [
    {
      title: "Create new resume",
      description: "Start from scratch with a guided builder.",
      icon: FiPlus,
      link: "/resume-form",
    },
    {
      title: "Upload existing resume",
      description: "Bring in a PDF and enhance it with AI.",
      icon: FiUpload,
      action: () => setIsUploadModalOpen(true),
    },
    {
      title: "Run ATS check",
      description: "See how well your resume passes filters.",
      icon: FiCpu,
      link: "/ats-checker",
    },
  ];

  const greetingName = user?.displayName?.split(" ")[0] || "there";

  return (
    <div className="surface-base min-h-screen">
      <div className="container-page py-12 md:py-16">
        <header className="mb-12">
          <div className="flex items-center gap-3 mb-5">
            <span className="h-px w-10 bg-[color:var(--text-muted)]" />
            <span className="eyebrow">Dashboard</span>
          </div>
          <h1
            className="text-[36px] md:text-[48px] tracking-tight leading-[1.05] text-[color:var(--text-primary)]"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            Welcome back, <em className="italic font-normal">{greetingName}.</em>
          </h1>
          <p className="mt-4 text-[15px] text-[color:var(--text-secondary)]">
            {resume?.name
              ? "Pick up where you left off, or start something new."
              : "Let's get your first resume set up."}
          </p>
        </header>

        <section className="mb-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {quickActions.map((a) => {
              const Icon = a.icon;
              const inner = (
                <div
                  className="p-6 h-full text-left group rounded-2xl transition-colors"
                  style={{
                    border: "1px solid var(--border-hairline)",
                    backgroundColor: "var(--surface-card)",
                  }}
                >
                  <div className="flex items-center justify-between mb-5">
                    <div className="w-10 h-10 rounded-full bg-[color:var(--accent-soft)] text-[color:var(--text-primary)] flex items-center justify-center">
                      <Icon className="text-lg" />
                    </div>
                    <FiArrowRight className="text-[color:var(--text-muted)] group-hover:text-[color:var(--text-primary)] group-hover:translate-x-0.5 transition-all" />
                  </div>
                  <h3
                    className="text-[18px] tracking-tight text-[color:var(--text-primary)] mb-2"
                    style={{ fontFamily: "var(--font-serif)" }}
                  >
                    {a.title}
                  </h3>
                  <p className="text-[13px] text-[color:var(--text-secondary)] leading-relaxed">
                    {a.description}
                  </p>
                </div>
              );
              return a.link ? (
                <Link key={a.title} to={a.link} className="block">
                  {inner}
                </Link>
              ) : (
                <button
                  key={a.title}
                  type="button"
                  onClick={a.action}
                  className="block w-full"
                >
                  {inner}
                </button>
              );
            })}
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <section
            className="lg:col-span-2 p-7 rounded-2xl"
            style={{
              border: "1px solid var(--border-hairline)",
              backgroundColor: "var(--surface-card)",
            }}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="eyebrow">Current resume</h2>
              {resume?.name && (
                <span className="inline-flex items-center gap-1.5 text-[12px] text-[color:var(--status-success)]">
                  <FiCheckCircle /> Ready
                </span>
              )}
            </div>

            {resume?.name ? (
              <>
                <div className="mb-7">
                  <h3
                    className="text-[26px] tracking-tight text-[color:var(--text-primary)] mb-1"
                    style={{ fontFamily: "var(--font-serif)" }}
                  >
                    {resume.name}
                  </h3>
                  <p className="text-[13px] text-[color:var(--text-muted)]">
                    Last updated {formatDate(resume.updatedOn || resume.createdOn)}
                  </p>
                </div>

                <dl
                  className="grid grid-cols-2 text-sm mb-7"
                  style={{
                    borderTop: "1px solid var(--border-hairline)",
                    borderBottom: "1px solid var(--border-hairline)",
                  }}
                >
                  <div
                    className="p-4"
                    style={{ borderRight: "1px solid var(--border-hairline)" }}
                  >
                    <dt className="text-[11px] uppercase tracking-[0.18em] text-[color:var(--text-muted)] mb-1.5">
                      Template
                    </dt>
                    <dd className="text-[color:var(--text-primary)]">
                      {resume.template || selectedTemplate}
                    </dd>
                  </div>
                  <div className="p-4">
                    <dt className="text-[11px] uppercase tracking-[0.18em] text-[color:var(--text-muted)] mb-1.5">
                      Member since
                    </dt>
                    <dd className="text-[color:var(--text-primary)]">{memberSince}</dd>
                  </div>
                </dl>

                <div className="flex gap-3 flex-wrap">
                  <Link to="/resume-form" className="btn-primary inline-flex items-center gap-2">
                    <FiEdit2 /> Edit resume
                  </Link>
                  <Link to="/resume" className="btn-secondary inline-flex items-center gap-2">
                    <FiEye /> Preview
                  </Link>
                </div>
              </>
            ) : (
              <div className="text-center py-10">
                <div className="w-14 h-14 mx-auto mb-5 rounded-full bg-[color:var(--accent-soft)] flex items-center justify-center text-[color:var(--text-primary)]">
                  <FiFileText className="text-xl" />
                </div>
                <h3
                  className="text-[22px] tracking-tight text-[color:var(--text-primary)] mb-1"
                  style={{ fontFamily: "var(--font-serif)" }}
                >
                  No resume yet
                </h3>
                <p className="text-[14px] text-[color:var(--text-secondary)] mb-6">
                  Create your first resume to get started.
                </p>
                <Link to="/resume-form" className="btn-primary inline-flex items-center gap-2">
                  <FiPlus /> Create resume
                </Link>
              </div>
            )}
          </section>

          <section
            className="p-7 rounded-2xl"
            style={{
              border: "1px solid var(--border-hairline)",
              backgroundColor: "var(--surface-card)",
            }}
          >
            <h2 className="eyebrow mb-6">Account</h2>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start justify-between gap-3">
                <span className="text-[color:var(--text-muted)]">Member since</span>
                <span className="text-[color:var(--text-primary)] text-right">{memberSince}</span>
              </li>
              <li className="flex items-start justify-between gap-3">
                <span className="text-[color:var(--text-muted)]">Resumes uploaded</span>
                <span className="text-[color:var(--text-primary)]">{uploadedResumes.length}</span>
              </li>
              <li className="flex items-start justify-between gap-3">
                <span className="text-[color:var(--text-muted)]">Last activity</span>
                <span className="text-[color:var(--text-primary)] text-right text-xs">
                  {uploadedResumes[0]?.uploadedAt
                    ? formatDate(uploadedResumes[0].uploadedAt)
                    : resume?.updatedOn
                    ? formatDate(resume.updatedOn)
                    : "—"}
                </span>
              </li>
            </ul>
            <Link
              to="/profile"
              className="mt-7 inline-flex items-center gap-1.5 text-sm text-[color:var(--text-primary)] underline underline-offset-4 hover:opacity-70"
            >
              View profile <FiArrowRight />
            </Link>
          </section>
        </div>

        <section
          className="mt-10 p-7 rounded-2xl"
          style={{
            border: "1px solid var(--border-hairline)",
            backgroundColor: "var(--surface-card)",
          }}
        >
          <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
            <h2 className="eyebrow">Recent uploads</h2>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsUploadModalOpen(true)}
                className="btn-primary inline-flex items-center gap-2 text-sm"
              >
                <FiUpload /> Upload
              </button>
              {uploadedResumes.length > 0 && (
                <Link
                  to="/profile"
                  className="inline-flex items-center gap-1.5 text-sm text-[color:var(--text-secondary)] hover:text-[color:var(--text-primary)] px-3 py-2"
                >
                  View all <FiArrowRight />
                </Link>
              )}
            </div>
          </div>

          {loadingResumes ? (
            <div className="flex items-center justify-center py-10 text-sm text-[color:var(--text-muted)]">
              <FiClock className="animate-spin mr-2" />
              Loading…
            </div>
          ) : uploadedResumes.length === 0 ? (
            <div
              className="text-center py-10 rounded-xl"
              style={{ border: "1px dashed var(--border-hairline)" }}
            >
              <FiFileText className="text-3xl text-[color:var(--text-muted)] mx-auto mb-3 opacity-50" />
              <p className="text-sm text-[color:var(--text-secondary)] mb-4">
                No resumes uploaded yet
              </p>
              <button
                type="button"
                onClick={() => setIsUploadModalOpen(true)}
                className="btn-secondary inline-flex items-center gap-2 text-sm"
              >
                <FiUpload /> Upload your first
              </button>
            </div>
          ) : (
            <ul style={{ borderTop: "1px solid var(--border-hairline)" }}>
              {uploadedResumes.map((r) => (
                <ResumeRow
                  key={r.id}
                  resume={r}
                  onDelete={handleDeleteResume}
                  onPdfActions={handlePdfActions}
                  onView={handleViewPdf}
                  onDownload={handleDownloadPdf}
                />
              ))}
            </ul>
          )}
        </section>
      </div>

      <ResumeUploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onUploadSuccess={handleUploadSuccess}
      />
      <DeleteConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={closeDeleteModal}
        onConfirm={confirmDeleteResume}
        fileName={deleteModal.resume?.fileName}
        isDeleting={isDeleting}
      />
      <PdfActionsModal
        isOpen={pdfActionsModal.isOpen}
        onClose={closePdfActionsModal}
        selectedResume={pdfActionsModal.resume}
      />
    </div>
  );
}

function ResumeRow({ resume, onDelete, onPdfActions, onView, onDownload }) {
  const formatFileSize = (bytes) => {
    if (!bytes) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
  };
  const formatDate = (d) =>
    new Date(d).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

  return (
    <li
      className="flex items-center gap-4 py-4 group"
      style={{ borderBottom: "1px solid var(--border-hairline)" }}
    >
      <button
        type="button"
        onClick={() => onPdfActions(resume)}
        title="Process this resume"
        className="flex items-center gap-3 flex-1 min-w-0 text-left"
      >
        <div className="w-9 h-9 rounded-full bg-[color:var(--accent-soft)] text-[color:var(--text-primary)] flex items-center justify-center shrink-0">
          <FiFileText />
        </div>
        <div className="min-w-0">
          <p className="text-sm text-[color:var(--text-primary)] truncate">
            {resume.fileName}
          </p>
          <p className="text-xs text-[color:var(--text-muted)] mt-0.5">
            {formatFileSize(resume.fileSize)} · {formatDate(resume.uploadedAt)}
          </p>
        </div>
      </button>

      <div className="flex items-center gap-1 text-[color:var(--text-muted)]">
        <IconButton onClick={() => onView(resume)} label="View" Icon={FiEye} />
        <IconButton onClick={() => onDownload(resume)} label="Download" Icon={FiDownload} />
        <IconButton onClick={() => onDelete(resume)} label="Delete" Icon={FiTrash2} danger />
      </div>
    </li>
  );
}

function IconButton({ onClick, label, Icon, danger }) {
  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      title={label}
      aria-label={label}
      className={`p-2 rounded-md hover:bg-[color:var(--accent-soft)] transition-colors ${
        danger
          ? "hover:text-[color:var(--status-danger)]"
          : "hover:text-[color:var(--text-primary)]"
      }`}
    >
      <Icon />
    </button>
  );
}
