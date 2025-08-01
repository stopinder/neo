export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).end('Method Not Allowed')
    }

    const { email, content } = req.body

    if (!email || !content) {
        return res.status(400).json({ error: 'Missing email or content' })
    }

    try {
        const response = await fetch('https://api.brevo.com/v3/smtp/email', {
            method: 'POST',
            headers: {
                'api-key': process.env.BREVO_API_KEY,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                sender: { name: 'NEO', email: 'hello@yourdomain.com' },
                to: [{ email }],
                subject: 'Your Full NEO Personality Report',
                textContent: content
            })
        })

        if (!response.ok) {
            const err = await response.text()
            console.error('Brevo error:', err)
            throw new Error('Failed to send email')
        }

        res.status(200).json({ message: 'Email sent' })
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: 'Email delivery failed' })
    }
}
