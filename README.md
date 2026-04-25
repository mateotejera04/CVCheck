# CVCheck – AI-Powered Resume Builder

CVCheck is an intelligent, AI-powered platform that helps you build, optimize, and perfect your resume to stand out in today's competitive job market.

With a live editor and customizable formatting, you can create professional, ATS-friendly resumes while receiving real-time feedback and suggestions.

---

## ✨ Features

- **📄 Upload & Analyze:** Upload your existing resume (PDF or DOCX) and instantly get an **ATS Compatibility Score** to find out if your resume can get past automated screening.
- **📝 Create from Upload:** Upload your old resume and we'll auto-populate our templates with your information. From there, you can edit, optimize, and give it a fresh new look.

---

## 🚀 Core Features

- **Build From Scratch:** Step-by-step form to guide you through Personal Info, Work Experience, Education, Projects, Skills, and Certifications.
- **Live Resume Preview:** See your changes in real-time. Tweak fonts, colors, and styles until it's _just right_.
- **Templates:**
  - **Classic:** Traditional and formal.
  - **Sidebar:** Modern split-layout with a color accent.
  - **Standard:** Clean, simple, and minimal.
- **AI Bullet Point Enhancer:** Turn boring bullet points into powerful, action-oriented statements.
- **Role-Specific Optimization:** Tailor your resume for a specific role.
- **ATS Compatibility Checker:** Get a score (out of 100) on your resume's ATS-friendliness.
- **Download as PDF:** Pixel-perfect PDF export.
- **Secure User Profiles:** Auth and data via Firebase.

---

## 🛠️ Tech Stack

| Layer              | Technology                                                |
| ------------------ | --------------------------------------------------------- |
| Frontend Framework | React 19 + Vite                                           |
| Styling            | TailwindCSS v4                                            |
| Animations         | Framer Motion                                             |
| Authentication     | Firebase Auth                                             |
| Database           | Firebase Firestore                                        |
| File Storage       | Appwrite                                                  |
| State Management   | React Context API                                         |
| AI Engine          | OpenAI API (resume parsing, ATS check, bullet enhancement) |
| PDF Download       | react-to-print / react-to-pdf                             |
| Hosting            | Vercel                                                    |

---

## 🔒 Security

- API keys managed via `.env` (see `.env.example`).
- User auth and resume data secured via Firebase.
- CORS handled on the API.

---

## 📦 Getting Started

```bash
npm install
cp .env.example .env   # then fill in your keys
npm run dev
```

The dev script runs Vite (5173) + the local Express API (3001) concurrently.

### Required environment variables

- `OPENAI_API_KEY` — for AI features
- `VITE_FIREBASE_*` — Firebase project config (see `.env.example`)
- `VITE_APPWRITE_*` — Appwrite endpoint, project, and bucket IDs

Without these, the app will build but auth and AI features won't function at runtime.
