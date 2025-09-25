// /src/services/gptService.js

export async function generateReport(quizType, data) {
    const { answers, tally } = data

    // Build GPT prompt
    const prompt = `
You are an IFS-informed therapist.
The client has just completed a multiple-choice reflective quiz.

Quiz type: ${quizType}

### Role frequencies
- Protector: ${tally?.protector ?? 0}
- Manager: ${tally?.manager ?? 0}
- Exile: ${tally?.exile ?? 0}
- Self: ${tally?.self ?? 0}

### Item-by-item answers
${JSON.stringify(answers, null, 2)}

Write a reflective report, 600–800 words, structured as:

## Summary
2–3 paragraphs giving overall insight into the person’s inner system.

## Parts Overview
Discuss the balance of Protectors, Managers, Exiles, and Self based on the tally.
Show how these tendencies may interact internally.

## Relational Themes
How might these patterns shape relationships with others and the world?

## Strengths & Resources
Highlight resilience, coping strategies, and Self-energy.

## Challenges & Invitations
Gently point to blind spots or over-reliances.
Frame as invitations for curiosity and care, not problems to fix.

## Reflective Prompts
Provide 3–5 open-ended self-reflection questions for further exploration.

Tone rules:
- Warm but professional.
- Reflective, not diagnostic.
- Containment and care, not fusion.
- Avoid pathology or clinical labels.
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
        return dataResp.result
    } catch (err) {
        console.error("Error generating report:", err)
        return "⚠️ Unable to generate report. Please try again later."
    }
}
