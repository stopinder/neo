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
        const response = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`, // 👈 Put your key in .env
            },
            body: JSON.stringify({
                model: "gpt-4.1", // or gpt-4o, gpt-5 when available
                messages: [{ role: "user", content: prompt }],
                temperature: 0.7,
            }),
        })

        if (!response.ok) {
            throw new Error(`OpenAI API error: ${response.statusText}`)
        }

        const data = await response.json()
        return data.choices[0].message.content
    } catch (err) {
        console.error("Error generating report:", err)
        return "⚠️ Unable to generate report. Please try again later."
    }
}
