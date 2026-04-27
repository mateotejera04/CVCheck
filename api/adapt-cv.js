import { adaptResumeForJob } from "../config/openai.js";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { resume, jobDescription, locale = "en" } = req.body || {};

  if (!resume || !jobDescription) {
    return res.status(400).json({ error: "Missing resume or jobDescription" });
  }

  try {
    const adapted = await adaptResumeForJob(resume, jobDescription, locale);
    return res.json({ success: true, data: adapted });
  } catch (err) {
    console.error("CV Adapt Error:", err.message);
    return res.status(500).json({
      error: "Failed to adapt CV",
      details: err.message,
    });
  }
}
