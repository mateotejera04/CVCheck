// config/openai.js
import { OpenAI } from "openai";
import dotenv from "dotenv";
dotenv.config();

const responseLanguage = (locale = "en") =>
  locale === "es" ? "Spanish" : "English";

export async function enhanceBullet(text, locale = "en") {
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  const prompt = `
Transform this resume bullet point into a powerful, ATS-optimized statement that will impress both hiring managers and applicant tracking systems.

Original text: "${text}"

Requirements:
✅ Use strong action verbs (achieved, implemented, optimized, developed, led, etc.)
✅ Include quantifiable metrics when possible (percentages, numbers, timeframes)
✅ Incorporate relevant industry keywords for ATS compatibility
✅ Maintain professional, concise language (under 2 lines)
✅ Focus on impact and results, not just responsibilities
✅ Preserve any HTML formatting exactly as provided
✅ Write the enhanced result in ${responseLanguage(locale)}

Return ONLY the enhanced version - no explanations, quotes, or additional text.
`;

  const response = await openai.chat.completions.create({
    model: "gpt-4.1-mini-2025-04-14",
    temperature: 0.4,
    messages: [
      {
        role: "system",
        content:
          "You are an expert resume writer specializing in ATS optimization and impactful professional statements. Focus on creating compelling, keyword-rich content that showcases achievements and measurable results.",
      },
      { role: "user", content: prompt },
    ],
    max_tokens: 120,
  });

  return response.choices[0]?.message?.content?.trim() || "";
}


function sanitize(text) {
  return typeof text === "string" ? text.trim().replace(/\s+/g, " ") : "";
}

//func to check ATS score
export async function checkATSCompatibility(resume, locale = "en") {
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  const prompt = `
You are an expert in Applicant Tracking Systems (ATS) and resume optimization.

Your job is to evaluate how well the given resume aligns with ATS best practices and return actionable feedback.

✅ JSON response in the EXACT structure:
{
  "atsScore": 87,
  "sectionWiseFeedback": {
    "description": {
      "missing": [ ... ],
      "suggestions": [ ... ]
    },
    "skills": {
      "missing": [ ... ],
      "suggestions": [ ... ]
    },
    "experience": {
      "missing": [ ... ],
      "suggestions": [ ... ]
    },
    "projects": {
      "missing": [ ... ],
      "suggestions": [ ... ]
    },
    "achievements": {
      "missing": [ ... ],
      "suggestions": [ ... ]
    }
  },
  "generalTips": [
    ...
  ]
}

📌 Instructions & Constraints:
- DO NOT fabricate content. Only work with the provided resume.
- DO NOT mention or suggest removing HTML tags (they are for formatting).
- DO NOT suggest adding new resume sections outside of: description, skills, experience, projects, achievements.
- DO NOT include sections that are already well-optimized (omit them from feedback).
- DO NOT output anything outside the JSON block.
- Your job is to boost **ATS compatibility**, not visual design.
- In "description", focus on professional summary optimization, not listing tech skills already present in "skills".
- If any skill is already well-represented in "skills", do not repeat it in skills section feedback.
- Give user specific examples of how to improve each section, not just general advice.
- Make all suggestions **actionable, realistic, and ATS-specific**.
- If a field is well-optimized, **don't include it in \`sectionWiseFeedback\`**.
- Skills section contains both domain and languages, so provide suggestions accordingly.
- If a section is missing, include it in \`sectionWiseFeedback\` with suggestions to add it.
- Write all user-facing JSON string values in ${responseLanguage(locale)}.

Resume:
User Description: ${sanitize(resume.description)}

Skills: ${(resume.skills || []).map((s) => sanitize(s.domain || s)).join(", ")}

Projects: ${(resume.projects || [])
    .map((p) => `${sanitize(p.name)}: ${sanitize(p.description)}`)
    .join("; ")}

Experience: ${(resume.experience || [])
    .map(
      (e) =>
        `${sanitize(e.role)} at ${sanitize(e.company)}: ${sanitize(
          e.description
        )}`
    )
    .join("; ")}

Achievements: ${(resume.achievements || [])
    .map((a) =>
      [sanitize(a.title), sanitize(a.description)].filter(Boolean).join(": ")
    )
    .join("; ")}
`;

  const response = await openai.chat.completions.create({
    model: "gpt-4.1-mini-2025-04-14",
    temperature: 0.5,
    messages: [
      {
        role: "system",
        content:
          "You are an expert ATS resume evaluator and optimization specialist.",
      },
      { role: "user", content: prompt },
    ],
    max_tokens: 1200,
  });

  let raw = response.choices[0]?.message?.content?.trim() || "";

  // 🔧 Fix: Strip markdown formatting if present
  if (raw.startsWith("```json") || raw.startsWith("```")) {
    raw = raw.replace(/```json|```/g, "").trim();
  }

  try {
    return JSON.parse(raw);
  } catch (err) {
    console.error("❌ Failed to parse ATS JSON:\n", raw);
    throw new Error("Invalid ATS JSON from AI");
  }
}

// Function to parse uploaded resume and format according to ResuMate template
export async function parseResumeFromFile(fileUrl, locale = "en") {
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  try {
    // Step 1: Download the file from the URL
    console.log("📥 Downloading file from URL:", fileUrl);
    const fileResponse = await fetch(fileUrl);
    if (!fileResponse.ok) {
      throw new Error(`Failed to fetch file: ${fileResponse.statusText}`);
    }

    // Step 2: Get file content as buffer
    const fileBuffer = await fileResponse.arrayBuffer();

    // Step 3: Extract filename and ensure it has proper extension
    let fileName = fileUrl.split("/").pop() || "resume.pdf";
    const contentType =
      fileResponse.headers.get("content-type") || "application/pdf";

    // Ensure filename has proper extension based on content type
    if (!fileName.includes(".")) {
      if (contentType.includes("pdf")) {
        fileName += ".pdf";
      } else if (contentType.includes("msword")) {
        fileName += ".doc";
      } else if (contentType.includes("wordprocessingml")) {
        fileName += ".docx";
      } else if (contentType.includes("text/plain")) {
        fileName += ".txt";
      } else {
        fileName += ".pdf"; // default fallback
      }
    }

    console.log("📄 Processing file:", fileName, "Content-Type:", contentType);

    // Step 4: Create a File object from the buffer
    const file = new File([fileBuffer], fileName, {
      type: contentType,
    });

    // Step 5: Upload file to OpenAI for assistants purpose
    console.log("⬆️ Uploading file to OpenAI...");
    const uploadedFile = await openai.files.create({
      file: file,
      purpose: "assistants",
    });

    console.log("✅ File uploaded to OpenAI:", uploadedFile.id);
    console.log("🤖 Starting AI resume parsing...");

    // Step 6: Enhanced prompt for better parsing
    const prompt = `You are an expert resume parser and data extraction specialist. Analyze the uploaded resume file and extract ONLY the actual information present in the document.

CRITICAL INSTRUCTIONS:
- Do NOT provide sample or placeholder data
- Only extract real information from the uploaded resume file
- Pay special attention to EDUCATION section - extract ALL educational qualifications
- Look for education in various formats: degrees, certifications, courses, schools, colleges, universities
- Extract education details even if they appear in different sections or formats

Extract and structure the information in this exact JSON format:

{
  "name": "Full Name",
  "description": "Professional summary or objective statement",
  "contact": {
    "email": "email@gmail.com",
    "phone": "1234567890 any 10 digit number",
    "location": "City, State/Country",
    "linkedin": "https://linkedin.com/in/username",
    "github": "https://github.com/username",
    "websiteURL": "https://portfolio.com or any with personal website domain"
  },
  "skills": [{
    "domain": "Skill Category (e.g., Programming, Design, Frontend, Backend, etc.)",
    "languages": ["Language 1", "Language 2" ...]
  }],
  "experience": [
    {
      "role": "Job Title",
      "company": "Company Name",
      "technologies": "Technologies used",
      "years": "Duration of employment",
      "description": "Job description and responsibilities"
    }
  ],
  "projects": [
    {
      "name": "Project Name",
      "description": "Project description with technologies used and achievements",
      "github": "https://github.com/username/project",
      "demo": "https://project-demo.com"
    }
  ],
  "education": [
    {
      "institution": "College/University Name",
      "degree": "Degree Name",
      "specialization": "Specialization Area if any",
      "location": "City, State/Country",
      "duration": "Start Year - End Year (e.g., 2020 - 2024)",
      "gpa": "CGPA/GPA if mentioned",
      "school": "School Name for secondary education",
      "tenth": "10th grade percentage",
      "twelfth": "12th grade percentage"
    }
  ],
  "achievements": [
    {
      "title": "Achievement Title",
      "description": "Description of the achievement",
      "year": "Year of Achievement",
      "month": "Month of Achievement"
    }
  ]
}

EDUCATION PARSING GUIDELINES:
- Look for university/college names, degree titles, graduation years
- Extract school names for secondary education (10th/12th grade)
- Find GPA, CGPA, percentages, or grades
- Look for specializations, majors, or concentrations
- Check for education dates in various formats (2020-2024, 2020 to 2024, etc.)
- Include ALL educational institutions mentioned, not just the highest degree
- Keep proper nouns, company names, school names, URLs, emails, and technologies exactly as written.
- Write descriptive user-facing fields in ${responseLanguage(locale)} when translation is appropriate.

Return ONLY the JSON object with actual data from the resume, no additional text or formatting. If information is not available in the resume, use empty strings "" or empty arrays [].`;

    // Step 7: Create an Assistant with file_search tool
    console.log("🤖 Creating temporary assistant for resume parsing...");
    const assistant = await openai.beta.assistants.create({
      name: "Resume Parser",
      instructions: `You are an expert resume parser. ${prompt}`,
      model: "gpt-4.1-mini-2025-04-14",
      tools: [{ type: "file_search" }],
    });

    console.log("✅ Assistant created:", assistant.id);

    // Step 8: Create a vector store and add the file
    console.log("📚 Creating vector store...");
    const vectorStore = await openai.vectorStores.create({
      name: "Resume Analysis",
      file_ids: [uploadedFile.id],
    });

    console.log("✅ Vector store created:", vectorStore.id);

    // Step 9: Update assistant with vector store
    await openai.beta.assistants.update(assistant.id, {
      tool_resources: {
        file_search: {
          vector_store_ids: [vectorStore.id],
        },
      },
    });

    // Step 10: Create a thread and message
    console.log("💬 Creating thread and message...");
    const thread = await openai.beta.threads.create({
      messages: [
        {
          role: "user",
          content:
            "Please analyze the uploaded resume file and extract all information according to the JSON format specified in your instructions. Return only the JSON object with no additional text.",
        },
      ],
    });

    console.log("✅ Thread created:", thread.id);

    // Step 11: Run the assistant
    console.log("🏃 Running assistant...");
    const run = await openai.beta.threads.runs.createAndPoll(thread.id, {
      assistant_id: assistant.id,
    });

    console.log("✅ Run completed with status:", run.status);

    if (run.status !== "completed") {
      throw new Error(`Assistant run failed with status: ${run.status}`);
    }

    // Step 12: Get the response
    const messages = await openai.beta.threads.messages.list(thread.id);
    const responseMessage = messages.data[0];
    const responseText = responseMessage.content[0]?.text?.value?.trim() || "";

    console.log("📝 Raw response length:", responseText.length);
    console.log("📄 Full raw response:", responseText);

    if (!responseText || responseText.length === 0) {
      console.log("❌ Empty response from OpenAI");
      throw new Error("Empty response from OpenAI API");
    }

    // Step 13: Cleanup - Delete assistant and vector store
    console.log("🧹 Cleaning up resources...");
    try {
      await openai.beta.assistants.delete(assistant.id);
      await openai.vectorStores.delete(vectorStore.id);
      await openai.files.delete(uploadedFile.id);
      console.log("✅ Cleanup completed");
    } catch (cleanupError) {
      console.warn("⚠️ Cleanup warning:", cleanupError.message);
    }

    // Step 14: Clean up the response
    console.log("🧹 Cleaning response format...");
    let cleanedResponse = responseText;
    if (cleanedResponse.startsWith("```json")) {
      console.log("🔍 Detected markdown code block, removing...");
      cleanedResponse = cleanedResponse
        .replace(/```json\n?/, "")
        .replace(/\n?```$/, "");
    }

    console.log("🔄 Parsing JSON response...");

    try {
      const parsedData = JSON.parse(cleanedResponse);
      console.log("✅ Successfully parsed JSON response");
      console.log("📊 Parsed data structure:", {
        hasName: !!parsedData.name,
        hasContact: !!parsedData.contact,
        skillsCount: parsedData.skills?.length || 0,
        experienceCount: parsedData.experience?.length || 0,
        educationCount: parsedData.education?.length || 0,
        projectsCount: parsedData.projects?.length || 0,
      });

      // Detailed education logging
      if (parsedData.education && parsedData.education.length > 0) {
        console.log("🎓 Education details found:", parsedData.education);
      } else {
        console.log("⚠️ No education details found or education is empty");
      }

      console.log("🎉 Resume parsing complete!");
      return parsedData;
    } catch (parseError) {
      console.error("❌ Failed to parse JSON response:", parseError);
      console.log(
        "📄 Raw response that failed parsing:",
        cleanedResponse.substring(0, 500) + "..."
      );
      throw new Error("Invalid JSON response from AI");
    }
  } catch (error) {
    console.error("❌ Resume parsing error:", error);
    throw new Error(`Failed to parse resume: ${error.message}`);
  }
}

// Function to check ATS compatibility directly from uploaded file
export async function checkATSFromFile(fileUrl, locale = "en") {
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  try {
    console.log("🔍 Starting ATS analysis from uploaded file...");

    // Step 1: Download the file from the URL
    const fileResponse = await fetch(fileUrl);
    if (!fileResponse.ok) {
      throw new Error(`Failed to fetch file: ${fileResponse.statusText}`);
    }

    // Step 2: Get file content as buffer
    const fileBuffer = await fileResponse.arrayBuffer();

    // Step 3: Extract filename and ensure it has proper extension
    let fileName = fileUrl.split("/").pop() || "resume.pdf";
    const contentType =
      fileResponse.headers.get("content-type") || "application/pdf";

    // Ensure filename has proper extension based on content type
    if (!fileName.includes(".")) {
      if (contentType.includes("pdf")) {
        fileName += ".pdf";
      } else if (contentType.includes("msword")) {
        fileName += ".doc";
      } else if (contentType.includes("wordprocessingml")) {
        fileName += ".docx";
      } else if (contentType.includes("text/plain")) {
        fileName += ".txt";
      } else {
        fileName += ".pdf"; // default fallback
      }
    }

    console.log("📄 Processing file for ATS analysis:", fileName);

    // Step 4: Create a File object from the buffer
    const file = new File([fileBuffer], fileName, {
      type: contentType,
    });

    // Step 5: Upload file to OpenAI for user_data purpose
    const uploadedFile = await openai.files.create({
      file: file,
      purpose: "user_data",
    });

    console.log(
      "✅ File uploaded to OpenAI for ATS analysis:",
      uploadedFile.id
    );

    // Step 6: Enhanced ATS analysis prompt
    const atsPrompt = `You are an expert in Applicant Tracking Systems (ATS) analysis and resume optimization.

Analyze the uploaded resume file and evaluate how well it aligns with ATS best practices.

Return a JSON response in this EXACT structure:

{
  "atsScore": 87,
  "sectionWiseFeedback": {
    "description": {
      "missing": ["Professional summary missing", "No quantifiable achievements"],
      "suggestions": ["Add a compelling professional summary with 2-3 key strengths", "Include measurable results like 'Increased efficiency by 25%'"]
    },
    "skills": {
      "missing": ["Technical skills not clearly categorized", "Missing industry keywords"],
      "suggestions": ["Create clear skill categories (e.g., Programming, Tools, Frameworks)", "Include relevant technical keywords from your field"]
    },
    "experience": {
      "missing": ["Job descriptions lack action verbs", "No quantifiable achievements"],
      "suggestions": ["Start each bullet with strong action verbs (achieved, implemented, led)", "Add metrics and results to show impact"]
    },
    "projects": {
      "missing": ["Projects not clearly described", "Missing technical details"],
      "suggestions": ["Describe projects with specific technologies used", "Include project outcomes and impact"]
    },
    "achievements": {
      "missing": ["No quantifiable achievements", "Missing awards or recognition"],
      "suggestions": ["Add measurable accomplishments with numbers/percentages", "Include relevant certifications or awards"]
    },
    "education": {
      "missing": ["Education details incomplete", "Missing graduation dates or GPA"],
      "suggestions": ["Include complete education details (degree, institution, dates)", "Add GPA/CGPA if it's competitive (above 3.5/8.0)"]
    }
  },
  "generalTips": [
    "Use standard section headings like 'Experience', 'Education', 'Skills'",
    "Include relevant keywords from job descriptions you're targeting",
    "Use bullet points for better readability and ATS parsing",
    "Ensure consistent formatting throughout the document"
  ]
}

IMPORTANT:
- Only analyze the actual content in the uploaded resume
- Do NOT suggest adding sections that don't exist if they're not relevant
- Focus on ATS optimization, not visual design
- If a section is well-formatted, don't include it in sectionWiseFeedback
- Provide actionable, specific suggestions with examples
- Write all user-facing JSON string values in ${responseLanguage(locale)}
- Return ONLY the JSON object, no additional text`;

    // Step 7: Create an Assistant with file_search tool for ATS analysis
    console.log("🤖 Creating temporary assistant for ATS analysis...");
    const assistant = await openai.beta.assistants.create({
      name: "ATS Analyzer",
      instructions: `You are an expert ATS analyzer. ${atsPrompt}`,
      model: "gpt-4.1-mini-2025-04-14",
      tools: [{ type: "file_search" }],
    });

    console.log("✅ ATS Assistant created:", assistant.id);

    // Step 8: Create a vector store and add the file
    console.log("📚 Creating vector store for ATS analysis...");
    const vectorStore = await openai.vectorStores.create({
      name: "ATS Analysis",
      file_ids: [uploadedFile.id],
    });

    console.log("✅ ATS Vector store created:", vectorStore.id);

    // Step 9: Update assistant with vector store
    await openai.beta.assistants.update(assistant.id, {
      tool_resources: {
        file_search: {
          vector_store_ids: [vectorStore.id],
        },
      },
    });

    // Step 10: Create a thread and message
    console.log("💬 Creating thread and message for ATS analysis...");
    const thread = await openai.beta.threads.create({
      messages: [
        {
          role: "user",
          content:
            "Please analyze the uploaded resume file for ATS compatibility and provide the analysis according to the JSON format specified in your instructions. Return only the JSON object with no additional text.",
        },
      ],
    });

    console.log("✅ ATS Thread created:", thread.id);

    // Step 11: Run the assistant
    console.log("🏃 Running ATS assistant...");
    const run = await openai.beta.threads.runs.createAndPoll(thread.id, {
      assistant_id: assistant.id,
    });

    console.log("✅ ATS Run completed with status:", run.status);

    if (run.status !== "completed") {
      throw new Error(`ATS Assistant run failed with status: ${run.status}`);
    }

    // Step 12: Get the response
    const messages = await openai.beta.threads.messages.list(thread.id);
    const responseMessage = messages.data[0];
    const atsResponseText =
      responseMessage.content[0]?.text?.value?.trim() || "";

    console.log("📝 ATS Raw response length:", atsResponseText.length);
    console.log("📄 ATS Full raw response:", atsResponseText);

    if (!atsResponseText || atsResponseText.length === 0) {
      console.log("❌ Empty response from OpenAI ATS analysis");
      throw new Error("Empty response from OpenAI API");
    }

    // Step 13: Cleanup - Delete assistant and vector store
    console.log("🧹 Cleaning up ATS resources...");
    try {
      await openai.beta.assistants.delete(assistant.id);
      await openai.vectorStores.delete(vectorStore.id);
      await openai.files.delete(uploadedFile.id);
      console.log("✅ ATS Cleanup completed");
    } catch (cleanupError) {
      console.warn("⚠️ ATS Cleanup warning:", cleanupError.message);
    }

    // Step 14: Clean up the ATS response
    console.log("🧹 Cleaning ATS response format...");
    let cleanedResponse = atsResponseText;
    if (cleanedResponse.startsWith("```json")) {
      console.log("🔍 Detected markdown code block, removing...");
      cleanedResponse = cleanedResponse
        .replace(/```json\n?/, "")
        .replace(/\n?```$/, "");
    }

    console.log("🔄 Parsing ATS analysis JSON response...");

    try {
      const atsData = JSON.parse(cleanedResponse);
      console.log("✅ Successfully parsed ATS analysis JSON response");
      console.log("📊 ATS Score:", atsData.atsScore);

      // Cleanup: Delete the uploaded file
      console.log("🧹 Cleaning up - deleting uploaded file:", uploadedFile.id);
      await openai.files.del(uploadedFile.id);
      console.log("✅ File deleted successfully");

      console.log("🎉 ATS analysis complete!");
      return atsData;
    } catch (parseError) {
      console.error(
        "❌ Failed to parse ATS analysis JSON response:",
        parseError
      );
      console.log(
        "📄 Raw response that failed parsing:",
        cleanedResponse.substring(0, 500) + "..."
      );
      throw new Error("Invalid JSON response from ATS analysis");
    }
  } catch (error) {
    console.error("❌ ATS analysis error:", error);
    throw new Error(`Failed to analyze ATS compatibility: ${error.message}`);
  }
}
