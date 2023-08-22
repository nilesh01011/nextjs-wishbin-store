/* eslint-disable no-undef */
import axios from "axios";

export const makePaymentRequest = async (endpoint, payload) => {

    // console.log(process.env.NEXT_PUBLIC_API_URL);

    const res = await axios.post(
        `${endpoint}`,
        payload,
        {
            headers: {
                Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_KEY}`,
                'Content-Type': 'application/json'
            }
        }
    );

    return res.data;

};