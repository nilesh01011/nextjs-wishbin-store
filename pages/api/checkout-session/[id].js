/* eslint-disable no-undef */
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
    if (req.method === 'GET') {
        const id = req.query.id;

        try {
            // Set the Stripe API key using the Bearer token
            if (!id.startsWith('cs_') && !id) {
                throw new Error('Incorrect checkout session id in /api/checkout-session/[id]')
            }

            if (id.startsWith('cs_')) {
                const checkoutSession = await stripe.checkout.sessions.retrieve(id);

                return res.status(200).json(checkoutSession)
            }

            // Set the COD API key using the Bearer token
            if (id) {

                console.log(id)

                return res.status(200).json(id)
            }

        } catch (error) {
            console.log('error in /api/checkout-session/[id]', error);
            res.status(500).json({ statusCode: 500, message: 'Error in /api/checkout-session/[id] files' + error.message });
        }
    } else {
        res.setHeader('Allow', "GEt");
        res.status(405).end("Method Not Allowed");
    }
}