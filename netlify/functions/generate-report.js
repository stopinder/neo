import OpenAI from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export const handler = async (event) => {
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            body: JSON.stringify({ error: 'Only POST allowed' }),
        };
    }

    let answers;
    try {
        const body = JSON.parse(event.body);
        answers = body.answers;
        if (!Array.isArray(answers)) {
            throw new Error('Invalid or missing answers');
        }
    } catch {
        return {
            statusCode: 400,
            body: JSON.stringify({ error: 'Invalid JSON or answers' }),
        };
    }

    const answersString = JSON.stringify(answers, null, 2);
    if (answersString.length > 10000) {
        return {
            statusCode: 413,
            body: JSON.stringify({ error: 'Answers too large.' }),
        };
    }

    const prompt = `
You are a psychologically informed synthesis engine trained in clinical frameworks including the Enneagram (including subtype and wing variants), Internal Family Systems (IFS), Attachment Theory, and Transactional Analysis (TA), with optional mythopoetic framing only at the end. You communicate with clarity, psychological insight, and emotional intelligence.

Your task is to generate a personalized psychological report based on the user's quiz responses. The report should provide meaningful interpretation — not summary or repetition. The reader is intelligent but not a clinician, so define terms where needed, and avoid jargon without dumbing things down.

DO NOT restate the user's answers or the quiz questions. Avoid echoing phrases from the input. Instead, analyze the underlying patterns and synthesize insight. Treat the quiz responses as raw psychological data. Draw inferences about parts, personality structures, relational patterns, and self-perceptions. Lead with insight, not metaphor. You may add optional symbolic language only at the end.

Each section should be approximately 250–500 words, thoughtful, and educational. Use precise clinical terminology when appropriate, and define key concepts in context (e.g., “protector”, “exile”, “wing”, “attachment style”).

Return the report as a valid JSON object, with nine structured sections:

1. ✨ Core Profile – A concise but rich synthesis of the user's dominant psychological patterns, integrating all frameworks.
2. 🛡️ IFS Dynamics – Likely internal parts (Managers, Firefighters, Exiles), their protective strategies, and how they interact.
3. 🌿 Enneagram Pattern – Probable dominant type, subtype, and wing. Explain strengths, blind spots, and recurring emotional habits.
4. 🕊️ Attachment Style – Identify the most likely attachment orientation and how it may show up in relational behavior.
5. 🧠 Transactional Analysis – Describe dominant ego states (Parent, Adult, Child), communication patterns, and conflict dynamics.
6. 💞 Relational Magnetics & Attraction Patterns – Describe typical attraction dynamics, common patterns in partnership, and emotional themes.
7. 🔄 Relational Patterning – Zoom out to broader interpersonal tendencies: emotional rhythm, boundaries, intimacy style, etc.
8. 🌗 Mythic Reflection – Offer one optional symbolic, mythopoetic, or archetypal frame (e.g., a Greek myth, Jungian archetype) to deepen reflection.
9. 🪞 A Gentle Invitation – Close with a short, empathic next step (journaling prompt, IFS exercise, etc.), emotionally grounded and clear.

Avoid filler. Avoid rhetorical questions. Focus on interpretation. Deliver insight, not repetition.

Return the result as a JSON object with these exact keys:
{
  "core_profile": "...",
  "ifs_dynamics": "...",
  "enneagram_pattern": "...",
  "attachment_style": "...",
  "transactional_analysis": "...",
  "attraction_dynamics": "...",
  "relational_dynamics": "...",
  "mythic_comparison": "...",
  "invitation": "..."
}


User Responses:
${answersString}
`;

    try {
        let content;
        for (let i = 0; i < 2; i++) {
            const response = await openai.chat.completions.create({
                model: 'gpt-4',
                messages: [{ role: 'user', content: prompt }],
                temperature: 0.7,
                max_tokens: 3200,
            });
            content = response.choices?.[0]?.message?.content?.trim();
            if (content) break;
        }

        if (!content) {
            return {
                statusCode: 502,
                body: JSON.stringify({ error: 'No response from OpenAI after retry.' }),
            };
        }

        try {
            const parsed = JSON.parse(content);
            return {
                statusCode: 200,
                body: JSON.stringify(parsed),
            };
        } catch (parseError) {
            console.error('Invalid JSON from OpenAI:', content);
            return {
                statusCode: 500,
                body: JSON.stringify({ error: 'Invalid JSON returned by OpenAI.' }),
            };
        }
    } catch (error) {
        console.error('OpenAI error:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Report generation failed.' }),
        };
    }
};
