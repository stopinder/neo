import OpenAI from "openai";

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req, res) {
    try {
        const chat = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                { role: "system", content: "You are a helpful assistant." },
                { role: "user", content: "What is 2 + 2?" }
            ],
        });

        const reply = chat.choices[0].message.content;
        res.status(200).json({ reply });
    } catch (err) {
        console.error("OpenAI error:", err);
        res.status(500).json({ error: "OpenAI API call failed", details: err.message });
    }
}
