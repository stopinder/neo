import OpenAI from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Only POST requests are allowed.' });
    }

    const { answers } = req.body;

    if (!answers || !Array.isArray(answers)) {
        return res.status(400).json({ error: 'Invalid or missing answers array.' });
    }

    const answersString = JSON.stringify(answers, null, 2);

    if (answersString.length > 10000) {
        return res.status(413).json({ error: 'Answers payload too large.' });
    }

    const prompt = `
You are a psychologically informed synthesis engine trained in clinical frameworks including Internal Family Systems (IFS), the Enneagram (including subtype and wing variants), Attachment Theory, and Transactional Analysis (TA). Your task is to generate a one-off, structured psychological insight report based on quiz answers. Assume the reader is intelligent and introspective, though not a clinician.

Tone: Calm, reflective, and grounded. Speak with the clarity of a clinical guide and the depth of a thoughtful mentor. Avoid absolutes. Use language like “may,” “tend to,” or “is often drawn to...” to reflect that these are probable, not fixed, patterns. Avoid leaving open-ended questions; this is a one-time report, not a conversation. Reserve mythopoetic or archetypal metaphors for the final sections only, and use them with restraint.

Each section should be 250–500 words and serve both as insight and education. Define key terms when used (e.g., “protector,” “subtype,” “attachment”). Your goal is not to flatter, but to clarify and gently deepen the user’s self-understanding.

Format the output as a valid JSON object with the following keys:

{
  "core_profile": "A concise summary of dominant psychological dynamics, integrating multiple frameworks. Begin here.",
  "ifs_dynamics": "Describe likely Manager, Firefighter, and Exile parts, including their protective strategies and stress interactions.",
  "enneagram_pattern": "Identify likely Enneagram type and subtype. Define the type clearly. Explain strengths, growth edges, and behavioral patterns. Include probable wing type and clarify its influence.",
  "attachment_style": "Identify attachment style and illustrate how this may show up in relationships (e.g., response to intimacy, conflict, or distance).",
  "transactional_analysis": "Identify likely dominant ego states (Parent, Adult, Child). Describe communication style and typical patterns in stress or conflict.",
  "attraction_dynamics": "Describe the types of partners this person may be drawn to, what patterns recur, and what traits they may unconsciously seek. Avoid romantic fluff.",
  "relational_dynamics": "Discuss habitual emotional rhythms, intimacy patterns, and the user’s likely stance during conflict or vulnerability.",
  "mythic_comparison": "Offer one symbolic or archetypal metaphor (e.g., Greek, Jungian, or literary) that could help reflect the user’s core inner theme. Keep it elegant and optional, never dominant.",
  "invitation": "Conclude with a warm, brief reflection—offering one simple next step such as journaling, IFS inquiry, or personal integration."
}

User Responses:
${answersString}
    `.trim();

    if (process.env.NODE_ENV !== 'production') {
        console.log('GPT prompt:\n', prompt);
    }

    try {
        let content;
        for (let attempt = 0; attempt < 2; attempt++) {
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
            return res.status(502).json({ error: 'No response from OpenAI after retry.' });
        }

        try {
            const parsed = JSON.parse(content);
            return res.status(200).json(parsed);
        } catch (parseError) {
            console.error('Invalid JSON from OpenAI:\n', content);
            return res.status(500).json({ error: 'Invalid JSON returned by OpenAI.' });
        }
    } catch (error) {
        console.error('OpenAI API error:', error);
        return res.status(500).json({ error: 'Report generation failed.' });
    }
}
