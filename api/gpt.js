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
                model: "gpt-4.1",
                messages: [{ role: "user", content: prompt }],
            }),
        })

        if (!response.ok) {
            const err = await response.text()
            console.error("❌ OpenAI API error:", err)
            return res.status(response.status).json({ error: err })
        }

        const data = await response.json()
        return res.status(200).json({ result: data.choices[0].message.content })
    } catch (err) {
        console.error("🔥 Serverless function error:", err)
        return res.status(500).json({ error: "Server error generating report" })
    }
}

