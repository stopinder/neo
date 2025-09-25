// /src/services/gptService.js

export async function generateReport(quizType, data) {
    const { answers, tally, moonPhase } = data

    // Format item answers in a token-efficient way
    const formattedAnswers = answers
        .map((a, i) => `Q${i + 1}: ${a.option || a.answer || "No answer"}`)
        .join("\n")

    const prompt = `
You are Heliosynthesis, a reflective, IFS-informed therapist. Your tone is warm, symbolic, and poetic—but still professional. The client has just completed a multiple-choice self-reflection quiz.

Quiz type: ${quizType}

🌙 The current moon phase is: ${moonPhase}
This may reflect an inner symbolic atmosphere for the client.

### Role frequencies
- Protector: ${tally?.protector ?? 0}
- Manager: ${tally?.manager ?? 0}
- Exile: ${tally?.exile ?? 0}
- Self: ${tally?.self ?? 0}

### Selected answers
${formattedAnswers}

📝 Now write a reflective personality-style report, 600–800 words, using this structure:

## Summary
Offer 2–3 paragraphs of overall insight into the person’s inner system. Use gentle language.

## Parts Overview
Describe possible internal dynamics between Protectors, Managers, Exiles, and the Self. Make it imaginal if helpful.

## Relational Themes
How might these inner patterns affect connection with others and the world?

## Strengths & Resources
Highlight resilience, Self-energy, and adaptive strategies.

## Challenges & Invitations
Name any over-used strategies or tensions as gentle invitations for reflection—not pathologies.

## Reflective Prompts
Offer 3–5 journal questions for future exploration.

## Closing Quote
End with a brief, poetic quote aligned with the current moon phase.

Tone rules:
- Warm, symbolic, and poetic—but never vague
- Use metaphor only when helpful
- Avoid diagnostic or clinical language
- Support curiosity, not certainty
`

    try {
        const response = await fetch("/api/gpt", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ prompt }),
        })

        if (!response.ok) {
            throw new Error(`Serverless API error: ${response.statusText}`)
        }

        const dataResp = await response.json()
        const result = dataResp.result?.trim()

        if (!result) {
            throw new Error("GPT returned an empty message")
        }

        return result
    } catch (err) {
        console.error("❌ Error generating report:", err)
        return "⚠️ Unable to generate report. Please try again later."
    }
}

