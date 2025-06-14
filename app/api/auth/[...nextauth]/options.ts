import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { connectDB } from "@/lib/dbConfig";
import bcrypt from "bcryptjs";
import User from "@/models/users";

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: "credentials",
            credentials: {
                identifier: { label: "Email", type: "text", placeholder: "Enter your Email" },
                password: { label: "Password", type: "password", placeholder: "Enter your Password" }
            },
            async authorize(credentials) {
                console.log(credentials)
                if (!credentials?.identifier || !credentials?.password) {
                    throw new Error("Missing Email or Password")
                }

                try {

                    await connectDB();
                    const user = await User.findOne({ email: credentials.identifier });
                    if (!user) {
                        throw new Error("User does not exists");
                    }

                    const isPasswordCorrect = await bcrypt.compare(credentials.password, user.password);

                    if (!isPasswordCorrect) {
                        throw new Error("Invalid Password")
                    }

                    if (!user.isVerified) {
                        throw new Error("Please verify accound berfore logging in");
                    }

                    return {
                        id: user._id as string,
                        identifier: user.email
                    }

                } catch (error) {
                    throw Error("Something went wrong while authentication")
                }

            }

        })
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token._id = user._id?.toString();
                token.isVerified = user.isVerified;
                token.isAcceptingMessage = user.isAcceptingMessage;
                token.username = user.username;
            }
            return token
        },
        async session({ session, token }) {
            if (token) {
                session.user._id = token._id as string;
                token.isVerified = token.isVerified;
                token.isAcceptingMessage = token.isAcceptingMessage;
                token.username = token.username;
            }
            return session
        }
    },
    pages: {
        signIn: "/login",
        error: "/login"
    },
    session: {
        strategy: "jwt",
        maxAge: 2592000
    },
    secret: process.env.NEXT_AUTH_SECRET
}