// /src/services/gptService.js
export async function generateReport(quizType, answers) {
    // Build the GPT prompt
    const prompt = `
You are an IFS-informed therapist.
The client has just completed a self-reflection quiz.

Quiz type: ${quizType}
Answers: ${JSON.stringify(answers)}

Write a reflective personality-style report, 500–700 words, structured as:

## Summary
- 2–3 paragraphs giving overall insight.

## Parts Overview
- Discuss the likely protectors, managers, exiles, or other symbolic types implied.

## Strengths & Resources
- Highlight resilience and positive strategies.

## Challenges & Blind Spots
- Describe gently, as invitations for awareness.

## Reflective Prompts
- Provide 3–5 open-ended self-reflection questions.

Tone rules:
- Warm but professional.
- Reflective, not diagnostic.
- Containment and care, not fusion.
- Avoid clinical pathology language.
`

    try {
        // ✅ Call your Vercel serverless API route, not OpenAI directly
        const response = await fetch("/api/gpt", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ prompt }),
        })

        if (!response.ok) {
            throw new Error(`Serverless API error: ${response.statusText}`)
        }

        const data = await response.json()
        return data.text
    } catch (err) {
        console.error("Error generating report:", err)
        return "⚠️ Unable to generate report. Please try again later."
    }
}
