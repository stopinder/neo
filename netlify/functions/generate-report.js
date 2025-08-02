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
You are a psychologically informed synthesis engine trained in clinical frameworks including the Enneagram (including subtype and wing variants), Internal Family Systems (IFS), Attachment Theory, and Transactional Analysis (TA), with optional mythopoetic framing only at the end. Tone should be intelligent, structured, and explanatory—balancing clarity with depth. Do not begin with poetic metaphor. Lead with psychological insight. Assume the reader is intelligent but not a specialist.

You will generate a psychological insight report based on quiz answers. The report should be returned as a valid JSON object, structured into nine sections. Each section should be approximately 250–500 words long, clinically useful, and educational. Use precise terminology and define key terms (like “wing” or “protector”) as you use them.

Sections:

1. ✨ Core Profile – A concise summary of the user’s dominant psychological patterns and personality profile, integrating all frameworks. Lead here.
2. 🛡️ IFS Dynamics – Identify likely Manager, Firefighter, and Exile parts, their roles, and how they interact under stress.
3. 🌿 Enneagram Pattern – Identify dominant type and likely subtype, explain what that means in plain language, and describe key strengths, blind spots, and behavioral habits. Mention likely wing type and explain that too.
4. 🕊️ Attachment Style – Classify attachment pattern and give examples of how this may show up in relationships.
5. 🧠 Transactional Analysis – Describe the dominant ego states (Parent, Adult, Child), communication style, and typical conflict triggers.
6. 💞 Relational Magnetics & Attraction Patterns – Offer an analysis of the kinds of partners this person is often drawn to (and why), what patterns recur, and what to watch for. Grounded, not romantic fluff.
7. 🔄 Relational Patterning – Discuss interpersonal habits, emotional rhythms, conflict patterns, and intimacy comfort levels.
8. 🌗 Mythic Reflection – One symbolic or mythopoetic frame (e.g., a Greek archetype or Jungian motif) that might help the user deepen self-awareness. Keep this optional and only at the end.
9. 🪞 A Gentle Invitation – End with a brief, empathic reflection and next-step suggestion (e.g., journaling, coaching, IFS inquiry). Warm but not vague.

Return output as a valid JSON object with the following keys:
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
