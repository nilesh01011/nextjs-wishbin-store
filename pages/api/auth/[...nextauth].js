/* eslint-disable no-undef */
// import jwt from "jsonwebtoken";
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
// import { SanityAdapter } from "next-auth-sanity";
import { client } from "../../../sanity";
import { compare } from "bcryptjs";
import toast from "react-hot-toast";
import { createUser } from "../../../utils/createUserWithGoogleLogin";
// import axios from "axios";
// import { signToken } from "../../../utils/jwtAuth";

const secret = process.env.JWT_SECRET;

export default NextAuth({

    // ================================================================

    providers: [
        // OAuth provider example (Google)
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        }),
        CredentialsProvider({
            name: 'credentials',
            async authorize(credentials, req) {
                console.log(req)
                // check user existence
                const email = credentials.email;
                const result = await client.fetch(`*[_type == "user" && email == $email][0]`, {
                    email: email,
                });

                if (!result) {
                    throw new Error('No user Found with Email please Sign Up...!');
                }

                // compare password with bcrypt
                const checkPassword = await compare(credentials.password, result.passwordProtect);

                if (!checkPassword || result.email !== credentials.email) {
                    throw new Error("User email or password doesn't match");
                }

                return result;
            }
        }),
    ],
    secret: secret,
    session: {
        jwt: true,
    },
    jwt: {
        secret: secret,
    },
    cookies: {
        sessionToken: {
            name: 'session-token',
            options: {
                httpOnly: true,
                sameSite: 'lax',
                path: "/",
                secure: process.env.NEXT_PUBLIC_SANITY_DATASET === "production",
                maxAge: 86400 // for 1d
            }
        }
    },
    callbacks: {
        async signIn({ account, profile }) {
            // console.log("==========================SignIn==================================")
            // console.log('SignIn:', account)
            if (account.provider === 'google') {
                // Extract the email and name from the user's profile
                const email = profile.email;
                const name = profile.name; // or profile.name.split(' ')[0] for the first name only

                // Check if the user already exists in Sanity.io
                const createNewUser = await createUser({ email, name });

                if (!createNewUser) {
                    // If the user doesn't exist, show an error toast message
                    toast.error('User not found. Please register first.');
                    return false; // Return false to deny the sign-in
                }

                return profile.email_verified && profile.email.endsWith("@gmail.com");
            }

            return true; // Return true to allow the sign-in
        },
        async jwt({ token, user }) {
            // If the user signed in, add custom properties to the token
            if (user) {
                token = user;
            }
            return token;
        },
        async session({ session, token }) {
            // Attach the token data to the user's session
            // session.user = signToken(token);
            if (token && token.user) {
                session.user = token.user;
            }
            return session;
        },
    },
});