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
    if (!Array.isArray(answers) || answers.length === 0) {
        return res.status(400).json({ error: 'Invalid or empty answers array' })
    }

    const prompt = `... JSON-prompt including answers ...`

    try {
        const completion = await openai.createChatCompletion({
            model: 'gpt-4',
            messages: [{ role: 'user', content: prompt }]
        })

        const content = completion.data.choices[0]?.message.content
        if (!content) {
            console.error('No GPT content returned', completion.data)
            return res.status(500).json({ error: 'OpenAI returned empty content' })
        }

        let json
        try {
            json = JSON.parse(content.trim())
        } catch (parseErr) {
            console.error('Could not parse GPT output as JSON:', content, parseErr)
            return res.status(500).json({ error: 'Invalid JSON from OpenAI' })
        }

        return res.status(200).json(json)

    } catch (err) {
        console.error('OpenAI request failed:', err)
        return res.status(500).json({ error: 'OpenAI request error' })
    }
}
