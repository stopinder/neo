import { Configuration, OpenAIApi } from "openai";

export default async function handler(req, res) {
    const config = new Configuration({
        apiKey: process.env.OPENAI_API_KEY,
    });
    const openai = new OpenAIApi(config);

    try {
        const response = await openai.createChatCompletion({
            model: "gpt-4",
            messages: [
                { role: "system", content: "You are a helpful assistant." },
                { role: "user", content: "What's 2 + 2?" },
            ],
        });

        const answer = response.data.choices[0].message?.content;
        res.status(200).json({ reply: answer });
    } catch (err) {
        console.error("OpenAI error:", err);
        res.status(500).json({ error: "API call failed" });
    }
}
