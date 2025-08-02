const Stripe = require('stripe');
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

exports.handler = async function (event) {
    try {
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            mode: 'payment',
            line_items: [
                {
                    price: 'price_1RrZ8yPS3rVEOBKXGrfiUKcG',
                    quantity: 1,
                },
            ],
            success_url: `${event.headers.origin}/payment-success`,
            cancel_url: `${event.headers.origin}/cancel`,
        });

        return {
            statusCode: 200,
            body: JSON.stringify({ url: session.url }),
        };
    } catch (err) {
        console.error('Stripe error:', err.message);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: err.message }),
        };
    }
};
