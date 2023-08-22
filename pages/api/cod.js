/* eslint-disable no-undef */

export default async function handler(req, res) {
    if (req.method === "POST") {
        try {
            console.log(req.body)
            return res.status(200).json(req.body);
        } catch (error) {
            res.status(error.statusCode || 500).json(res.message)
            console.log('/api/code : errors')
            return { error };
        }
    } else {
        res.setHeader('Allow', 'POST');
        res.status(405).end('Method Not Allowed');
    }
}