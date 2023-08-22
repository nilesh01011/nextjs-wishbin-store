/* eslint-disable no-undef */

// import { sign, verify } from 'jsonwebtoken';
import jwt from 'jsonwebtoken'

const secret = process.env.JWT_SECRET;
const jwt_algorithm = 'HS256';

// Set JWT token
export function generateResetToken(email) {
    const payload = { email };
    const expiresIn = 5 * 60; // Expiration time in seconds (5 minutes)

    return jwt.sign(payload, secret, { expiresIn, algorithm: jwt_algorithm })
}

function base64UrlDecode(input) {
    const base64 = input.replace(/-/g, '+').replace(/_/g, '/');
    const padding = '='.repeat((4 - (base64.length % 4)) % 4);
    const decoded = Buffer.from(base64 + padding, 'base64').toString('utf8');
    return decoded;
}

function decodeJWT(jwtToken, algorithm) {
    const [headerBase64, payloadBase64] = jwtToken.split('.');
    const header = JSON.parse(base64UrlDecode(headerBase64));
    const payload = JSON.parse(base64UrlDecode(payloadBase64));

    return { header, payload, algorithm };
}


export function verifyResetToken(token) {

    try {
        const decoded = decodeJWT(token, jwt_algorithm);

        // Check if the token is expired
        if (decoded.exp && Date.now() >= decoded.exp * 1000) {
            console.log('Token has expired.');
        }

        if (!decoded) {
            return console.log('Invalid signature');
        }

        return decoded.payload;
    } catch (error) {
        return false
    }
}
