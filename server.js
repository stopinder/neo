const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const SibApiV3Sdk = require('@sendinblue/client')
require('dotenv').config()

const app = express()
app.use(cors())
app.use(bodyParser.json())

const brevo = new SibApiV3Sdk.TransactionalEmailsApi()
brevo.setApiKey(SibApiV3Sdk.TransactionalEmailsApiApiKeys.apiKey, process.env.BREVO_API_KEY)

app.post('/api/send-report', async (req, res) => {
    const { email, content } = req.body

    if (!email || !content) {
        return res.status(400).json({ error: 'Missing email or content' })
    }

    try {
        await brevo.sendTransacEmail({
            sender: { email: process.env.FROM_EMAIL, name: "Personality Profiler" },
            to: [{ email }],
            subject: "Your Personality Report",
            htmlContent: `<p>Here is your full personality report:</p><pre>${content}</pre>`
        })

        res.status(200).json({ success: true })
    } catch (error) {
        console.error('Brevo error:', error)
        res.status(500).json({ error: 'Failed to send email' })
    }
})

const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
