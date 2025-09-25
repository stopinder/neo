// /api/gpt.js

export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method not allowed" })
    }

    try {
        let body = ""
        for await (const chunk of req) {
            body += chunk
        }

        const { prompt } = JSON.parse(body)

        if (!prompt || prompt.length < 50) {
            return res.status(400).json({ error: "Prompt too short or missing." })
        }

        if (!process.env.OPENAI_API_KEY) {
            return res.status(500).json({ error: "Missing OpenAI API key" })
        }

        const response = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
            },
            body: JSON.stringify({
                model: "gpt-4", // or fallback to gpt-3.5-turbo if needed
                messages: [{ role: "user", content: prompt }],
                temperature: 0.8,
                max_tokens: 1800,
            }),
        })

        if (!response.ok) {
            const errText = await response.text()
            console.error("❌ OpenAI API error:", errText)
            return res.status(response.status).json({ error: errText })
        }

        const data = await response.json()
        const content = data.choices?.[0]?.message?.content?.trim()

        if (!content) {
            return res.status(500).json({ error: "No content returned from GPT." })
        }

        return res.status(200).json({ result: content })
    } catch (err) {
        console.error("🔥 Server error:", err)
        return res.status(500).json({ error: "Server error generating report." })
    }
}
