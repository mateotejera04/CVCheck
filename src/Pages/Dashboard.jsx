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
      <div className="container-page py-10 md:py-14">
        <header className="mb-10">
          <p className="eyebrow mb-2">Dashboard</p>
          <h1 className="h-section mb-2">Welcome back, {greetingName}</h1>
          <p className="text-zinc-600">
            {resume?.name
              ? "Pick up where you left off, or start something new."
              : "Let's get your first resume set up."}
          </p>
        </header>

        {/* Quick actions */}
        <section className="mb-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {quickActions.map((a) => {
              const Icon = a.icon;
              const inner = (
                <div className="card-flat p-5 h-full hover:border-zinc-300 transition-colors text-left group">
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-10 h-10 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center">
                      <Icon className="text-lg" />
                    </div>
                    <FiArrowRight className="text-zinc-300 group-hover:text-sky-600 group-hover:translate-x-0.5 transition-all" />
                  </div>
                  <h3 className="text-base font-semibold text-zinc-900 mb-1">
                    {a.title}
                  </h3>
                  <p className="text-sm text-zinc-600 leading-relaxed">
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
          {/* Resume status */}
          <section className="lg:col-span-2 card-flat p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-base font-semibold text-zinc-900">
                Current resume
              </h2>
              {resume?.name && (
                <span className="inline-flex items-center gap-1.5 text-xs text-green-700">
                  <FiCheckCircle /> Ready
                </span>
              )}
            </div>

            {resume?.name ? (
              <>
                <div className="mb-6">
                  <h3 className="text-xl font-semibold text-zinc-900 mb-1">
                    {resume.name}
                  </h3>
                  <p className="text-sm text-zinc-500">
                    Last updated {formatDate(resume.updatedOn || resume.createdOn)}
                  </p>
                </div>

                <dl className="grid grid-cols-2 gap-px bg-zinc-200 border border-zinc-200 rounded-xl overflow-hidden text-sm mb-6">
                  <div className="bg-white p-4">
                    <dt className="text-xs text-zinc-500 mb-1">Template</dt>
                    <dd className="font-medium text-zinc-900">
                      {resume.template || selectedTemplate}
                    </dd>
                  </div>
                  <div className="bg-white p-4">
                    <dt className="text-xs text-zinc-500 mb-1">Member since</dt>
                    <dd className="font-medium text-zinc-900">{memberSince}</dd>
                  </div>
                </dl>

                <div className="flex gap-3">
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
                <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-zinc-100 flex items-center justify-center">
                  <FiFileText className="text-zinc-400 text-xl" />
                </div>
                <h3 className="text-base font-semibold text-zinc-900 mb-1">
                  No resume yet
                </h3>
                <p className="text-sm text-zinc-600 mb-5">
                  Create your first resume to get started.
                </p>
                <Link to="/resume-form" className="btn-primary inline-flex items-center gap-2">
                  <FiPlus /> Create resume
                </Link>
              </div>
            )}
          </section>

          {/* Account snapshot */}
          <section className="card-flat p-6">
            <h2 className="text-base font-semibold text-zinc-900 mb-5">
              Account
            </h2>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start justify-between gap-3">
                <span className="text-zinc-500">Member since</span>
                <span className="font-medium text-zinc-900 text-right">{memberSince}</span>
              </li>
              <li className="flex items-start justify-between gap-3">
                <span className="text-zinc-500">Resumes uploaded</span>
                <span className="font-medium text-zinc-900">{uploadedResumes.length}</span>
              </li>
              <li className="flex items-start justify-between gap-3">
                <span className="text-zinc-500">Last activity</span>
                <span className="font-medium text-zinc-900 text-right text-xs">
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
              className="mt-6 inline-flex items-center gap-1.5 text-sm text-sky-700 font-medium hover:underline"
            >
              View profile <FiArrowRight />
            </Link>
          </section>
        </div>

        {/* Recent uploads */}
        <section className="mt-10 card-flat p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-base font-semibold text-zinc-900">Recent uploads</h2>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsUploadModalOpen(true)}
                className="btn-primary inline-flex items-center gap-2 text-sm"
              >
                <FiUpload /> Upload
              </button>
              {uploadedResumes.length > 0 && (
                <Link to="/profile" className="btn-ghost inline-flex items-center gap-1.5 text-sm">
                  View all <FiArrowRight />
                </Link>
              )}
            </div>
          </div>

          {loadingResumes ? (
            <div className="flex items-center justify-center py-10 text-sm text-zinc-500">
              <FiClock className="animate-spin mr-2" />
              Loading…
            </div>
          ) : uploadedResumes.length === 0 ? (
            <div className="text-center py-10 border border-dashed border-zinc-200 rounded-xl">
              <FiFileText className="text-3xl text-zinc-300 mx-auto mb-3" />
              <p className="text-sm text-zinc-600 mb-4">No resumes uploaded yet</p>
              <button
                type="button"
                onClick={() => setIsUploadModalOpen(true)}
                className="btn-secondary inline-flex items-center gap-2 text-sm"
              >
                <FiUpload /> Upload your first
              </button>
            </div>
          ) : (
            <ul className="divide-y divide-zinc-100">
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
    <li className="flex items-center gap-4 py-3 group">
      <button
        type="button"
        onClick={() => onPdfActions(resume)}
        title="Process this resume"
        className="flex items-center gap-3 flex-1 min-w-0 text-left"
      >
        <div className="w-9 h-9 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center shrink-0">
          <FiFileText />
        </div>
        <div className="min-w-0">
          <p className="text-sm font-medium text-zinc-900 truncate">
            {resume.fileName}
          </p>
          <p className="text-xs text-zinc-500">
            {formatFileSize(resume.fileSize)} · {formatDate(resume.uploadedAt)}
          </p>
        </div>
      </button>

      <div className="flex items-center gap-1 text-zinc-400">
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
      className={`p-2 rounded-md hover:bg-zinc-100 transition-colors ${
        danger ? "hover:text-red-600" : "hover:text-zinc-900"
      }`}
    >
      <Icon />
    </button>
  );
}
