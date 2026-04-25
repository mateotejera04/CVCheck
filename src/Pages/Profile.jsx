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
    "w-full px-4 py-3 border border-zinc-200 rounded-xl focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100 text-sm text-zinc-900 bg-white";

  return (
    <div className="surface-base min-h-screen">
      <div className="container-page py-10 md:py-14 max-w-3xl">
        <header className="mb-10">
          <p className="eyebrow mb-2">Profile</p>
          <h1 className="h-section mb-2">Account settings</h1>
          <p className="text-zinc-600">
            Manage your profile information and uploaded resumes.
          </p>
        </header>

        {/* Profile card */}
        <section className="card-flat overflow-hidden mb-8">
          <div className="p-6 md:p-8 flex items-center gap-5 border-b border-zinc-100">
            <div className="w-16 h-16 rounded-full overflow-hidden bg-sky-100 text-sky-700 flex items-center justify-center text-2xl font-semibold shrink-0">
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
              <h2 className="text-lg font-semibold text-zinc-900 truncate">
                {user?.displayName || "User"}
              </h2>
              <p className="text-sm text-zinc-500 truncate">{user?.email}</p>
            </div>
          </div>

          <div className="p-6 md:p-8">
            {editing ? (
              <div className="space-y-5">
                <div>
                  <label className="text-sm font-medium text-zinc-700 mb-2 block">
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
                  <label className="text-sm font-medium text-zinc-700 mb-2 block">
                    Email
                  </label>
                  <input
                    name="email"
                    disabled
                    value={form.email}
                    className={`${inputCls} bg-zinc-50 text-zinc-500 cursor-not-allowed`}
                  />
                  <p className="text-xs text-zinc-500 mt-2">
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
              <div className="space-y-5">
                <Field icon={FiUser} label="Full name" value={user?.displayName || "Not provided"} />
                <Field icon={FiMail} label="Email" value={user?.email} />
                <div className="flex gap-3 pt-2">
                  <button
                    onClick={() => setEditing(true)}
                    className="btn-primary inline-flex items-center gap-2"
                  >
                    <FiEdit2 /> Edit profile
                  </button>
                  <button
                    onClick={handleLogout}
                    className="btn-secondary inline-flex items-center gap-2 hover:!border-red-200 hover:!text-red-600"
                  >
                    <FiLogOut /> Sign out
                  </button>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Uploaded resumes */}
        <section className="card-flat p-6 md:p-8">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-base font-semibold text-zinc-900">Uploaded resumes</h2>
            <button
              type="button"
              onClick={() => setIsUploadModalOpen(true)}
              className="btn-primary inline-flex items-center gap-2 text-sm"
            >
              Upload
            </button>
          </div>

          {loadingResumes ? (
            <div className="flex items-center justify-center py-10 text-sm text-zinc-500">
              <FiClock className="animate-spin mr-2" /> Loading…
            </div>
          ) : uploadedResumes.length === 0 ? (
            <div className="text-center py-10 border border-dashed border-zinc-200 rounded-xl">
              <FiFileText className="text-3xl text-zinc-300 mx-auto mb-3" />
              <p className="text-sm text-zinc-600">No resumes uploaded yet</p>
            </div>
          ) : (
            <ul className="divide-y divide-zinc-100 max-h-[500px] overflow-y-auto">
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

function Field({ icon: Icon, label, value }) {
  return (
    <div>
      <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-zinc-500 mb-1">
        <Icon /> {label}
      </div>
      <p className="text-base text-zinc-900 break-words">{value}</p>
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
    <li className="flex items-center gap-3 py-3">
      <div className="w-9 h-9 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center shrink-0">
        <FiFileText />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-zinc-900 truncate">{resume.fileName}</p>
        <p className="text-xs text-zinc-500">
          {formatFileSize(resume.fileSize)} · {formatDate(resume.uploadedAt)}
        </p>
      </div>
      <div className="flex items-center gap-1 text-zinc-400">
        <button onClick={open} title="View" className="p-2 rounded-md hover:bg-zinc-100 hover:text-zinc-900 transition-colors">
          <FiEye />
        </button>
        <button onClick={download} title="Download" className="p-2 rounded-md hover:bg-zinc-100 hover:text-zinc-900 transition-colors">
          <FiDownload />
        </button>
        <button
          onClick={() => onDelete(resume)}
          title="Delete"
          className="p-2 rounded-md hover:bg-red-50 hover:text-red-600 transition-colors"
        >
          <FiTrash2 />
        </button>
      </div>
    </li>
  );
}

export default Profile;
