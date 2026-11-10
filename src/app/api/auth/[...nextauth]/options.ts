import {NextAuthOptions} from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import  bcrypt from "bcryptjs";
import dbconnect from "@/lib/dbconnect";
import UserModel from "@/model/User";

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({ 
            id: "credentials",
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "text" }, // Usually email or username depending on your app
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials: any): Promise<any> {
                // 1. Connect to database
                await dbconnect();

                try {
                    // 2. Find user by email or username
                    const user = await UserModel.findOne({
                        $or: [
                            { email: credentials.identifier }, // or credentials.email
                            { username: credentials.identifier }
                        ]
                    });

                    if (!user) {
                        throw new Error('No user found with this email');
                    }

                    // 3. Check if user is verified
                    if (!user.isverified) {
                        throw new Error('Please verify your account before logging in');
                    }

                    // 4. Compare passwords using bcrypt
                    const typedUser = user as any;
                    const isPasswordCorrect = await bcrypt.compare(
                        credentials.password,
                        typedUser.password
                    );

                    if (isPasswordCorrect) {
                        return user; // NextAuth saves this object in the JWT token/session
                    } else {
                        throw new Error('Incorrect password');
                    }

                } catch (err: any) {
                    throw new Error(err.message);
                }
            }
        })
    ],
    // Add callbacks, session strategy, and pages if you have them configured!
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token._id = user._id?.toString();
                token.isVerified = (user as any).isVerified;
                token.isAcceptingMessages = (user as any).isAcceptingMessages;
                token.username = (user as any).username;
            }
            return token;
        },
        async session({ session,  token }) {
            if (token) {
                session.user._id = token._id;
                session.user.isVerified = token.isVerified;
                session.user.isAcceptingMessages = token.isAcceptingMessages;
                session.user.username = token.username;
            }
            return session;
        }
    }, 
    session: {
        strategy: "jwt",
    },
    pages: {
        signIn: '/sign-in',
    },
    secret: process.env.NEXTAUTH_SECRET,
};
