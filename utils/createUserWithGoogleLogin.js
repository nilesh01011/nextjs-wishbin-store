import { client } from "../sanity";
// import { signToken } from "./jwtAuth";
// import bcrypt from 'bcryptjs'

export async function createUser({ email, name }) {
    // Check if the user already exists in Sanity.io
    const existingUser = await client.fetch(`*[_type == 'user' && email == $email]`, { email });

    if (existingUser.length === 0) {
        // If the user doesn't exist, create a new user in Sanity.io
        // const passwordProtect = bcrypt.hashSync(email);
        const newUser = await client.create({
            _type: 'user',
            email,
            username: name,
            // passwordProtect
        });

        // const addTokens = await signToken(newUser);

        // console.log('creatingUserWithGoogleLogin', addTokens);

        return newUser;
    }

    return existingUser[0]; // Return the existing user if already created
}