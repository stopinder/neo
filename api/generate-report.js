import OpenAI from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Only POST allowed' });
    }

    const { answers } = req.body;

    if (!answers || !Array.isArray(answers)) {
        return res.status(400).json({ error: 'Invalid or missing answers' });
    }

    const answersString = JSON.stringify(answers, null, 2);
    if (answersString.length > 10000) {
        return res.status(413).json({ error: 'Answers too large.' });
    }

    const prompt = `
You are Heliosynthesis—a poetic psychological guide weaving Enneagram, Internal Family Systems (IFS), Attachment Theory, Transactional Analysis, and mythic-symbolic reflection. Your voice is calm, clear, imaginal, and psychologically grounded.

The user has answered 15 personality questions. Based on their answers, generate a long-form, emotionally rich psychological report in 8 parts (total 2,000–3,000 words). Each section must include multiple paragraphs and blend the following:
- Insightful interpretation from the relevant framework
- A warm, reverent tone (not diagnostic or pathologizing)
- A symbolic or mythopoetic metaphor (optional but encouraged)
- A sense of direct address (e.g., “you may feel…,” “this part of you may carry…”)

Use archetypes like Chiron, Prometheus, Philomela, or The Fool sparingly and with context. Do not overload the user with references—aim for clarity, resonance, and depth. You may include reflective invitations, but no lists, summaries, or exercises.

Structure the response as valid JSON with exactly 8 keys, each corresponding to a report section:

{
  "✨ Core Profile": "...",
  "🛡️ IFS Dynamics": "...",
  "🌿 Enneagram Pattern": "...",
  "🕊️ Attachment Style": "...",
  "🧠 Transactional Analysis": "...",
  "🔄 Relational Patterning": "...",
  "🌗 Mythic Reflection": "...",
  "🪞 A Gentle Invitation": "..."
}

Each section’s value must be 250–500 words.

User Responses:
${answersString}
`;

    if (process.env.NODE_ENV !== 'production') {
        console.log('GPT prompt:\n', prompt);
    }

    try {
        let content;
        for (let i = 0; i < 2; i++) {
            const response = await openai.chat.completions.create({
                model: 'gpt-4',
                messages: [{ role: 'user', content: prompt }],
                temperature: 0.7,
            });
            content = response.choices?.[0]?.message?.content?.trim();
            if (content) break;
        }

        if (!content) {
            return res.status(502).json({ error: 'No response from OpenAI after retry.' });
        }

        try {
            const parsed = JSON.parse(content);
            return res.status(200).json(parsed);
        } catch (parseError) {
            console.error('Invalid JSON from OpenAI:', content);
            return res.status(500).json({ error: 'Invalid JSON returned by OpenAI.' });
        }
    } catch (error) {
        console.error('OpenAI error:', error);
        return res.status(500).json({ error: 'Report generation failed.' });
    }
}
