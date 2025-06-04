import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { connectDB } from "./dbConfig";
import bcrypt from "bcryptjs";
import User from "@/models/users";

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "text", placeholder: "Enter your Email" },
                password: { label: "Password", type: "password", placeholder: "Enter your Password" }
            },

            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    throw new Error("Mission Email or Password")
                }

                try {

                    await connectDB();
                    const user = await User.findOne({ email: credentials.email });
                    if (!user) {
                        throw new Error("User does not exists");
                    }

                    const isPasswordCorrect = await bcrypt.compare(credentials.password, user.password);

                    if (!isPasswordCorrect) {
                        throw new Error("Invalid Password")
                    }

                    return {
                        id: user._id as string,
                        email: user.email
                    }

                } catch (error) {
                    throw Error("Something went wrong while authentication")
                }

            }

        })
    ],
    callbacks: {
        async jwt({ token, user }) {
            if(user){
                token.id = user.id;
            }
            return token
        },
        async session({ session, token }) {
            if (session?.user) {
                session.user.id = token.id as string;
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