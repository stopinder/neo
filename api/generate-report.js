import { Configuration, OpenAIApi } from 'openai'

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY
})
const openai = new OpenAIApi(configuration)

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).end('Method Not Allowed')
    }

    const { answers } = req.body

    if (!answers || !Array.isArray(answers)) {
        return res.status(400).json({ error: 'Invalid answers array' })
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
Please return only a JSON object with each of the 8 sections as keys.`

    try {
        const completion = await openai.createChatCompletion({
            model: 'gpt-4',
            messages: [{ role: 'user', content: prompt }]
        })

        const content = completion.data.choices[0].message.content.trim()
        const json = JSON.parse(content)

        res.status(200).json({ report: json })
    } catch (error) {
        console.error('OpenAI error:', error)
        res.status(500).json({ error: 'Failed to generate report' })
    }
}
