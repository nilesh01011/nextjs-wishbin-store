/* eslint-disable no-undef */
import jwt from 'jsonwebtoken';

// set tokens
const signToken = (userData) => {
    console.log('================creating token========================')

    const payload = {
        userData,
    }

    return jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: '30d'
    })
};

// decode jwt tokens
const isAuth = async (req, res, next) => {
    const { authorization } = req.headers;
    if (authorization) {
        const token = authorization.slice(7, authorization.length); // token in length of 7 BEARER *****
        jwt.verify(token, process.env.JWT_SECRET, (err, decode) => {
            if (err) {
                res.status(401).send({ message: "Token is not valid" });
            } else {
                req.userData = decode;
                next();
            }
        })
    }

    // try {
    //     // Decode the JWT token and get the payload data
    //     const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

    //     console.log(decodedToken);

    //     return decodedToken;
    // } catch (error) {
    //     console.error('Error decoding the token:', error);
    //     return null;
    // }
}

export { signToken, isAuth };