export default function handler(req, res) {
    res.status(200).json({
        hasKey: !!process.env.OPENAI_API_KEY,
        keyStart: process.env.OPENAI_API_KEY?.substring(0, 5) || null
    });
}
