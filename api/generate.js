import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Allow override via env. Default to a JSON-capable model.
const MODEL = process.env.OPENAI_MODEL || "gpt-4o-mini";

export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Only POST requests are allowed." });
    }

    const { answers } = req.body || {};
    if (!answers || !Array.isArray(answers)) {
        return res.status(400).json({ error: "Invalid or missing answers array." });
    }

    const answersString = JSON.stringify(answers, null, 2);
    if (answersString.length > 10000) {
        return res.status(413).json({ error: "Answers payload too large." });
    }

    // ----- Refined prompt pieces -----
    const systemMsg = `
You are a psychologically informed synthesis engine trained in Internal Family Systems (IFS), the Enneagram (including subtype and wing), Attachment Theory, and Transactional Analysis (TA).

Task: Generate a single structured psychological insight report based on the user’s quiz answers.

Tone: Calm, reflective, grounded. Avoid absolutes; prefer “may,” “tend to,” “is often drawn to…”. Define key terms inline when first used. Each section should be 250–500 words. Use mythopoetic metaphors only in the final sections.

Output: Return ONLY a valid JSON object with EXACTLY these keys (no extra text or code fences):

{
  "core_profile": "...",
  "ifs_dynamics": "...",
  "enneagram_pattern": "...",
  "attachment_style": "...",
  "transactional_analysis": "...",
  "attraction_dynamics": "...",
  "relational_dynamics": "...",
  "mythic_comparison": "...",
  "invitation": "...",
  "framework_sources": {
    "Internal Family Systems": ["core_profile","ifs_dynamics"],
    "Enneagram": ["core_profile","enneagram_pattern"],
    "Attachment Theory": ["core_profile","attachment_style"],
    "Transactional Analysis": ["transactional_analysis"],
    "Attraction Dynamics": ["attraction_dynamics"],
    "Relational Dynamics": ["relational_dynamics"]
  }
}
`.trim();

    const userMsg = `
User Quiz Answers:

${answersString}

Please interpret these answers as data about personality traits, relational styles, and inner systems to generate the report.
`.trim();

    // ----- Call helper with retries -----
    try {
        const content = await callOpenAIWithRetries({
            model: MODEL,
            system: systemMsg,
            user: userMsg,
            maxAttempts: 3,
        });

        // Primary parse
        try {
            const parsed = JSON.parse(content);
            // Optional: sanity check keys exist
            const must = [
                "core_profile",
                "ifs_dynamics",
                "enneagram_pattern",
                "attachment_style",
                "transactional_analysis",
                "attraction_dynamics",
                "relational_dynamics",
                "mythic_comparison",
                "invitation",
                "framework_sources",
            ];
            for (const k of must) {
                if (!(k in parsed)) {
                    throw new Error(`Missing key: ${k}`);
                }
            }
            res.setHeader("Cache-Control", "no-store");
            return res.status(200).json(parsed);
        } catch (e) {
            // Regex salvage if model ever slips anything extra in
            const salvaged = salvageJson(content);
            if (salvaged) {
                res.setHeader("Cache-Control", "no-store");
                return res.status(200).json(salvaged);
            }
            console.error("Invalid JSON from OpenAI:\n", content);
            return res.status(500).json({ error: "Invalid JSON returned by OpenAI." });
        }
    } catch (error) {
        console.error("OpenAI API error:", error);
        return res.status(500).json({ error: "Report generation failed." });
    }
}

// --- Helpers ---

async function callOpenAIWithRetries({ model, system, user, maxAttempts = 3 }) {
    let lastErr;
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
        try {
            const resp = await OpenAIChatJSON({ model, system, user });
            const content = resp?.choices?.[0]?.message?.content?.trim();
            if (content) return content;
            lastErr = new Error("Empty completion");
        } catch (e) {
            lastErr = e;
        }
        // simple backoff
        await sleep(300 * attempt);
    }
    throw lastErr || new Error("OpenAI failed without error");
}

async function OpenAIChatJSON({ model, system, user }) {
    return await openai.chat.completions.create({
        model,
        // Forces pure JSON output on modern models
        response_format: { type: "json_object" },
        temperature: 0.2,
        max_tokens: 3200,
        messages: [
            { role: "system", content: system },
            { role: "user", content: user },
        ],
    });
}

function sleep(ms) {
    return new Promise((r) => setTimeout(r, ms));
}

// Try to extract the largest JSON object in the text.
function salvageJson(text) {
    if (!text) return null;
    const start = text.indexOf("{");
    const end = text.lastIndexOf("}");
    if (start === -1 || end === -1 || end <= start) return null;

    const candidate = text.slice(start, end + 1);
    try {
        return JSON.parse(candidate);
    } catch {
        // Second pass: remove a trailing "framework_sources {...}" if it's outside JSON
        const cleaned = text
            .replace(/\n```json[\s\S]*?```\s*$/i, "")
            .replace(/\n?framework_sources\s*\{[\s\S]*?\}\s*$/i, "")
            .trim();
        const s2 = cleaned.indexOf("{");
        const e2 = cleaned.lastIndexOf("}");
        if (s2 === -1 || e2 === -1 || e2 <= s2) return null;
        try {
            return JSON.parse(cleaned.slice(s2, e2 + 1));
        } catch {
            return null;
        }
    }
}
