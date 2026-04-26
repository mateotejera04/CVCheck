// api/enhance.js
import express from "express";
import { enhanceBullet } from "../config/openai.js";
import { checkATSCompatibility } from "../config/openai.js";
import { parseResumeFromFile } from "../config/openai.js";
import { checkATSFromFile } from "../config/openai.js";

const router = express.Router();

router.post("/enhance-bullet", async (req, res) => {
  const { text, locale = "en" } = req.body;
  if (!text) return res.status(400).json({ error: "Text is required" });

  try {
    const result = await enhanceBullet(text, locale);
    res.json({ result });
  } catch (err) {
    console.error("OpenAI error:", err);
    res.status(500).json({ error: "AI request failed" });
  }
});

router.post("/ats-score", async (req, res) => {
  const resume = req.body;
  const locale = req.body?.locale || "en";

  if (!resume) {
    return res.status(400).json({ error: "Missing input" });
  }

  try {
    const atsResult = await checkATSCompatibility(resume, locale);
    return res.json(atsResult);
  } catch (err) {
    console.error("AI ATS Scoring Error:", err.message);
    return res.status(500).json({ error: "Failed to evaluate ATS score" });
  }
});

router.post("/parse-resume", async (req, res) => {
  const { fileUrl, locale = "en" } = req.body;

  if (!fileUrl) {
    return res.status(400).json({ error: "File URL is required" });
  }

  try {
    const parsedResume = await parseResumeFromFile(fileUrl, locale);
    return res.json({ success: true, data: parsedResume });
  } catch (err) {
    console.error("Resume Parsing Error:", err.message);
    return res.status(500).json({
      error: "Failed to parse resume",
      details: err.message,
    });
  }
});

router.post("/ats-check-file", async (req, res) => {
  const { fileUrl, locale = "en" } = req.body;

  if (!fileUrl) {
    return res.status(400).json({ error: "File URL is required" });
  }

  try {
    const atsResult = await checkATSFromFile(fileUrl, locale);
    return res.json({ success: true, data: atsResult });
  } catch (err) {
    console.error("ATS File Analysis Error:", err.message);
    return res.status(500).json({
      error: "Failed to analyze ATS compatibility",
      details: err.message,
    });
  }
});

export default router;
