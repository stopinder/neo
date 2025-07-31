const stripe = require('stripe')('sk_test_51RqjGPAsDQzdgGBFygdUIJUjXWTwvfJBjjOTpAukM8bPOv3b36Fok8n17SNDOHQH2UZ24oCeVwowteTfbBOj83eW00sb2n450P');

module.exports = async (req, res) => {
    const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        mode: 'payment',
        line_items: [{
            price_data: {
                currency: 'gbp',
                product_data: { name: 'Full Report Access' },
                unit_amount: 1099,
            },
            quantity: 1,
        }],
        success_url: 'http://localhost:5173/full-report',
        cancel_url: 'http://localhost:5173/cancel',
    });

    res.status(200).json({ url: session.url });
};
