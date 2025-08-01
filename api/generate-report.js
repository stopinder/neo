import OpenAI from 'openai';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Only POST allowed' });
    }

    const { answers } = req.body;

    if (!answers || !Array.isArray(answers)) {
        console.error('Invalid answers:', answers);
        return res.status(400).json({ error: 'Invalid or missing answers array' });
    }

    const prompt = `
You are a skilled psychological guide synthesizing Enneagram, Internal Family Systems (IFS), Attachment Theory, and Transactional Analysis. Create a symbolic, insightful psychological report in 8 sections. The tone is poetic yet precise.

Sections:
1. ✨ Core Profile
2. 🛡️ IFS Dynamics
3. 🌿 Enneagram Pattern
4. 🕊️ Attachment Style
5. 🧠 Transactional Analysis
6. 🔄 Relational Patterning
7. 🌓 Mythic Reflection
8. 🪞 A Gentle Invitation

User Responses:
${JSON.stringify(answers, null, 2)}

Please return a valid JSON object with keys matching the sections.
`;

    try {
        const response = await openai.chat.completions.create({
            model: 'gpt-4',
            messages: [{ role: 'user', content: prompt }],
            temperature: 0.7
        });

        const content = response.choices?.[0]?.message?.content?.trim();
        if (!content) {
            console.error('Empty content from OpenAI:', response);
            return res.status(500).json({ error: 'Empty response from OpenAI' });
        }

        const parsed = JSON.parse(content);
        return res.status(200).json(parsed);

    } catch (error) {
        console.error('OpenAI error:', error);
        return res.status(500).json({ error: error.message || 'Failed to generate report' });
    }
}
