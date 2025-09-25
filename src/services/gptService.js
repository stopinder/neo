export async function generateReport(quizType, data) {
    const { answers, tally, moonPhase } = data

    const moonSymbolism = {
        "New Moon": "A time of quiet emergence. Something new may be seeking to surface from within.",
        "Waxing Crescent": "A time for planting seeds. Inner growth stirs, even if not yet visible.",
        "First Quarter": "A moment of tension and momentum. Parts may press forward or resist change.",
        "Waxing Gibbous": "A swelling phase — rich with insight, but not yet resolution.",
        "Full Moon": "Illumination. Patterns long hidden may now be seen in full light.",
        "Waning Gibbous": "Integration begins. Insights soften, and reflection deepens.",
        "Last Quarter": "A phase of shedding. What can be released to lighten the inner field?",
        "Waning Crescent": "A sacred pause. Rest before renewal. Listen to the whispering parts.",
    }

    const symbolicMessage = moonSymbolism[moonPhase] || "A lunar moment for reflection and inner attunement."

    const prompt = `
You are a reflective, IFS-informed guide with symbolic and poetic insight. 
The client has just completed a multiple-choice reflective quiz.

Quiz type: ${quizType}

### Moon Phase
- Current Moon: ${moonPhase}
- Symbolic Message: "${symbolicMessage}"

### Role Frequencies
- Protector: ${tally?.protector ?? 0}
- Manager: ${tally?.manager ?? 0}
- Exile: ${tally?.exile ?? 0}
- Self: ${tally?.self ?? 0}

### Item-by-item Answers
${JSON.stringify(answers, null, 2)}

Write a reflective 600–800 word report using the following structure:

## Summary
Offer 2–3 warm, poetic paragraphs describing the overall tendencies of the person’s inner system. Reference the symbolic mood of the current moon phase, if relevant.

## Parts Overview
Explore how the Protectors, Managers, Exiles, and Self may show up. Use gentle, archetypal language (e.g., “a cautious strategist”, “a silenced inner child”). Show relational patterns between these parts.

## Relational Themes
How might these inner dynamics influence their relationships with others or with the world?

## Strengths & Resources
Affirm inner resilience. Name self-led moments, growth edges, or supportive protectors.

## Challenges & Invitations
Offer compassionate, non-pathologizing insights. Frame challenges as invitations for deeper curiosity, not as problems to be solved.

## Reflective Prompts
List 3–5 gentle questions they can explore in journaling or therapy.

Tone guide:
- Poetic, grounded, warm
- Evocative but not overwhelming
- Avoid diagnoses or jargon
- Use metaphor, lunar language, and symbolic insight when fitting
- Encourage curiosity and self-compassion
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
