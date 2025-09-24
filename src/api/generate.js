export default async function handler(req, res) {
    // Allow requests from anywhere (development + production)
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

    if (req.method === 'OPTIONS') {
        // Preflight request → return 200 with headers only
        return res.status(200).end()
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' })
    }

    try {
        const { answers } = req.body

        // Dummy response for now
        res.status(200).json({
            core_reflection: "This is your core reflection.",
            parts_map: "This is your parts map.",
            mythopoetic_image: "This is your mythopoetic image.",
            gentle_invitations: [
                "Pause for one breath.",
                "Notice which part of you is most active today."
            ],
            disclaimer: "This is reflective entertainment, not therapy."
        })
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
}
