// /src/services/gptService.js

export async function generateReport(quizType, data) {
    const { answers, tally, moonPhase } = data;

    // Build a shorter, more efficient GPT prompt
    const prompt = `
You are an IFS-informed therapist creating a gentle, imaginal report based on a self-reflection quiz.

Quiz Type: ${quizType}
Moon Phase: ${moonPhase}

### Role Frequencies
- Protector: ${tally?.protector ?? 0}
- Manager: ${tally?.manager ?? 0}
- Exile: ${tally?.exile ?? 0}
- Self: ${tally?.self ?? 0}

Using this as a general symbolic map of the client's system, write a **300–500 word reflective report** with this structure:

## Summary
2–3 paragraphs offering overall insight.

## Parts Overview
What roles are active? How might these parts relate?

## Strengths & Resources
Mention resilience, self-energy, or symbolic support.

## Challenges & Invitations
Offer gentle reflections on inner tension or imbalance.

## Reflective Prompts
Include 3–5 open-ended questions.

Tone:
- Warm, poetic, reflective
- Not diagnostic or clinical
- Gently symbolic (myth or metaphor ok)
`;

    try {
        const response = await fetch("/api/gpt", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ prompt }),
        });

        if (!response.ok) {
            throw new Error(`Serverless API error: ${response.statusText}`);
        }

        const dataResp = await response.json();

        if (!dataResp?.result || dataResp.result.trim() === "") {
            throw new Error("GPT returned empty content");
        }

        return dataResp.result;
    } catch (err) {
        console.error("❌ GPT Report Error:", err);
        return "⚠️ Unable to generate report. Please try again later.";
    }
}

