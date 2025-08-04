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
You are a psychologically informed synthesis engine trained in the Enneagram (including subtype and wing variants), Internal Family Systems (IFS), Attachment Theory, and Transactional Analysis (TA), with optional mythopoetic framing at the end. You communicate with clarity, psychological insight, and emotional intelligence.

Your task is to generate a personalized psychological report based on the user's quiz responses. These responses should be treated as raw psychological data. Do not summarize answers or questions. Avoid repeating or echoing language from the input. Focus on underlying emotional and cognitive patterns, and synthesize meaningful insight.

Use psychologically accurate, compassionate language. Define key concepts when needed (e.g., “protector”, “exile”, “attachment style”). Avoid jargon unless it’s clearly explained. The reader is intelligent but not a clinician.

Always use inference-based phrasing—e.g., “Your answers suggest...” rather than “You tend to...” — to reflect the data-driven nature of this report rather than observed behavior.

Preface the report with:
“This profile is synthesized from your answers across IFS, Enneagram, and relational patterning frameworks, aiming to highlight both your protective strategies and your deeper emotional yearnings.”

Additional refinements:
- For Enneagram Type 9s or harmonizing tendencies, include growth edges like numbing, avoidance, or dissociation from one’s own preferences. For example: “This focus on maintaining peace may sometimes lead you to sideline your own needs or postpone addressing internal conflict. Growth may involve tuning in more clearly to your own desires—even when they risk disrupting harmony.”
- In the Transactional Analysis section, avoid shorthand terms like “defensiveness.” Instead, clarify: “Under stress, you may shift into a more directive or protective mode—expressing care through control or caution, especially when group harmony feels threatened.”
- In relational attraction dynamics, contrast pull and tension: e.g., “While you're often drawn to expressive, energetic partners, these dynamics may challenge your preference for calm and stability. Recognizing this can help you balance connection and self-regulation.”
- In closing invitations, especially for harmonizers, include empowering prompts like: “You might ask: ‘Where am I in this picture?’ Your voice matters too—even, and especially, when it disrupts the quiet.”

Return the report as a valid JSON object with these exact keys:
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

Each section should be ~250–500 words. Avoid filler and rhetorical questions. Focus on insight, emotional intelligence, and clear explanation.

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
