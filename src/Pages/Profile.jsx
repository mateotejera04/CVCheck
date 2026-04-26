import { useState, useEffect } from "react";
import { useAuth } from "../Contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import {
  FiEdit2,
  FiLogOut,
  FiUser,
  FiMail,
  FiCheck,
  FiX,
  FiFileText,
  FiEye,
  FiDownload,
  FiTrash2,
  FiClock,
} from "react-icons/fi";
import showSuccessToast from "../Components/showSuccessToast";
import {
  getUserUploadedResumes,
  deleteUploadedResume,
  getUserProfile,
} from "../db/database";
import ResumeUploadModal from "../Components/ResumeUploadModal";
import DeleteConfirmModal from "../Components/DeleteConfirmModal";
import toast from "react-hot-toast";

const Profile = () => {
  const { user, logout, updateUser } = useAuth();
  const navigate = useNavigate();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    name: user?.displayName || "",
    email: user?.email || "",
  });
  const [uploadedResumes, setUploadedResumes] = useState([]);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [loadingResumes, setLoadingResumes] = useState(true);
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, resume: null });
  const [isDeleting, setIsDeleting] = useState(false);
  const [userProfile, setUserProfile] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const loadResumes = async () => {
    try {
      setLoadingResumes(true);
      const resumes = await getUserUploadedResumes();
      const sorted = resumes.sort(
        (a, b) => new Date(b.uploadedAt) - new Date(a.uploadedAt)
      );
      setUploadedResumes(sorted);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load resumes");
    } finally {
      setLoadingResumes(false);
    }
  };

  useEffect(() => {
    const loadAll = async () => {
      try {
        await loadResumes();
        const profile = await getUserProfile();
        setUserProfile(profile);
      } catch (err) {
        console.error(err);
      }
    };
    if (user) loadAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const handleUploadSuccess = () => loadResumes();

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

  const handleSave = async () => {
    try {
      await updateUser({ displayName: form.name });
      setEditing(false);
      showSuccessToast("Profile updated");
    } catch (err) {
      console.error(err);
    }
  };

  const handleLogout = () => {
    logout();
    showSuccessToast("Logged out");
    navigate("/");
  };

  const initials = (user?.displayName || user?.email || "U").charAt(0).toUpperCase();

  const inputCls =
    "w-full bg-transparent border-0 border-b border-[#cdbda6] py-2.5 text-[15px] focus:outline-none focus:border-[color:var(--text-primary)] transition-colors text-[color:var(--text-primary)]";

  return (
    <div className="surface-base min-h-screen">
      <div className="container-page py-12 md:py-16 max-w-3xl">
        <header className="mb-12">
          <div className="flex items-center gap-3 mb-5">
            <span className="h-px w-10 bg-[color:var(--text-muted)]" />
            <span className="eyebrow">Profile</span>
          </div>
          <h1
            className="text-[36px] md:text-[48px] tracking-tight leading-[1.05] text-[color:var(--text-primary)]"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            Account <em className="italic font-normal">settings.</em>
          </h1>
          <p className="mt-4 text-[15px] text-[color:var(--text-secondary)]">
            Manage your profile information and uploaded resumes.
          </p>
        </header>

        <section
          className="overflow-hidden mb-8 rounded-2xl"
          style={{
            border: "1px solid var(--border-hairline)",
            backgroundColor: "var(--surface-card)",
          }}
        >
          <div
            className="p-7 md:p-8 flex items-center gap-5"
            style={{ borderBottom: "1px solid var(--border-hairline)" }}
          >
            <div
              className="w-16 h-16 rounded-full overflow-hidden bg-[color:var(--text-primary)] text-[color:var(--surface-base)] flex items-center justify-center text-2xl shrink-0"
              style={{ fontFamily: "var(--font-serif)" }}
            >
              {userProfile?.imgUrl ? (
                <img
                  src={userProfile.imgUrl}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                initials
              )}
            </div>
            <div className="min-w-0">
              <h2
                className="text-[22px] tracking-tight text-[color:var(--text-primary)] truncate"
                style={{ fontFamily: "var(--font-serif)" }}
              >
                {user?.displayName || "User"}
              </h2>
              <p className="text-sm text-[color:var(--text-muted)] truncate mt-0.5">
                {user?.email}
              </p>
            </div>
          </div>

          <div className="p-7 md:p-8">
            {editing ? (
              <div className="space-y-7">
                <div>
                  <label className="block text-[11px] tracking-[0.18em] uppercase mb-2 text-[color:var(--text-muted)]">
                    Full name
                  </label>
                  <input
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Your name"
                    className={inputCls}
                  />
                </div>
                <div>
                  <label className="block text-[11px] tracking-[0.18em] uppercase mb-2 text-[color:var(--text-muted)]">
                    Email
                  </label>
                  <input
                    name="email"
                    disabled
                    value={form.email}
                    className={`${inputCls} text-[color:var(--text-muted)] cursor-not-allowed`}
                  />
                  <p className="text-xs text-[color:var(--text-muted)] mt-2">
                    Email cannot be changed.
                  </p>
                </div>
                <div className="flex gap-3 pt-1">
                  <button onClick={handleSave} className="btn-primary inline-flex items-center gap-2">
                    <FiCheck /> Save
                  </button>
                  <button
                    onClick={() => setEditing(false)}
                    className="btn-secondary inline-flex items-center gap-2"
                  >
                    <FiX /> Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <ProfileField icon={FiUser} label="Full name" value={user?.displayName || "Not provided"} />
                <ProfileField icon={FiMail} label="Email" value={user?.email} />
                <div className="flex gap-3 pt-3 flex-wrap">
                  <button
                    onClick={() => setEditing(true)}
                    className="btn-primary inline-flex items-center gap-2"
                  >
                    <FiEdit2 /> Edit profile
                  </button>
                  <button
                    onClick={handleLogout}
                    className="btn-secondary inline-flex items-center gap-2"
                  >
                    <FiLogOut /> Sign out
                  </button>
                </div>
              </div>
            )}
          </div>
        </section>

        <section
          className="p-7 md:p-8 rounded-2xl"
          style={{
            border: "1px solid var(--border-hairline)",
            backgroundColor: "var(--surface-card)",
          }}
        >
          <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
            <h2 className="eyebrow">Uploaded resumes</h2>
            <button
              type="button"
              onClick={() => setIsUploadModalOpen(true)}
              className="btn-primary inline-flex items-center gap-2 text-sm"
            >
              Upload
            </button>
          </div>

          {loadingResumes ? (
            <div className="flex items-center justify-center py-10 text-sm text-[color:var(--text-muted)]">
              <FiClock className="animate-spin mr-2" /> Loading…
            </div>
          ) : uploadedResumes.length === 0 ? (
            <div
              className="text-center py-10 rounded-xl"
              style={{ border: "1px dashed var(--border-hairline)" }}
            >
              <FiFileText className="text-3xl text-[color:var(--text-muted)] mx-auto mb-3 opacity-50" />
              <p className="text-sm text-[color:var(--text-secondary)]">
                No resumes uploaded yet
              </p>
            </div>
          ) : (
            <ul
              className="max-h-[500px] overflow-y-auto"
              style={{ borderTop: "1px solid var(--border-hairline)" }}
            >
              {uploadedResumes.map((r) => (
                <ProfileResumeRow key={r.id} resume={r} onDelete={handleDeleteResume} />
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
    </div>
  );
};

function ProfileField({ icon: Icon, label, value }) {
  return (
    <div>
      <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.18em] text-[color:var(--text-muted)] mb-1.5">
        <Icon /> {label}
      </div>
      <p className="text-[16px] text-[color:var(--text-primary)] break-words">
        {value}
      </p>
    </div>
  );
}

function ProfileResumeRow({ resume, onDelete }) {
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

  const open = () => resume.fileUrl && window.open(resume.fileUrl, "_blank");
  const download = async () => {
    try {
      const res = await fetch(resume.fileUrl);
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = resume.fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch {
      toast.error("Failed to download");
    }
  };

  return (
    <li
      className="flex items-center gap-3 py-4"
      style={{ borderBottom: "1px solid var(--border-hairline)" }}
    >
      <div className="w-9 h-9 rounded-full bg-[color:var(--accent-soft)] text-[color:var(--text-primary)] flex items-center justify-center shrink-0">
        <FiFileText />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm text-[color:var(--text-primary)] truncate">
          {resume.fileName}
        </p>
        <p className="text-xs text-[color:var(--text-muted)] mt-0.5">
          {formatFileSize(resume.fileSize)} · {formatDate(resume.uploadedAt)}
        </p>
      </div>
      <div className="flex items-center gap-1 text-[color:var(--text-muted)]">
        <button
          onClick={open}
          title="View"
          className="p-2 rounded-md hover:bg-[color:var(--accent-soft)] hover:text-[color:var(--text-primary)] transition-colors"
        >
          <FiEye />
        </button>
        <button
          onClick={download}
          title="Download"
          className="p-2 rounded-md hover:bg-[color:var(--accent-soft)] hover:text-[color:var(--text-primary)] transition-colors"
        >
          <FiDownload />
        </button>
        <button
          onClick={() => onDelete(resume)}
          title="Delete"
          className="p-2 rounded-md hover:bg-[color:var(--status-danger-soft)] hover:text-[color:var(--status-danger)] transition-colors"
        >
          <FiTrash2 />
        </button>
      </div>
    </li>
  );
}

export default Profile;
