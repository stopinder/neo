// /api/gpt.js
export default async function handler(req, res) {
    try {
        // Parse the request body
        const { prompt } = await req.json()

        // Call OpenAI securely with your server-side key
        const response = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${process.env.OPENAI_API_KEY}`, // ✅ backend-only env var
            },
            body: JSON.stringify({
                model: "gpt-4.1",
                messages: [{ role: "user", content: prompt }],
                temperature: 0.7,
            }),
        })

        if (!response.ok) {
            const error = await response.text()
            return res.status(response.status).json({ error })
        }

        const data = await response.json()
        return res.status(200).json({ text: data.choices[0].message.content })
    } catch (err) {
        console.error("Serverless function error:", err)
        return res.status(500).json({ error: "Server error generating report" })
    }
}

