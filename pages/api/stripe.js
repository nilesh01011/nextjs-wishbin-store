/* eslint-disable no-undef */
// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

import imageUrlBuilder from '@sanity/image-url'

const builder = imageUrlBuilder({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECTID,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
})
const urlFor = (source) => builder.image(source);

export default async function handler(req, res) {
    const { products } = req.body;

    if (req.method === "POST") {
        try {
            const lineItems = products.map((item) => {
                const img = item.image;
                const newImage = urlFor(img).url();
                return {
                    price_data: {
                        currency: 'inr',
                        product_data: {
                            name: item.name,
                            images: [newImage],
                        },
                        unit_amount: item.oneQuantityPrice * 100,
                    },
                    quantity: item.quantity
                }
            });

            const session = await stripe.checkout.sessions.create({
                submit_type: 'pay',
                mode: 'payment',
                payment_method_types: ['card'],
                billing_address_collection: 'auto',
                shipping_options: [
                    { shipping_rate: 'shr_1NPQwbSAuLKW0flW23hgI82U' },
                    // { shipping_rate: 'shr_1NPQzLSAuLKW0flWxwT5l0S1' }
                ],
                line_items: lineItems,
                success_url: `${req.headers.origin}/success?session_id={CHECKOUT_SESSION_ID}`,
                cancel_url: `${req.headers.origin}/checkout-summary/?canceled=true`,
            });

            // console.log(session);

            res.status(200).json(session);

        } catch (error) {
            res.status(error.statusCode || 500).json(res.message)
            return { error };
        }
    } else {
        res.setHeader('Allow', 'POST');
        res.status(405).end('Method Not Allowed');
    }

}