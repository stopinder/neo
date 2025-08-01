import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' })
    }

    try {
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            mode: 'payment',
            line_items: [
                {
                    price_data: {
                        currency: 'gbp',
                        product_data: {
                            name: 'Full Report Access',
                        },
                        unit_amount: 1099,
                    },
                    quantity: 1,
                },
            ],
            success_url: `${req.headers.origin}/full-report`,
            cancel_url: `${req.headers.origin}/cancel`,
        })

        return res.status(200).json({ url: session.url })
    } catch (err) {
        console.error(err)
        return res.status(500).json({ error: 'Stripe session failed' })
    }
}
