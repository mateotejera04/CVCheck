const API_BASE = import.meta.env.VITE_API_BASE || "/api";

// Enhance a single bullet point
export async function enhance(text, locale = "en") {
  try {
    const res = await fetch(`${API_BASE}/enhance-bullet`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text, locale }),
    });

    const data = await res.json();
    return data.result || "";
  } catch (err) {
    console.error("AI Enhance Error:", err);
    return "";
  }
}

export async function atsScore(resume, locale = "en") {
  try {
    const res = await fetch(`${API_BASE}/ats-score`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...resume, locale }),
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || "Failed to fetch ATS score");
    }

    const data = await res.json();
    return data;
  } catch (err) {
    console.error("❌ ATS Score API Error:", err.message);
    return { error: err.message || "ATS scoring failed" };
  }
}

// Parse resume from uploaded file URL
export async function parseResumeFromUpload(fileUrl, locale = "en") {
  try {
    console.log("Parsing resume from URL:", fileUrl); // Debug log

    const res = await fetch(`${API_BASE}/parse-resume`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fileUrl, locale }),
    });

    console.log("API Response status:", res.status); // Debug log

    const data = await res.json();
    console.log("API Response data:", data); // Debug log

    if (!res.ok) {
      throw new Error(data.error || `HTTP ${res.status}: ${res.statusText}`);
    }

    if (!data.success) {
      throw new Error(data.error || data.details || "Failed to parse resume");
    }

    return data.data;
  } catch (err) {
    console.error("Resume Parsing Error:", err);
    throw err;
  }
}

// Adapt the user's saved resume to a specific job description.
// Returns an adapted resume object with the same shape as the input.
export async function adaptCV({ resume, jobDescription, locale = "en" }) {
  try {
    const res = await fetch(`${API_BASE}/adapt-cv`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ resume, jobDescription, locale }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error || `HTTP ${res.status}: ${res.statusText}`);
    }

    if (!data.success) {
      throw new Error(data.error || data.details || "Failed to adapt CV");
    }

    return data.data;
  } catch (err) {
    console.error("CV Adapt Error:", err);
    throw err;
  }
}

// Check ATS compatibility from uploaded file URL
export async function checkATSFromUpload(fileUrl, locale = "en") {
  try {
    console.log("Checking ATS compatibility from URL:", fileUrl); // Debug log

    const res = await fetch(`${API_BASE}/ats-check-file`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fileUrl, locale }),
    });

    console.log("ATS Check API Response status:", res.status); // Debug log

    const data = await res.json();
    console.log("ATS Check API Response data:", data); // Debug log

    if (!res.ok) {
      throw new Error(data.error || `HTTP ${res.status}: ${res.statusText}`);
    }

    if (!data.success) {
      throw new Error(data.error || "Failed to check ATS compatibility");
    }

    return data.data;
  } catch (err) {
    console.error("ATS Check Error:", err);
    throw err;
  }
}
