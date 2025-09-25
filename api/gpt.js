export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method not allowed" })
    }

    try {
        // Parse request body
        const buffers = []
        for await (const chunk of req) buffers.push(chunk)
        const body = JSON.parse(Buffer.concat(buffers).toString())

        const prompt = body?.prompt

        if (!prompt || typeof prompt !== "string") {
            return res.status(400).json({ error: "Missing or invalid prompt" })
        }

        const apiKey = process.env.OPENAI_API_KEY
        if (!apiKey) {
            return res.status(500).json({ error: "Missing OpenAI API key" })
        }

        // Call OpenAI Chat API
        const response = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${apiKey}`,
            },
            body: JSON.stringify({
                model: "gpt-4-0613",
                messages: [
                    {
                        role: "user",
                        content: prompt,
                    },
                ],
                temperature: 0.7,
                max_tokens: 1500,
            }),
        })

        if (!response.ok) {
            const error = await response.text()
            console.error("❌ OpenAI API error:", error)
            return res.status(response.status).json({ error: error })
        }

        const data = await response.json()
        const content = data.choices?.[0]?.message?.content?.trim()

        if (!content) {
            return res.status(500).json({ error: "No response from OpenAI" })
        }

        return res.status(200).json({ result: content })
    } catch (err) {
        console.error("🔥 GPT API error:", err)
        return res.status(500).json({ error: "Server error generating report" })
    }
}


