const express = require('express');
const stripe = require('stripe')('sk_test_51RqjGPAsDQzdgGBFygdUIJUjXWTwvfJBjjOTpAukM8bPOv3b36Fok8n17SNDOHQH2UZ24oCeVwowteTfbBOj83eW00sb2n450P');
const app = express();
const cors = require('cors');

app.use(cors());
app.use(express.json());

app.post('/api/create-checkout-session', async (req, res) => {
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

    res.json({ url: session.url });
});

app.listen(4242, () => console.log('Server running on http://localhost:4242'));
